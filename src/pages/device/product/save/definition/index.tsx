import React from 'react';
import { Tabs, Card } from 'antd';
import Property from './Properties';
import Functions from './Functions';
import Events from './Events';
import Tags from '@/pages/device/product/save/definition/Tags';

interface Props {
  saveProperty: Function;
  saveFunctions: Function;
  saveEvents: Function;
  saveTags: Function;
  unitsData: Function;
  propertyData: any;
  functionsData: any;
  eventsData: any;
  tagsData: any;
}

const Definition: React.FC<Props> = props => (
  <Card>
    <Tabs defaultActiveKey="1" tabPosition="left">
      <Tabs.TabPane tab="属性定义" key="1">
        <Property
          data={props.propertyData}
          unitsData={props.unitsData}
          save={(data: any) => {
            props.saveProperty(data);
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="功能定义" key="2">
        <Functions
          data={props.functionsData}
          unitsData={props.unitsData}
          save={(data: any) => {
            props.saveFunctions(data);
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="事件定义" key="3">
        <Events
          data={props.eventsData}
          unitsData={props.unitsData}
          save={(data: any) => {
            props.saveEvents(data);
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="标签定义" key="4">
        <Tags
          data={props.tagsData}
          unitsData={props.unitsData}
          save={(data: any) => {
            props.saveTags(data);
          }}
        />
      </Tabs.TabPane>
    </Tabs>
  </Card>
);

export default Definition;
