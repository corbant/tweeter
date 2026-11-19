import { UserProfile } from "tweeter-shared";
import { ServerFacade } from "../../lib/ServerFacade";

class UserService {
  private facade: ServerFacade;

  public constructor(facade: ServerFacade) {
    this.facade = facade;
  }

  public async login(alias: string, password: string): Promise<UserProfile> {
    return await this.facade.login(alias, password);
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageKey: string
  ): Promise<UserProfile> {
    return await this.facade.register(alias, firstName, lastName, password, imageKey);
  }
  public async logout(): Promise<void> {
    return await this.facade.logout();
  }
  public async getUserByAlias(alias: string): Promise<UserProfile | null> {
    return await this.facade.getUserProfile(alias);
  }
}

export default UserService;
