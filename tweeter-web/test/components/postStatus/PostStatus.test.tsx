import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn()
}));

const mockUserInstance = new User("test", "test", "@test", "https://test.com");
const mockAuthTokenInstance = new AuthToken("test", 1234567);

describe("PostStatus component", () => {
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance
    });
  });
  it("On initial render, Post Status and Clear buttons are both disabled", () => {
    const { postStatusButton, clearStatusButton } = renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("Post status and Clear buttons are enabled when the text field has text", () => {
    const { user, postStatusButton, clearStatusButton, statusTextField } =
      renderPostStatusAndGetElement();
    user.type(statusTextField, "test");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("Post status and Clear buttons are disabled when the text field is cleared", () => {
    const { user, postStatusButton, clearStatusButton, statusTextField } =
      renderPostStatusAndGetElement();
    user.type(statusTextField, "test");
    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
    user.click(clearStatusButton);
    expect(statusTextField).toHaveDisplayValue("");
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("presenter's postStatus method is called with correct parameters when the Post Status button is pressed", () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const post = "this is a test post";

    const { user, postStatusButton, statusTextField } =
      renderPostStatusAndGetElement(mockPresenterInstance);
    user.type(statusTextField, post);
    user.click(postStatusButton);

    verify(mockPresenter.submitPost(mockAuthTokenInstance, mockUserInstance, post)).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      <PostStatus presenter={presenter} />
    </MemoryRouter>
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent;

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearStatusButton = screen.getByRole("button", { name: /Clear/i });
  const statusTextField = screen.getByLabelText("status-text");

  return { user, postStatusButton, clearStatusButton, statusTextField };
}
