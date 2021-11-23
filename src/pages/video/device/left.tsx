import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './index.less';
import { Table, Button, Input, Select, Modal, Icon, message } from 'antd';
import BaseForm from '@/components/BaseForm';
// import DeviceModel from './deviceModel';
import { useRequest } from 'ahooks';
import { addOnvif, delDevice, getDeviceList, getOnvif, MediaDeviceList, getDeviceCount } from '@/pages/edge-gateway/device/service';
import DeviceModel from '@/pages/edge-gateway/device/detail/video/add/addDevice';
import StatusBadge from '@/components/StatusBadge';
interface LeftProps {
  onRowClick?: (record: any) => void
}

function Left(props: LeftProps) {
  // const { edge } = props

  const { data, loading, run } = useRequest(getDeviceList, {
    manual: true,
    onSuccess: (data: any) => {
      if (data.result && data.result[0].data.length) {
        setDeviceId(data.result[0].data[0].id)
        tableRowClick(data.result[0].data[0])
      }
    }
  })

  const { run: DeviceCount } = useRequest(getDeviceCount, {
    manual: true,
    onSuccess: (data: any) => {
      setDeviceCount(data.result[0])
    }
  })

  const { loading: deleteLoading, run: deleteDevice } = useRequest(delDevice, {
    manual: true,
    onSuccess: (data: any) => {
      setDeleteVisible(false)
      if (data.status === 200) {
        tableRequest()
      }
    }
  })

  const [formData, setFormData] = useState({})
  const [AddOnvifLoading, setAddOnvifLoading] = useState(false)

  const [advanced, setAdvanced] = useState(false)
  const [visible, setVisible] = useState(false)
  const [deviceParams, setDeviceParams] = useState({
    pageSize: 8
  });
  const [deviceId, setDeviceId] = useState('');
  const queryForm: any = useRef(null)

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [deviceCount, setDeviceCount] = useState<number>(0)

  const [queryFormItems] = useState([
    {
      name: 'name',
      label: '设备名称',
      render: () => <Input />
    },
    {
      name: 'state',
      label: '状态',
      render: () => <Select>
        <Select.Option value=''>全部</Select.Option>
        <Select.Option value='online'>在线</Select.Option>
        <Select.Option value='offline'>离线</Select.Option>
      </Select>
    }
  ])

  const openModel = (type: string) => {
    setVisible(true)
    setFormData({})
  }

  // 添加视频设备请求
  const addOnvifRequest = async (data: any) => {
    setAddOnvifLoading(true)
    const result = await addOnvif('local', data)
    if (result.status === 200) {
      message.success('保存成功！');
    }
    setAddOnvifLoading(false)
    setVisible(false);
    // 刷新table
    run('local', deviceParams)
  }

  /**
   * 添加设备确认事件
   */
  const saveOnvifSubmit = useCallback(async (fileValue: any) => {
    if (!!fileValue.id) {
      addOnvifRequest(fileValue)
    } else {
      let param = {
        url: fileValue.url,
        username: fileValue.username,
        password: fileValue.password,
      }

      const res = await getOnvif('local', param)
      if (res.status === 200) {
        if (res.result.length > 0) {
          let data = res.result[0];
          let mediaProfiles = (res.result[0]?.mediaProfiles || []).map((item: any, index: number) => {
            let ra = Math.round(Math.random() * 10000000000);
            return {
              name: item.name,
              token: item.token,
              id: `channel${index}${ra}`
            }
          })
          let params = {
            id: `device${Math.round(Math.random() * 10000000000)}`,
            firmwareVersion: data.firmwareVersion,
            hardwareId: data.hardwareId,
            description: fileValue.description,
            manufacturer: data.manufacturer,
            mediaProfiles: mediaProfiles,
            model: data.model,
            name: fileValue.name || data.name,
            password: data.password,
            serialNumber: data.serialNumber,
            url: data.url,
            username: data.username
          }
          addOnvifRequest(params)
        }
      }
    }
  }, [])

  useEffect(() => {
    tableRequest()
    DeviceCount({ "terms": [{ "column": "productId", "value": "onvif-media-device" }, { "column": "productId", "value": "GB28181-PRO", "type": "or" }] })
  }, [])

  /**
   * table数据请求
   */
  const tableRequest = (data?: any) => {
    run('local', data ? data : {})
  }

  const AdvancedFilter = useCallback(async () => {
    const data = await queryForm.current.getFieldsValue()
    console.log(data)
    const arrStr = Object.keys(data).filter((item: string) => data[item]).map((item: string) => `${item} like %${data[item]}%`).join(' and ')
    tableRequest(arrStr ? { where: arrStr } : undefined)
  }, [])

  const resetFields = () => {
    queryForm.current.resetFields()
    tableRequest()
  }

  const handleEditData = (data: MediaDeviceList) => {
    setFormData(data)
    setVisible(true)
  }

  const tableRowClick = (data: MediaDeviceList) => {
    if (props.onRowClick) {
      props.onRowClick(data)
    }
  }

  const backgroundStyle = (record: any) => {
    return record.id === deviceId ? styles.clickRowStyl : '';
  }

  return (
    <div className={styles.left}>
      <div className={styles.header}>
        <span>视频设备</span>
        <div>
          <Button type='primary' onClick={() => {
            openModel('add')
          }}>添加设备</Button>
          <Icon onClick={() => {
            AdvancedFilter()
            DeviceCount({ "terms": [{ "column": "productId", "value": "onvif-media-device" }, { "column": "productId", "value": "GB28181-PRO", "type": "or" }] })
          }} style={{ color: 'rgba(0,0,0,.45)', marginLeft: 25, cursor: 'pointer' }} type="redo" />
        </div>
      </div>
      <div className={styles.tool}>
        <span>已接入设备数 {deviceCount}</span>
        <div onClick={() => { setAdvanced(!advanced) }} style={{ color: '#1890FF', cursor: 'pointer' }}>
          高级筛选 <Icon style={{ transform: `rotate( ${advanced ? 0 : '-180deg'})`, transition: 'all .3s' }} type="down" />
        </div>
      </div>
      <div className={`${styles.advanced} ${advanced ? styles.active : ''}`}>
        <BaseForm
          ref={queryForm}
          labelCol={{
            xs: { span: 12 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 36 },
            sm: { span: 18 },
          }}
          column={2}
          items={queryFormItems}
        />
        <div className={styles.advancedTool}>
          <Button type="primary" onClick={AdvancedFilter}>查询</Button>
          <Button onClick={resetFields}>重置</Button>
          
        </div>
      </div>
      <div className={styles.table}>
        <Table<MediaDeviceList>
          loading={loading}
          dataSource={data && data.result && data.result.length ? data.result[0].data : []}
          rowKey="id"
          pagination={{
            pageSize: data && data.result && data.result.length ? data.result[0].pageSize : 0,
            total: data && data.result && data.result.length ? data.result[0].total : 0,
            current: data && data.result && data.result.length ? data.result[0].pageIndex : 0
          }}
          rowClassName={backgroundStyle}
          onRow={record => ({
            onClick: (_) => {
              setDeviceId(record.id)
              tableRowClick(record)
            }
          })}
          columns={[
            {
              title: '状态',
              dataIndex: 'state',
              render: (value) => {
                return <StatusBadge value={value.value} />
              },
              width: 90
            },
            {
              title: '设备名称',
              dataIndex: 'name',
              render: (data, result) => {
                return <div>
                  <div style={{ color: 'rgba(0,0,0,1)', fontSize: 14 }}>{data}</div>
                  <div style={{ color: 'rgba(0,0,0,0.45)' }}>
                    <span style={{ paddingRight: 4 }}>IP: {result.host || '-'}</span>
                    <span>通道: {result.channelNumber || '0'}</span>
                  </div>
                </div>
              }
            },
            {
              title: '接入协议',
              dataIndex: 'provider',
            },
            {
              title: '操作',
              align:'center',
              render: (_, record) => {
                return <>
                  <Button type='link' onClick={() => {

                    handleEditData(record)
                  }}>编辑</Button>
                  <Button type='link' onClick={() => {
                    setDeleteId(record.id)
                    setDeleteVisible(true)
                  }}>删除</Button>
                </>
              },
              width: 154
            },
          ]}
        />

      </div>

      {visible && <DeviceModel
        deviceId=''
        close={() => { setVisible(false) }}
        data={formData}
        loading={AddOnvifLoading}
        save={saveOnvifSubmit} />}

      <Modal
        title={<span style={{ fontWeight: 600 }}>删除</span>}
        visible={deleteVisible}
        confirmLoading={deleteLoading}
        onOk={() => {
          deleteDevice('local', { deviceId: deleteId })
        }}
        onCancel={() => {
          setDeleteVisible(false)
        }}
        okText="确认"
        cancelText="取消"
      >
        <span style={{ fontSize: 14 }}>确认删除该视频设备吗？</span>
      </Modal>
    </div>
  );
}

export default Left;
// connect(({ edge }: ConnectState) => ({
//   edge
// }))(Left);
