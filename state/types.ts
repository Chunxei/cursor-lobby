export interface GenericAction<T, P = null> {
  type: T
  payload: P
}
