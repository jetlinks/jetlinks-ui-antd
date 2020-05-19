import { MenuDataItem, getMenuData, getPageTitle, Settings } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { Link } from 'umi';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { ConnectProps, ConnectState } from '@/models/connect';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
    settings,
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          {/* <SelectLang /> */}
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>JetLinks </span>
              </Link>
            </div>
            <div className={styles.desc}>捷联物联网平台</div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter /> */}
      </div>
    </>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
