import { Status } from "tweeter-shared";
import { PagedPresenter, PagedView } from "./PagedPresenter";
import StatusService from "../model/service/StatusService";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export interface PagedStatusItemView extends PagedView<Status> {}

export abstract class PagedStatusItemPresenter extends PagedPresenter<Status, StatusService> {
  protected constructor(
    view: PagedStatusItemView,
    itemDescription: "story" | "feed",
    facade: ServerFacade = serverFacade
  ) {
    const service = new StatusService(facade);
    super(view, service, itemDescription, facade);
  }
}
