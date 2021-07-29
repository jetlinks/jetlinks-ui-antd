type LoginParam = {
  username: string;
  password: string;
  expires?: number;
  verifyCode?: string;
  verifyKey?: string;
};

type UserBase = {
  avatar: string;
  createTime: number;
  description: string;
  email: string;
  id: string;
  name: string;
  telephone: string;
  tenantDisabled: boolean;
  tenants: any[];
};

type Role = {
  id: string;
  name: string;
  type: string;
};

type Permission = {
  id: string;
  name: string;
  actions: string[];
  dataAccesses: string[];
  options: any;
};

type UserInfo = {
  userId: string;
  user: Partial<UserBase>;
  token: string;
  roles: Role[];
  permissions: Partial<Permission>[];
  expires: number;
  currentAuthority: string[];
};
