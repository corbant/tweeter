import { Status } from "tweeter-shared";
import { PagedPresenter, PagedView } from "./PagedPresenter";
import StatusService from "../model/service/StatusService";

export interface PagedStatusItemView extends PagedView<Status> {}

export abstract class PagedStatusItemPresenter extends PagedPresenter<Status, StatusService> {
  protected constructor(view: PagedStatusItemView, itemDescription: "story" | "feed") {
    const service = new StatusService();
    super(view, service, itemDescription);
  }
}
