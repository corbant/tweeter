import { AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import UserService from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockService: UserService;

  beforeEach(() => {
    mockAppNavbarPresenterView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

    const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarPresenterViewInstance));
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockService = mock<UserService>();
    const mockServiceInstance = instance(mockService);

    when(appNavbarPresenterSpy.userService).thenReturn(mockServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut();
    verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service", async () => {
    await appNavbarPresenter.logOut();
    verify(mockService.logout()).once();
  });

  it("On logout success, tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page", async () => {
    await appNavbarPresenter.logOut();

    verify(mockAppNavbarPresenterView.deleteMessage(anything())).once();
    verify(mockAppNavbarPresenterView.logoutSuccess()).once();
  });

  it("On logout failure, tells the view to display an error message and does not tell it to clear the info message, clear the user info or navigate to the login page", async () => {
    let error = new Error("An error occured");
    when(mockService.logout()).thenThrow(error);
    await appNavbarPresenter.logOut();

    verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).once();
    verify(mockAppNavbarPresenterView.logoutSuccess()).never();
  });
});
