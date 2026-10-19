import UserItem from "../userItem/UserItem";
import { PagedUserItemPresenter, PagedUserItemView } from "../../presenter/PagedUserItemPresenter";
import ItemScroller from "./ItemScroller";

interface Props {
  featureUrl: string;
  presenterFactory: (listener: PagedUserItemView) => PagedUserItemPresenter;
}

const UserItemScroller = (props: Props) => {
  return (
    <ItemScroller
      presenterFactory={props.presenterFactory}
      renderItem={(user) => <UserItem user={user} featurePath={props.featureUrl} />}
    />
  );
};

export default UserItemScroller;
