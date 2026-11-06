import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";

class FollowService {
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    limit: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(userAlias, limit, lastUser);
  }
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    limit: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(userAlias, limit, lastUser);
  }
  public async getIsFollower(
    token: string,
    userAlias: string,
    otherUserAlias: string
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }
  public async getFollowerCount(token: string, userAlias: string): Promise<number> {
    return FakeData.instance.getFollowerCount(userAlias);
  }
  public async getFolloweeCount(token: string, userAlias: string): Promise<number> {
    return FakeData.instance.getFolloweeCount(userAlias);
  }
  public async follow(token: string, userAlias: string): Promise<void> {
    return new Promise((f) => setTimeout(f, 2000));
  }
  public async unfollow(token: string, userAlias: string): Promise<void> {
    return new Promise((f) => setTimeout(f, 2000));
  }

  private async getFakeData(
    userAlias: string,
    limit: number,
    lastUser: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastUser),
      limit,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}

export default FollowService;
