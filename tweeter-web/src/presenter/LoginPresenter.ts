import { UserProfile } from "tweeter-shared";
import UserService from "../model/service/UserService";
import { LoadingView, Presenter } from "./Presenter";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export interface LoginView extends LoadingView {
  loginSuccess(user: UserProfile, rememberMe: boolean): void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private userService: UserService;

  public constructor(view: LoginView, facade: ServerFacade = serverFacade) {
    super(view);
    this.userService = new UserService(facade);
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    try {
      this.view.setLoading(true);

      const user = await this.login(alias, password);

      this.view.loginSuccess(user, rememberMe);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    } finally {
      this.view.setLoading(false);
    }
  }

  private async login(alias: string, password: string): Promise<UserProfile> {
    // TODO: Replace with the result of calling the server
    const user = await this.userService.login(alias, password);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return user;
  }
}
