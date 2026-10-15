import { AuthToken, User } from "tweeter-shared";
import { PagedUserItemPresenter, PagedUserItemView } from "./PagedUserItemPresenter";

export class FolloweePresenter extends PagedUserItemPresenter {
  public constructor(view: PagedUserItemView) {
    super(view, "followees");
  }

  protected async getMoreItems(authToken: AuthToken, user: User): Promise<[User[], boolean]> {
    const [newItems, hasMore] = await this.service.getFollowees(
      authToken,
      user.alias,
      this.pageSize,
      this.lastItem
    );

    return [newItems, hasMore];
  }
}
