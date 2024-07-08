export type OptionalProperties<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
export type RequiredProperties<T, K extends keyof T> = Required<Pick<T, K>>;
