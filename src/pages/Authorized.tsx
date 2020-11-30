import React from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import { getRouteAuthority } from '@/utils/utils';
import { ConnectProps, ConnectState, UserModelState } from '@/models/connect';
import { PageLoading } from '@ant-design/pro-layout';

interface AuthComponentProps extends ConnectProps {
  user: UserModelState;
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
  dispatch
}) => {
  const { currentUser } = user;
  const { routes = [] } = route;
  const isLogin = currentUser && currentUser.name;

  const autz = localStorage.getItem('hsweb-autz');
  if (!autz) {
    dispatch!({
      type: 'user/fetchCurrent',
    });
    return <PageLoading tip="获取用户数据中" />
  } else {
    return (
      <Authorized
        authority={getRouteAuthority(location.pathname, routes) || ''}
        noMatch={!isLogin ? <Redirect to="/exception/403" /> : <Redirect to={location.pathname} />}
      >
        {children}
      </Authorized>
    );
  }
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(AuthComponent);
