import { Card, Tabs } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import type { FunctionMetadata } from '@/pages/device/Product/typings';
import FnForm from './form';
import AModel from './AdvancedMode';

const Functions = () => {
  const functionList = JSON.parse(InstanceModel.detail.metadata || '{}')
    .functions as FunctionMetadata[];

  return (
    <Card>
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
    </Card>
  );
};
export default Functions;
