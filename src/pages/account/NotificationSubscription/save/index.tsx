import { Modal } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Checkbox, Form, FormGrid, FormItem, Input, Select } from '@formily/antd';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { onlyMessage, useAsyncDataSource } from '@/utils/util';
import { service } from '@/pages/account/NotificationSubscription';
import _ from 'lodash';

interface Props {
  data: Partial<NotifitionSubscriptionItem>;
  close: () => void;
  reload: () => void;
}

const Save = (props: Props) => {
  const [data, setDada] = useState<any>(props.data || {});
  const [dataList, setDataList] = useState<any[]>([]);

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        initialValues: data,
      }),
    [],
  );

  useEffect(() => {
    if (props.data?.topicConfig) {
      const param = {
        ...props.data,
        topicConfig: {
          alarmConfigId: props.data?.topicConfig?.alarmConfigId.split(','),
          alarmConfigName: props.data?.topicConfig?.alarmConfigName.split(','),
        },
      };
      setDada({ ...param });
      form.setValues(param);
    }
  }, [props.data]);

  const queryProvidersList = () => service.getProvidersList();

  const queryAlarmConfigList = () => {
    return service.getAlarmConfigList().then((resp) => {
      setDataList(resp);
      return resp;
    });
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      grid: {
        type: 'void',
        'x-component': 'FormGrid',
        'x-component-props': {
          maxColumns: 2,
          minColumns: 1,
        },
        properties: {
          subscribeName: {
            title: '名称',
            'x-component': 'Input',
            'x-decorator': 'FormItem',
            required: true,
            'x-decorator-props': {
              gridSpan: 2,
              labelAlign: 'left',
              layout: 'vertical',
            },
            'x-component-props': {
              placeholder: '请输入名称',
            },
            'x-validator': [
              {
                required: true,
                message: '请输入名称',
              },
              {
                max: 64,
                message: '最多可输入64个字符',
              },
            ],
          },
          topicProvider: {
            title: '类型',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            required: true,
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              layout: 'vertical',
            },
            'x-component-props': {
              placeholder: '请选择类型',
            },
            'x-reactions': ['{{useAsyncDataSource(queryProvidersList)}}'],
            'x-validator': [
              {
                required: true,
                message: '请选择类型',
              },
            ],
          },
          'topicConfig.alarmConfigId': {
            title: '告警规则',
            type: 'array',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            required: true,
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              layout: 'vertical',
            },
            'x-component-props': {
              mode: 'multiple',
              showArrow: true,
              placeholder: '请选择告警规则',
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
            'x-reactions': ['{{useAsyncDataSource(queryAlarmConfigList)}}'],
            'x-validator': [
              {
                required: true,
                message: '请选择告警规则',
              },
            ],
          },
          notice: {
            title: '通知方式',
            type: 'array',
            required: true,
            // 'x-disabled': true,
            default: [1],
            enum: [
              {
                label: '站内通知',
                value: 1,
              },
              // {
              //   label: '邮件通知',
              //   value: 2,
              // },
              // {
              //   label: '短信通知',
              //   value: 3,
              // },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox.Group',
            'x-decorator-props': {
              gridSpan: 2,
              labelAlign: 'left',
              layout: 'vertical',
            },
            'x-validator': [
              {
                required: true,
                message: '请选择通知方式',
              },
            ],
          },
        },
      },
    },
  };

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      FormGrid,
      Input,
      Select,
      Checkbox,
    },
  });

  const handleSave = async () => {
    let param: any = await form.submit();
    delete param.notice;
    const config = dataList.filter((item) =>
      param?.topicConfig?.alarmConfigId.includes(item?.value),
    );
    param = {
      ...data,
      ...param,
      topicConfig: {
        ...param?.topicConfig,
        alarmConfigId: param?.topicConfig.alarmConfigId.join(','),
        alarmConfigName: _.map(config, 'label').join(','),
      },
    };
    const response: any = await service.saveData(param);
    if (response.status === 200) {
      onlyMessage('操作成功！');
      props.reload();
    }
  };

  return (
    <Modal
      title={props.data.id ? '编辑' : '新增'}
      visible
      onCancel={props.close}
      onOk={() => handleSave()}
      width={'45vw'}
    >
      <Form form={form} layout="vertical">
        <SchemaField
          schema={schema}
          scope={{
            useAsyncDataSource,
            queryProvidersList,
            queryAlarmConfigList,
          }}
        />
      </Form>
    </Modal>
  );
};
export default Save;
