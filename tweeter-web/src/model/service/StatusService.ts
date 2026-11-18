import { Status } from "tweeter-shared";
import { ServerFacade } from "../../lib/ServerFacade";

class StatusService {
  private facade: ServerFacade;

  public constructor(facade: ServerFacade) {
    this.facade = facade;
  }

  public async getFeed(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[Status[], string | null]> {
    return await this.facade.loadFeed(userAlias, limit, cursor);
  }
  public async getStory(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[Status[], string | null]> {
    return await this.facade.loadStory(userAlias, limit, cursor);
  }
  public async postStatus(content: string): Promise<void> {
    return await this.facade.postStatus(content);
  }
}

export default StatusService;
