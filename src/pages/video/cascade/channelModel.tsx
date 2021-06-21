import React, { useState, useCallback } from 'react';
import { Modal, Input, Button, Select, Table, Badge } from 'antd';
import Form from '@/components/BaseForm';

interface ChannelProps {
  visible?: boolean
  data?: object
  onOk?: (e: string[] | number[]) => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}


function ChannelModel(props: ChannelProps) {

  const { onOk, ...extra } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | number[]>([])
  const [data, setData] = useState([])

  const OnOk = useCallback(() => {
    // 提交数据
    if (props.onOk) {
      props.onOk(selectedRowKeys)
    }
  }, [selectedRowKeys])

  const onSelectChange = (e: string[] | number[]) => {
    setSelectedRowKeys(e)
  }

  return (
    <Modal
      title='选择通道'
      onOk={OnOk}
      {...extra}
      width='50vw'
    >
      <div>
        <Form
          column={2}
          data={props.data}
          items={[
            {
              name: 'test00',
              label: '通道国际编号',
              render: () => {
                return <Input placeholder='请输入通道国际编号' />
              }
            },
            {
              name: 'test22',
              label: '通道名称',
              render: () => {
                return <Input placeholder='请输入通道名称' />
              }
            },
            {
              name: 'test33',
              label: '在线状态',
              render: () => {
                return <Select>
                  <Select.Option value=''>全部</Select.Option>
                </Select>
              }
            },
            {
              render: () => <div
                style={{
                  height: 79,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end'
                }}
              >
                <Button style={{ marginRight: 8 }}>重置</Button>
                <Button type='primary'>查询</Button>
              </div>
            }
          ]}
        />
      </div>
      <div>
        <h2>通道详情</h2>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange
          }}
          dataSource={data}
          columns={[
            {
              title: '通道国际编号',
              dataIndex: 'no'
            },
            {
              title: '通道名称',
              dataIndex: 'name'
            },
            {
              title: '厂商',
              dataIndex: 'cs'
            },
            {
              title: '云台类型',
              dataIndex: 'type'
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: value => {
                return <Badge color="#f50" text="离线" />
              },
              width: 60
            },
          ]}
        />
      </div>
    </Modal>
  );
}

export default ChannelModel;
