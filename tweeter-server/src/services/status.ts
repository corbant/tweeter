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
  public async postStatus(userAlias: string, content: string): Promise<void> {
    const user = FakeData.instance.findUserByAlias(userAlias);
    FakeData.instance.fakeStatuses.push(new Status(content, user!, Date.now()));
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
