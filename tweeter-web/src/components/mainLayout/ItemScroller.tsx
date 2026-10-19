import { useEffect, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useParams } from "react-router-dom";
import { PagedPresenter, PagedView } from "../../presenter/PagedPresenter";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePresenter } from "../../presenter";

interface Props<T> {
  presenterFactory: (view: PagedView<T>) => PagedPresenter<T, unknown>;
  renderItem: (item: T) => React.ReactNode;
}

function ItemScroller<T>(props: Props<T>) {
  const [items, setItems] = useState<T[]>([]);

  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const addItems = (newItems: T[]) => setItems((previousItems) => [...previousItems, ...newItems]);
  const loadMoreItems = () => {
    return presenter.loadMoreItems(authToken!, displayedUser!);
  };
  const reset = async () => {
    setItems(() => []);
    presenter.reset();
  };

  useEffect(() => {
    if (authToken && displayedUserAliasParam && displayedUserAliasParam != displayedUser!.alias) {
      presenter.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const listener: PagedView<T> = {
    addItems,
    displayErrorMessage
  };

  const presenter = usePresenter(() => props.presenterFactory(listener));

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
            {props.renderItem(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ItemScroller;
