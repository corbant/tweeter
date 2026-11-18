import { UserSummary } from "tweeter-shared";
import { PagedPresenter, PagedView } from "./PagedPresenter";
import FollowService from "../model/service/FollowService";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export interface PagedUserItemView extends PagedView<UserSummary> {}

export abstract class PagedUserItemPresenter extends PagedPresenter<UserSummary, FollowService> {
  protected constructor(
    view: PagedUserItemView,
    itemDescription: "followers" | "followees",
    facade: ServerFacade = serverFacade
  ) {
    const service = new FollowService(facade);
    super(view, service, itemDescription, facade);
  }
}
