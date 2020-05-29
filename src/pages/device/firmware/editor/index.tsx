import React, { useEffect, useState } from 'react';
import { Descriptions, Icon, Row, Spin, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { router } from 'umi';
import Info from './detail/Info';
import styles from './index.less';
import { Dispatch } from '@/models/connect';
import apis from '@/services';
import { FirmwareData, UpgradeTaskData } from '@/pages/device/firmware/data';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import UpgradeTask from '@/pages/device/firmware/editor/detail/upgrade-task';
import History from '@/pages/device/firmware/editor/detail/History';
import SaveTask from '@/pages/device/firmware/editor/detail/SaveTask';

interface Props extends FormComponentProps {
  dispatch: Dispatch;
  location: Location;
}

interface State {
  data: Partial<FirmwareData>;
  activeKey: string;
  taskId: string;
  historyState: string;
  spinning: boolean;
  taskData: Partial<UpgradeTaskData>;
}

const Editor: React.FC<Props> = props => {
  const {
    location: { pathname },
  } = props;

  const initState: State = {
    activeKey: 'info',
    data: {},
    taskId: '',
    historyState: '',
    spinning: true,
    taskData: {},
  };
  const [activeKey, setActiveKey] = useState(initState.activeKey);
  const [data, setData] = useState(initState.data);
  const [taskData, setTaskData] = useState(initState.taskData);
  const [spinning, setSpinning] = useState(initState.spinning);
  const [taskId, setTaskId] = useState(initState.taskId);
  const [historyState, setHistoryState] = useState(initState.historyState);

  const tabList = [
    {
      key: 'info',
      tab: '基本信息',
    },
    {
      key: 'task',
      tab: '升级任务',
    },
    {
      key: 'history',
      tab: '升级记录',
    },
  ];

  const getInfo = (firmwareId?: string) => {
    setSpinning(true);
    apis.firmware.info(firmwareId)
      .then((response: any) => {
        if (response.status === 200) {

          setData(response.result);
          setSpinning(false);
        }
      })
      .catch(() => {
      });
  };

  useEffect(() => {
    setActiveKey('info');

    if (pathname.indexOf('save') > 0) {
      const list = pathname.split('/');
      getInfo(list[list.length - 1]);
    }
  }, [window.location.hash]);

  const action = (
    <Tooltip title='刷新'>
      <Icon type="sync" style={{ fontSize: 20 }} onClick={() => {
        getInfo(data.id);
      }}/>
    </Tooltip>
  );

  const info = {
    info: <Info data={data}/>,
    task: <UpgradeTask firmwareId={data.id} productId={data.productId}
                       jumpPedal={(taskData: UpgradeTaskData) => {
                         setTaskData(taskData);
                         setActiveKey('saveTags');
                       }}/>,
    history: <History firmwareId={data.id} productId={data.productId} taskId={taskId} historyState={historyState}/>,
    saveTags: <SaveTask data={taskData} firmwareId={data.id} productId={data.productId}
                        appointStep={taskData.id ? 2 : 0}
                        close={(item: any) => {
                          if (item.type === 'history') {
                            setTaskId(item.taskId);
                            setHistoryState(item.state);
                          }
                          setActiveKey(item.type);
                        }}/>,
  };

  const content = (
    <div style={{ marginTop: 30 }}>
      <Descriptions column={4}>
        <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
        <Descriptions.Item label="产品">
          <div>
            {data.productName}
            <a style={{ marginLeft: 10 }}
               onClick={() => {
                 router.push(`/device/product/save/${data.productId}`);
               }}
            >查看</a>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const titleInfo = (
    <Row>
      <div>
        <span>
          固件：{data.name}
        </span>
      </div>
    </Row>
  );

  return (
    <Spin tip="加载中..." spinning={spinning}>
      <PageHeaderWrapper
        className={styles.instancePageHeader}
        title={titleInfo}
        extra={action}
        content={content}
        tabList={tabList}
        tabActiveKey={activeKey === 'saveTags' ? 'task' : activeKey}
        onTabChange={(key: string) => {
          setTaskId('');
          setHistoryState('');
          setActiveKey(key);
        }}
      >
        {info[activeKey]}
      </PageHeaderWrapper>
    </Spin>
  );
};
export default Form.create<Props>()(Editor);

