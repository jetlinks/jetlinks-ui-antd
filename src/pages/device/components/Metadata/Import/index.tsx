import { Modal } from 'antd';
import { createSchemaField } from '@formily/react';
import type { Field } from '@formily/core';
import { createForm } from '@formily/core';
import { Form, FormItem, Input, Select, Space } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import FMonacoEditor from '@/components/FMonacoEditor';
import FUpload from '@/components/Upload';
import { service } from '@/pages/device/Product';
import { service as deviceService } from '@/pages/device/Instance';
import { useParams } from 'umi';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { onlyMessage } from '@/utils/util';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { InstanceModel } from '@/pages/device/Instance';
import _ from 'lodash';
import { DeviceMetadata } from '@/pages/device/Product/typings';

interface Props {
  visible: boolean;
  close: () => void;
  type: 'product' | 'device';
}

const Import = (props: Props) => {
  const param = useParams<{ id: string }>();
  const form = createForm({
    initialValues: {},
  });

  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      FMonacoEditor,
      FUpload,
      Space,
    },
  });

  const loadData = () => async (field: Field) => {
    field.loading = true;
    const product = (await service.queryNoPagingPost({
      paging: false,
      terms: [{ column: 'id$not', value: param.id }],
    })) as any;
    field.dataSource = product.result
      .filter((i: any) => i?.metadata)
      .map((item: any) => ({
        label: item.name,
        value: item.metadata,
        key: item.id,
      }));
    field.loading = false;
  };

  const schema: ISchema = {
    type: 'object',
    properties: {
      type: {
        title: '导入方式',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [
          { label: '拷贝产品', value: 'copy' },
          { label: '导入物模型', value: 'import' },
        ],
      },
      copy: {
        title: '选择产品',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-component-props': {
          showSearch: true,
          showArrow: true,
          allowClear: true,
          filterOption: (input: string, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        },
        'x-visible': false,
        'x-reactions': [
          '{{loadData()}}',
          {
            dependencies: ['.type'],
            fulfill: {
              state: {
                visible: "{{$deps[0]==='copy'}}",
              },
            },
          },
        ],
      },
      metadata: {
        title: '物模型类型',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-decorator-props': {
          width: '800px',
        },
        'x-component-props': {
          width: '800px',
        },
        default: 'jetlinks',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{$deps[0]==='import'}}",
            },
          },
        },
        enum: [
          {
            label: 'Jetlinks物模型',
            value: 'jetlinks',
          },
          {
            label: '阿里云物模型TSL',
            value: 'alink',
          },
        ],
      },
      layout: {
        type: 'void',
        'x-component': 'Space',
        'x-visible': false,
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{$deps[0]==='import'}}",
            },
          },
        },

        properties: {
          upload: {
            'x-decorator': 'FormItem',
            'x-component': 'FUpload',
            'x-component-props': {
              title: '快速导入',
              showUploadList: false,
              accept: '.json',
              formatOnType: true,
              formatOnPaste: true,
              type: 'file',
              beforeUpload: (file: any) => {
                console.log(file, 'fff');
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (json) => {
                  form.setValues({
                    import: json.target?.result,
                  });
                };
              },
            },
          },
        },
      },
      import: {
        title: '物模型',
        'x-decorator': 'FormItem',
        'x-component': 'FMonacoEditor',
        'x-component-props': {
          height: 350,
          theme: 'vs',
          language: 'json',
          editorDidMount: (editor1: any) => {
            editor1.onDidScrollChange?.(() => {
              editor1.getAction('editor.action.formatDocument').run();
            });
          },
        },
        'x-visible': false,
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: "{{$deps[0]==='import'}}",
            },
          },
        },
      },
    },
  };

  const operateLimits = (mdata: DeviceMetadata) => {
    const obj: DeviceMetadata = { ...mdata };
    const old = JSON.parse(InstanceModel.detail?.metadata || '{}');
    const fid = _.map(InstanceModel.detail?.features || [], 'id');
    if (fid.includes('eventNotModifiable')) {
      obj.events = old?.events || [];
    }
    if (fid.includes('propertyNotModifiable')) {
      obj.properties = old?.properties || [];
    }
    return obj;
  };

  const handleImport = async () => {
    const data = (await form.submit()) as any;

    if (data.metadata === 'alink') {
      service.convertMetadata('from', 'alink', data.import).subscribe({
        next: async (meta) => {
          onlyMessage('导入成功');
          if (props?.type === 'device') {
            await deviceService.modify(param.id, { metadata: JSON.stringify(operateLimits(meta)) });
          } else {
            await service.modify(param.id, { metadata: JSON.stringify(operateLimits(meta)) });
          }
        },
        error: () => {
          onlyMessage('发生错误!', 'error');
        },
      });
    } else {
      const params = {
        id: param.id,
        metadata: JSON.stringify(operateLimits(JSON.parse(data[data?.type] || '{}'))),
      };
      let resp: any = undefined;
      if (props?.type === 'device') {
        resp = await deviceService.modify(param.id, params);
      } else {
        resp = await service.modify(param.id, params);
      }
      if (resp.status === '200') {
        onlyMessage('导入成功');
      }
    }
    Store.set(SystemConst.GET_METADATA, true);
    props.close();
  };
  return (
    <Modal
      maskClosable={false}
      title="导入物模型"
      destroyOnClose
      visible={props.visible}
      onCancel={() => props.close()}
      onOk={handleImport}
    >
      <div style={{ background: 'rgb(236, 237, 238)' }}>
        <p style={{ padding: 10 }}>
          <ExclamationCircleOutlined style={{ marginRight: 5 }} />
          导入的物模型会覆盖原来的属性、功能、事件、标签，请谨慎操作。
          {/* <br /> */}
          {/*物模型格式请参考文档：*/}
          {/*<a*/}
          {/*  rel="noopener noreferrer"*/}
          {/*  target="_blank"*/}
          {/*  href="http://doc.jetlinks.cn/basics-guide/device-manager.html#%E8%AE%BE%E5%A4%87%E5%9E%8B%E5%8F%B7"*/}
          {/*>*/}
          {/*  设备型号*/}
          {/*</a>*/}
        </p>
      </div>
      <Form form={form} layout="vertical">
        <SchemaField scope={{ loadData }} schema={schema} />
      </Form>
    </Modal>
  );
};

export default Import;
