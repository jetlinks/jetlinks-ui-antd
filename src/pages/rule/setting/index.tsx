import React, { useState, useEffect } from 'react';
import Cards from '@/components/Cards';
import { connect } from 'dva';
import { ConnectState, Dispatch } from '@/models/connect';
import { Button, Checkbox, message } from 'antd';
import CardItem from './card';
import styles from './index.less';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import Save from '@/pages/rule-engine/instance/save';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import AlarmSave from "@/pages/device/alarm/save/index";
import SqlRuleSave from '@/pages/rule-engine/sqlRule/save/index';
import SceneSave from '@/pages/rule-engine/scene/save';
export interface RuleInstanceItem {
  createTime: number;
  description: string;
  id: string;
  modelId: string;
  modelMeta: string;
  modelType: string;
  modelVersion: number;
  name: string;
  state: any;
}

interface Props {
  ruleInstance: any;
  dispatch: Dispatch;
  location: Location;
  loading: boolean;
}
interface State {
  data: any;
  searchParam: any;
  saveVisible: boolean;
  detailVisible: boolean,
  current: Partial<RuleInstanceItem>;
  deviceAlarm: any;
  deviceMateData: string;
  detailData: any;
}

const ExtraTool = () => {

  const [options, setOptions] = useState([
    { label: '规则实例', value: '1' },
    { label: '场景联动', value: '2' },
  ])

  const [checkAll, setCheckAll] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkList, setCheckList] = useState<CheckboxValueType[]>([])

  return <div style={{ padding: 16, backgroundColor: '#fff' }}>
    <Checkbox
      onChange={e => {
        setCheckAll(e.target.checked)
        setCheckList(e.target.checked ? options.map(item => item.value) : [])
        setIndeterminate(false)
      }}
      checked={checkAll}
      indeterminate={indeterminate}
    >全选</Checkbox>
    <Checkbox.Group
      options={options}
      value={checkList}
      onChange={e => {
        setCheckList(e)
        setCheckAll(e.length === options.length)
        setIndeterminate(!!e.length && e.length < options.length)
      }}
    />
  </div>
}

const Setting: React.FC<Props> = props => {

  const { dispatch } = props;

  // const { result } = props.ruleInstance;

  const initState: State = {
    data: [],
    searchParam: {
      pageSize: 8, sorts: {
        order: "descend",
        field: "createTime"
      }
    },
    saveVisible: false,
    detailVisible: false,
    current: {},
    deviceAlarm: {},
    deviceMateData: "",
    detailData: {},
  };

  const [searchParam, setSearchParam] = useState(initState.searchParam);
  const [saveVisible, setSaveVisible] = useState(initState.saveVisible);
  const [detailVisible, setDetailVisible] = useState(initState.detailVisible);
  const [detailData, setDetailData] = useState(initState.detailData);
  const [saveSqlRuleVisible, setSaveSqlRuleVisible] = useState(false);
  const [saveAlarmVisible, setSaveAlarmVisible] = useState(false);
  const [current, setCurrent] = useState(initState.current);
  const [ruleData, setRuleData] = useState(initState.current);
  const [deviceAlarm, setDeviceAlarm] = useState(initState.deviceAlarm);
  const [deviceMateData, setDeviceMateData] = useState(initState.deviceMateData);
  const [sceneVisible, setSceneVisible] = useState(false);


  const handleSearch = (params?: any) => {
    setSearchParam(params);
    dispatch({
      type: 'ruleInstance/query',
      payload: encodeQueryParam(params),
    });
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const startInstance = (record: any) => {
    if (record.modelType === "device_alarm") {
      apis.ruleInstance
        .startDeviceAlarm(record.id)
        .then(response => {
          if (response.status === 200) {
            message.success('启动成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    } else if (record.modelType === "rule-scene") {
      apis.ruleInstance
        .startScene(record.id)
        .then(response => {
          if (response.status === 200) {
            message.success('启动成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    } else {
      apis.ruleInstance
        .start(record.id)
        .then(response => {
          if (response.status === 200) {
            message.success('启动成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    }
  };

  const stopInstance = (record: any) => {
    if (record.modelType === "device_alarm") {
      apis.ruleInstance
        .stopDeviceAlarm(record.id)
        .then(response => {
          if (response.status === 200) {
            message.success('停止成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    } else if (record.modelType === "rule-scene") {
      apis.ruleInstance
        .stopScene(record.id)
        .then(response => {
          if (response.status === 200) {
            message.success('启动成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    } else {
      apis.ruleInstance
        .stop(record.id)
        .then(response => {
          if (response.status === 200) {
            message.success('启动成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    }
  };

  const handleDelete = (params: any) => {
    dispatch({
      type: 'ruleInstance/remove',
      payload: params.id,
      callback: () => {
        message.success('删除成功');
        handleSearch(searchParam);
      },
    });
  };

  const onChange = (page: number, pageSize: number) => {
    handleSearch({
      pageIndex: page - 1,
      pageSize,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  const onShowSizeChange = (current: number, size: number) => {
    handleSearch({
      pageIndex: current - 1,
      pageSize: size,
      terms: searchParam.terms,
      sorts: searchParam.sorts,
    });
  };

  const saveOrUpdate = (item: RuleInstanceItem) => {
    apis.sqlRule.saveOrUpdate(item)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setSaveSqlRuleVisible(false);
          setCurrent({});
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
  };

  const updateDeviceAlarm = (item: any) => {
    let data: any;
    try {
      data = JSON.parse(item.modelMeta);
    } catch (error) {
      message.error("数据结构异常");
      return;
    }
    if (data.target === 'product') {
      apis.deviceProdcut.info(data.targetId)
        .then((response: any) => {
          if (response.status === 200 && response.result) {
            setDeviceMateData(response.result.metadata);
            setDeviceAlarm(data);
            setSaveAlarmVisible(true);
          } else {
            message.error("告警相关产品不存在。");
          }
        })
        .catch(() => {
        })
    } else {
      apis.deviceInstance.info(data.targetId)
        .then((response: any) => {
          if (response.status === 200 && response.result) {
            setDeviceMateData(response.result.metadata);
            setDeviceAlarm(data);
            setSaveAlarmVisible(true);
          } else {
            message.error("告警相关设备不存在。");
          }
        })
        .catch(() => {
        })
    }
  };

  const submitData = (data: any) => {
    apis.deviceAlarm.saveProductAlarms(deviceAlarm.target, deviceAlarm.targetId, data)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setSaveAlarmVisible(false);
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
  };

  const onEdit = (item: any) => {
    console.log(item);
    if (item.modelType === 'node-red') {
      window.open(`/jetlinks/rule-editor/index.html#flow/${item.id}`)
    } else if (item.modelType === 'sql_rule') {
      try {
        setSaveSqlRuleVisible(true);
        let data = JSON.parse(item.modelMeta);
        data['id'] = item.id;
        setCurrent(data);
      } catch (error) {
        message.error('数据异常，请至数据转发界面检查数据');
      }
    } else if (item.modelType === 'device_alarm') {
      updateDeviceAlarm(item);
    } else if (item.modelType === 'rule-scene') {
      setDetailData(item);
      setSceneVisible(true);
    }
  }


  const onReboot = (item: any) => {
    startInstance(item);
  }

  const onCopy = (item: any) => {
    setRuleData(item);
    setSaveVisible(true);
  }

  console.log(detailData);

  return (
    <div style={{ height: '100%' }}>
      <Cards
        title='规则引擎设置'
        cardItemRender={(data: any) =>
          <CardItem
            data={data}
            onCopy={() => { onCopy(data) }}
            onReboot={() => { onReboot(data) }}
            onDelete={() => { handleDelete(data) }}
            onEdit={() => { onEdit(data) }}
          />}
        toolNode={<Button type='primary'>新增规则引擎</Button>}
        extraTool={<ExtraTool />}
        bodyClassName={styles.body}
        pagination={{
          pageSize: 10,
          current: 1,
          total: 6
        }}
        dataSource={[
          {
            name: 1,
            id: '12153122',
            modelType: 'node-red',
            description: '这是描述',
            status: 1
          },
          {
            name: 2,
            id: '12113121',
            modelType: 'sql_rule',
            description: '-',
            status: 1
          },
          {
            name: 3,
            id: '12123222',
            modelType: 'device_alarm',
            description: '-',
            status: 1
          },
          {
            name: 4,
            id: '12123133',
            modelType: '规则实例',
            description: '-',
            status: 1
          },
          {
            name: 5,
            id: '12123144',
            modelType: 'rule-scene',
            description: '-',
            status: 1
          },
          {
            name: 6,
            id: '12123155',
            modelType: 'rule-scene',
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
            dataIndex: 'modelType',
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
            render: (data) => <>
              <Button type='link' onClick={() => { onEdit(data) }}>编辑</Button>
              <Button type='link' onClick={() => { onReboot(data) }}>重启</Button>
              <Button type='link' onClick={() => { onCopy(data) }}>复制</Button>
              <Button type='link' onClick={() => { handleDelete(data) }}>删除</Button>
            </>,
            width: 280
          },
        ]}
      />
      {sceneVisible && (
        <SceneSave
          data={detailData}
          close={() => {
            setSceneVisible(false);
            setDetailData({});
            handleSearch(searchParam);
          }}
          save={() => {
            setSceneVisible(false);
          }}
        />
      )}
      {saveVisible && (
        <Save
          data={ruleData}
          close={() => {
            setSaveVisible(false);
            setRuleData({});
            handleSearch(searchParam);
          }}
        />
      )}
      {/* {detailVisible && (
        <Detail
          data={detailData}
          close={() => {
            setDetailVisible(false);
            setDetailData({});
          }}
        />
      )} */}
      {saveSqlRuleVisible && (
        <SqlRuleSave
          data={current}
          close={() => {
            setSaveSqlRuleVisible(false);
            setCurrent({});
          }}
          save={(item: RuleInstanceItem) => {
            saveOrUpdate(item);
          }}
        />
      )}
      {saveAlarmVisible && <AlarmSave
        close={() => {
          setDeviceAlarm({});
          setDeviceMateData("");
          setSaveAlarmVisible(false);
        }}
        save={(data: any) => {
          submitData(data);
        }}
        data={deviceAlarm} targetId={deviceAlarm.targetId}
        target={deviceAlarm.target} metaData={deviceMateData}
        name={deviceAlarm.name} productName={deviceAlarm.alarmRule.productName}
        productId={deviceAlarm.alarmRule.productId}
      />}
    </div>
  );
}

export default connect(({ ruleInstance, loading }: ConnectState) => ({
  ruleInstance,
  loading: loading.models.ruleInstance,
}))(Setting);
