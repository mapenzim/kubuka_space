export abstract class ApiClient {
  protected async get<T>(
    url: string,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "GET",
    });
  }

  protected async post<T>(
    url: string,
    body?: unknown,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body,
    });
  }

  protected async put<T>(
    url: string,
    body?: unknown,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body,
    });
  }

  protected async patch<T>(
    url: string,
    body?: unknown,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "PATCH",
      body,
    });
  }

  protected async delete<T = void>(
    url: string,
  ): Promise<T> {
    return this.request<T>(url, {
      method: "DELETE",
    });
  }

  private async request<T>(
    url: string,
    options: {
      method: string;
      body?: unknown;
    },
  ): Promise<T> {
    const response = await fetch(url, {
      method: options.method,
      cache: options.method === "GET" ? "no-store" : undefined,
      headers:
        options.body !== undefined
          ? {
              "Content-Type":
                "application/json",
            }
          : undefined,
      body:
        options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
    });

    if (!response.ok) {
      throw new Error(
        await response.text(),
      );
    }

    // Handle 204 No Content
    if (
      response.status === 204 ||
      response.headers.get(
        "content-length",
      ) === "0"
    ) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }
}
