import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.svg';
import { BasicLayoutProps } from './BasicLayout';
import { connect } from 'dva';
import { Menu, Button, Badge, Spin } from 'antd'
import { CurrentUser } from '@/models/user';
import { ConnectProps, ConnectState } from '@/models/connect';
import styles from './TopLayout.less';
import Service from '@/pages/account/settings/service';
import { ClickParam } from 'antd/es/menu';
import { HeaderViewProps } from '@ant-design/pro-layout/lib/Header';

interface TopLayoutProps extends Omit<HeaderViewProps, 'logo'>, BasicLayoutProps {
  currentUser?: CurrentUser;
}

function TopLayout(props: TopLayoutProps) {
  const { currentUser, dispatch } = props;
  const service = new Service('user/detail');
  const [current, setCurrent] = useState('')

  const fetchData = () => {
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  }

  const handleClick = (param: ClickParam) => {
    setCurrent(param.key)
  }

  useEffect(() => {
    const u = service.get().subscribe(resp => {
      localStorage.setItem('user-detail', JSON.stringify(resp));
      // localStorage.setItem('tenants-admin', resp.tenants[0]?.adminMember);
    });
    return () => {
      u.unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    if (props.location?.pathname) {
      setCurrent(props.location?.pathname)
    }
  }, [props.location])


  return <div className={styles.topLayout}>
    <div className={styles.left}>
      <img className={styles.log} src={props.iconfontUrl || logo} alt="" />
      <span className={styles.title}>{props.title || 'Jetlinks-Edge'}</span>
      <div className={styles.icons}>
        <img className={styles.device} src={require('@/assets/device.png')} alt="" />
        <div className={styles.horiLine}></div>
        <img className={styles.things} src={require('@/assets/things.png')} alt="" />
      </div>
      <div className={styles.status}>
        <Badge style={{ color: '#fff' }} color='green' text='在线' />
      </div>
    </div>
    <div className={styles.center}>

      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        {
          props.menuData && props.menuData.map(
            item =>
              <Menu.Item key={item.path}>
                {item.name}
              </Menu.Item>
          )
        }
      </Menu>
    </div>
    <div className={styles.right}>
      {
        currentUser && currentUser.name ?
          <span> {currentUser.name} </span>
          : <Spin
            size="small"
            style={{
              marginLeft: 8,
              marginRight: 8,
            }}
          />
      }
      <div className={styles.verticalLine}></div>
      <Button type='link' style={{ color: '#fff' }} onClick={fetchData}>退出</Button>
    </div>
  </div>
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(TopLayout)
