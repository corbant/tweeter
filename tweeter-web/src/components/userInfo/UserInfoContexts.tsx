import { Context, createContext } from "react";
import { UserProfile } from "tweeter-shared";
import { UserInfo } from "./UserInfo";

export const UserInfoContext = createContext<UserInfo>({} as UserInfo);

interface UserInfoActions {
  updateUserInfo: (
    currentUser: UserProfile,
    displayedUser: UserProfile | null,
    remember: boolean
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: UserProfile) => void;
}

const defaultUserInfoActions: UserInfoActions = {
  updateUserInfo: () => null,
  clearUserInfo: () => null,
  setDisplayedUser: () => null
};

export const UserInfoActionsContext: Context<UserInfoActions> =
  createContext<UserInfoActions>(defaultUserInfoActions);
