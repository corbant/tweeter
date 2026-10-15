import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import UserService from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface RegisterView extends View {
  setLoading: (value: boolean) => void;
  registerSuccess: (user: User, authToken: AuthToken, rememberMe: boolean) => void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  private userService: UserService;

  public constructor(view: RegisterView) {
    super(view);
    this.userService = new UserService();
  }

  public async processImageFile(file: File): Promise<{
    bytes: Uint8Array;
    fileExtension: string;
  }> {
    const fileExtension = file.name.split(".").pop();

    if (!fileExtension) {
      throw new Error("The selected image has no file extension");
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    return {
      bytes,
      fileExtension
    };
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    try {
      this.view.setLoading(true);

      const [user, authToken] = await this.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.registerSuccess(user, authToken, rememberMe);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
    } finally {
      this.view.setLoading(false);
    }
  }

  private async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const [user, authToken] = await this.userService.register(
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension
    );

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  }
}
