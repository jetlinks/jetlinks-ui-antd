import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useState } from 'react';
import Comprehensive from './comprehensive';
import Device from './device';
import Init from './init';
import Ops from './ops';
import Service from './service';

export const service = new Service();
const Home = () => {
  type ViewType = keyof typeof ViewMap;
  const [current, setCurrent] = useState<ViewType>('init');

  const ViewMap = {
    init: <Init changeView={(value: ViewType) => setCurrent(value)} />,
    device: <Device />,
    ops: <Ops />,
    comprehensive: <Comprehensive />,
  };

  useEffect(() => {
    service.queryView().then((resp) => {
      if (resp.status === 200) {
        if (resp.result.length == 0) {
          setCurrent('init');
        } else {
          setCurrent(resp.result[0]?.content);
        }
      }
    });
  }, []);
  return <PageContainer>{ViewMap[current]}</PageContainer>;
};
export default Home;
