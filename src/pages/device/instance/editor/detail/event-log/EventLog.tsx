import React, { useEffect, useState } from 'react';
import { Form, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import moment from 'moment';
import AceEditor from "react-ace";

interface Props {
  close: Function;
  item: any;
  type: string;
  deviceId: string;
}

interface State {
  eventColumns: ColumnProps<any>[];
  logData: any
}

const EventLog: React.FC<Props> = props => {
  const initState: State = {
    eventColumns: props.item.valueType.type === "object" ? props.item.valueType.properties?.map((item: any) => {
      return {
        title: item.name,
        dataIndex: `${item.id}_format`,
        ellipsis: true,
        render: (text: any) => typeof text === 'object' ?
          JSON.stringify(text) : text
      };
    }) : [{
      title: "数据",
      dataIndex: `value`,
      ellipsis: true,
      render:(text)=>JSON.stringify(text)
    }],
    logData: {},
  };
  initState.eventColumns.push({
    title: '事件时间',
    dataIndex: 'timestamp',
    width: '200px',
    render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    sorter: true,
    defaultSortOrder: 'descend',
  });

  initState.eventColumns.push({
    title: '操作',
    render: (record: any) => (
      <>
        <a onClick={() => {
          for (let i in record) {
            if (i.indexOf('_format') != -1) {
              delete record[i];
            }
          }
          Modal.info({
            title: '详情',
            width: 850,
            content: (
              <Form.Item wrapperCol={{ span: 20 }} labelCol={{ span: 4 }} label={props.item.name}>
                <AceEditor
                  readOnly
                  value={JSON.stringify(record, null, 2)}
                  mode='json'
                  theme="eclipse"
                  name="app_code_editor"
                  key='deviceShadow'
                  fontSize={14}
                  showPrintMargin
                  showGutter
                  wrapEnabled
                  highlightActiveLine  //突出活动线
                  enableSnippets  //启用代码段
                  style={{ width: '100%', height: '50vh' }}
                  setOptions={{
                    enableBasicAutocompletion: true,   //启用基本自动完成功能
                    enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                    enableSnippets: true,  //启用代码段
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </Form.Item>
            ),
            okText: '关闭',
            onOk() {
            },
          });
        }}>详情</a>
      </>
    )
  });

  const [logData, setLogData] = useState(initState.logData);

  useEffect(() => {
    apis.deviceInstance.eventData(
      props.deviceId,
      props.item.id,
      encodeQueryParam({
        pageIndex: 0,
        pageSize: 10,
      }),
    ).then(response => {
      setLogData(response.result);
    }).catch(() => {

    });
  }, []);

  const onTableChange = (pagination: PaginationConfig, filters: any, sorter: SorterResult<any>) => {
    apis.deviceInstance.eventData(
      props.deviceId,
      props.item.id,
      encodeQueryParam({
        pageIndex: Number(pagination.current) - 1,
        pageSize: pagination.pageSize,
        sorts: sorter,
      }),
    ).then(response => {
      setLogData(response.result);
    }).catch(() => {

    });
  };

  return (
    <Modal
      title="事件详情"
      visible
      onCancel={() => props.close()}
      onOk={() => props.close()}
      width="70%"
    >
      <Table
        rowKey='id'
        dataSource={logData.data}
        size="small"
        onChange={onTableChange}
        pagination={{
          current: logData.pageIndex + 1,
          total: logData.total,
          pageSize: logData.pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total: number) => `共 ${total} 条记录 第  ${logData.pageIndex + 1}/${Math.ceil(logData.total / logData.pageSize)}页`,
        }}
        columns={initState.eventColumns}
      />
    </Modal>
  );
};

export default EventLog;
