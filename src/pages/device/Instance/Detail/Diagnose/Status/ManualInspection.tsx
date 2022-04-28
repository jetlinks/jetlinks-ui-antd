import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import type { ISchema } from '@formily/json-schema';
import { Form, FormGrid, FormItem, Input, Password, PreviewText } from '@formily/antd';
import { Modal } from 'antd';
import styles from './index.less';
import { ExclamationCircleFilled } from '@ant-design/icons';

const componentMap = {
  string: 'Input',
  password: 'Password',
};

interface Props {
  close: () => void;
  data: any;
  ok: (data: any) => void;
}

const ManualInspection = (props: Props) => {
  const { data } = props;

  const form = createForm({
    validateFirst: true,
    initialValues: {},
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Password,
      FormGrid,
      PreviewText,
    },
  });

  const configToSchema = (list: any[]) => {
    const config = {};
    list.forEach((item) => {
      config[item.property] = {
        type: 'string',
        title: item.name,
        require: true,
        'x-decorator': 'FormItem',
        'x-component': componentMap[item.type.type],
        'x-decorator-props': {
          tooltip: item.description,
        },
        'x-component-props': {
          value: '',
          placeholder: `请输入${item.name}`,
        },
      };
    });
    return config;
  };

  const renderConfigCard = () => {
    const itemSchema: ISchema = {
      type: 'object',
      properties: {
        grid: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': {
            minColumns: [1],
            maxColumns: [1],
          },
          properties: configToSchema(data?.data?.properties),
        },
      },
    };

    return (
      <>
        <PreviewText.Placeholder value="-">
          <Form form={form} layout="vertical">
            <SchemaField schema={itemSchema} />
          </Form>
        </PreviewText.Placeholder>
      </>
    );
  };
  const renderComponent = () => (
    <div style={{ backgroundColor: '#f6f6f6', padding: 10 }}>
      {(data?.data?.properties || []).map((item: any) => (
        <div key={item?.property}>
          <span>{item?.name}</span>:{' '}
          <span>
            {data?.check && data?.check[item?.property] ? data?.check[item?.property] : '--'}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <Modal
      title="人工检查"
      onCancel={() => {
        props.close();
      }}
      width={600}
      onOk={async () => {
        const values = (await form.submit()) as any;
        if (!data?.check) {
          props.ok({
            status: 'error',
            data: data,
          });
        } else {
          let flag = true;
          Object.keys(values).forEach((key) => {
            if (values[key] !== data?.check[key]) {
              flag = false;
            }
          });
          if (flag) {
            props.ok({
              status: 'success',
              data: data,
            });
          } else {
            props.ok({
              status: 'error',
              data: data,
            });
          }
        }
      }}
      visible
    >
      <div className={styles.alert}>
        <ExclamationCircleFilled style={{ marginRight: 10 }} />
        {data.type === 'product'
          ? `当前填写的数据将与产品-设备接入配置中的${data.data.name}数据进行比对`
          : `当前填写的数据将与设备-实例信息配置中的${data.data.name}数据进行比对`}
      </div>
      <div style={{ marginTop: 10 }}>
        已配置参数
        {renderComponent()}
      </div>
      <div style={{ marginTop: 10 }}>{renderConfigCard()}</div>
    </Modal>
  );
};

export default ManualInspection;
