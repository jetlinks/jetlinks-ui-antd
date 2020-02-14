import React from 'react';
import { Tabs, Card } from 'antd';
import Property from './Properties';
import Functions from './Functions';
import Events from './Events';

interface Props {
  saveProperty: Function;
  saveFunctions: Function;
  saveEvents: Function;
  propertyData: any;
  functionsData: any;
  eventsData: any;
}

const Definition: React.FC<Props> = props => (
  <Card>
    <Tabs defaultActiveKey="1" tabPosition="left">
      <Tabs.TabPane tab="属性定义" key="1">
        <Property
          data={props.propertyData}
          save={(data: any) => {
            props.saveProperty(data);
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="功能定义" key="2">
        <Functions
          data={props.functionsData}
          save={(data: any) => {
            props.saveFunctions(data);
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="事件定义" key="3">
        <Events
          data={props.eventsData}
          save={(data: any) => {
            props.saveEvents(data);
          }}
        />
      </Tabs.TabPane>
    </Tabs>
  </Card>
);

export default Definition;
