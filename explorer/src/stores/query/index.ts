export type QueryResponseItem = {
  id: string;
  path: string;
  data: any;
};

export type QueryResponseSnapshotItem = QueryResponseItem & {
  parent: string;
};
export type QueryBase = {
  success: boolean;
  error: string;
};

export type DocumentSnapshotResponse = {
  type: "DocumentSnapshot";
  queryId: string;
  data: QueryResponseItem;
} & QueryBase;
export type QueryDocumentSnapshotResponse = {
  type: "QueryDocumentSnapshot";
  queryId: string;
  data: QueryResponseItem;
} & QueryBase;
export type QuerySnapshotResponse = {
  type: "QuerySnapshot";
  queryId: string;
  data: Array<QueryResponseSnapshotItem>;
} & QueryBase;
export type CollectionArrayResponse = {
  type: "CollectionArray";
  queryId: string;
  data: Array<QueryResponseItem>;
} & QueryBase;
export type QueryResponse =
  | DocumentSnapshotResponse
  | QueryDocumentSnapshotResponse
  | QuerySnapshotResponse
  | CollectionArrayResponse;
export type DocumentResponse =
  | DocumentSnapshotResponse
  | QueryDocumentSnapshotResponse;
