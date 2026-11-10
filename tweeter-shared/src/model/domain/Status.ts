import { PostSegment, Type } from "./PostSegment";
import { format } from "date-fns";
import { UserSummary } from "./UserSummary";
import { StatusData } from "../api/statuses";

export class Status {
  private _post: string;
  private _user: UserSummary;
  private _timestamp: number;
  private _segments: PostSegment[];

  public constructor(post: string, user: UserSummary, timestamp: number) {
    this._post = post;
    this._user = user;
    this._timestamp = timestamp;
    this._segments = this.getPostSegments(post);
  }

  private getPostSegments(post: string): PostSegment[] {
    const segments: PostSegment[] = [];

    let startIndex = 0;

    for (let reference of Status.getSortedReferences(post)) {
      if (startIndex < reference.startPostion) {
        segments.push(
          new PostSegment(
            post.substring(startIndex, reference.startPostion),
            startIndex,
            reference.startPostion - 1,
            Type.text
          )
        );
      }

      segments.push(reference);

      startIndex = reference.endPosition;
    }

    if (startIndex < post.length) {
      segments.push(
        new PostSegment(post.substring(startIndex), startIndex, post.length, Type.text)
      );
    }

    return segments;
  }

  private static getSortedReferences(post: string): PostSegment[] {
    const references = [
      ...Status.parseUrlReferences(post),
      ...Status.parseMentionReferences(post),
      ...Status.parseNewlines(post)
    ];

    references.sort((a, b) => {
      return a.startPostion - b.startPostion;
    });

    return references;
  }

  private static parseUrlReferences(post: string): PostSegment[] {
    return this.parseReferences(
      post,
      (post: string) => {
        return Status.parseUrls(post);
      },
      Type.url
    );
  }

  private static parseReferences(
    post: string,
    parseMethod: (post: string) => string[],
    type: Type
  ): PostSegment[] {
    const references: PostSegment[] = [];

    const referenceStrings: string[] = parseMethod(post);

    let previousStartIndex = 0;

    for (let ref of referenceStrings) {
      let startIndex = post.indexOf(ref, previousStartIndex);

      if (startIndex > -1) {
        // Push the reference
        references.push(new PostSegment(ref, startIndex, startIndex + ref.length, type));

        // Move start and previous start past the reference
        startIndex = startIndex + ref.length;
        previousStartIndex = startIndex;
      }
    }

    return references;
  }

  private static parseUrls(post: string): string[] {
    const urlRegex: RegExp = /https?:\/\/[^\s<>"']+[a-zA-Z0-9]/g;
    return this.parseRegex(post, urlRegex);
  }

  private static parseRegex(post: string, regex: RegExp): string[] {
    const regexMatches: string[] = [];
    const matches: RegExpMatchArray | null = post.match(regex);

    if (matches) {
      for (let url of matches) {
        regexMatches.push(url);
      }
    }

    return regexMatches;
  }

  private static parseMentionReferences(post: string): PostSegment[] {
    return this.parseReferences(
      post,
      (post: string) => {
        return Status.parseMentions(post);
      },
      Type.alias
    );
  }

  private static parseMentions(post: string): string[] {
    const aliasRegex: RegExp = /@[a-zA-Z0-9]+/g;
    return this.parseRegex(post, aliasRegex);
  }

  private static parseNewlines(post: string): PostSegment[] {
    const newlines: PostSegment[] = [];

    const regex = /\n/g;

    let match;
    while ((match = regex.exec(post)) !== null) {
      const matchIndex = match.index;
      newlines.push(new PostSegment("\n", matchIndex, matchIndex + 1, Type.newline));
    }

    return newlines;
  }

  public get post(): string {
    return this._post;
  }

  public set post(value: string) {
    this._post = value;
  }

  public get user(): UserSummary {
    return this._user;
  }

  public set user(value: UserSummary) {
    this._user = value;
  }

  public get timestamp(): number {
    return this._timestamp;
  }

  public get formattedDate(): string {
    let date: Date = new Date(this.timestamp);
    return format(date, "MMMM dd, yyyy HH:mm:ss");
  }

  public set timestamp(value: number) {
    this._timestamp = value;
  }

  public get segments(): PostSegment[] {
    return this._segments;
  }

  public set segments(value: PostSegment[]) {
    this._segments = value;
  }

  public equals(other: Status): boolean {
    return (
      this._user.equals(other.user) &&
      this._timestamp === other._timestamp &&
      this._post === other.post
    );
  }

  public static fromJSON(json: StatusData | null | undefined): Status | null {
    if (!!json) {
      return new Status(
        json.content,
        new UserSummary(
          json.author.firstName,
          json.author.lastName,
          json.author.alias,
          json.author.imageUrl
        ),
        json.timestamp
      );
    } else {
      return null;
    }
  }

  public toJSON(): StatusData {
    return {
      content: this._post,
      author: {
        firstName: this._user.firstName,
        lastName: this._user.lastName,
        alias: this._user.alias,
        imageUrl: this._user.imageUrl
      },
      timestamp: this._timestamp
    };
  }
}
