import {useEffect, useRef, useState, forwardRef, useImperativeHandle} from "react";
import BaseMenu from '@/pages/system/Menu/Setting/baseMenu'
import {service} from '../index'
import { observable } from '@formily/reactive';

export const MenuDataModel = observable<{menuData: any[]}>({
  menuData: []
});

const Menu = forwardRef((_, ref) => {

  const [count, setCount] = useState(0)
  const menuRef = useRef<any[]>()

  const menuCount = (menus: any[]) => {
    return menus.reduce((pre,next) => {
      let _count = 1
      if (next.children) {
        _count = menuCount(next.children)
      }
      return pre + _count
    }, 0)
  }

  /**
   * 根据权限过滤菜单
   */
  const filterMenu = (permissions:  string[], menus: any[]) => {
    return menus.filter(item => {
      let isPermissions = true
      if (item.permissions && item.permissions.length) {
        isPermissions = item.permissions.some((pItem: any) => permissions.includes(pItem.permission))
      }

      if (item.children) {
        item.children = filterMenu(permissions, item.children)
      }

      return isPermissions || !!item.children?.length
    })
  }


  /**
   * 获取当前系统所有权限
   */
  const getSystemPermissions = async () => {
    const resp = await service.getPermissionAll()
    if (resp.status === 200) {
      const newTree = filterMenu(resp.result.map((item: any) => item.id), BaseMenu)
      const _count = menuCount(newTree)
      menuRef.current = newTree
      MenuDataModel.menuData = newTree
      setCount(_count)
    }
  }

  useImperativeHandle(ref, () => ({
    save: () => {
      console.log(menuRef.current)
    }
  }))

  useEffect(() => {
    getSystemPermissions()
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 16}}>
        <img src={require('/public/images/init-home/menu.png')} />
      </div>
      <div>
        <b>系统将初始化{count}个菜单</b>
        <div>初始化后的菜单可在“菜单管理”页面进行维护管理</div>
      </div>
    </div>
  );
});

export default Menu ;
