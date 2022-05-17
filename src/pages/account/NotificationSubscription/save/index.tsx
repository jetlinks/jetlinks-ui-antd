import { message, Modal } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Form, FormGrid, FormItem, Input, Select, Checkbox } from '@formily/antd';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { useAsyncDataSource } from '@/utils/util';
import { service } from '@/pages/account/NotificationSubscription';

interface Props {
  data: Partial<NotifitionSubscriptionItem>;
  close: () => void;
  reload: () => void;
}

const Save = (props: Props) => {
  const [data, setDada] = useState<Partial<NotifitionSubscriptionItem>>(props.data || {});
  const [dataList, setDataList] = useState<any[]>([]);

  useEffect(() => {
    setDada(props.data);
  }, [props.data]);

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
        initialValues: data,
      }),
    [],
  );

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
          },
          'topicConfig.alarmConfigId': {
            title: '告警规则',
            'x-component': 'Select',
            'x-decorator': 'FormItem',
            required: true,
            'x-decorator-props': {
              gridSpan: 1,
              labelAlign: 'left',
              layout: 'vertical',
            },
            'x-component-props': {
              placeholder: '请选择告警规则',
            },
            'x-reactions': ['{{useAsyncDataSource(queryAlarmConfigList)}}'],
          },
          notice: {
            title: '通知方式',
            type: 'array',
            required: true,
            'x-disabled': true,
            default: [1],
            enum: [
              {
                label: '站内通知',
                value: 1,
              },
              {
                label: '邮件通知',
                value: 2,
              },
              {
                label: '短信通知',
                value: 3,
              },
            ],
            'x-decorator': 'FormItem',
            'x-component': 'Checkbox.Group',
            'x-decorator-props': {
              gridSpan: 2,
              labelAlign: 'left',
              layout: 'vertical',
            },
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
    const config = dataList.find((item) => item?.value === param?.topicConfig?.alarmConfigId);
    param = {
      ...data,
      ...param,
      topicConfig: {
        ...param?.topicConfig,
        alarmConfigName: config.label || '',
      },
    };
    const response: any = await service.saveData(param);
    if (response.status === 200) {
      message.success('操作成功！');
      props.reload();
    }
  };

  return (
    <Modal title={'详情'} visible onCancel={props.close} onOk={() => handleSave()} width={'45vw'}>
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
