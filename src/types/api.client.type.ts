export type BodyInitCompatible<TEntity> =
  | string
  | Blob
  | ArrayBuffer
  | ArrayBufferView
  | FormData
  | URLSearchParams
  | null
  | undefined
  | object
  | React.Dispatch<React.SetStateAction<TEntity>>
  | Record<string, TEntity>;

export type ApiRequestInit<TEntity = unknown> = Omit<RequestInit, 'body'> & {
  body?: BodyInitCompatible<TEntity>;
};