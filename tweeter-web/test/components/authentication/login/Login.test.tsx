import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);

describe("Login component", () => {
  it("starts with the signin button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button if both alias and password fields have text", () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");

    user.type(aliasField, "a");
    user.type(passwordField, "b");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if either the alias or the password field is cleared", () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");

    user.type(aliasField, "a");
    user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();

    user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    user.type(aliasField, "a");
    expect(signInButton).toBeEnabled();

    user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign in button is pressed", () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://somewhere.com";
    const alias = "@alias";
    const password = "myPassword";

    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement(
      originalUrl,
      mockPresenterInstance
    );

    user.type(aliasField, alias);
    user.type(passwordField, password);

    user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, false)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      <Login originalUrl={originalUrl} presenter={presenter} />
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(originalUrl: string, presenter?: LoginPresenter) {
  const user = userEvent;

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}
