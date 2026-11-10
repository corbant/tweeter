import { FakeData, UserSummaryData } from "tweeter-shared";

class FollowService {
  public async loadMoreFollowers(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[UserSummaryData[], string | null]> {
    return this.getFakeData(userAlias, limit, cursor);
  }
  public async loadMoreFollowees(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[UserSummaryData[], string | null]> {
    return this.getFakeData(userAlias, limit, cursor);
  }
  public async getIsFollower(userAlias: string, otherUserAlias: string): Promise<boolean> {
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
    cursor: string | null
  ): Promise<[UserSummaryData[], string | null]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(cursor, limit, userAlias);
    let nextCursor = null;
    if (hasMore) {
      nextCursor = items[items.length - 1].alias;
    }
    const data = items.map((user) => user.toJSON());
    return [data, nextCursor];
  }
}

export default FollowService;
