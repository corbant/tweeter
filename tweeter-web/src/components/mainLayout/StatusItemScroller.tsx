import StatusItem from "../statusItem/StatusItem";
import {
  PagedStatusItemPresenter,
  PagedStatusItemView
} from "../../presenter/PagedStatusItemPresenter";
import ItemScroller from "./ItemScroller";

interface Props {
  featureUrl: string;
  presenterFactory: (listener: PagedStatusItemView) => PagedStatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
  return (
    <ItemScroller
      presenterFactory={props.presenterFactory}
      renderItem={(status) => <StatusItem status={status} featurePath={props.featureUrl} />}
    />
  );
};

export default StatusItemScroller;
