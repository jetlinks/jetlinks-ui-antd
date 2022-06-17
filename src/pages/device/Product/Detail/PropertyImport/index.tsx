import { Button, Modal, Space, Upload } from 'antd';
import MetadataModel from '@/pages/device/components/Metadata/Base/model';
import { FormItem, FormLayout, Radio } from '@formily/antd';
import { createForm, onFieldValueChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import 'antd/lib/tree-select/style/index.less';
import { UploadOutlined } from '@ant-design/icons';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { useParams } from 'umi';
import { productModel, service } from '../..';
import { downloadFile, onlyMessage } from '@/utils/util';
import type { DeviceMetadata, ProductItem } from '@/pages/device/Product/typings';
import { Store } from 'jetlinks-store';
import { asyncUpdateMedata, updateMetadata } from '@/pages/device/components/Metadata/metadata';
import { InstanceModel } from '@/pages/device/Instance';

const NormalUpload = (props: any) => {
  const param = useParams<{ id: string }>();

  const typeMap = new Map<string, any>();

  typeMap.set('product', productModel.current);
  typeMap.set('device', InstanceModel.detail);

  const mergeMetadata = async (url: string) => {
    if (!url) return;
    // 解析物模型
    const r = await service.importProductProperty(param.id, url);
    const _metadata = JSON.parse(r.result || '{}') as DeviceMetadata;

    const target = typeMap.get(props.type);

    const _data = updateMetadata('properties', _metadata.properties, target) as ProductItem;
    // const resp = await service.update(_product);
    const resp = await asyncUpdateMedata(props.type, _data);
    if (resp.status === 200) {
      onlyMessage('操作成功');
      // 刷新物模型

      if (props.type === 'product') {
        Store.set(SystemConst.GET_METADATA, true);
      } else if (props.type === 'device') {
        Store.set(SystemConst.REFRESH_DEVICE, true);
      }
      setTimeout(() => {
        Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
      }, 300);
    }
    MetadataModel.importMetadata = false;
  };

  return (
    <div>
      <Space>
        <Upload
          accept={`.${props?.fileType || 'xlsx'}`}
          action={`/${SystemConst.API_BASE}/file/static`}
          headers={{
            'X-Access-Token': Token.get(),
          }}
          onChange={async (info) => {
            if (info.file.status === 'done') {
              onlyMessage('上传成功');
              const resp: any = info.file.response || { result: '' };
              await mergeMetadata(resp?.result);
              // service.importProductProperty(param.id, resp?.result).then((r) => {
              //   console.log(r, 'resp');
              //   const _metadata = JSON.parse(r.result || '{}') as DeviceMetadata;
              //
              //   // 更新产品物模型属性信息
              // });
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
              const url = `/${SystemConst.API_BASE}/device/product/${param?.id}/property-metadata/template.xlsx`;
              downloadFile(url);
              // downloadTemplate('xlsx', param?.id);
            }}
          >
            .xlsx
          </a>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              const url = `/${SystemConst.API_BASE}/device/product/${param.id}/property-metadata/template.csv`;
              // downloadTemplate('csv', param?.id);
              downloadFile(url);
            }}
          >
            .csv
          </a>
        </div>
      </Space>
    </div>
  );
};

interface Props {
  type: 'product' | 'device';
}

const PropertyImport = (props: Props) => {
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
            type: props.type,
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
          // labelCol: 4,
          // wrapperCol: 18,
          // labelAlign: 'right',
          layout: 'vertical',
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
      maskClosable={false}
      visible
      onCancel={() => (MetadataModel.importMetadata = false)}
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
