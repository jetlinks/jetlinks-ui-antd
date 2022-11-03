import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '@/pages/link/AccessConfig';
import { ProtocolMapping } from '../data';
import TitleComponent from '@/components/TitleComponent';
import { getButtonPermission } from '@/utils/menu';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'umi';
import { onlyMessage } from '@/utils/util';

interface Props {
  change: () => void;
  data: any;
  provider: any;
  view?: boolean;
}

const Media = (props: Props) => {
  const [form] = Form.useForm();
  const [config, setConfig] = useState<any>({});
  const history = useHistory();

  const protocol = props.provider.id === 'modbus-tcp' ? 'modbus-tcp' : 'opc-ua';
  const name = props.provider.id === 'modbus-tcp' ? 'Modbus' : 'OPCUA';

  useEffect(() => {
    form.setFieldsValue({
      name: props.data.name,
      description: props.data.description,
    });
  }, [props.data]);

  useEffect(() => {
    service.getConfigView(protocol, ProtocolMapping.get(props.provider?.id)).then((resp) => {
      if (resp.status === 200) {
        setConfig(resp.result);
      }
    });
  }, [props.provider]);

  return (
    <Card>
      {!props.data?.id && (
        <Button
          type="link"
          onClick={() => {
            props.change();
          }}
        >
          返回
        </Button>
      )}
      <div style={{ margin: '20px 30px' }}>
        <Row gutter={24}>
          <Col span={12}>
            <div>
              <TitleComponent data={'基本信息'} />
              <Form name="basic" layout="vertical" form={form}>
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[{ required: true, message: '请输入名称' }]}
                >
                  <Input placeholder="请输入名称" />
                </Form.Item>
                <Form.Item name="description" label="说明">
                  <Input.TextArea showCount maxLength={200} placeholder="请输入说明" />
                </Form.Item>
              </Form>
              <div style={{ marginTop: 50 }}>
                {!props.view && (
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
                          provider: props.provider?.id,
                          protocol: protocol,
                          transport: props.provider.id === 'modbus-tcp' ? 'MODBUS_TCP' : 'OPC_UA',
                          channel: props.provider.id === 'modbus-tcp' ? 'modbus' : 'opc-ua',
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
                )}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginLeft: 10 }}>
              <TitleComponent data={'配置概览'} />
              <div>
                <p>接入方式：{props.provider?.name || ''}</p>
                {props.provider?.description && <p>{props.provider?.description || ''}</p>}
                <p>消息协议：{protocol}</p>
                {config?.document && (
                  <div>{<ReactMarkdown>{config?.document}</ReactMarkdown> || ''}</div>
                )}
              </div>
              <TitleComponent data={'设备接入指引'} />
              <div>
                <p>1、配置{name}通道</p>
                <p>2、创建{name}设备接入网关</p>
                <p>3、创建产品，并选中接入方式为{name}</p>
                <p>4、添加设备，单独为每一个设备进行数据点绑定</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default Media;
