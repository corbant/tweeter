import { useCallback, useMemo, useState } from "react";
import { UserProfile, UserProfileData } from "tweeter-shared";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";
import { UserInfo } from "./UserInfo";
import { AuthStorage } from "../../lib/AuthStorage";

const CURRENT_USER_KEY: string = "CurrentUserKey";

interface Props {
  children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  const saveUser = (currentUser: UserProfile, remember: boolean): void => {
    const json = JSON.stringify(currentUser.toJSON());

    if (remember) {
      sessionStorage.removeItem(CURRENT_USER_KEY);
      localStorage.setItem(CURRENT_USER_KEY, json);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      sessionStorage.setItem(CURRENT_USER_KEY, json);
    }
  };

  const retrieveFromLocalStorage = (): UserInfo => {
    const storedUser =
      localStorage.getItem(CURRENT_USER_KEY) ?? sessionStorage.getItem(CURRENT_USER_KEY);
    let loggedInUser: UserProfile | null = null;

    if (storedUser) {
      loggedInUser = UserProfile.fromJSON(JSON.parse(storedUser) as UserProfileData);
    }

    const authToken = AuthStorage.getToken();

    if (!!loggedInUser && !!authToken) {
      return {
        currentUser: loggedInUser,
        displayedUser: loggedInUser
      };
    } else {
      return { currentUser: null, displayedUser: null };
    }
  };

  const clearLocalStorage = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
  };

  const [userInfo, setUserInfo] = useState({
    ...retrieveFromLocalStorage()
  });

  const updateUserInfo = useCallback(
    (currentUser: UserProfile, displayedUser: UserProfile | null, remember: boolean = false) => {
      setUserInfo(() => {
        return {
          currentUser: currentUser,
          displayedUser: displayedUser
        };
      });

      AuthStorage.setRememberMe(remember);
      saveUser(currentUser, remember);
    },
    []
  );

  const clearUserInfo = useCallback(() => {
    setUserInfo(() => {
      return {
        currentUser: null,
        displayedUser: null
      };
    });

    clearLocalStorage();
    AuthStorage.clearToken();
  }, []);

  const setDisplayedUser = useCallback((user: UserProfile) => {
    setUserInfo((previous) => {
      return { ...previous, displayedUser: user };
    });
  }, []);

  const userInfoActions = useMemo(
    () => ({
      updateUserInfo,
      clearUserInfo,
      setDisplayedUser
    }),
    [updateUserInfo, clearUserInfo, setDisplayedUser]
  );

  return (
    <UserInfoContext.Provider value={userInfo}>
      <UserInfoActionsContext.Provider value={userInfoActions}>
        {children}
      </UserInfoActionsContext.Provider>
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
