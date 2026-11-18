import UserService from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";
import { ServerFacade } from "../lib/ServerFacade";

export interface AppNavbarView extends MessageView {
  logoutSuccess: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private _userService: UserService;

  public constructor(view: AppNavbarView, facade: ServerFacade) {
    super(view);
    this._userService = new UserService(facade);
  }

  public get userService(): UserService {
    return this._userService;
  }

  public async logOut() {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.logout();

      this.view.deleteMessage(loggingOutToastId);
      this.view.logoutSuccess();
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
    }
  }

  private async logout() {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    this.userService.logout();
  }
}
