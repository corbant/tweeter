import { AuthToken, User } from "tweeter-shared";
import FollowService from "../model/service/FollowService";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
  setLoading: (value: boolean) => void;
  setIsFollower: (value: boolean) => void;
  setFollowerCount: (value: number) => void;
  setFolloweeCount: (value: number) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
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
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    const followerCount = await this.followService.getFollowerCount(authToken, userAlias);
    const followeeCount = await this.followService.getFolloweeCount(authToken, userAlias);

    return [followerCount, followeeCount];
  }

  private async unfollow(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

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
    var followingUserToast = "";

    try {
      this.view.setLoading(true);
      followingUserToast = this.view.displayInfoMessage(`Following ${user.name}...`, 0);

      const [followerCount, followeeCount] = await this.follow(authToken, user.alias);

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setLoading(false);
    }
  }

  public async unfollowUser(authToken: AuthToken, user: User): Promise<void> {
    var unfollowingUserToast = "";

    try {
      this.view.setLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(`Unfollowing ${user.name}...`, 0);

      const [followerCount, followeeCount] = await this.unfollow(authToken!, user.alias);

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setLoading(false);
    }
  }
}
