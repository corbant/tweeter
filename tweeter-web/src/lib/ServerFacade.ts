import { FollowListResponse, IsFollowingResponse, UserSummary } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "";
  private LIMIT = 10;

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    alias: string,
    cursor: string | undefined
  ): Promise<[UserSummary[], string | null]> {
    const url = new URL(`/users/${alias}/followees`);
    url.searchParams.set("limit", this.LIMIT.toString());
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    const response = await this.clientCommunicator.doRequest<undefined, FollowListResponse>(
      undefined,
      url.toString(),
      "GET"
    );

    const items: UserSummary[] | null = response.items
      ? response.items.map((dto) => UserSummary.fromJSON(dto) as UserSummary)
      : null;

    if (!items) {
      throw new Error(`No followees found`);
    }

    return [items, response.nextCursor];
  }

  public async getMoreFollowers(
    alias: string,
    cursor: string | undefined
  ): Promise<[UserSummary[], string | null]> {
    const url = new URL(`/users/${alias}/followers`);
    url.searchParams.set("limit", this.LIMIT.toString());
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    const response = await this.clientCommunicator.doRequest<undefined, FollowListResponse>(
      undefined,
      url.toString(),
      "GET"
    );

    const items: UserSummary[] | null = response.items
      ? response.items.map((dto) => UserSummary.fromJSON(dto) as UserSummary)
      : null;

    if (!items) {
      throw new Error(`No followers found`);
    }

    return [items, response.nextCursor];
  }

  public async getIsFollowing(alias: string): Promise<boolean> {
    const url = new URL(`/me/following/${alias}`);
    const response = await this.clientCommunicator.doRequest<undefined, IsFollowingResponse>(
      undefined,
      url.toString(),
      "GET"
    );

    const { isFollowing } = response;

    return isFollowing;
  }

  public async followUser(alias: string): Promise<void> {
    const url = new URL(`/me/following/${alias}`);
    const response = await this.clientCommunicator.doRequest<undefined, undefined>(
      undefined,
      url.toString(),
      "PUT"
    );
  }

  public async unfollowUser(alias: string): Promise<void> {
    const url = new URL(`/me/following/${alias}`);
    const response = await this.clientCommunicator.doRequest<undefined, undefined>(
      undefined,
      url.toString(),
      "DELETE"
    );
  }
}
