import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal, Input, Button, Select, Table, message } from 'antd';
import Form from '@/components/BaseForm';
import StatusBadge from '@/components/StatusBadge';
import Service from "@/pages/edge-gateway/device/detail/video/cascade/service";

interface ChannelProps {
  visible?: boolean
  cascadeId?: string
  // id?: string
  onOk?: () => void
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}


function ChannelModel(props: ChannelProps) {
  const { cascadeId} = props;
  const { onOk, ...extra } = props
  const [bindList, setBindList] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [fixedParam] = useState({ terms: [{ column: 'id$cascade_channel', value: props.cascadeId }] });
  const [searchParam, setSearchParam] = useState({
    pageSize: 8
  })
  const [result, setResult] = useState<any[]>([]);
  const service = new Service('media/channel');
  const form: any = useRef(null)

  const OnOk = useCallback(() => {
    // 提交数据
    if (props.onOk) {
      props.onOk()
    }
  }, [])

  const _channel = (params?: any) => {
    setLoading(true);
    setSearchParam(params);
    service.getChannelList('local', params).subscribe(
      (res: any) => {
        setResult(res.data);
      },
      () => {
      },
      () => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    _channel(searchParam);
    _bind_cascade_channel();
  }, []);


  const _bind_cascade_channel = () => {
    service.getChannelList('local', fixedParam).subscribe(
      (res) => {
        let list: string[] = [];
        res.data.map((item: any) => {
          list.push(item.id);
        });
        setBindList(list);
      },
      () => {
      },
      () => setLoading(false));
  };

  const _bind = (channelId: any[]) => {
    if (cascadeId) {
      service._bind('local', cascadeId, channelId).subscribe(
        () => {
          message.success('绑定成功');
          _bind_cascade_channel();
        },
        () => {
          message.error('绑定失败')
        },
        () => {
        });
    }
  };

  const _unbind = (channelId: string[]) => {
    if (cascadeId) {
      service._unbind('local', cascadeId, channelId).subscribe(
        () => {
          message.success('解绑成功');
          _bind_cascade_channel();
        },
        () => {
          message.error('解绑失败')
        },
        () => {
        });
    }
  };

  const AdvancedFilter = useCallback(async () => {
    const data = await form.current.getFieldsValue()
    const arrStr = Object.keys(data).filter((item: string) => data[item]).map((item: string) => `${item}${data[item]}`).join(' and ')
    _channel(arrStr ? { where: arrStr } : undefined)
  }, [])

  const resetFields = () => {
    form.current.resetFields()
    _channel({
      pageSize: 8
    })
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
          ref={form}
          items={[
            {
              name: 'gb28181ChannelId$LIKE',
              label: '通道国际编号',
              render: () => {
                return <Input placeholder='请输入通道国际编号' />
              }
            },
            {
              name: 'name$LIKE',
              label: '通道名称',
              render: () => {
                return <Input placeholder='请输入通道名称' />
              }
            },
            {
              name: 'status=',
              label: '在线状态',

              render: () => {
                return <Select>
                  <Select.Option value=''>全部</Select.Option>
                  <Select.Option value='online'>在线</Select.Option>
                  <Select.Option value='offline'>离线</Select.Option>
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
                <Button style={{ marginRight: 8 }} onClick={resetFields}>重置</Button>
                <Button type='primary' onClick={AdvancedFilter}>查询</Button>
              </div>
            }
          ]}
        />
      </div>
      <div>
        <h2>通道详情</h2>
        <Table
          loading={loading}
          rowSelection={{
            selectedRowKeys: bindList,
            onChange: (selectedRowKeys: any) => {
              setBindList(selectedRowKeys);
            },
            onSelect: (record: any, selected: any) => {
              setLoading(true);
              let list: string[] = [record.id];
              if (selected) {
                _bind(list);
              } else {
                _unbind(list);
              }
            },
            onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
              setLoading(true);
              let list: string[] = [];
              changeRows.map((item: any) => {
                list.push(item.id);
              });
              if (selected) {
                _bind(list);
              } else {
                _unbind(list);
              }
            }
          }}
          rowKey="id"
          dataSource={result}
          columns={[
            {
              title: '通道国际编号',
              dataIndex: 'gb28181ChannelId'
            },
            {
              title: '通道名称',
              dataIndex: 'name'
            },
            {
              title: '厂商',
              dataIndex: 'manufacturer'
            },
            {
              title: '云台类型',
              dataIndex: 'ptzType',
              width: 120,
              render(value) {
                return value.text
              }
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: value => {
                return <StatusBadge value={value.value} />
              },
              width: 80
            },
          ]}
        />
      </div>
    </Modal>
  );
}

export default ChannelModel;
