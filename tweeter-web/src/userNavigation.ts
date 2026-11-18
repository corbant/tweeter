import { useNavigate } from "react-router-dom";
import { UserProfile } from "tweeter-shared";
import { useMessageActions } from "./components/toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./components/userInfo/UserInfoHooks";
import { UserNavigationPresenter, UserNavigationView } from "./presenter/UserNavigationPresenter";
import { usePresenter } from "./presenter";

export const useUserNavigation = (featurePath: string) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  const onUserFound = (user: UserProfile) => {
    setDisplayedUser(user);
    navigate(`${featurePath}/${user.alias}`);
  };

  const listener: UserNavigationView = {
    displayErrorMessage,
    userFound: onUserFound
  };

  const presenter = usePresenter(() => new UserNavigationPresenter(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    presenter.navigateToUser(displayedUser!, event.target.toString());
  };

  return {
    navigateToUser
  };
};
