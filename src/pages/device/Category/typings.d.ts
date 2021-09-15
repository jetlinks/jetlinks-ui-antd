type CategoryItem = {
  id: string;
  name: string;
  level: number;
  key: string;
  parentId: string;
  path: string;
  sortIndex: number;
  children?: Category[];
};
