import { type PostStatusView, PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import StatusService from "../../src/model/service/StatusService";

describe("AppNavbarPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const statusText = "test";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    const mockServiceInstance = instance(mockService);

    when(postStatusPresenterSpy.statusService).thenReturn(mockServiceInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(statusText);
    verify(mockPostStatusView.displayInfoMessage(anything(), 0)).once();
  });

  it("calls postStatus on the post status service with the correct status string", async () => {
    await postStatusPresenter.submitPost(statusText);
    verify(mockService.postStatus(statusText)).once();

    const [capturedStatus] = capture(mockService.postStatus).last();
    expect(capturedStatus).toEqual(statusText);
  });

  it("On status post success, tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message", async () => {
    await postStatusPresenter.submitPost(statusText);

    verify(mockPostStatusView.deleteMessage(anything())).once();
    verify(mockPostStatusView.postSuccess()).once();
  });

  it("On status post failure, tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    let error = new Error("An error occured");
    when(mockService.postStatus(anything())).thenThrow(error);
    await postStatusPresenter.submitPost(statusText);

    verify(mockPostStatusView.displayErrorMessage(anything())).once();
    verify(mockPostStatusView.postSuccess()).never();
  });
});
