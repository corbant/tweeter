export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}

export interface LoadingView extends View {
  setLoading: (value: boolean) => void;
}

export class Presenter<V extends View> {
  protected view: V;

  protected constructor(view: V) {
    this.view = view;
  }
}
