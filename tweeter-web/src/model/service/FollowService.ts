import { UserSummary } from "tweeter-shared";
import { ServerFacade } from "../../lib/ServerFacade";

class FollowService {
  private facade: ServerFacade;

  public constructor(facade: ServerFacade) {
    this.facade = facade;
  }

  public async loadMoreFollowers(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[UserSummary[], string | null]> {
    return await this.facade.getMoreFollowers(userAlias, limit, cursor);
  }
  public async loadMoreFollowees(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[UserSummary[], string | null]> {
    return await this.facade.getMoreFollowees(userAlias, limit, cursor);
  }
  public async getIsFollower(userAlias: string): Promise<boolean> {
    return await this.facade.getIsFollowing(userAlias);
  }
  public async follow(userAlias: string): Promise<void> {
    return await this.facade.followUser(userAlias);
  }
  public async unfollow(userAlias: string): Promise<void> {
    return await this.facade.unfollowUser(userAlias);
  }
}

export default FollowService;
