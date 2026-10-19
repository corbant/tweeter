import { Status } from "tweeter-shared";
import Post from "./Post";
import UserSummaryLayout from "../mainLayout/UserSummaryLayout";

interface Props {
  status: Status;
  featurePath: string;
}
const StatusItem = (props: Props) => {
  return (
    <UserSummaryLayout user={props.status.user} featurePath={props.featurePath}>
      {props.status.formattedDate}
      <br />
      <Post status={props.status} featurePath="/feed" />
    </UserSummaryLayout>
  );
};

export default StatusItem;
