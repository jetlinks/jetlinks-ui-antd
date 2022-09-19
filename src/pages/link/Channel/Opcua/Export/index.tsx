import { FormItem, FormLayout, Radio, Select } from '@formily/antd';
import { createForm } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Modal } from 'antd';
import 'antd/lib/tree-select/style/index.less';
import { useEffect, useState } from 'react';
import { service } from '@/pages/link/Channel/Opcua';
import SystemConst from '@/utils/const';
import { downloadFile } from '@/utils/util';

interface Props {
  close: () => void;
  data: any;
}

const Export = (props: Props) => {
  const { close } = props;
  const [list, setList] = useState<any[]>([]);
  const SchemaField = createSchemaField({
    components: {
      Radio,
      Select,
      FormItem,
      FormLayout,
    },
  });

  useEffect(() => {
    service
      .noPagingOpcua({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
      })
      .then((resp) => {
        if (resp.status === 200) {
          const items = resp.result.map((item: { name: any; id: any }) => ({
            label: item.name,
            value: item.id,
          }));
          setList(items);
        }
      });
  }, []);

  const form = createForm();

  const schema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          // labelCol: 4,
          // wrapperCol: 18,
          // labelAlign: 'right',
          layout: 'vertical',
        },
        properties: {
          opcUaId: {
            type: 'string',
            title: '通道',
            required: true,
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            enum: [...list],
            'x-component-props': {
              allowClear: true,
              showSearch: true,
              showArrow: true,
              filterOption: (input: string, option: any) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            },
          },
          fileType: {
            title: '文件格式',
            default: 'xlsx',
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            'x-component-props': {
              optionType: 'button',
              buttonStyle: 'solid',
            },
            enum: [
              {
                label: 'xlsx',
                value: 'xlsx',
              },
              {
                label: 'csv',
                value: 'csv',
              },
            ],
          },
        },
      },
    },
  };
  const downloadTemplate = async () => {
    const values = (await form.submit()) as any;
    const opcUaName = props.data.find((item: any) => item.id === values.opcUaId)?.name;
    if (values) {
      downloadFile(
        `/${SystemConst.API_BASE}/opc/point/${values.opcUaId}/export.${values.fileType}`,
        {
          opcUaName: opcUaName,
        },
      );
      close();
    }
  };
  return (
    <Modal
      maskClosable={false}
      visible
      onCancel={() => close()}
      width="35vw"
      title="导出"
      onOk={downloadTemplate}
    >
      <div style={{ marginTop: '20px' }}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </div>
    </Modal>
  );
};
export default Export;
