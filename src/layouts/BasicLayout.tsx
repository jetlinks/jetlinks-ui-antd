/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link, router } from 'umi';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Result, Button } from 'antd';
import Authorized, { reloadAuthorized } from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import apis from '@/services';
import { getAccessToken, getAuthority } from '@/utils/authority';

// import PubSub from 'pubsub-js';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  const version = localStorage.getItem('system-version');
  const tenant = localStorage.getItem('tenants-admin');
  reloadAuthorized();
  if (tenant === 'true') {
    return menuList
      .filter(j => j.tenant)
      .filter(i => i.tenant.indexOf('admin') > -1)
      .map(item => {
        const localItem: any = {
          ...item,
          // icon: <MenuFont type={item.iconfont} />,
          children: item.children ? menuDataRender(item.children) : [],
        };
        return localItem?.version && version === 'community'
          ? []
          : (Authorized.check(item.authority, localItem, null) as MenuDataItem);
      });
  } else if (tenant === 'false') {
    return menuList
      .filter(j => j.tenant)
      .filter(i => i.tenant.indexOf('member') > -1)
      .map(item => {
        const localItem: any = {
          ...item,
          // icon: <MenuFont type={item.iconfont} />,
          children: item.children ? menuDataRender(item.children) : [],
        };
        return localItem?.version && version === 'community'
          ? []
          : (Authorized.check(item.authority, localItem, null) as MenuDataItem);
      });
  }
  //  else {
  //   return menuList.filter(j => j.tenant).map(item => {
  //     const localItem: any = {
  //       ...item,
  //       // icon: <MenuFont type={item.iconfont} />,
  //       children: item.children ? menuDataRender(item.children) : []
  //     };
  //     return localItem?.version && version === 'community' ? [] : Authorized.check(item.authority, localItem, null) as MenuDataItem;
  //   });
  // }
  return menuList.map(item => {
    const localItem: any = {
      ...item,
      // icon: <MenuFont type={item.iconfont} />,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return localItem?.version && version === 'community'
      ? []
      : (Authorized.check(item.authority, localItem, null) as MenuDataItem);
  });
};

const defaultFooterDom = <div />;

const footerRender: BasicLayoutProps['footerRender'] = () => {
  if (!isAntDesignPro()) {
    return defaultFooterDom;
  }

  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  const [mark, setMark] = useState<string | boolean>(localStorage.getItem('hide_menu') || "false");
  const hide_menu = props.location?.query?.hide_menu;
  const token = getAccessToken();
  useEffect(() => {
    if (dispatch) {
        if(token!=='null'){
            dispatch({
                type: 'user/fetchCurrent',
              });
        }else{
            router.push('/user/login');
        }

    }
    if (hide_menu) {
      setMark(hide_menu);
      localStorage.setItem('hide_menu', hide_menu);
    }
  }, [hide_menu]);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  return mark === 'true' ? (
    <Authorized authority={authorized!.authority} noMatch={noMatch}>
      {children}
    </Authorized>
  ) : (
    <ProLayout
      // logo={logo}
      logo={settings.titleIcon || logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      // menuDataRender={()=>menuData}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
