import { AuthToken, Status, User } from "tweeter-shared";
import UserService from "../model/service/UserService";

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
  private _view: StatusItemView;
  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;
  private userService: UserService;

  protected constructor(view: StatusItemView) {
    this._view = view;
    this.userService = new UserService();
  }

  protected get view() {
    return this._view;
  }

  protected set view(value) {
    this._view = value;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value) {
    this._lastItem = value;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return this.userService.getUserByAlias(authToken, alias);
  }
}
