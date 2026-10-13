import { AuthToken, Status, User } from "tweeter-shared";
import StatusService from "../model/service/StatusService";

export interface PostStatusView {
  setLoading: (value: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  postSuccess: () => void;
  displayErrorMessage: (message: string) => void;
  deleteMessage: (messageId: string) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.statusService = new StatusService();
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
