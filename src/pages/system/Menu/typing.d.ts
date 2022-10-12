export type MenuItem = {
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 编码
   */
  code: string;
  /**
   * 所属应用
   */
  application: string;
  /**
   * 描述
   */
  describe: string;
  /**
   * url，路由
   */
  url: string;
  /**
   * 图标
   */
  icon: string;
  /**
   * 状态, 0为禁用，1为启用
   */
  status: number;
  /**
   * 绑定权限信息
   */
  permissions: PermissionInfo[];
  /**
   * 按钮定义信息
   */
  buttons: MenuButtonInfo[];
  /**
   * 其他配置信息
   */
  options: Record<string, any>;
  /**
   * 父级ID
   */
  parentId: string;
  /**
   * 树结构路径
   */
  path: string;
  /**
   * 排序序号
   */
  sortIndex: number;
  /**
   * 树层级
   */
  level: number;
  createTime: number;
  redirect?: string;
  children?: MenuItem[];
  accessSupport?: { text: string; value: string };
  appId?: string; //应用id
  isShow?: boolean;
};

/**
 * 权限信息
 */
export type PermissionInfo = {
  permission: string;
  actions: string[];
};

/**
 * 按钮信息
 */
export type MenuButtonInfo = {
  id: string;
  name: string;
  permissions: PermissionInfo;
  createTime: number;
  describe?: string;
  options: Record<string, any>;
};
