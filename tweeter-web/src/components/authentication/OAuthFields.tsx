import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMessageActions } from "../toaster/MessageHooks";
import OAuthButton from "./OAuthButton";

interface Props {
  heading: string;
}
const OAuthFields = (props: Props) => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
  };

  return (
    <>
      <h1 className="h5 mb-3 fw-normal">{props.heading}</h1>

      <OAuthButton
        providerIcon="google"
        providerName="Google"
        onClick={() =>
          displayInfoMessageWithDarkBackground("Google registration is not implemented.")
        }
      />
      <OAuthButton
        providerIcon="facebook"
        providerName="Facebook"
        onClick={() =>
          displayInfoMessageWithDarkBackground("Facebook registration is not implemented.")
        }
      />
      <OAuthButton
        providerIcon="twitter"
        providerName="Twitter"
        onClick={() =>
          displayInfoMessageWithDarkBackground("Twitter registration is not implemented.")
        }
      />
      <OAuthButton
        providerIcon="linkedin"
        providerName="LinkedIn"
        onClick={() =>
          displayInfoMessageWithDarkBackground("LinkedIn registration is not implemented.")
        }
      />
      <OAuthButton
        providerIcon="github"
        providerName="GitHub"
        onClick={() =>
          displayInfoMessageWithDarkBackground("Github registration is not implemented.")
        }
      />
    </>
  );
};

export default OAuthFields;
