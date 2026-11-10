import { UserSummary } from "./UserSummary";

export class Follow {
  private _follower: UserSummary;
  private _followee: UserSummary;

  public constructor(follower: UserSummary, followee: UserSummary) {
    this._follower = follower;
    this._followee = followee;
  }

  public get follower(): UserSummary {
    return this._follower;
  }

  public set follower(value: UserSummary) {
    this._follower = value;
  }

  public get followee(): UserSummary {
    return this._followee;
  }

  public set followee(value: UserSummary) {
    this._followee = value;
  }
}
