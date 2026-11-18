# AI Attribution Log

## Project

Tweeter

## Milestone

Server integration and client-server testing milestone

## Date

2026-11-18

## AI Assistance

GitHub Copilot was used as an AI coding assistant during this milestone. It provided both code edits and technical guidance. The sections below distinguish those activities.

## Code Directly Edited by AI

Copilot directly edited or created the following files during the session:

- Created this [AI_ATTRIBUTION.md](./AI_ATTRIBUTION.md).
- Readded frontend service classes:
  - [UserService.ts](./tweeter-web/src/model/service/UserService.ts)
  - [StatusService.ts](./tweeter-web/src/model/service/StatusService.ts)
  - [FollowService.ts](./tweeter-web/src/model/service/FollowService.ts)
- Added and later removed temporary compatibility and test-environment changes in shared/frontend model and service files.
- Updated [ServerFacade.ts](./tweeter-web/src/lib/ServerFacade.ts) for URL handling and constructor injection.
- Updated [ClientCommunicator.ts](./tweeter-web/src/lib/ClientCommunicator.ts) to handle empty successful responses and report HTTP failures. The student later undid these changes.
- Updated [AuthStorage.ts](./tweeter-web/src/lib/AuthStorage.ts) while separating bearer-token storage from React user state.
- Updated [UserInfoProvider.tsx](./tweeter-web/src/components/userInfo/UserInfoProvider.tsx) to remove auth-token state and revise profile storage.
- Updated [userNavigation.ts](./tweeter-web/src/userNavigation.ts) to remove auth-token arguments.
- Updated [UserItem.tsx](./tweeter-web/src/components/userItem/UserItem.tsx) to use `UserSummary`.
- Updated login, register, and status-creation Lambda handlers to parse JSON request bodies before Zod validation.
- Updated [vite.config.ts](./tweeter-web/vite.config.ts) to load and define environment variables.
- Updated Jest configuration and setup for `babel-jest`, `isomorphic-fetch`, and `dotenv`.
- Updated existing navbar, post-status, and post-status component tests after the `AuthToken` object was removed.
- Created:
  - [ServerFacade.integration.test.ts](./tweeter-web/test/lib/ServerFacade.integration.test.ts)
  - [StatusService.integration.test.ts](./tweeter-web/test/presenter/StatusService.integration.test.ts)

Several edits were later changed or reversed by the student or corrected based on later requirements.

## Guidance and Discussion Provided by AI

Copilot provided the following guidance but did not necessarily edit the corresponding code:

- Compared keeping service adapters against replacing them with direct facade calls.
- Explained constructor injection and shared facade instances.
- Recommended how `UserInfoPresenter` could fetch one profile instead of separate follow-count requests.
- Explained the design of local profile storage and separate bearer-token storage.
- Explained Vite `.env` loading and `VITE_*` browser variables.
- Diagnosed invalid relative URL construction and explained correct endpoint construction.
- Explained that API Gateway request bodies arrive as JSON strings and must be parsed before Zod validation.
- Explained Zod query-parameter coercion for numeric `limit` values.
- Explained that TypeScript generic response types cannot be inspected at runtime.
- Reviewed the CDK HTTP API stack and identified CORS, authorizer, route, CfnOutput, and upload considerations.
- Explained why HTTP API `HttpLambdaIntegration` does not expose REST API integration responses.
- Explained AWS OpenAPI extensions, API export/re-import behavior, and HTTP API import limitations.
- Discussed stateful fake-data behavior across separate Lambda instances.
- Explained Jest/jsdom `fetch` needs and helped configure `isomorphic-fetch`.
- Discussed Jest compatibility with `import.meta.env`, dotenv loading, constructor injection, and mocking options.
- Explained the benefits and drawbacks of a window-based environment variable and recommended against it.

## Human Contributions

The student:

- Made final implementation decisions.
- Reviewed, applied, modified, or rejected AI-generated edits.
- Selected API endpoints and deployment settings.
- Provided AWS credentials and deployment context.
- Ran Vite builds, Jest tests, CDK commands, and API Gateway operations.
- Made final changes to their code and tests.

## Verification

At different points, Copilot ran or discussed:

- Frontend Vite/TypeScript builds.
- CDK build and synthesis.
- Jest integration tests.
- AWS CDK and API Gateway CLI operations.

Verification is not a guarantee that every change listed above remains in the final project because the student changed the code throughout the milestone.
