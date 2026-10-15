import { AuthToken, Status, User } from "tweeter-shared";
import { PagedStatusItemPresenter, PagedStatusItemView } from "./PagedStatusItemPresenter";

export class StoryPresenter extends PagedStatusItemPresenter {
  public constructor(view: PagedStatusItemView) {
    super(view, "story");
  }

  protected async getMoreItems(authToken: AuthToken, user: User): Promise<[Status[], boolean]> {
    const [newItems, hasMore] = await this.service.getStory(
      authToken,
      user.alias,
      this.pageSize,
      this.lastItem
    );

    return [newItems, hasMore];
  }
}
