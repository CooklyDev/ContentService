export interface IdProvider {
  getUserId(): Promise<string>;
}
