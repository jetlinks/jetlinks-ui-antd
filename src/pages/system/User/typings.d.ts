type UserItem = {
  id: string;
  name: string;
  status: number;
  username: string;
  createTime: number;
  email?: string;
  telephone?: string;
  avatar?: string;
  description?: string;

  orgList?: { id: string; name: string }[] | string[];
  roleList?: { id: string; name: string }[] | string[];
  orgIdList?: string[];
  roleIdList?: string[];
  type?: {
    name: string;
    id: string;
  };
};
