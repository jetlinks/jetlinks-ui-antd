import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import BaseMenu from '@/pages/system/Menu/Setting/baseMenu';
import { service } from '../index';
/**
 * 根据权限过滤菜单
 */
export const filterMenu = (permissions: string[], menus: any[]) => {
  return menus.filter((item) => {
    let isShow = false;
    if (item.showPage && item.showPage.length) {
      isShow = item.showPage.every((pItem: any) => {
        return permissions.includes(pItem);
      });
    }
    if (item.children) {
      item.children = filterMenu(permissions, item.children);
    }
    return isShow || !!item.children?.length;
  });
};
const Menu = forwardRef((props: { onChange?: (menu: any) => void }, ref) => {
  const [count, setCount] = useState(0);
  const menuRef = useRef<any[]>();

  const menuCount = (menus: any[]) => {
    return menus.reduce((pre, next) => {
      let _count = 1;
      if (next.children) {
        _count = menuCount(next.children);
      }
      return pre + _count;
    }, 0);
  };

  /**
   * 获取当前系统所有权限
   */
  const getSystemPermissions = async () => {
    const resp = await service.getSystemPermission();
    if (resp.status === 200) {
      // console.log(resp.result.map((item: any) => JSON.parse(item).id));
      const newTree = filterMenu(
        resp.result.map((item: any) => JSON.parse(item).id),
        BaseMenu,
      );
      // console.log(newTree)
      const _count = menuCount(newTree);
      menuRef.current = newTree;
      setCount(_count);
    }
  };

  useImperativeHandle(ref, () => ({
    save: () => {
      return new Promise((resolve) => {
        if (props.onChange) {
          props.onChange(menuRef.current);
        }
        service.updateMenus(menuRef.current).then((res) => {
          resolve(res.status === 200);
        });
      });
    },
  }));

  useEffect(() => {
    getSystemPermissions();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 16 }}>
        <img src={require('/public/images/init-home/menu.png')} />
      </div>
      <div>
        <b>系统将初始化{count}个菜单</b>
        <div>初始化后的菜单可在“菜单管理”页面进行维护管理</div>
      </div>
    </div>
  );
});

export default Menu;
