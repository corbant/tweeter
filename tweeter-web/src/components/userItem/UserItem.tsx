import { User } from "tweeter-shared";
import UserSummaryLayout from "../mainLayout/UserSummaryLayout";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  return <UserSummaryLayout user={props.user} featurePath={props.featurePath} />;
};

export default UserItem;
