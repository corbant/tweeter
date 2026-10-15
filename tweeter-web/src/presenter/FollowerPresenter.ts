import { AuthToken, User } from "tweeter-shared";
import { PagedUserItemPresenter, PagedUserItemView } from "./PagedUserItemPresenter";

export class FollowerPresenter extends PagedUserItemPresenter {
  public constructor(view: PagedUserItemView) {
    super(view, "followers");
  }

  protected async getMoreItems(authToken: AuthToken, user: User): Promise<[User[], boolean]> {
    const [newItems, hasMore] = await this.service.getFollowers(
      authToken,
      user.alias,
      this.pageSize,
      this.lastItem
    );

    return [newItems, hasMore];
  }
}
