import { AuthToken, User } from "tweeter-shared";
import FollowService from "../model/service/FollowService";
import { LoadingView, MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView, LoadingView {
  setIsFollower: (value: boolean) => void;
  setFollowerCount: (value: number) => void;
  setFolloweeCount: (value: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public async setDisplayedUser(
    authToken: AuthToken,
    currentUserAlias: string,
    displayedUserAlias: string
  ) {
    this.setIsFollowerStatus(authToken, currentUserAlias, displayedUserAlias);
    this.setNumbFollowees(authToken, displayedUserAlias);
    this.setNumbFollowers(authToken, displayedUserAlias);
  }

  private async setNumbFollowees(authToken: AuthToken, userAlias: string) {
    try {
      this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, userAlias));
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`);
    }
  }

  private async setNumbFollowers(authToken: AuthToken, userAlias: string) {
    try {
      this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, userAlias));
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followers count because of exception: ${error}`);
    }
  }

  private async follow(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.followService.follow(authToken, userAlias);

    return await this.getUpdatedFollowCounts(authToken, userAlias);
  }

  private async unfollow(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.followService.unfollow(authToken, userAlias);

    return await this.getUpdatedFollowCounts(authToken, userAlias);
  }

  private async getUpdatedFollowCounts(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerCount = await this.followService.getFollowerCount(authToken, userAlias);
    const followeeCount = await this.followService.getFolloweeCount(authToken, userAlias);

    return [followerCount, followeeCount];
  }

  private async setIsFollowerStatus(
    authToken: AuthToken,
    currentUserAlias: string,
    displayedUserAlias: string
  ) {
    try {
      if (currentUserAlias === displayedUserAlias) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.getIsFollowerStatus(authToken, currentUserAlias, displayedUserAlias)
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  private async getIsFollowerStatus(
    authToken: AuthToken,
    userAlias: string,
    otherUserAlias: string
  ): Promise<boolean> {
    return this.followService.getIsFollower(authToken, userAlias, otherUserAlias);
  }

  public async followUser(authToken: AuthToken, user: User): Promise<void> {
    return await this.updateFollowStatus(authToken, user, "follow");
  }

  public async unfollowUser(authToken: AuthToken, user: User): Promise<void> {
    return await this.updateFollowStatus(authToken, user, "unfollow");
  }

  private async updateFollowStatus(
    authToken: AuthToken,
    user: User,
    action: "follow" | "unfollow"
  ): Promise<void> {
    const isFollowing = action === "follow";
    var followStatusToast = "";

    try {
      this.view.setLoading(true);
      followStatusToast = this.view.displayInfoMessage(
        `${isFollowing ? "Following" : "Unfollowing"} ${user.name}...`,
        0
      );

      let followerCount: number, followeeCount: number;
      if (isFollowing) {
        [followerCount, followeeCount] = await this.follow(authToken, user.alias);
      } else {
        [followerCount, followeeCount] = await this.unfollow(authToken, user.alias);
      }

      this.view.setIsFollower(isFollowing ? true : false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${isFollowing ? "follow" : "unfollow"} user because of exception: ${error}`
      );
    } finally {
      this.view.deleteMessage(followStatusToast);
      this.view.setLoading(false);
    }
  }
}
