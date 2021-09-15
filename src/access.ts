import lodash from 'lodash';

export const includesKey = (keys: string[], permission: Partial<Permission>[]): boolean => {
  const permissionIds = permission.map((item) => item.id);
  const result = lodash.xorWith(keys, lodash.intersection(keys, permissionIds), lodash.isEqual);
  return result.length === 0;
};

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: UserInfo | undefined }) {
  const { currentUser } = initialState;
  const checkAccess = (keys: string[]) =>
    currentUser && includesKey(keys, currentUser!.permissions);
  return {
    user: checkAccess(['user']),
    role: checkAccess(['dimension']),
    org: checkAccess(['org']),
  };
}
