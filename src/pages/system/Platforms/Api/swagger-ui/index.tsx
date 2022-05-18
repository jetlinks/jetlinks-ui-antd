import { Button, Tabs } from 'antd';
import { ApiModel } from '@/pages/system/Platforms/Api/base';
import Base from './base';
import Debugger from './debugging';

interface SwaggerProps {
  showDebugger?: boolean;
}

export default (props: SwaggerProps) => {
  return (
    <div className={'platforms-api-swagger'}>
      <Button
        onClick={() => {
          ApiModel.showTable = true;
        }}
        className={'platforms-api-swagger-back'}
      >
        返回
      </Button>
      <Tabs type="card">
        <Tabs.TabPane tab={'文档'} key={1}>
          <Base />
        </Tabs.TabPane>
        {props.showDebugger === true && (
          <Tabs.TabPane tab={'调试'} key={2}>
            <Debugger />
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};
