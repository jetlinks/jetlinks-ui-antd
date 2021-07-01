import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Switch } from 'antd';
import styles from './index.less';
import CascadeModel from './cascadeModel';
import StatusBadge from '@/components/StatusBadge';
import { CascadeDisabled, CascadeEnabled, CascadeList, getCascadeList, removeCascade } from '@/pages/edge-gateway/device/detail/video/cascade/service';
import { useRequest } from 'ahooks';
import { ApiResponse } from '@/services/response';
import { EdgeModelState } from '@/models/edge';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import ChannelModel from './channelModel';
interface CascadeProps {
  edge: EdgeModelState
}
// TODO 绑定通道未做
function Cascade(props: CascadeProps) {

  const [visible, setVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [channelVisible, setChannelVisible] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editData, setEditData] = useState<CascadeList | undefined>(undefined)

  const { data, loading, run } = useRequest<ApiResponse<CascadeList>>(getCascadeList, {
    manual: true
  })
  const { run: RemoveCascade } = useRequest<ApiResponse<any>>(removeCascade, {
    manual: true,
    onSuccess(result) {
      if (result.status === 200) {
        run()
      }
    }
  })

  const { run: DisabledRun } = useRequest<ApiResponse<any>>(CascadeDisabled, {
    manual: true,
    onSuccess(result) {
      if (result.status === 200) {
        run()
      }
    }
  })

  const { run: EnabledRun } = useRequest<ApiResponse<any>>(CascadeEnabled, {
    manual: true,
    onSuccess(result) {
      if (result.status === 200) {
        run()
      }
    }
  })

  useEffect(() => {
    run()
  }, [])

  const deleteOk = useCallback(
    () => {
      RemoveCascade(props.edge.id, deleteId)
    },
    [deleteId, props.edge.id],
  )

  return (
    <div style={{ height: '100%', backgroundColor: '#fff', padding: 16 }}>
      <div className={styles.header}>
        <span>国标级联</span>
        <div>
          <Button type='primary' onClick={() => {
            setEditData(undefined)
            setVisible(true)
          }}>新增国标级联</Button>
        </div>
      </div>
      <div>
        <Table<CascadeList>
          dataSource={data && data.result ? data.result[0] : []}
          loading={loading}
          columns={[
            {
              title: "级联信息",
              className: styles.td_top,
              render: (_, record) => {
                return <>
                  <div className={styles.table_text}>级联ID: <span>{record.id}</span></div>
                  <div className={styles.table_text}>级联名称: <span>{record.name}</span></div>
                </>
              }
            }, {
              title: "上级SIP信息",
              className: styles.td_top,
              render: (_, record) => {
                return <>
                  <div className={styles.table_text}>名称: <span>{record.sipConfigs[0].name}</span></div>
                  <div className={styles.table_text}>SIP ID: <span>{record.sipConfigs[0].sipId}</span></div>
                  <div className={styles.table_text}>SIP域: <span>{record.sipConfigs[0].domain}</span></div>
                  <div className={styles.table_text}>SIP HOST: <span>{record.sipConfigs[0].remoteAddress}</span></div>
                  <div className={styles.table_text}>SIP PORT: <span>{record.sipConfigs[0].remotePort}</span></div>
                </>
              }
            }, {
              title: "本地SIP",
              className: styles.td_top,
              dataIndex: 'sipConfigs',
              render: (_, record) => {
                return <>
                  <div className={styles.table_text}>SIP本地 ID:<span>{record.sipConfigs[0].localSipId}</span></div>
                  <div className={styles.table_text}>SIP本地端口:<span>{record.sipConfigs[0].port}</span></div>
                  <div className={styles.table_text}>SIP本地地址:<span>{record.sipConfigs[0].localAddress}</span></div>
                </>
              }
            }, {
              title: "其它",
              className: styles.td_top,
              render: (_, record) => {
                return <>
                  <div className={styles.table_text}>注册时间(秒):<span>{record.sipConfigs[0].registerInterval}</span></div>
                  <div className={styles.table_text}>心跳周期(秒):<span>{record.sipConfigs[0].keepaliveInterval}</span></div>
                  <div className={styles.table_text}>传输协议:<span>{record.sipConfigs[0].transport}</span></div>
                  <div className={styles.table_text}>字符集:<span>{record.sipConfigs[0].charset}</span></div>
                </>
              }
            }, {
              title: "启用状态",
              dataIndex: 'status',
              className: styles.td_top,
              width: 140,
              render: (data, record) => {
                return <Switch checked={data.value === 'enabled' ? true : false} onChange={(e) => {
                  if (props.edge.id) {
                    if (e) {
                      EnabledRun(props.edge.id, { id: record.id })
                    } else {
                      DisabledRun(props.edge.id, { id: record.id })
                    }
                  }
                }} />
              }
            }, {
              title: "连接状态",
              dataIndex: 'onlineStatus',
              className: styles.td_top,
              width: 140,
              render: (data) => {
                return <StatusBadge value={data.value} />
              }
            }, {
              title: "操作",
              className: styles.td_top,
              width: 250,
              render: (_, record) => {
                return <>
                  <Button type="link" onClick={() => {
                    setEditData(record)
                    setVisible(true)
                  }}>编辑</Button>
                  <Button type="link" onClick={() => {
                    setEditData(record)
                    setChannelVisible(true)
                  }}>选择通道</Button>
                  <Button type="link" onClick={() => {
                    // clickId.current = data.id
                    setDeleteId(record.id)
                    setDeleteVisible(true)
                  }}>删除</Button>
                </>
              }
            }
          ]}
        />
      </div>
      {
        visible &&
        <CascadeModel
          data={editData}
          visible={visible}
          id={props.edge.id || ''}
          onCancel={() => {
            setVisible(false)
          }}
          onOk={() => {
            run()
            setVisible(false)
          }}
        />
      }
      {
        channelVisible &&
        <ChannelModel
          cascadeId={editData ? editData.id : ''}
          visible={channelVisible}
          id={props.edge.id || ''}
          onCancel={() => { setChannelVisible(false) }}
          onOk={() => {
            setChannelVisible(false)
          }}
        />
      }
      <Modal
        title='删除'
        visible={deleteVisible}
        onOk={deleteOk}
        onCancel={() => {
          setDeleteVisible(false)
        }}
      >
        确认删除该国标级联吗
      </Modal>
    </div>
  );
}

export default connect(({ edge }: ConnectState) => ({
  edge
}))(Cascade);

