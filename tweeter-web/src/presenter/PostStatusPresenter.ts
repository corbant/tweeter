import StatusService from "../model/service/StatusService";
import { LoadingView, MessageView, Presenter, View } from "./Presenter";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export interface PostStatusView extends MessageView, LoadingView {
  postSuccess: () => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  public constructor(view: PostStatusView, facade: ServerFacade = serverFacade) {
    super(view);
    this._statusService = new StatusService(facade);
  }

  public get statusService(): StatusService {
    return this._statusService;
  }

  public async submitPost(post: string): Promise<void> {
    var postingStatusToastId = "";

    try {
      this.view.setLoading(true);
      postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

      await this.postStatus(post);

      this.view.postSuccess();
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setLoading(false);
    }
  }

  private async postStatus(post: string): Promise<void> {
    await this.statusService.postStatus(post);
  }
}
