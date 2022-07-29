import { Checkbox } from 'antd';
import { useState, forwardRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import RoleMenuData, { roleKeysType, ROLEKEYS, RoleData } from './data/RoleData';
import { service } from '@/pages/init-home';
import '../index.less';

const Role = forwardRef((_, ref) => {
  const [keys, setKeys] = useState<roleKeysType[]>([]);

  const findMenuByRole = (menu: any[], code: string): any => {
    let _item = null;
    menu.some((item) => {
      if (item.code === code) {
        _item = item;
        return true;
      }

      if (item.children) {
        const childrenItem = findMenuByRole(item.children, code);
        if (childrenItem) {
          _item = childrenItem;
          return true;
        }
        return false;
      }

      return null;
    });
    return _item;
  };

  useImperativeHandle(
    ref,
    () => ({
      save: async () => {
        return new Promise((resolve) => {
          if (!keys.length) {
            return resolve(true);
          }
          let Count = 0;
          keys.forEach(async (item, index) => {
            const _itemData = RoleData[item];
            // 添加该角色
            const res = await service.addRole(_itemData);
            if (res.status === 200) {
              const menuTree = await service.getRoleMenu(res.result.id);
              if (menuTree.status === 200) {
                const _roleData = (RoleMenuData[item] as []).filter((roleItem: any) => {
                  const _menu = findMenuByRole(menuTree.result, roleItem.code);
                  if (_menu) {
                    roleItem.id = _menu.id;
                    roleItem.parentId = _menu.parentId;
                    roleItem.createTime = _menu.createTime;
                    return true;
                  }
                  return false;
                });
                //更新权限
                const roleRes = await service.updateRoleMenu(res.result.id, { menus: _roleData });
                if (roleRes.status === 200) {
                  Count += 1;
                }
                if (index === keys.length - 1) {
                  resolve(Count === keys.length);
                }
              } else if (index === keys.length - 1) {
                resolve(Count === keys.length);
              }
            } else if (index === keys.length - 1) {
              resolve(Count === keys.length);
            }
          });
        });
      },
    }),
    [keys],
  );

  return (
    <div className={'init-home-role'}>
      <Checkbox.Group
        onChange={(e) => {
          setKeys(e as roleKeysType[]);
        }}
      >
        <div className={'init-home-role-content'}>
          <div
            className={classNames('role-item role-image-1', { active: keys.includes('device') })}
          >
            <div className={'role-item-title'}>
              <Checkbox value={ROLEKEYS.device}></Checkbox>
              <div>设备接入岗</div>
            </div>
            <div className={'role-item-content'}></div>
            <div className={'role-item-footer'}>该角色负责设备接入模块的维护管理</div>
          </div>
          <div className={classNames('role-item role-image-2', { active: keys.includes('link') })}>
            <div className={'role-item-title'}>
              <Checkbox value={ROLEKEYS.link}></Checkbox>
              <div>运维管理岗</div>
            </div>
            <div className={'role-item-content'}></div>
            <div className={'role-item-footer'}>该角色负责系统运维模块的维护管理</div>
          </div>
          <div
            className={classNames('role-item role-image-3', { active: keys.includes('complex') })}
          >
            <div className={'role-item-title'}>
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
