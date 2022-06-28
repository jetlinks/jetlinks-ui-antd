import { TitleComponent } from '@/components';
import { getButtonPermission } from '@/utils/menu';
import { Button, Col, Form, Input, Row } from 'antd';
import { service } from '@/pages/link/AccessConfig';
import { useHistory } from 'umi';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ProcotoleMapping } from '../Protocol';
import { onlyMessage } from '@/utils/util';

interface Props {
  prev: () => void;
  data: any;
  config: any;
  provider: any;
  procotol: string;
}

const Finish = (props: Props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    form.setFieldsValue({
      name: props.data.name,
      description: props.data.description,
    });
  }, [props.data]);

  useEffect(() => {
    service.getConfigView(props.procotol, ProcotoleMapping.get(props.provider?.id)).then((resp) => {
      if (resp.status === 200) {
        setConfig(resp.result);
      }
    });
  }, [props.procotol, props.provider]);

  return (
    <Row gutter={24}>
      <Col span={12}>
        <div>
          <TitleComponent data={'基本信息'} />
          <Form name="basic" layout="vertical" form={form}>
            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
              <Input placeholder="请输入名称" />
            </Form.Item>
            <Form.Item name="description" label="说明">
              <Input.TextArea showCount maxLength={200} placeholder="请输入说明" />
            </Form.Item>
          </Form>
          <div style={{ marginTop: 50 }}>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                props.prev();
              }}
            >
              上一步
            </Button>
            <Button
              type="primary"
              disabled={
                !!props.data.id
                  ? getButtonPermission('link/AccessConfig', ['update'])
                  : getButtonPermission('link/AccessConfig', ['add'])
              }
              onClick={async () => {
                try {
                  const values = await form.validateFields();
                  const param = {
                    ...props.data,
                    ...values,
                    provider: props.provider.id,
                    protocol: props.procotol,
                    transport: 'HTTP_SERVER',
                    configuration: {
                      ...props.config,
                    },
                  };
                  const resp: any = await service[!props.data?.id ? 'save' : 'update'](param);
                  if (resp.status === 200) {
                    onlyMessage('操作成功！');
                    history.goBack();
                    if ((window as any).onTabSaveSuccess) {
                      (window as any).onTabSaveSuccess(resp);
                      setTimeout(() => window.close(), 300);
                    }
                  }
                } catch (errorInfo) {
                  console.error('Failed:', errorInfo);
                }
              }}
            >
              保存
            </Button>
          </div>
        </div>
      </Col>
      <Col span={12}>
        <div style={{ marginLeft: 10 }}>
          <TitleComponent data={'配置概览'} />
          <div>
            <p>接入方式：{props.provider?.name || ''}</p>
            {props.provider?.description && <p>{props.provider?.description || ''}</p>}
            <p>消息协议：{props.procotol}</p>
            {config?.document && (
              <div>{<ReactMarkdown>{config?.document}</ReactMarkdown> || ''}</div>
            )}
          </div>
          <TitleComponent data={'设备接入指引'} />
          <div>
            <p>
              1、创建类型为{props?.provider?.id === 'OneNet' ? 'OneNet' : 'CTWing'}的设备接入网关
            </p>
            <p>
              2、创建产品，并选中接入方式为{props?.provider?.id === 'OneNet' ? 'OneNet' : 'CTWing'}
            </p>
            {props?.provider?.id === 'OneNet' ? (
              <p>
                3、添加设备，为每一台设备设置唯一的IMEI、IMSI码（需与OneNet平台中填写的值一致，若OneNet平台没有对应的设备，将会通过OneNet平台提供的LWM2M协议自动创建）
              </p>
            ) : (
              <p>
                3、添加设备，为每一台设备设置唯一的IMEI、SN、PSK码（需与CTWingt平台中填写的值一致，若CTWing平台没有对应的设备，将会通
              </p>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Finish;
