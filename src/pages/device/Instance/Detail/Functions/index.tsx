import { Card, Tabs } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import type { FunctionMetadata } from '@/pages/device/Product/typings';
import FnForm from './form';
import AModel from './AdvancedMode';
import { getDomFullHeight } from '@/utils/util';
import { useEffect, useState } from 'react';
import { Empty } from '@/components';

const Functions = () => {
  const functionList = JSON.parse(InstanceModel.detail.metadata || '{}')
    .functions as FunctionMetadata[];

  const [minHeight, setMinHeight] = useState(100);

  useEffect(() => {
    setMinHeight(getDomFullHeight('device-detail-function', 12));
  }, []);

  return (
    <Card className={'device-detail-function'} style={{ minHeight: minHeight }}>
      <Tabs>
        <Tabs.TabPane tab={'精简模式'} key={1}>
          <Tabs tabPosition="left">
            {functionList &&
              functionList.map((fn) => {
                return (
                  <Tabs.TabPane tab={fn.name} key={fn.id}>
                    <FnForm data={fn} />
                  </Tabs.TabPane>
                );
              })}
          </Tabs>
        </Tabs.TabPane>
        <Tabs.TabPane tab={'高级模式'} key={2}>
          <Tabs tabPosition="left">
            {functionList &&
              functionList.map((fn) => {
                return (
                  <Tabs.TabPane tab={fn.name} key={fn.id}>
                    <AModel data={fn} />
                  </Tabs.TabPane>
                );
              })}
          </Tabs>
        </Tabs.TabPane>
      </Tabs>
      {!functionList && (
        <div style={{ height: minHeight - 150 }}>
          <Empty />
        </div>
      )}
    </Card>
  );
};
export default Functions;
