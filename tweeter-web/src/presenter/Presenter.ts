export interface View {
  displayErrorMessage: (message: string) => void;
}

export class Presenter<V extends View> {
  protected view: V;

  protected constructor(view: V) {
    this.view = view;
  }
}
