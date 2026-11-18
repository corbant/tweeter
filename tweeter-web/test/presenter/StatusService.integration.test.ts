import StatusService from "../../src/model/service/StatusService";
import { ServerFacade } from "../../src/lib/ServerFacade";
import { AuthStorage } from "../../src/lib/AuthStorage";

describe("StatusService integration", () => {
  beforeAll(() => {
    if (!process.env.VITE_SERVER_BASE_URL) {
      throw new Error("VITE_SERVER_BASE_URL is not defined in the .env file");
    }

    AuthStorage.clearToken();
  });

  it("successfully retrieves a user's story page", async () => {
    const facade = new ServerFacade(process.env.VITE_SERVER_BASE_URL);
    await facade.login("@allen", "testPassword");

    const statusService = new StatusService(facade);
    const [statuses, nextCursor] = await statusService.getStory("@allen", 10, null);

    expect(Array.isArray(statuses)).toBe(true);

    for (const status of statuses) {
      expect(status.post).toBeDefined();
      expect(status.user.alias).toBeTruthy();
      expect(status.user.firstName).toBeDefined();
      expect(status.user.lastName).toBeDefined();
      expect(status.timestamp).toBeGreaterThanOrEqual(0);
    }

    expect(nextCursor === null || typeof nextCursor === "string").toBe(true);
  });
});
