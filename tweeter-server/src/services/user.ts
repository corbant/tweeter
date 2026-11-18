import { FakeData, AuthTokenData, UserProfileData } from "tweeter-shared";

class UserService {
  public async login(alias: string, password: string): Promise<[UserProfileData, AuthTokenData]> {
    return [FakeData.instance.fakeUsers[0].toJSON(), { token: alias, timestamp: Date.now() }];
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageKey: string | undefined
  ): Promise<[UserProfileData, AuthTokenData]> {
    return [FakeData.instance.fakeUsers[0].toJSON(), { token: alias, timestamp: Date.now() }];
  }
  public async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  }
  public async getUserByAlias(alias: string): Promise<UserProfileData | null> {
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.toJSON() : null;
  }
}

export default UserService;
