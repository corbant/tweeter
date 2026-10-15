import { AuthToken, User } from "tweeter-shared";
import UserService from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  userFound: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this.userService = new UserService();
  }

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User,
    targetText: string
  ): Promise<void> {
    try {
      const alias = this.extractAlias(targetText);

      const toUser = await this.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.userFound(toUser);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  private async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return this.userService.getUserByAlias(authToken, alias);
  }
}
