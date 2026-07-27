export interface ApiRequest {
  method?: string;
  body?: Record<string, unknown>;
  /**
   * Populated by Vercel's Node runtime from the incoming request. Optional
   * because this shape is not guaranteed by a type package we control, so
   * readers must tolerate absence rather than assume it.
   */
  headers?: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string | undefined>;
}

export interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): {
    json(payload: unknown): unknown;
    end(): unknown;
  };
}
