import { TitleComponent } from '@/components';
import {Button, Collapse, Spin} from 'antd';
import styles from './index.less';
import Basis from './components/basis';
import Menu from './components/menu';
import Role from './components/role';
import Data from './components/data';
import Service from './service';
import { useHistory } from 'umi'
import {useState, useRef, useEffect} from 'react';
import BaseMenu from '@/pages/system/Menu/Setting/baseMenu'

export const service = new Service();

const InitHome = () => {
  const [loadings, setLoadings] = useState<boolean>(false);
  const [, setCurrent] = useState<number>(0);
  const history = useHistory()

  const cacheRef = useRef<Set<string>>()

  const baseRef = useRef<{ save: any }>()
  const menuRef = useRef<{ save: any }>()
  const roleRef = useRef<{ save: any }>()
  const dataRef = useRef<{ save: any }>()

  const jump = () => {
    history.push(BaseMenu[0].url)
  }

  useEffect(() => {
    service.getInit().then(res => {
      if (res.status === 200 && res.result.length) {
        // jump()
      }
    })
  }, [])

  return (
    <div className={styles.init}>
      <TitleComponent data={'系统初始化'} />
      <div className={styles.box}>
        <div className={styles.container}>
          {/*<div className={styles.left}>*/}
          {/*  <Steps direction="vertical" current={current} percent={60} style={{ height: '100%' }}>*/}
          {/*    <Steps.Step />*/}
          {/*    <Steps.Step />*/}
          {/*    <Steps.Step />*/}
          {/*    <Steps.Step />*/}
          {/*  </Steps>*/}
          {/*</div>*/}
          <div className={styles.right}>
            <Spin spinning={loadings}>
              <Collapse defaultActiveKey={['1']} accordion>
                <Collapse.Panel
                  header={
                    <div className={styles.collapseTitle}>
                      基本信息
                      <div className={styles.collapseDesc}>
                        配置平台名称、登录背景图、主题色等基本信息
                      </div>
                    </div>
                  }
                  key="1"
                >
                  <Basis ref={baseRef} />
                </Collapse.Panel>
                <Collapse.Panel
                  header={
                    <div className={styles.collapseTitle}>
                      菜单初始化<div className={styles.collapseDesc}>初始化菜单数据</div>
                    </div>
                  }
                  key="2"
                >
                  <Menu ref={menuRef} />
                </Collapse.Panel>
                <Collapse.Panel
                  header={
                    <div className={styles.collapseTitle}>
                      角色初始化<div className={styles.collapseDesc}>初始化内置角色与权限数据</div>
                    </div>
                  }
                  key="3"
                >
                  <Role ref={roleRef} />
                </Collapse.Panel>
                <Collapse.Panel
                  header={
                    <div className={styles.collapseTitle}>
                      初始数据<div className={styles.collapseDesc}>初始化设备接入示例数据</div>
                    </div>
                  }
                  key="4"
                >
                  <Data ref={dataRef} />
                </Collapse.Panel>
              </Collapse>
            </Spin>
            <Button
              type="primary"
              style={{ marginTop: 20 }}
              loading={loadings}
              onClick={async () => {
                setLoadings(true);
                setCurrent(0);
                if (!cacheRef.current?.has('base')) {
                  const baseRes = await baseRef.current?.save()
                  if (!baseRes) { return  setLoadings(false) }
                  cacheRef.current?.add('base')
                }

                if (!cacheRef.current?.has('menu')) {
                  const menuRes = await menuRef.current?.save()
                  if (!menuRes) { return  setLoadings(false) }
                  cacheRef.current?.add('menu')
                }

                if (!cacheRef.current?.has('role')) {
                  const roleRes = await roleRef.current?.save()
                  if (!roleRes) { return  setLoadings(false) }
                  cacheRef.current?.add('role')
                }

                if (!cacheRef.current?.has('data')) {
                  const dataRes = await dataRef.current?.save()
                  if (!dataRes) { return  setLoadings(false) }
                  cacheRef.current?.add('data')
                }
                //  记录当前
                service.saveInit().then(res => {
                  if (res.status === 200) {
                    jump()
                  }
                })
              }}
            >
              确认
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitHome;
