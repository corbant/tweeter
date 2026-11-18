import { Status } from "tweeter-shared";
import { PagedStatusItemPresenter, PagedStatusItemView } from "./PagedStatusItemPresenter";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export class StoryPresenter extends PagedStatusItemPresenter {
  public constructor(view: PagedStatusItemView, facade: ServerFacade = serverFacade) {
    super(view, "story", facade);
  }

  protected async getMoreItems(alias: string): Promise<[Status[], string | null]> {
    const [newItems, cursor] = await this.service.getStory(alias, this.pageSize, this.cursor);

    return [newItems, cursor];
  }
}
