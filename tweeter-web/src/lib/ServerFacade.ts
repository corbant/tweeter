import {
  AuthResponse,
  CreateStatusRequest,
  FollowListResponse,
  IsFollowingResponse,
  LoginRequest,
  RegisterRequest,
  Status,
  StatusListResponse,
  UserProfile,
  UserProfileResponse,
  UserSummary
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { AuthStorage } from "./AuthStorage";

declare const process: {
  env: Record<string, string | undefined>;
};

export class ServerFacade {
  private SERVER_URL: string;

  private clientCommunicator: ClientCommunicator;

  public constructor(serverUrl?: string) {
    this.SERVER_URL = serverUrl ?? process.env.VITE_SERVER_BASE_URL ?? "";
    this.clientCommunicator = new ClientCommunicator(this.SERVER_URL);
  }

  public async getUserProfile(alias: string): Promise<UserProfile> {
    const url = `/users/${alias}`;
    const response = await this.clientCommunicator.doRequest<undefined, UserProfileResponse>(
      undefined,
      url,
      "GET"
    );
    const user = UserProfile.fromJSON(response)!;
    return user;
  }

  public async getMoreFollowees(
    alias: string,
    limit: number,
    cursor: string | null
  ): Promise<[UserSummary[], string | null]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) {
      params.set("cursor", cursor);
    }
    const url = `/users/${alias}/followees?${params.toString()}`;
    const response = await this.clientCommunicator.doRequest<undefined, FollowListResponse>(
      undefined,
      url,
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
    limit: number,
    cursor: string | null
  ): Promise<[UserSummary[], string | null]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) {
      params.set("cursor", cursor);
    }
    const url = `/users/${alias}/followers?${params.toString()}`;
    const response = await this.clientCommunicator.doRequest<undefined, FollowListResponse>(
      undefined,
      url,
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
    const url = `/me/following/${alias}`;
    const response = await this.clientCommunicator.doRequest<undefined, IsFollowingResponse>(
      undefined,
      url,
      "GET"
    );

    const { isFollowing } = response;

    return isFollowing;
  }

  public async followUser(alias: string): Promise<void> {
    const url = `/me/following/${alias}`;
    await this.clientCommunicator.doRequest<undefined, undefined>(undefined, url, "PUT");
  }

  public async unfollowUser(alias: string): Promise<void> {
    const url = `/me/following/${alias}`;
    await this.clientCommunicator.doRequest<undefined, undefined>(undefined, url, "DELETE");
  }

  public async loadFeed(
    alias: string,
    limit: number,
    cursor: string | null
  ): Promise<[Status[], string | null]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) {
      params.set("cursor", cursor);
    }
    const url = `/users/${alias}/feed?${params.toString()}`;
    const response = await this.clientCommunicator.doRequest<undefined, StatusListResponse>(
      undefined,
      url,
      "GET"
    );

    const items: Status[] | null = response.items
      ? response.items.map((dto) => Status.fromJSON(dto) as Status)
      : null;

    if (!items) {
      throw new Error(`No feed posts found`);
    }

    return [items, response.nextCursor];
  }

  public async loadStory(
    alias: string,
    limit: number,
    cursor: string | null
  ): Promise<[Status[], string | null]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) {
      params.set("cursor", cursor);
    }
    const url = `/users/${alias}/story?${params.toString()}`;
    const response = await this.clientCommunicator.doRequest<undefined, StatusListResponse>(
      undefined,
      url,
      "GET"
    );

    const items: Status[] | null = response.items
      ? response.items.map((dto) => Status.fromJSON(dto) as Status)
      : null;

    if (!items) {
      throw new Error(`No feed posts found`);
    }

    return [items, response.nextCursor];
  }

  public async postStatus(content: string) {
    const url = `/me/statuses`;
    await this.clientCommunicator.doRequest<CreateStatusRequest, undefined>(
      {
        content
      },
      url,
      "POST"
    );
  }

  public async login(alias: string, password: string): Promise<UserProfile> {
    const url = `/auth/login`;
    const response = await this.clientCommunicator.doRequest<LoginRequest, AuthResponse>(
      {
        alias,
        password
      },
      url,
      "POST"
    );
    AuthStorage.setToken(response.authToken.token);
    const user = UserProfile.fromJSON(response.user)!;
    return user;
  }

  public async register(
    alias: string,
    firstName: string,
    lastName: string,
    password: string,
    imageKey: string
  ): Promise<UserProfile> {
    const url = `/auth/register`;
    const response = await this.clientCommunicator.doRequest<RegisterRequest, AuthResponse>(
      {
        alias,
        firstName,
        lastName,
        password,
        imageKey
      },
      url,
      "POST"
    );
    AuthStorage.setToken(response.authToken.token);
    const user = UserProfile.fromJSON(response.user)!;
    return user;
  }

  public async logout(): Promise<void> {
    const url = `/auth/logout`;
    await this.clientCommunicator.doRequest<undefined, undefined>(undefined, url, "POST");
    AuthStorage.clearToken();
  }
}

export const serverFacade = new ServerFacade();
