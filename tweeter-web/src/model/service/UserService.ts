import { AuthToken, FakeData, User } from "tweeter-shared";

class UserService {
  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    return [FakeData.instance.fakeUsers[0], FakeData.instance.authToken];
  }
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    return [FakeData.instance.fakeUsers[0], FakeData.instance.authToken];
  }
  public async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 1000));
  }
  public async getUserByAlias(authToken: AuthToken, alias: string): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias);
  }
}

export default UserService;
