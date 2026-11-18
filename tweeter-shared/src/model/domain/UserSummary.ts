import { UserSummaryData } from "../api/users";
export class UserSummary {
  private _firstName: string;
  private _lastName: string;
  private _alias: string;
  private _imageUrl: string;

  public constructor(firstName: string, lastName: string, alias: string, imageUrl: string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._alias = alias;
    this._imageUrl = imageUrl;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }

  public get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  public get alias(): string {
    return this._alias;
  }

  public set alias(value: string) {
    this._alias = value;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public set imageUrl(value: string) {
    this._imageUrl = value;
  }

  public equals(other: UserSummary): boolean {
    return this._alias === other._alias;
  }

  public static fromJSON(json: UserSummaryData | null | undefined): UserSummary | null {
    if (!!json) {
      return new UserSummary(json.firstName, json.lastName, json.alias, json.imageUrl);
    } else {
      return null;
    }
  }

  public toJSON(): UserSummaryData {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      alias: this.alias,
      imageUrl: this.imageUrl
    };
  }
}
