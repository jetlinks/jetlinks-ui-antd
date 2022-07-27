import {Checkbox} from 'antd'
import { useState, forwardRef, useImperativeHandle} from "react";
import classNames from "classnames";
import RoleData, {roleKeysType, ROLEKEYS} from "./data/RoleData"
import '../index.less';
import {MenuDataModel} from "@/pages/init-home/components/menu";

const Role = forwardRef((_, ref) => {

  const [ keys, setKeys ] = useState<roleKeysType[]>([])

  const findMenuByRole = (menu: any[], code: string): boolean => {
    return menu.some(item => {
      if (item.code === code) {
        return true
      }

      if (item.children) {
        return findMenuByRole(item.children, code)
      }

      return false
    })
  }

  useImperativeHandle(ref, () => ({
    save: async () => {
      console.log(keys)
    // 获取当前选中的角色
      const newRole = keys.map(item => {

        const _roleData = (RoleData[item] as []).filter((roleItem: any) => {
          return findMenuByRole(MenuDataModel.menuData, roleItem.code)
        })
        return { menus: _roleData }
      })
      console.log(newRole)
    }
  }), [keys])

  return (
    <div className={'init-home-role'}>
      <Checkbox.Group onChange={(e) => {
        setKeys(e as roleKeysType[])
      }}>
        <div className={'init-home-role-content'}>
          <div className={classNames('role-item role-image-1', {active: keys.includes('device')})}>
            <div className={'role-item-title'} >
              <Checkbox value={ROLEKEYS.device}></Checkbox>
              <div>设备接入岗</div>
            </div>
            <div className={'role-item-content'}></div>
            <div className={'role-item-footer'}>该角色负责设备接入模块的维护管理</div>
          </div>
          <div className={classNames('role-item role-image-2', {active: keys.includes('link')})}>
            <div className={'role-item-title'} >
              <Checkbox value={ROLEKEYS.link}></Checkbox>
              <div>运维管理岗</div>
            </div>
            <div className={'role-item-content'}></div>
            <div className={'role-item-footer'}>该角色负责系统运维模块的维护管理</div>
          </div>
          <div className={classNames('role-item role-image-3', {active: keys.includes('complex')})}>
            <div className={'role-item-title'} >
              <Checkbox value={ROLEKEYS.complex}></Checkbox>
              <div>综合管理岗</div>
            </div>
            <div className={'role-item-content'}></div>
            <div className={'role-item-footer'}>该角色负责系统运维和设备接入模块的维护管理</div>
          </div>
        </div>
      </Checkbox.Group>
    </div>
  );
});

export default Role;
