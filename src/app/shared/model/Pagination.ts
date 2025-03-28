export type Pagination<T> = {
    data: T[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
}