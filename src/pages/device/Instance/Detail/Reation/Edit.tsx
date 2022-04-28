import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { InstanceModel, service } from '@/pages/device/Instance';
import type { ISchema } from '@formily/json-schema';
import { Form, FormGrid, FormItem, Select, PreviewText } from '@formily/antd';
import { useParams } from 'umi';
import { Button, Drawer, message, Space } from 'antd';
import { action } from '@formily/reactive';
import type { Response } from '@/utils/typings';
import { useEffect, useState } from 'react';

interface Props {
  close: () => void;
  data: any[];
}

const Edit = (props: Props) => {
  const { data } = props;
  const params = useParams<{ id: string }>();
  const id = InstanceModel.detail?.id || params?.id;
  const [initData, setInitData] = useState<any>({});

  const getUsers = () => service.queryUserListNopaging();

  const useAsyncDataSource = (api: any) => (field: Field) => {
    field.loading = true;
    api(field).then(
      action.bound!((resp: Response<any>) => {
        field.dataSource = resp.result?.map((item: Record<string, unknown>) => ({
          ...item,
          label: item.name,
          value: JSON.stringify({
            id: item.id,
            name: item.name,
          }),
        }));
        field.loading = false;
      }),
    );
  };

  const form = createForm({
    validateFirst: true,
    initialValues: initData,
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Select,
      FormGrid,
      PreviewText,
    },
  });

  const configToSchema = (list: any[]) => {
    const config = {};
    list.forEach((item) => {
      config[item.relation] = {
        type: 'string',
        title: item.relationName,
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          placeholder: `请选择${item.relationName}`,
          showSearch: true,
          showArrow: true,
          mode: 'multiple',
          filterOption: (input: string, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
        'x-reactions': ['{{useAsyncDataSource(getUsers)}}'],
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
          properties: configToSchema(data),
        },
      },
    };

    return (
      <>
        <PreviewText.Placeholder value="-">
          <Form form={form} layout="vertical">
            <SchemaField schema={itemSchema} scope={{ useAsyncDataSource, getUsers }} />
          </Form>
        </PreviewText.Placeholder>
      </>
    );
  };

  useEffect(() => {
    const obj: any = {};
    (props?.data || []).map((item: any) => {
      obj[item.relation] = [...(item?.related || []).map((i: any) => JSON.stringify(i))];
    });
    setInitData(obj);
  }, [props.data]);

  return (
    <Drawer
      title="编辑"
      placement="right"
      onClose={() => {
        props.close();
      }}
      visible
      extra={
        <Space>
          <Button
            type="primary"
            onClick={async () => {
              const values = (await form.submit()) as any;
              if (Object.keys(values).length > 0) {
                const param: any[] = [];
                Object.keys(values).forEach((key) => {
                  const item = data.find((i) => i.relation === key);
                  const items = (values[key] || []).map((i: string) => JSON.parse(i));
                  if (item) {
                    param.push({
                      relatedType: 'user',
                      relation: item.relation,
                      description: '',
                      related: [...items],
                    });
                  }
                });
                const resp = await service.saveRelations(id || '', param);
                if (resp.status === 200) {
                  message.success('操作成功！');
                  props.close();
                }
              }
            }}
          >
            保存
          </Button>
        </Space>
      }
    >
      {renderConfigCard()}
    </Drawer>
  );
};

export default Edit;
