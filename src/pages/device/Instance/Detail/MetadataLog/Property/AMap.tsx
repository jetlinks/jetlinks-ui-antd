import { AMap, PathSimplifier } from '@/components';
import { Button, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value: any;
  name: string;
}

export default (props: Props) => {
  const [speed] = useState(1000000);
  const PathNavigatorRef = useRef<PathNavigator | null>(null);
  const [dataSource, setDataSource] = useState<any>({});

  useEffect(() => {
    const list: any[] = [];
    (props?.value?.data || []).forEach((item: any) => {
      list.push([item.value.lon, item.value.lat]);
    });
    setDataSource({
      name: props?.name || '',
      path: [...list],
    });
  }, [props.value]);
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 0, top: 5, zIndex: 999 }}>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              if (PathNavigatorRef.current) {
                PathNavigatorRef.current.start();
              }
            }}
          >
            开始动画
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (PathNavigatorRef.current) {
                PathNavigatorRef.current.stop();
              }
            }}
          >
            停止动画
          </Button>
        </Space>
      </div>
      <AMap
        AMapUI
        style={{
          height: 500,
          width: '100%',
        }}
      >
        <PathSimplifier pathData={[dataSource]}>
          <PathSimplifier.PathNavigator
            speed={speed}
            isAuto={false}
            onCreate={(nav) => {
              PathNavigatorRef.current = nav;
            }}
          />
        </PathSimplifier>
      </AMap>
    </div>
  );
};
