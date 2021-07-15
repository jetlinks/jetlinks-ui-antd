import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import { Table, Button, Icon, Tooltip, Modal } from 'antd';
import ChannelModel from './channelModel';
import Play from './play';
import { useRequest } from 'ahooks';
import { ChannelList, delChannel, getChannelList, MediaDeviceList } from '@/pages/edge-gateway/device/service';
import StatusBadge from '@/components/StatusBadge';
interface RightProps {
  rowData?: MediaDeviceList
}

function Right(props: RightProps) {

  const [visible, setVisible] = useState(false)
  const [playVisible, setPlayVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [editData, setEditData] = useState<ChannelList | undefined>(undefined)
  const [channelParams, setChannelParams] = useState({
    pageSize: 8
  });
  const [rowData, setRowData] = useState<ChannelList | undefined>(undefined)

  const { data, loading, run } = useRequest(getChannelList, {
    manual: true
  })

  const { loading: deleteLoading, run: deleteChannel } = useRequest(delChannel, {
    manual: true,
    onSuccess(result) {
      setDeleteVisible(false)
      if (result.status === 200) {
        tableRequest()
      }
    }
  })

  useEffect(() => {
    tableRequest()
  }, [props.rowData])

  const tableRequest = useCallback(() => {
    if (props.rowData && props.rowData.id) {
      run('local', {
        where:  `deviceId = ${props.rowData.id}`
      })
    }
  }, [props.rowData])

  return (
    <div className={styles.right}>
      <div className={styles.header}>
        <span>视频通道</span>
        <div>
          <Icon style={{ color: 'rgba(0,0,0,.45)', marginLeft: 25, cursor: 'pointer' }} type="redo" />
        </div>
      </div>
      <Table<ChannelList>
        loading={loading}
        dataSource={data && data.result && data.result.length ? data.result[0].data : []}
        columns={[
          {
            title: '序号',
            dataIndex: 'center',
            width: 60,
            render: (text: string, record: any, index: number) => `${index + 1}`,
          },
          {
            title: '状态',
            dataIndex: 'status',
            render: (value) => {
              return <StatusBadge value={value.value} />
            },
            width: 90
          },
          {
            title: '通道名称',
            dataIndex: 'name',
          },
          {
            title: '通道ID',
            dataIndex: 'channelId',
            ellipsis: true,
            render: (channelId: string) => {
              return (
                <Tooltip arrowPointAtCenter title={channelId}>{channelId}</Tooltip>
              )
            }
          },
          {
            title: '操作',
            render: (_, record) => {
              return <>
                <Button type='link' onClick={() => {
                  setEditData(record)
                  setVisible(true)
                }}>
                  编辑
                </Button>
                <Button type='link' onClick={() => {
                  setRowData(record)
                  setPlayVisible(true)
                }}>播放</Button>
                {
                  record.status.value !== 'online' ?
                    <Button type='link' onClick={() => {
                      setDeleteId(record.id)
                      setDeleteVisible(true)
                    }}>删除</Button>
                    : null
                }
              </>
            },
            width: 214
          },
        ]}
      />
      {
        visible && <ChannelModel
          visible={visible}
          // edgeId={props.edge.id}
          data={editData}
          onCancel={() => {
            setVisible(false)
          }}
          onOk={() => {
            tableRequest()
            setVisible(false)
          }}
        />
      }
      {
        playVisible && <Play
          visible={playVisible}
          deviceId='1'
          close={() => {
            setPlayVisible(false)
          }}
          save={() => {
            setPlayVisible(false)
          }}
          data={rowData}
        />
      }

      <Modal
        title={<span style={{ fontWeight: 600 }}>删除</span>}
        visible={deleteVisible}
        confirmLoading={deleteLoading}
        onOk={() => {
          if (props.rowData) {
            deleteChannel(props.rowData.id, { channelDataId: deleteId })
          }
        }}
        onCancel={() => {
          setDeleteVisible(false)
        }}
        okText="确认"
        cancelText="取消"
      >
        <span style={{ fontSize: 14 }}>确认删除该视频通道吗？</span>
      </Modal>
    </div>
  );
}

export default Right;
// connect(({ edge }: ConnectState) => ({
//   edge
// }))(Right);
