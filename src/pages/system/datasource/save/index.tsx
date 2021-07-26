import SchemaForm, { createFormActions, FormEffectHooks, ISchema } from '@formily/antd';
import { message, Modal } from 'antd';
import React from 'react';
import { Select, Input, ArrayTable } from '@formily/antd-components';
import { useEffect } from 'react';
import { service } from '..';
import { useState } from 'react';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { from } from 'rxjs';
import styles from '../index.less';
import _ from 'lodash';

interface Props {
  close: () => void;
  data: any;
}

type Type = {
  label: string;
  value: string;
  id: string;
  name: string;
};

const actions = createFormActions();

const Save = (props: Props) => {
  const {  close, data } = props;

  const [types, setTypes] = useState<Type[]>([]);

  const queryType = () => {
    service
      .type()
      .pipe(
        mergeMap((data: Type[]) => from(data)),
        map((i: Type) => ({ label: i.id, value: i.name })),
        toArray(),
      )
      .subscribe((data: any) => setTypes(data));
  };
  useEffect(() => {
    queryType();
  }, [data]);

  const { onFieldValueChange$ } = FormEffectHooks;

  const effects = () => {
    const { setFieldState } = actions;

    onFieldValueChange$('typeId').subscribe(({ value }) => {
      setFieldState(
        `*(shareConfig.adminUrl,shareConfig.addresses,shareConfig.virtualHost,shareConfig.username,shareConfig.password)`,
        state => {
          state.visible = value === 'RabbitMQ';
          state.value = undefined;
        },
      );
      setFieldState(`*(shareConfig.bootstrapServers)`, state => {
        state.visible = value === 'Kafka';
        state.value = undefined;
      });
    });
  };
  const schema: ISchema = {
    type: 'object',
    properties: {
      NO_NAME_FIELD_$0: {
        type: 'object',
        'x-component': 'mega-layout',
        'x-component-props': {
          grid: true,
          autoRow: true,
          responsive: {
            lg: 4,
            m: 2,
            s: 1,
          },
        },
        properties: {
          name: {
            title: '名称',
            'x-component': 'Input',
            'x-mega-props': {
              span: 2,
              labelCol: 6,
            },
            'x-rules': [{ required: true, message: '此字段必填' }],
          },
          typeId: {
            title: '类型',
            'x-component': 'Select',
            'x-component-props': {
              disabled: !!data.typeId,
            },
            'x-mega-props': {
              span: 2,
              labelCol: 6,
            },
            enum: types,
          },
          'shareConfig.adminUrl': {
            title: '管理地址',
            'x-mega-props': {
              span: 4,
              labelCol: 3,
            },
            required: true,
            default: 'http://localhost:15672',
            visible: false,
            'x-component': 'Input',
          },
          'shareConfig.addresses': {
            title: '链接地址',
            'x-mega-props': {
              span: 2,
              labelCol: 6,
            },
            required: true,
            default: 'localhost:5672',
            visible: false,
            'x-component': 'Input',
          },
          'shareConfig.virtualHost': {
            title: '虚拟域',
            'x-mega-props': {
              span: 2,
              labelCol: 6,
            },
            required: true,
            visible: false,
            default: '/',
            'x-component': 'Input',
          },
          'shareConfig.username': {
            title: '用户名',
            'x-mega-props': {
              span: 2,
              labelCol: 6,
            },
            visible: false,
            'x-rules': [
              {
                required: true,
                message: '用户名必填',
              },
            ],
            'x-component': 'Input',
          },
          'shareConfig.password': {
            title: '密码',
            'x-mega-props': {
              span: 2,
              labelCol: 6,
            },
            visible: false,
            'x-rules': [
              {
                required: true,
                message: '密码必填',
              },
            ],
            'x-component': 'Input',
          },
          'shareConfig.bootstrapServers': {
            title: '地址',
            'x-mega-props': {
              span: 4,
              labelCol: 3,
            },
            'x-rules': [
              {
                required: true,
                message: '地址必填',
              },
            ],
            visible: false,
            'x-component': 'Select',
            'x-component-props': {
              mode: 'tags',
            },
          },
          description: {
            title: '说明',
            'x-mega-props': {
              span: 4,
              labelCol: 3,
            },
            'x-component': 'TextArea',
            'x-component-props': {
              rows: 4,
            },
          },
        },
      },
    },
  };

  const save = (data: any) => {
    service.saveOrUpdate(data).subscribe(() => {
      message.success('保存成功');
      close();
    });
  };

  return (
    <Modal title="编辑" onCancel={close} visible={true} width={1000} onOk={() => actions.submit()}>
      <SchemaForm
        initialValues={data}
        className={styles.save}
        onSubmit={save}
        actions={actions}
        effects={effects}
        schema={schema}
        components={{
          Input,
          Select,
          ArrayTable,
          TextArea: Input.TextArea,
        }}
      />
    </Modal>
  );
};

export default Save;
