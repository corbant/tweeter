import { AuthToken, FakeData, UserProfile, UserProfileData } from "tweeter-shared";

class UserService {
  public async login(alias: string, password: string): Promise<[UserProfileData, AuthToken]> {
    return [FakeData.instance.fakeUsers[0].toJSON(), FakeData.instance.authToken];
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageKey: string | undefined
  ): Promise<[UserProfileData, AuthToken]> {
    return [FakeData.instance.fakeUsers[0].toJSON(), FakeData.instance.authToken];
  }
  public async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  }
  public async getUserByAlias(
    authToken: AuthToken,
    alias: string
  ): Promise<UserProfileData | null> {
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.toJSON() : null;
  }
}

export default UserService;
