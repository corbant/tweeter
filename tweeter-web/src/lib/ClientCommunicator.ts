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

    const responseText = await resp.text();

    if (!resp.ok) {
      if (!responseText) {
        throw new Error(`Request failed with status ${resp.status}`);
      }

      const error = JSON.parse(responseText) as ErrorResponse;
      throw new Error(error.error);
    }

    if (!responseText) {
      return undefined as RES;
    }

    return JSON.parse(responseText) as RES;
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
