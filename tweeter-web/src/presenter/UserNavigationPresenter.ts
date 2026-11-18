import { UserProfile, UserSummary } from "tweeter-shared";
import UserService from "../model/service/UserService";
import { Presenter, View } from "./Presenter";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export interface UserNavigationView extends View {
  userFound: (user: UserProfile) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(view: UserNavigationView, facade: ServerFacade = serverFacade) {
    super(view);
    this.userService = new UserService(facade);
  }

  public async navigateToUser(displayedUser: UserProfile, targetText: string): Promise<void> {
    try {
      const alias = this.extractAlias(targetText);

      const toUser = await this.getUser(alias);

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
    return value.substring(index + 1);
  }

  private async getUser(alias: string): Promise<UserProfile | null> {
    return this.userService.getUserByAlias(alias);
  }
}
