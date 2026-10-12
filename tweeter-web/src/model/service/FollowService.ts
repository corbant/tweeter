import { AuthToken, FakeData, User } from "tweeter-shared";

class FollowService {
  public async getFollowers(
    authToken: AuthToken,
    userAlias: string,
    limit: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastUser, limit, userAlias);
  }
  public async getFollowees(
    authToken: AuthToken,
    userAlias: string,
    limit: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> {
    return FakeData.instance.getPageOfUsers(lastUser, limit, userAlias);
  }
  public async getIsFollower(
    authToken: AuthToken,
    userAlias: string,
    otherUserAlias: string
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }
  public async getFollowerCount(authToken: AuthToken, userAlias: string): Promise<number> {
    return FakeData.instance.getFollowerCount(userAlias);
  }
  public async getFolloweeCount(authToken: AuthToken, userAlias: string): Promise<number> {
    return FakeData.instance.getFolloweeCount(userAlias);
  }
  public async follow(authToken: AuthToken, userAlias: string): Promise<void> {}
  public async unfollow(authToken: AuthToken, userAlias: string): Promise<void> {}
}

export default FollowService;
