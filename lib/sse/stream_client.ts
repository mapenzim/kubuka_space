export interface StreamClient {
  id: string;
  stream: ReadableStreamDefaultController<string>;
}