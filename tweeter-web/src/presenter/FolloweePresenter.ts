import { UserSummary } from "tweeter-shared";
import { PagedUserItemPresenter, PagedUserItemView } from "./PagedUserItemPresenter";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export class FolloweePresenter extends PagedUserItemPresenter {
  public constructor(view: PagedUserItemView, facade: ServerFacade = serverFacade) {
    super(view, "followees", facade);
  }

  protected async getMoreItems(alias: string): Promise<[UserSummary[], string | null]> {
    const [newItems, cursor] = await this.service.loadMoreFollowees(
      alias,
      this.pageSize,
      this.cursor
    );

    return [newItems, cursor];
  }
}
