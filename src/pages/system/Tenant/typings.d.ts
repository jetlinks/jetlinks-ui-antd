export type TenantDetail = {
  id: string;
  name: string;
  type: string;
  state: any;
  members: number;
  photo: string;
  createTime: number;
  description: string;
};

export type TenantItem = {
  members: number;
  tenant: Partial<TenantDetail>;
};
