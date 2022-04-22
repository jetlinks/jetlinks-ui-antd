type ReationItem = {
  id: string;
  name: string;
  objectType: string;
  objectTypeName: string;
  relation: string;
  targetType: string;
  targetTypeName: string;
  createTime: number;
  description?: string;
  expands?: Record<string, any>;
};
