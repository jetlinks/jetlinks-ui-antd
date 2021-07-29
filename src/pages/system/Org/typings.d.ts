export type OrgItem = {
  id: string;
  parentId: string;
  path: string;
  sortIndex: number;
  level: number;
  name: string;
  describe: string;
  permissionExpresion: string;
  url: string;
  icon: string;
  status: number;
  code?: string;
  children?: OrgItem[];
};

export type ObsModel = {
  data: Partial<{
    id: null;
    name: string;
    title: string;
    children: Partial<OrgItem>[];
  }>;
  current: Partial<OrgItem>;
  parentId: string | undefined;
  edit: boolean;
  update: (data: Partial<OrgItem>) => void;
  addNext: (parentData: Partial<OrgItem>) => void;
  authorize: boolean;
  authorized: (data: Partial<OrgItem>) => void;
  closeEdit: () => void;
};
