import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import UserService from "../model/service/UserService";

export interface PagedView<T> extends View {
  addItems: (items: T[]) => void;
}

export abstract class PagedPresenter<T, U> extends Presenter<PagedView<T>> {
  private _service: U;
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;
  private _pageSize: number = 10;
  private itemDescription: string;
  private userService: UserService;

  protected constructor(view: PagedView<T>, service: U, itemDescription: string) {
    super(view);
    this._service = service;
    this.itemDescription = itemDescription;
    this.userService = new UserService();
  }

  public async loadMoreItems(authToken: AuthToken, user: User): Promise<void> {
    try {
      const [items, hasMoreItems] = await this.getMoreItems(authToken, user);

      this._hasMoreItems = hasMoreItems;
      this._lastItem = items.length > 0 ? items[items.length - 1] : null;
      this.view.addItems(items);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this.itemDescription} items because of exception: ${error}`
      );
    }
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return this.userService.getUserByAlias(authToken, alias);
  }

  protected abstract getMoreItems(authToken: AuthToken, user: User): Promise<[T[], boolean]>;

  protected get pageSize() {
    return this._pageSize;
  }

  protected get service() {
    return this._service;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }
}
