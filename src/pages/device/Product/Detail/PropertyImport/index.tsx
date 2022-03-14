import { Modal } from 'antd';
import MetadataModel from '@/pages/device/components/Metadata/Base/model';
import { FormItem, FormLayout, Radio } from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Button, message, Space, Upload } from 'antd';
import 'antd/lib/tree-select/style/index.less';
import { UploadOutlined } from '@ant-design/icons';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { useParams } from 'umi';
import { service } from '../..';

const downloadTemplate = (type: string, productId: string) => {
  const formElement = document.createElement('form');
  formElement.style.display = 'display:none;';
  formElement.method = 'GET';
  formElement.action = `/${SystemConst.API_BASE}/device/product/${productId}/property-metadata/template.${type}`;
  const inputElement = document.createElement('input');
  inputElement.type = 'hidden';
  inputElement.name = ':X_Access_Token';
  inputElement.value = Token.get();
  formElement.appendChild(inputElement);
  document.body.appendChild(formElement);
  formElement.submit();
  document.body.removeChild(formElement);
};

const NormalUpload = (props: any) => {
  const param = useParams<{ id: string }>();
  console.log(props?.fileType);

  return (
    <div>
      <Space>
        <Upload
          accept={`.${props?.fileType || 'xlsx'}`}
          action={`/${SystemConst.API_BASE}/file/static`}
          headers={{
            'X-Access-Token': Token.get(),
          }}
          onChange={(info) => {
            if (info.file.status === 'done') {
              message.success('上传成功');
              const resp: any = info.file.response || { result: '' };
              service.importProductProperty(param.id, resp?.result).then(() => {
                // 更新产品物模型属性信息
              });
            }
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
        <div style={{ marginLeft: 20 }}>
          下载模板
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              downloadTemplate('xlsx', param?.id);
            }}
          >
            .xlsx
          </a>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              downloadTemplate('csv', param?.id);
            }}
          >
            .csv
          </a>
        </div>
      </Space>
    </div>
  );
};

const PropertyImport = () => {
  const SchemaField = createSchemaField({
    components: {
      Radio,
      FormItem,
      FormLayout,
      NormalUpload,
    },
  });

  const form = createForm({
    effects() {
      onFieldValueChange('fileType', (field) => {
        form.setFieldState('*(upload)', (state) => {
          state.componentProps = {
            fileType: field.value,
          };
        });
      });
    },
  });

  const schema = {
    type: 'object',
    properties: {
      layout: {
        type: 'void',
        'x-component': 'FormLayout',
        'x-component-props': {
          labelCol: 4,
          wrapperCol: 18,
          labelAlign: 'right',
        },
        properties: {
          fileType: {
            title: '文件格式',
            'x-decorator': 'FormItem',
            'x-component': 'Radio.Group',
            default: 'xlsx',
            'x-component-props': {
              buttonStyle: 'solid',
              optionType: 'button',
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
          upload: {
            type: 'string',
            title: '文件上传',
            'x-decorator': 'FormItem',
            'x-component': 'NormalUpload',
          },
        },
      },
    },
  };

  return (
    <Modal
      visible
      onCancel={() => close()}
      width="35vw"
      title="导入属性"
      onOk={() => {
        MetadataModel.importMetadata = false;
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            MetadataModel.importMetadata = false;
          }}
        >
          取消
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={() => {
            MetadataModel.importMetadata = false;
          }}
        >
          确认
        </Button>,
      ]}
    >
      <div style={{ marginTop: '20px' }}>
        <FormProvider form={form}>
          <SchemaField schema={schema} />
        </FormProvider>
      </div>
    </Modal>
  );
};
export default PropertyImport;
