import { PageHeaderWrapper } from '@ant-design/pro-layout';
import OrganizationChart from '@dabeng/react-orgchart';
import { Button, message } from 'antd';

import React from 'react';
const ds = {
  id: 'n1',
  name: 'Lao Lao',
  title: 'general manager',
  children: [
    { id: 'n2', name: 'Bo Miao', title: 'department manager' },
    {
      id: 'n3',
      name: 'Su Miao',
      title: 'department manager',
      children: [
        { id: 'n4', name: 'Tie Hua', title: 'senior engineer' },
        {
          id: 'n5',
          name: 'Hei Hei',
          title: 'senior engineer',
          children: [
            { id: 'n6', name: 'Dan Dan', title: 'engineer' },
            { id: 'n7', name: 'Xiang Xiang', title: 'engineer' },
          ],
        },
        { id: 'n8', name: 'Pang Pang', title: 'senior engineer' },
      ],
    },
    { id: 'n9', name: 'Hong Miao', title: 'department manager' },
    {
      id: 'n10',
      name: 'Chun Miao',
      title: 'department manager',
      children: [{ id: 'n11', name: 'Yue Yue', title: 'senior engineer' }],
    },
  ],
};
const OrgChart = () => {
  return (
    <PageHeaderWrapper title="组织架构图">
      <OrganizationChart
        datasource={ds}
        draggable
        onClickNode={(node: any) => {
          message.success(JSON.stringify(node));
        }}
        NodeTemplate={(nodeData: any) => {
          console.log(nodeData, 'node');
          return (
            <Button onClick={()=>message.success(JSON.stringify(nodeData))}>{nodeData.nodeData.name}</Button>
          );
        }}
      />
    </PageHeaderWrapper>
  );
};
export default OrgChart;
