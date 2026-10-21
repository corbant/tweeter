import { AuthToken } from "tweeter-shared";
import UserService from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView {
  logoutSuccess: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private _userService: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this._userService = new UserService();
  }

  public get userService(): UserService {
    return this._userService;
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
    this.userService.logout(authToken);
  }
}
