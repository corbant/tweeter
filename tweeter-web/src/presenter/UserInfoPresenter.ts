import FollowService from "../model/service/FollowService";
import { LoadingView, MessageView, Presenter } from "./Presenter";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";
import UserService from "../model/service/UserService";
import { UserSummary } from "tweeter-shared";

export interface UserInfoView extends MessageView, LoadingView {
  setIsFollower: (value: boolean) => void;
  setFollowerCount: (value: number) => void;
  setFolloweeCount: (value: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;
  private userService: UserService;

  public constructor(view: UserInfoView, facade: ServerFacade = serverFacade) {
    super(view);
    this.followService = new FollowService(facade);
    this.userService = new UserService(facade);
  }

  public async setDisplayedUser(currentUserAlias: string, displayedUserAlias: string) {
    try {
      const [followerCount, followeeCount] = await this.getUpdatedFollowCounts(displayedUserAlias);

      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);

      await this.setIsFollowerStatus(currentUserAlias, displayedUserAlias);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to set displayed user because of exception: ${error}`);
    }
  }

  private async follow(userAlias: string): Promise<[followerCount: number, followeeCount: number]> {
    await this.followService.follow(userAlias);

    return await this.getUpdatedFollowCounts(userAlias);
  }

  private async unfollow(
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.followService.unfollow(userAlias);

    return await this.getUpdatedFollowCounts(userAlias);
  }

  private async getUpdatedFollowCounts(
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const profile = await this.userService.getUserByAlias(userAlias);

    if (!profile) {
      throw new Error("Unable to retrieve the displayed user's profile");
    }

    const { followerCount, followeeCount } = profile;

    return [followerCount, followeeCount];
  }

  private async setIsFollowerStatus(currentUserAlias: string, displayedUserAlias: string) {
    try {
      if (currentUserAlias === displayedUserAlias) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(await this.getIsFollowerStatus(displayedUserAlias));
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  private async getIsFollowerStatus(userAlias: string): Promise<boolean> {
    return this.followService.getIsFollower(userAlias);
  }

  public async followUser(user: UserSummary): Promise<void> {
    return await this.updateFollowStatus(user, "follow");
  }

  public async unfollowUser(user: UserSummary): Promise<void> {
    return await this.updateFollowStatus(user, "unfollow");
  }

  private async updateFollowStatus(
    user: UserSummary,
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
        [followerCount, followeeCount] = await this.follow(user.alias);
      } else {
        [followerCount, followeeCount] = await this.unfollow(user.alias);
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
