import React, { useState } from 'react';
import { Button, Col, Drawer, Form, Input, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { SqlRule } from '../data';
import Action from '@/pages/rule-engine/sqlRule/save/actions';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<SqlRule>;
}

interface State {
  script?: string;
  actions: any[];
  whenErrorThen: any[];
  sqlRuleType: string;
}

const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;

  const initState: State = {
    script: props.data?.sql,
    actions: props.data.actions ? props.data.actions : [{ _id: 0 }],
    whenErrorThen: props.data.whenErrorThen ? props.data.whenErrorThen : [{ _id: 0 }],
    sqlRuleType: props.data.type ? props.data.type : '',
  };

  const [actions, setActions] = useState(initState.actions);
  const [whenErrorThen, setWhenErrorThen] = useState(initState.whenErrorThen);
  const [sqlRuleType, setSqlRuleType] = useState(initState.sqlRuleType);

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      const { id } = props.data;

      const data = fileValue;
      let sqlRule = {
        name: data.name,
        type: data.type,
        cron: data.cron,
        sql: props.data.sql,
        actions: actions,
        whenErrorThen: whenErrorThen,
      };

      let ruleInstance = {
        name: data.name,
        modelMeta: JSON.stringify(sqlRule),
        modelType: 'sql_rule',
        modelVersion: 0,
      };
      props.save({
        id,
        ...ruleInstance,
      });
    });
  };

  const renderSqlRuleType = () => {
    switch (sqlRuleType) {
      case 'timer':
        return (
          <Col span={12} key={`col_${Math.round(Math.random() * 100000)}`}>
            <Form.Item key={`cron_${Math.round(Math.random() * 100000)}`} label="cron表达式">
              {getFieldDecorator('cron', {
                rules: [{ required: true, message: 'cron表达式' }],
                initialValue: props.data?.cron,
              })(<Input placeholder="输入cron表达式" key={`cron_${Math.round(Math.random() * 100000)}`}/>)}
            </Form.Item>
          </Col>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      visible
      width={900}
      onClose={() => props.close()}
      title={`${props.data?.id ? '编辑' : '新增'}数据转发`}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} style={{ paddingBottom: 20 }}
            key={`form_${Math.round(Math.random() * 100000)}`}>
        <Row key={`_${Math.round(Math.random() * 100000)}`}>
          <Col span={12} key={`col_${Math.round(Math.random() * 100000)}`}>
            <Form.Item key={`name_${Math.round(Math.random() * 100000)}`} label="名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '名称' }],
                initialValue: props.data?.name,
              })(<Input placeholder="请输入名称" key={`name_${Math.round(Math.random() * 100000)}`}/>)}
            </Form.Item>
          </Col>
          <Col span={12} key={`col_${Math.round(Math.random() * 100000)}`}>
            <Form.Item key={`_type_${Math.round(Math.random() * 100000)}`} label="类型">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '类型' }],
                initialValue: props.data?.type,
              })(<Select placeholder="请选择类型" onChange={(value: string) => {
                setSqlRuleType(value);
              }} key={`type_${Math.round(Math.random() * 100000)}`}>
                <Select.Option value="timer" key='timer'>定时</Select.Option>
                <Select.Option value="realTime" key='realTime'>实时</Select.Option>
              </Select>)}
            </Form.Item>
          </Col>
          {renderSqlRuleType()}

          <Col span={24}>
            <Form.Item label="SQL" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              <AceEditor
                mode='mysql'
                theme="eclipse"
                name="app_code_editor"
                fontSize={14}
                showPrintMargin
                showGutter
                onChange={value => {
                  props.data.sql = value;
                }}
                value={props.data.sql}
                wrapEnabled
                highlightActiveLine  //突出活动线
                enableSnippets  //启用代码段
                style={{ width: '100%', height: 500 }}
                setOptions={{
                  enableBasicAutocompletion: true,   //启用基本自动完成功能
                  enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                  enableSnippets: true,  //启用代码段
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24} key={`col_${Math.round(Math.random() * 100000)}`}>
            <Form.Item label="执行动作" key={`_actions_${Math.round(Math.random() * 100000)}`}
                       labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              {actions.map((item: any, index: number) => (
                  <Action save={(data: any) => {
                    actions.splice(index, 1, data);
                  }} remove={(value: any) => {
                    actions.splice(value, 1);
                    setActions([...actions]);
                  }} position={index} action={item}/>
                ),
              )}
              <Button icon="plus" type="link" key={`button_${Math.round(Math.random() * 100000)}`}
                      onClick={() => {
                        setActions([...actions, { _id: Math.round(Math.random() * 100000) }]);
                      }}
              >
                执行动作
              </Button>
            </Form.Item>
          </Col>
          <Col span={24} key={`col_${Math.round(Math.random() * 100000)}`}>
            <Form.Item label="失败执行动作" key={`_whenErrorThen_${Math.round(Math.random() * 100000)}`}
                       labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
              {whenErrorThen.map((item: any, index: number) => (
                  <Action save={(data: any) => {
                    whenErrorThen.splice(index, 1, data);
                  }} remove={(value: any) => {
                    whenErrorThen.splice(value, 1);
                    setWhenErrorThen([...whenErrorThen]);
                  }} position={index} action={item}/>
                ),
              )}
              <Button icon="plus" type="link" key={`button_${Math.round(Math.random() * 100000)}`}
                      onClick={() => {
                        setWhenErrorThen([...whenErrorThen, { _id: Math.round(Math.random() * 100000) }]);
                      }}
              >
                执行动作
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
        key={`div_${Math.round(Math.random() * 100000)}`}
      >
        <Button
          key={`button_${Math.round(Math.random() * 100000)}`}
          onClick={() => {
            props.close();
          }}
          style={{ marginRight: 8 }}
        >
          关闭
        </Button>
        <Button
          key={`button_${Math.round(Math.random() * 100000)}`}
          onClick={() => {
            submitData();
          }}
          type="primary"
        >
          确认
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<Props>()(Save);
