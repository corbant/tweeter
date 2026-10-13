import { AuthToken } from "tweeter-shared";
import UserService from "../model/service/UserService";

export interface AppNavbarView {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  displayErrorMessage: (message: string) => void;
  logoutSuccess: () => void;
}

export class AppNavbarPresenter {
  private view: AppNavbarView;
  private userService: UserService;

  public constructor(view: AppNavbarView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.logoutSuccess();
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
    }
  }

  private async logout(authToken: AuthToken) {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
