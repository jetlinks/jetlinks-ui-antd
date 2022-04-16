import { useEffect, useState } from 'react';
import { BUTTON_PERMISSION_ENUM } from '@/utils/menu/router';
import type { MENUS_CODE_TYPE, BUTTON_PERMISSION } from '@/utils/menu/router';
import { MENUS_BUTTONS_CACHE } from '@/utils/menu';

type permissionKeyType = keyof typeof BUTTON_PERMISSION_ENUM;
type permissionType = Record<permissionKeyType, boolean>;

const usePermissions = (
  code: MENUS_CODE_TYPE,
): {
  /**
   * 是否有改权限
   */
  permission: Partial<permissionType>;
  /**
   * 获取额外权限，比如组合权限
   * @example getOtherPermission(['add', 'delete']) => boolean
   * @return Boolean
   */
  getOtherPermission: (permission: BUTTON_PERMISSION | BUTTON_PERMISSION[]) => boolean;
} => {
  const [permission, setPermission] = useState<Partial<permissionType>>({});

  let buttons = {};
  const permissionButton: Partial<permissionType> = {};

  try {
    const buttonString = localStorage.getItem(MENUS_BUTTONS_CACHE);
    buttons = JSON.parse(buttonString || '{}');
  } catch (e) {
    console.warn(e);
  }

  const getOtherPermission = (permissionCode: string | string[]) => {
    if (!!Object.keys(buttons).length && permissionCode) {
      const _buttonArray = buttons[code];
      if (!_buttonArray) {
        return false;
      }
      return _buttonArray.some((btnId: string) => {
        if (typeof permissionCode === 'string') {
          return permissionCode === btnId;
        } else {
          return permissionCode.includes(btnId);
        }
        return false;
      });
    }
    return false;
  };

  useEffect(() => {
    Object.keys(BUTTON_PERMISSION_ENUM).forEach((key) => {
      permissionButton[key] = getOtherPermission(key);
    });
    setPermission(permissionButton);
  }, [code]);

  return { permission, getOtherPermission };
};

export default usePermissions;
