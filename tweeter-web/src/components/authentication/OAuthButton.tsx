import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
  providerIcon: "google" | "facebook" | "twitter" | "linkedin" | "github";
  providerName: string;
  onClick: () => void;
}

const OAuthButton = (props: Props) => {
  return (
    <button type="button" className="btn btn-link btn-floating mx-1" onClick={props.onClick}>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="googleTooltip">{props.providerName}</Tooltip>}
      >
        <FontAwesomeIcon icon={["fab", props.providerIcon]} />
      </OverlayTrigger>
    </button>
  );
};

export default OAuthButton;
