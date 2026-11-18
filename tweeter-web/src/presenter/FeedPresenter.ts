import { Status } from "tweeter-shared";
import { PagedStatusItemPresenter, PagedStatusItemView } from "./PagedStatusItemPresenter";
import { ServerFacade, serverFacade } from "../lib/ServerFacade";

export class FeedPresenter extends PagedStatusItemPresenter {
  public constructor(view: PagedStatusItemView, facade: ServerFacade = serverFacade) {
    super(view, "feed", facade);
  }

  protected async getMoreItems(alias: string): Promise<[Status[], string | null]> {
    const [newItems, cursor] = await this.service.getFeed(alias, this.pageSize, this.cursor);

    return [newItems, cursor];
  }
}
