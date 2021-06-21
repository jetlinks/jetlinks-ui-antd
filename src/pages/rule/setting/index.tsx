import React from 'react';
import Cards from '@/components/Cards';
import { Button } from 'antd';
import { } from 'react-router-dom';
function Setting() {
  return (
    <div style={{ height: '100%' }}>
      <Cards
        title='规则引擎设置'
        dataSource={[
          {
            name: 1,
            id: '12153122',
            type: '规则实例',
            description: '-',
            status: 1
          },
          {
            name: 2,
            id: '12113121',
            type: '规则实例',
            description: '-',
            status: 1
          },
          {
            name: 3,
            id: '12123222',
            type: '规则实例',
            description: '-',
            status: 1
          },
          {
            name: 4,
            id: '12123133',
            type: '规则实例',
            description: '-',
            status: 1
          },
          {
            name: 5,
            id: '12123144',
            type: '规则实例',
            description: '-',
            status: 1
          },
          {
            name: 6,
            id: '12123155',
            type: '规则实例',
            description: '-',
            status: 1
          },
        ]}
        columns={[
          {
            title: '规则名称',
            dataIndex: 'name',
          },
          {
            title: '规则ID',
            dataIndex: 'id',
          },
          {
            title: '规则类型',
            dataIndex: 'type',
          },
          {
            title: '规则描述',
            dataIndex: 'description',
          },
          {
            title: '状态',
            dataIndex: 'status',
          },
          {
            title: '操作',
            render: () => <>
              <Button type='primary'>编辑</Button>
              <Button type='primary'>重启</Button>
              <Button type='primary'>复制</Button>
              <Button type='primary'>删除</Button>
            </>
          },
        ]}
      />
    </div>
  );
}

export default Setting;
