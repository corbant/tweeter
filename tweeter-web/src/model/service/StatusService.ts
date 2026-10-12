import { AuthToken, FakeData, Status } from "tweeter-shared";

class StatusService {
  public async getFeed(
    authToken: AuthToken,
    userAlias: string,
    limit: number,
    lastStatus: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastStatus, limit);
  }
  public async getStory(
    authToken: AuthToken,
    userAlias: string,
    limit: number,
    lastStatus: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(lastStatus, limit);
  }
  public async postStatus(authToken: AuthToken, status: Status): Promise<void> {
    FakeData.instance.fakeStatuses.push(status);
  }
}

export default StatusService;
