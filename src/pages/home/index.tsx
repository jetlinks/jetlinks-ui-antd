import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import Comprehensive from './comprehensive';
import Device from './device';
import Init from './init';
import Ops from './ops';
import Api from './Api';
import Service from './service';
import { Skeleton } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { isNoCommunity } from '@/utils/util';
import SystemConst from '@/utils/const';

export const service = new Service();
const Home = () => {
  type ViewType = keyof typeof ViewMap;
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const [current, setCurrent] = useState<ViewType>('init'); // 默认为初始化
  const [loading, setLoading] = useState(true);
  const [apiUser, setApiUser] = useState<any>();

  const ViewMap = {
    init: <Init changeView={(value: ViewType) => setCurrent(value)} />,
    device: <Device />,
    ops: <Ops />,
    comprehensive: <Comprehensive />,
  };

  const adminView = () => {
    service
      .setViews({
        name: 'view',
        content: 'comprehensive',
      })
      .then((res) => {
        if (res.status === 200) {
          setCurrent('comprehensive');
        }
      });
  };

  useEffect(() => {
    service.settingDetail('front').then((res) => {
      if (res.status === 200) {
        setInitialState({
          ...initialState,
          settings: {
            ...res.result,
          },
        });
      }
    });
    console.log('版本：' + localStorage.getItem(SystemConst.Version_Code));
  }, []);
  useEffect(() => {
    if (isNoCommunity) {
      service.queryCurrent().then((res) => {
        if (res && res.status === 200) {
          const isApiUser = res.result.dimensions.find(
            (item: any) => item.type === 'api-client' || item.type.id === 'api-client',
          );
          // console.log(isApiUser);
          setApiUser(isApiUser);
          service.queryViews().then((resp) => {
            setLoading(false);
            if (resp.status === 200) {
              if (resp.result) {
                setCurrent(resp.result?.content);
              } else {
                if (res.result.username === 'admin') {
                  setCurrent('comprehensive');
                  adminView();
                } else {
                  setCurrent('init');
                }
              }
            }
          });
        }
      });
    } else {
      service.queryViews().then((resp) => {
        setLoading(false);
        if (resp.status === 200) {
          if (resp.result) {
            setCurrent(resp.result?.content);
          }
        }
      });
    }
  }, []);

  return (
    <PageContainer>
      <Skeleton loading={loading} active>
        {apiUser ? <Api /> : <>{ViewMap[current]}</>}
      </Skeleton>
    </PageContainer>
  );
};
export default Home;
