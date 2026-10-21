import { AuthToken, Status, User } from "tweeter-shared";
import StatusService from "../model/service/StatusService";
import { LoadingView, MessageView, Presenter, View } from "./Presenter";

export interface PostStatusView extends MessageView, LoadingView {
  postSuccess: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService(): StatusService {
    return this._statusService;
  }

  public async submitPost(authToken: AuthToken, currentUser: User, post: string): Promise<void> {
    var postingStatusToastId = "";

    try {
      this.view.setLoading(true);
      postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.postStatus(authToken!, status);

      this.view.postSuccess();
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setLoading(false);
    }
  }

  private async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    await this.statusService.postStatus(authToken, newStatus);
  }
}
