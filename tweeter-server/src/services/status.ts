import { AuthToken, FakeData, Status } from "tweeter-shared";
import { StatusData } from "tweeter-shared/dist/model/api/statuses";

class StatusService {
  public async getFeed(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[StatusData[], string | null]> {
    return this.getFakeData(userAlias, limit, cursor);
  }
  public async getStory(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[StatusData[], string | null]> {
    return this.getFakeData(userAlias, limit, cursor);
  }
  public async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    FakeData.instance.fakeStatuses.push(status);
  }

  private async getFakeData(
    userAlias: string,
    limit: number,
    cursor: string | null
  ): Promise<[StatusData[], string | null]> {
    const [items, nextCursor] = FakeData.instance.getPageOfStatuses(cursor, limit);
    const data = items.map((status) => status.toJSON());
    return [data, nextCursor];
  }
}

export default StatusService;
