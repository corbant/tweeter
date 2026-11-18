import { UserProfile } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import UserService from "../model/service/UserService";
import { serverFacade, ServerFacade } from "../lib/ServerFacade";

export interface PagedView<T> extends View {
  addItems: (items: T[]) => void;
}

export abstract class PagedPresenter<T, U> extends Presenter<PagedView<T>> {
  private _service: U;
  private _cursor: string | null = null;
  private _pageSize: number = 10;
  private itemDescription: string;
  private userService: UserService;

  protected constructor(
    view: PagedView<T>,
    service: U,
    itemDescription: string,
    facade: ServerFacade = serverFacade
  ) {
    super(view);
    this._service = service;
    this.itemDescription = itemDescription;
    this.userService = new UserService(facade);
  }

  public async loadMoreItems(alias: string): Promise<void> {
    try {
      const [items, cursor] = await this.getMoreItems(alias);

      this._cursor = cursor;
      this.view.addItems(items);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this.itemDescription} items because of exception: ${error}`
      );
    }
  }

  public reset() {
    this._cursor = null;
  }

  public async getUser(alias: string): Promise<UserProfile | null> {
    return this.userService.getUserByAlias(alias);
  }

  protected abstract getMoreItems(alias: string): Promise<[T[], string | null]>;

  protected get pageSize() {
    return this._pageSize;
  }

  protected get service() {
    return this._service;
  }

  public get cursor() {
    return this._cursor;
  }
}
