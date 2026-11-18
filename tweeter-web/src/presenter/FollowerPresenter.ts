import { UserSummary } from "tweeter-shared";
import { PagedUserItemPresenter, PagedUserItemView } from "./PagedUserItemPresenter";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export class FollowerPresenter extends PagedUserItemPresenter {
  public constructor(view: PagedUserItemView, facade: ServerFacade = serverFacade) {
    super(view, "followers", facade);
  }

  protected async getMoreItems(alias: string): Promise<[UserSummary[], string | null]> {
    const [newItems, cursor] = await this.service.loadMoreFollowers(
      alias,
      this.pageSize,
      this.cursor
    );

    return [newItems, cursor];
  }
}
