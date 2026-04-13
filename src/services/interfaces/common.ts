export interface IdProvider {
  getUserId(): Promise<string | null>;
}

export interface TransactionManager {
  runInTransaction<T>(operation: () => Promise<T>): Promise<T>;
}
