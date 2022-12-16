import type { State } from '@/utils/typings';

// 部门
export type DepartmentItem = {
  id: string;
  name: string;
  path: string;
  sortIndex: number;
  level: number;
  code: string;
  parentId: string;
  children: DepartmentItem[];
};

// 用户
export type MemberItem = {
  id: string;
  name: string;
  username: string;
  status: number;
  createTime: number;
  creatorId: string;
};

// 产品
export type ProductItem = {
  id: string;
  name: string;
  description: string;
  grantedPermissions?: string[];
  state: number;
};

// 产品分类
export type ProductCategoryItem = { key: string; children: ProductCategoryItem[] } & ProductItem;

// 设备
export type DeviceItem = {
  id: string;
  name: string;
  productName: string;
  createTime: number;
  state: State;
  grantedPermissions?: string[];
};
