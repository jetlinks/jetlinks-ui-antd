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
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import MetadataAction from '@/pages/device/components/Metadata/DataBaseAction';
import { useMemo, useState } from 'react';
interface Props {
  visible: boolean;
  close: () => void;
  type: 'product' | 'device';
}

const Import = (props: Props) => {
  const param = useParams<{ id: string }>();
  const form = useMemo(
    () =>
      createForm({
        initialValues: {},
      }),
    [props.visible],
  );
  const [loading, setLoading] = useState<boolean>(false);

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
      sorts: [{ name: 'createTime', order: 'desc' }],
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
        default: 'import',
        'x-visible': props?.type === 'product',
        'x-validator': [
          {
            required: true,
            message: '请选择导入方式',
          },
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
        'x-validator': [
          {
            required: true,
            message: '请选择产品',
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
        'x-validator': [
          {
            required: true,
            message: '请选择物模型类型',
          },
        ],
        default: 'jetlinks',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: props?.type === 'device' || "{{$deps[0]==='import'}}",
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
      metadataType: {
        title: '导入类型',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        'x-decorator-props': {
          width: '800px',
        },
        'x-component-props': {
          width: '800px',
        },
        default: 'script',
        'x-reactions': {
          dependencies: ['.type'],
          fulfill: {
            state: {
              visible: props?.type === 'device' || "{{$deps[0]==='import'}}",
            },
          },
        },
        'x-validator': [
          {
            required: true,
            message: '请选择导入类型',
          },
        ],
        enum: [
          {
            label: '文件上传',
            value: 'file',
          },
          {
            label: '脚本',
            value: 'script',
          },
        ],
      },
      upload: {
        title: '文件上传',
        'x-decorator': 'FormItem',
        'x-component': 'FUpload',
        'x-visible': false,
        'x-reactions': {
          dependencies: ['.metadataType'],
          fulfill: {
            state: {
              visible: "{{$deps[0]==='file'}}",
            },
          },
        },
        'x-validator': [
          {
            required: true,
            message: '请上传文件',
          },
        ],
        'x-decorator-props': {
          tooltip: '上传json格式的物模型文件',
        },
        'x-component-props': {
          title: '快速导入',
          showUploadList: false,
          accept: '.json',
          formatOnType: true,
          formatOnPaste: true,
          type: 'file',
          beforeUpload: (file: any) => {
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
      import: {
        title: '物模型',
        'x-decorator': 'FormItem',
        'x-component': 'FMonacoEditor',
        'x-component-props': {
          height: 350,
          theme: 'vs',
          language: 'json',
        },
        'x-visible': false,
        'x-validator': [
          {
            required: true,
            message: '请输入物模型',
          },
        ],
        'x-decorator-props': {
          tooltip: '在线编辑器中编写物模型脚本',
        },
        'x-reactions': {
          dependencies: ['.metadataType'],
          fulfill: {
            state: {
              visible: "{{$deps[0]==='script'}}",
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
    (obj?.events || []).map((item, index) => {
      return { ...item, sortsIndex: index };
    });
    (obj?.properties || []).map((item, index) => {
      return { ...item, sortsIndex: index };
    });
    (obj?.functions || []).map((item, index) => {
      return { ...item, sortsIndex: index };
    });
    (obj?.tags || []).map((item, index) => {
      return { ...item, sortsIndex: index };
    });
    return obj;
  };

  const handleImport = async () => {
    const data = (await form.submit()) as any;
    setLoading(true);
    if (data.metadata === 'alink') {
      service.convertMetadata('from', 'alink', data.import).subscribe({
        next: async (meta) => {
          const metadata = JSON.stringify(operateLimits(meta));
          if (props?.type === 'device') {
            await deviceService.saveMetadata(param.id, metadata);
          } else {
            await service.modify(param.id, { metadata: metadata });
          }
          setLoading(false);
          MetadataAction.insert(JSON.parse(metadata || '{}'));
          onlyMessage('导入成功');
        },
        error: () => {
          setLoading(false);
          onlyMessage('发生错误!', 'error');
        },
      });
      Store.set(SystemConst.GET_METADATA, true);
      Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
      props.close();
    } else {
      try {
        const _object = JSON.parse(data[props?.type === 'device' ? 'import' : data?.type] || '{}');
        if (
          !(!!_object?.properties || !!_object?.events || !!_object?.functions || !!_object?.tags)
        ) {
          onlyMessage('物模型数据不正确', 'error');
          setLoading(false);
          return;
        }
        const params = {
          id: param.id,
          metadata: JSON.stringify(operateLimits(_object as DeviceMetadata)),
        };
        const paramsDevice = JSON.stringify(operateLimits(_object as DeviceMetadata));
        let resp: any = undefined;
        if (props?.type === 'device') {
          resp = await deviceService.saveMetadata(param.id, paramsDevice);
        } else {
          resp = await service.modify(param.id, params);
        }
        setLoading(false);
        if (resp.status === 200) {
          if (props?.type === 'device') {
            const metadata: DeviceMetadata = JSON.parse(paramsDevice || '{}');
            MetadataAction.insert(metadata);
            onlyMessage('导入成功');
          } else {
            const metadata: DeviceMetadata = JSON.parse(params?.metadata || '{}');
            MetadataAction.insert(metadata);
            onlyMessage('导入成功');
          }
        }
        Store.set(SystemConst.GET_METADATA, true);
        Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
        props.close();
      } catch (e) {
        setLoading(false);
        onlyMessage(e === 'error' ? '物模型数据不正确' : '上传json格式的物模型文件', 'error');
      }
    }
  };
  return (
    <Modal
      maskClosable={false}
      title="导入物模型"
      destroyOnClose
      visible={props.visible}
      onCancel={() => props.close()}
      onOk={handleImport}
      confirmLoading={loading}
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
