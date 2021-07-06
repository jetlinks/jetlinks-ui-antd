import React, { useState, useEffect, useCallback } from 'react';
import Cards from '@/components/Cards';
import { connect } from 'dva';
import { ConnectState, Dispatch } from '@/models/connect';
import { Button, Checkbox, message, Modal } from 'antd';
import CardItem from './card';
import styles from './index.less';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import Save from '@/pages/rule-engine/instance/save';
import encodeQueryParam from '@/utils/encodeParam';
import AlarmSave from "@/pages/device/alarm/save/index";
import SqlRuleSave from '@/pages/rule-engine/sqlRule/save/index';
import SceneSave from '@/pages/rule-engine/scene/save';
import { ruleList, ListData, remove } from '@/pages/rule-engine/instance/service';
import { useRequest } from 'ahooks';
import { ApiResponse } from '@/services/response';
import apis from '@/services';
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

interface ExtraToolProps {
  onChange: (data: CheckboxValueType[]) => void
}
const ExtraTool = (props: ExtraToolProps) => {

  const [options] = useState([
    { label: '规则实例', value: 'node-red' },
    // { label: '数据转发', value: 'sql_rule' },
    // { label: '设备报警', value: 'device_alarm' },
    { label: '场景联动', value: 'rule-scene' },
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
        if (props.onChange) {
          props.onChange(e.target.checked ? options.map(item => item.value) : [])
        }
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
        if (props.onChange) {
          props.onChange(e)
        }
      }}
    />
  </div>
}

const Setting: React.FC<Props> = props => {

  const { dispatch } = props;

  // const { result } = props.ruleInstance;

  const { data, run } = useRequest<ApiResponse<ListData>>(ruleList, {
    manual: true
  })

  const initState: State = {
    data: [],
    searchParam: {
      pageSize: 8,
      sorts: {
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
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deleteId, setDeleteId] = useState('')

  const { run: deleteRun } = useRequest<ApiResponse<any>>(remove, {
    manual: true,
    onSuccess(res) {
      if (res.status === 200) {
        message.success('删除成功');
        setDeleteVisible(false)
        handleSearch(searchParam);
      }
    }
  })

  const handleSearch = (params?: any) => {
    setSearchParam(params);
    // dispatch({
    //   type: 'ruleInstance/query',
    //   payload: encodeQueryParam(params),
    // });
    run('local', encodeQueryParam(params))
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, []);

  const startInstance = useCallback((record: ListData) => {
    if (record.modelType === "device_alarm") {
      apis.ruleInstance
        .startDeviceAlarm('local', record.id)
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
        .startScene('local', record.id)
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
        .start('local', { ruleInstanceId: record.id })
        .then(response => {
          if (response.status === 200) {
            message.success('启动成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    }
  }, [])

  const stopInstance = useCallback((record: any) => {
    if (record.modelType === "device_alarm") {
      apis.ruleInstance
        .stopDeviceAlarm('local', record.id)
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
        .stopScene('local', record.id)
        .then(response => {
          if (response.status === 200) {
            message.success('停止成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    } else {
      apis.ruleInstance
        .stop('local', { ruleInstanceId: record.id })
        .then(response => {
          if (response.status === 200) {
            message.success('停止成功');
            handleSearch(searchParam);
          }
        })
        .catch(() => {
        });
    }
  }, [])

  const handleDelete = (params: any) => {
    setDeleteId(params.id)
    setDeleteVisible(true)
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

  const saveOrUpdate = useCallback((item: RuleInstanceItem) => {

    apis.sqlRule.saveOrUpdate('local', item)
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
  }, [])

  const updateDeviceAlarm = useCallback((item: any) => {
    let data: any;
    setSaveAlarmVisible(true);
    try {
      data = JSON.parse(item.modelMeta);
    } catch (error) {
      message.error("数据结构异常");
      return;
    }
    if (data.target === 'product') {
      apis.deviceProdcut.info('local', data.targetId)
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
      apis.deviceInstance.info('local', data.targetId)
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
  }, [])

  const submitData = useCallback((data: any) => {
    apis.deviceAlarm.saveProductAlarms('local', data)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('保存成功');
          setSaveAlarmVisible(false);
          handleSearch(searchParam);
        }
      })
      .catch(() => {
      });
  }, [])

  const onEdit = (item: any) => {

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


  const onReboot = (item: ListData) => {
    startInstance(item);
  }

  const onCopy = (item: any) => {
    setRuleData(item);
    setSaveVisible(true);
  }

  return (
    <div style={{ height: '100%' }}>
      <Cards<ListData>
        title='规则引擎设置'
        cardItemRender={data =>
          <CardItem
            data={data}
            onCopy={() => { onCopy(data) }}
            onReboot={() => { onReboot(data) }}
            onDelete={() => { handleDelete(data) }}
            onEdit={() => { onEdit(data) }}
            onStart={() => { startInstance(data) }}
            onStop={() => { stopInstance(data) }}
          />}
        toolNode={<Button type='primary' onClick={() => {
          onCopy(undefined)
        }}>新增规则引擎</Button>}
        extraTool={<ExtraTool onChange={(str) => {
          let obj = searchParam
          if (str.length && str.length !== 4) {
            obj = {
              ...searchParam,
              where: `modelType in (${str.join(',')})`
            }
          } else {
            delete obj.where
          }
          handleSearch(obj)
        }} />}
        bodyClassName={styles.body}
        pagination={{
          pageSize: 10,
          current: 1,
          total: 6
        }}
        dataSource={data && data.result && data.result.length ? data.result[0].data : []}
        columns={[
          {
            title: '规则名称',
            dataIndex: 'name',
            ellipsis: true,
            width: 120
          },
          {
            title: '规则ID',
            dataIndex: 'id',
            width: 200
          },
          {
            title: '规则类型',
            dataIndex: 'modelType',
            width: 120
          },
          {
            title: '规则描述',
            ellipsis: true,
            dataIndex: 'description',
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: 120
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
      {/* 新增复制 */}
      {saveVisible && (
        <Save
          data={ruleData}
          onOk={() => {
            setSaveVisible(false);
            handleSearch(searchParam);
          }}
          close={() => {
            setSaveVisible(false);
            setRuleData({});

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
        data={deviceAlarm}
        targetId={deviceAlarm.targetId}
        target={deviceAlarm.target}
        metaData={deviceMateData}
        name={deviceAlarm.name}
        productName={deviceAlarm.alarmRule ? deviceAlarm.alarmRule.productName : ''}
        productId={deviceAlarm.alarmRule ? deviceAlarm.alarmRule.productId : ''}
      />}
      <Modal
        title={<span style={{ fontWeight: 600 }}>删除</span>}
        visible={deleteVisible}
        onOk={() => {
          if (deleteId) {
            deleteRun('local', deleteId)
          }
        }}
        onCancel={() => {
          setDeleteVisible(false)
        }}
        okText="确认"
        cancelText="取消"
      >
        <span style={{ fontSize: 14 }}>确认删除该规则实例吗？</span>
      </Modal>
    </div>
  );
}

export default connect(({ ruleInstance, loading}: ConnectState) => ({
  ruleInstance,
  loading: loading.models.ruleInstance,
}))(Setting);
