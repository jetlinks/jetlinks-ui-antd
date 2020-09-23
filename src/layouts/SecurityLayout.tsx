import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { PageLoading, Settings } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState, ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import { initWebSocket } from './GlobalWebSocket';
// import { getAccessToken } from '@/utils/authority';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
  children?: any;
  settings: Settings;
}

const SecurityLayout = (props: SecurityLayoutProps) => {

  const { dispatch, settings } = props;
  const [isReady, setIsReady] = useState(false);
  const { children, loading } = props;
  // You can replace it to your authentication rule (such as check token exists)
  // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
  const isLogin = !!localStorage.getItem('x-access-token');
  const queryString = stringify({
    redirect: window.location.href,
  });
  useEffect(() => {
    setIsReady(true);
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);

  /**
 * constructor
 */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'settings/fetchConfig',
        callback: () => {
          document.getElementById('title-icon')!.href = settings.titleIcon;
          setIsReady(true);
        }
      });
    }
  }, [settings.title]);

  const render = () => {
    if (isLogin) {
      initWebSocket()
    }

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin) {
      // TODO 此处应使用注释的代码。但跳转存在问题，
      // return <Redirect to={`/user/login?${queryString}`} />;
      return <Redirect to="/user/login"></Redirect>;
    }
    return children;
  }
  return render();
}

export default connect(({ user, settings, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  settings,
  loading: loading.models.user,
}))(SecurityLayout);
