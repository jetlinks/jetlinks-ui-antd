import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import Service from '@/pages/account/settings/service';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}
const AvatarDropdown: React.FC<GlobalHeaderRightProps> = props => {
  const onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }
    router.push(`/account/${key}`);
  };

  const [user, setUser] = useState<any>({});
  const service = new Service('user/detail');

  const {
    currentUser = {
      avatar: user.avatar || '',
      name: '',
    },
  } = props;

  useEffect(() => {
    const u = service.get().subscribe(resp => {
      setUser(resp);
      localStorage.setItem('user-detail', JSON.stringify(resp));
      // localStorage.setItem('tenants-admin', resp.tenants[0]?.adminMember);
    });
    return () => {
      u.unsubscribe();
    };
  }, [currentUser]);

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {/* <Menu.Item key="center">
          <Icon type="user" />
            个人中心
        </Menu.Item> */}
      <Menu.Item key="settings">
        <Icon type="setting" />
        个人设置
      </Menu.Item>
      <Menu.Divider />

      <Menu.Item key="logout">
        <Icon type="logout" />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return currentUser && currentUser.name ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={user.avatar} alt="avatar" />
        <span className={styles.name}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <Spin
      size="small"
      style={{
        marginLeft: 8,
        marginRight: 8,
      }}
    />
  );
};
// class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
// }

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
