import { User } from "tweeter-shared";
import { PagedPresenter, PagedView } from "./PagedPresenter";
import FollowService from "../model/service/FollowService";

export interface PagedUserItemView extends PagedView<User> {}

export abstract class PagedUserItemPresenter extends PagedPresenter<User, FollowService> {
  protected constructor(view: PagedUserItemView, itemDescription: "followers" | "followees") {
    const service = new FollowService();
    super(view, service, itemDescription);
  }
}
