export type QueryResponseItem = {
  id: string;
  path: string;
  data: any;
};
export type DocumentSnapshotResponse = {
  type: "DocumentSnapshot";
  queryId: string;
  data: QueryResponseItem;
};
export type QueryDocumentSnapshotResponse = {
  type: "QueryDocumentSnapshot";
  queryId: string;
  data: QueryResponseItem;
};
export type QuerySnapshotResponse = {
  type: "QuerySnapshot";
  queryId: string;
  data: Array<QueryResponseItem>;
};
export type CollectionArrayResponse = {
  type: "CollectionArray";
  queryId: string;
  data: Array<QueryResponseItem>;
};
export type QueryResponse =
  | DocumentSnapshotResponse
  | QueryDocumentSnapshotResponse
  | QuerySnapshotResponse
  | CollectionArrayResponse;
export type DocumentResponse =
  | DocumentSnapshotResponse
  | QueryDocumentSnapshotResponse;
