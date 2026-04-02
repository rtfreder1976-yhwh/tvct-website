export interface ApiRequest {
  method?: string;
  body?: Record<string, unknown>;
}

export interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): {
    json(payload: unknown): unknown;
    end(): unknown;
  };
}
