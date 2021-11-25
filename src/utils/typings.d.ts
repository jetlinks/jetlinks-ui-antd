export type Response<T> = {
  message: 'success' | 'error';
  result: PageResult | Record<string, any> | T | T[];
  status: number;
  timestamp: number;
};
type PageResult = {
  pageIndex: number;
  pageSize: number;
  total: number;
  data: T[];
};

type BaseItem = {
  id: string;
  name: string;
};

type State = {
  value: string;
  text: string;
};
