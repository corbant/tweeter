import { UserSummary } from "./UserSummary";
import { UserProfileData } from "../api/users";

export class UserProfile extends UserSummary {
  private _followerCount: number;
  private _followeeCount: number;

  public constructor(
    firstName: string,
    lastName: string,
    alias: string,
    imageUrl: string,
    followerCount: number,
    followeeCount: number
  ) {
    super(firstName, lastName, alias, imageUrl);
    this._followerCount = followerCount;
    this._followeeCount = followeeCount;
  }

  public get followerCount() {
    return this._followerCount;
  }

  public get followeeCount() {
    return this._followeeCount;
  }

  public equals(other: UserProfile): boolean {
    return super.equals(other);
  }

  public static fromJSON(json: UserProfileData | null | undefined): UserProfile | null {
    if (!!json) {
      return new UserProfile(
        json.firstName,
        json.lastName,
        json.alias,
        json.imageUrl,
        json.followerCount,
        json.followeeCount
      );
    } else {
      return null;
    }
  }

  public toJSON(): UserProfileData {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      alias: this.alias,
      imageUrl: this.imageUrl,
      followerCount: this.followerCount,
      followeeCount: this.followeeCount
    };
  }
}
