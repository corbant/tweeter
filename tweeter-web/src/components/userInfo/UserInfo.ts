import { UserProfile } from "tweeter-shared";

export interface UserInfo {
  currentUser: UserProfile | null;
  displayedUser: UserProfile | null;
}
