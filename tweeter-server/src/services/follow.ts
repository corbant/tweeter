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
    const [items, nextCursor] = FakeData.instance.getPageOfUsers(cursor, limit, userAlias);
    const data = items.map((user) => user.toJSON());
    return [data, nextCursor];
  }
}

export default FollowService;
