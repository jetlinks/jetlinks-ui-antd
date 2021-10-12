import type { State } from '@/utils/typings';

export type TenantDetail = {
  id: string;
  name: string;
  type: string;
  state: State;
  members: number;
  photo: string;
  createTime: number;
  description: string;
};

export type TenantItem = {
  members: number;
  tenant: Partial<TenantDetail>;
};

export type TenantMember = {
  id: string;
  adminMember: boolean;
  createTime: number;
  mainTenant: true;
  name: string;
  state: State;
  tenantId: string;
  type: string;
  userId: string;
};
