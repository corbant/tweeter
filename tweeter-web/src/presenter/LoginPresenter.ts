import { AuthToken, User } from "tweeter-shared";
import UserService from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  setLoading(isLoading: boolean): void;
  loginSuccess(user: User, authToken: AuthToken, rememberMe: boolean): void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private userService: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.userService = new UserService();
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean) {
    try {
      this.view.setLoading(true);

      const [user, authToken] = await this.login(alias, password);

      this.view.loginSuccess(user, authToken, rememberMe);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    } finally {
      this.view.setLoading(false);
    }
  }

  private async login(alias: string, password: string): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const [user, authToken] = await this.userService.login(alias, password);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, authToken];
  }
}
