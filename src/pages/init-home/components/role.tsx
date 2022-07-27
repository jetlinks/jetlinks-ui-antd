import {Checkbox} from 'antd'
import { useState, forwardRef, useImperativeHandle} from "react";
import classNames from "classnames";

import '../index.less';

const Role = forwardRef((_, ref) => {

  const [ keys, setKeys ] = useState<string[]>([])

  useImperativeHandle(ref, () => ({
    save: () => {
      console.log(keys)
    // 获取当前选中的角色
    }
  }), [keys])

  return (
    <div className={'init-home-role'}>
      <Checkbox.Group onChange={(e) => {
        setKeys(e as string[])
      }}>
        <div className={'init-home-role-content'}>
          <div className={classNames('role-item role-image-1', {active: keys.includes('device')})}>
            <div className={'role-item-title'} >
              <Checkbox value={'device'}></Checkbox>
              <div>设备接入岗</div>
            </div>
            <div className={'role-item-content'}></div>
            <div className={'role-item-footer'}>该角色负责设备接入模块的维护管理</div>
          </div>
          <div className={classNames('role-item role-image-2', {active: keys.includes('link')})}>
            <div className={'role-item-title'} >
              <Checkbox value={'link'}></Checkbox>
              <div>运维管理岗</div>
            </div>
            <div className={'role-item-content'}></div>
            <div className={'role-item-footer'}>该角色负责系统运维模块的维护管理</div>
          </div>
          <div className={classNames('role-item role-image-3', {active: keys.includes('complex')})}>
            <div className={'role-item-title'} >
              <Checkbox value={'complex'}></Checkbox>
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
