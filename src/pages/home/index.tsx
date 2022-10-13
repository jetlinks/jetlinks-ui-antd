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

export const service = new Service();
const Home = () => {
  type ViewType = keyof typeof ViewMap;
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const [current, setCurrent] = useState<ViewType>('init'); // 默认为初始化
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>({});

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
    service.settingDetail(['front']).then((res) => {
      if (res.status === 200) {
        setInitialState({
          ...initialState,
          settings: {
            ...res.result[0].properties,
          },
        });
      }
    });
  }, []);
  useEffect(() => {
    if (isNoCommunity) {
      service.userDetail().then((res) => {
        if (res.status === 200) {
          //三方用户
          service
            .apiDetail({
              terms: [
                {
                  column: 'userId',
                  value: res.result.id,
                },
              ],
            })
            .then((response) => {
              if (response.status === 200) {
                setDetail(response.result?.data);
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
        {detail && detail.length > 0 ? <Api /> : <>{ViewMap[current]}</>}
      </Skeleton>
    </PageContainer>
  );
};
export default Home;
