import { ErrorResponse } from "tweeter-shared";
import { AuthStorage } from "./AuthStorage";

export class ClientCommunicator {
  private SERVER_URL: string;

  public constructor(serverUrl: string) {
    this.SERVER_URL = serverUrl;
  }

  public async doRequest<REQ, RES>(
    req: REQ | undefined,
    endpoint: string,
    method: string,
    headers?: Headers
  ): Promise<RES> {
    if (headers && req) {
      headers.append("Content-Type", "application/json");
    } else if (req) {
      headers = new Headers({
        "Content-Type": "application/json"
      });
    }

    const token = AuthStorage.getToken();
    if (token) {
      if (headers) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        headers = new Headers({
          Authorization: `Bearer ${token}`
        });
      }
    }

    const url = this.getUrl(endpoint);
    const params = this.getParams(method, headers, req ? JSON.stringify(req) : undefined);

    const resp: Response = await fetch(url, params);

    if (resp.ok) {
      const response: RES = await resp.json();
      return response;
    } else {
      const error: ErrorResponse = await resp.json();
      throw new Error(error.error);
    }
  }

  private getUrl(endpoint: string): string {
    return this.SERVER_URL + endpoint;
  }

  private getParams(method: string, headers?: Headers, body?: BodyInit): RequestInit {
    const params: RequestInit = { method: method };

    if (headers) {
      params.headers = headers;
    }

    if (body) {
      params.body = body;
    }

    return params;
  }
}
