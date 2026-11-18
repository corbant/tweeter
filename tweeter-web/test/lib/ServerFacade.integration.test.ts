import { ServerFacade } from "../../src/lib/ServerFacade";
import { AuthStorage } from "../../src/lib/AuthStorage";

describe("ServerFacade Integration", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    if (!process.env.VITE_SERVER_BASE_URL) {
      throw new Error("VITE_SERVER_BASE_URL is not defined in the .env file");
    }

    serverFacade = new ServerFacade(process.env.VITE_SERVER_BASE_URL);
    AuthStorage.clearToken();
  });

  it("registers a new user", async () => {
    const uniqueAlias = `@integration${Date.now()}`;
    const response = await serverFacade.register(
      uniqueAlias,
      "Integration",
      "User",
      "testPassword",
      "test-image-key"
    );

    expect(response).toBeDefined();
    expect(response.firstName).toBeDefined();
    expect(response.lastName).toBeDefined();
    expect(response.alias).toBeTruthy();
    expect(response.imageUrl).toBeTruthy();
    expect(typeof response.followerCount).toBe("number");
    expect(typeof response.followeeCount).toBe("number");
  });

  it("gets a page of followers", async () => {
    await serverFacade.login("@allen", "testPassword");

    const [followers, nextCursor] = await serverFacade.getMoreFollowers("@allen", 10, null);

    expect(Array.isArray(followers)).toBe(true);
    expect(followers.length).toBeGreaterThan(0);

    for (const follower of followers) {
      expect(follower.alias).toBeTruthy();
      expect(follower.firstName).toBeDefined();
      expect(follower.lastName).toBeDefined();
      expect(follower.imageUrl).toBeTruthy();
    }

    expect(nextCursor === null || typeof nextCursor === "string").toBe(true);
  });

  it("gets follower and followee counts", async () => {
    const profile = await serverFacade.getUserProfile("@allen");

    expect(profile).toBeDefined();
    expect(profile.alias).toBe("@allen");
    expect(typeof profile.followerCount).toBe("number");
    expect(typeof profile.followeeCount).toBe("number");
  });
});
