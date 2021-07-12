import {
  Modal,
  Form,
  Input,
  Tooltip,
  InputNumber,
  Radio,
  Select,
  Upload,
  Icon,
  Button,
  Row,
  Col,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/es/form';
import apis from '@/services';
import { getAccessToken } from '@/utils/authority';
import { UploadProps } from 'antd/lib/upload';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from '../../index.less';

interface Props extends FormComponentProps {
  data: any;
  close: Function;
  save: Function;
}

interface State {
  item: any;
  typeList: any[];
  emailEditor: any;
  fileList: any[];
}

const Save: React.FC<Props> = props => {
  const initState: State = {
    item: props.data,
    typeList: [],
    emailEditor: BraftEditor.createEditorState(
      (props.data.template && JSON.parse(props.data.template).text) || null,
    ),
    fileList: (props.data.template && JSON.parse(props.data.template).attachments) || [],
  };
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const [item, setItem] = useState(initState.item);
  const [typeList, setTypeList] = useState(initState.typeList);
  const [emailEditor, setEmailEditor] = useState(initState.emailEditor);
  const [fileList, setFileList] = useState(initState.fileList);
  const [provider, setProvider] = useState<string>('');

  const uploadProps: UploadProps = {
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    defaultFileList: (props.data.template && JSON.parse(props.data.template).attachments) || [],
    // showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        let url = info.file.response.result;
        delete info.file.response;
        const tempFile: any = info.file;
        tempFile.location = url;
        fileList.push(tempFile);
        setFileList([...fileList]);
      }
    },
    onRemove(info) {
      const list = fileList.filter(e => e.uid !== info.uid);

      setFileList([...list]);
    },
  };

  useEffect(() => {
    if (item.id) {
      setProvider(item.provider);
      apis.notifier.queryById(item.id).then(res => {
        if (res) {
          setItem(res.result);
        }
      });
    }
    apis.notifier.configType().then((res: any) => {
      if (res) {
        setTypeList(res.result);
      }
    });
  }, []);

  const smsProvider = () => {
    const template = item.template ? JSON.parse(item.template) : {};
    switch (provider) {
      case 'test':
        return (
          <>
            <Form.Item label="短信内容">
              {getFieldDecorator('template.text', {
                initialValue: template.text,
              })(<Input.TextArea rows={3} />)}
            </Form.Item>
            <Form.Item label="收件人">
              <Tooltip title="多个收件人以  ,  分隔">
                {getFieldDecorator('template.sendTo', {
                  initialValue: template.sendTo,
                })(<Input.TextArea rows={3} placeholder="多个收件人以  ,  分隔" />)}
              </Tooltip>
            </Form.Item>
          </>
        );
      case 'aliyunSms':
        return (
          <>
            <Row>
              <Col span={12}>
                <Form.Item label="模板编码" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('template.code', {
                    rules: [{ required: true, message: '请输入模板编码' }],
                    initialValue: template.code,
                  })(<Input placeholder='阿里云短信模板编码' />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="签名" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('template.signName', {
                    rules: [{ required: true, message: '请输入签名信息' }],
                    initialValue: template.signName,
                  })(<Input placeholder='阿里云短信模板签名' />)}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="收件人">
              <Tooltip title="暂只支持单个联系人">
                {getFieldDecorator('template.phoneNumber', {
                  rules: [{ required: true, message: '请输入收件人' }],
                  initialValue: template.phoneNumber,
                })(<Input placeholder='短信接收者，暂只支持单个联系人' />)}
              </Tooltip>
            </Form.Item>
          </>
        );
      default:
        return;
    }
  };

  const renderConfig = () => {
    const { type } = item;
    const template = item.template ? JSON.parse(item.template) : {};
    const typeMap = new Map();
    typeMap.set('HTTP_CLIENT', 'POST http://[host]:[port]/api\nContent-Type: application/json\n\n${T(com.alibaba.fastjson.JSON).toJSONString(#this)}');
    typeMap.set('MQTT_CLIENT', 'qos1 /device/${#deviceId}\n\n${T(com.alibaba.fastjson.JSON).toJSONString(#this)}');
    switch (type) {
      case 'sms':
        return (
          <>
            {smsProvider()}
          </>
        );
      case 'voice':
        return (
          <div>
            <Form.Item label="模版ID">
              {getFieldDecorator('template.ttsCode', {
                initialValue: template.ttsCode,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="被叫显号">
              {getFieldDecorator('template.calledShowNumbers', {
                initialValue: template.calledShowNumbers,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="被叫号码">
              {getFieldDecorator('template.CalledNumber', {
                initialValue: template.CalledNumber,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="播放次数">
              {getFieldDecorator('template.PlayTimes', {
                initialValue: template.PlayTimes,
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        );
      case 'email':
        return (
          <div>
            <Form.Item label="标题">
              {getFieldDecorator('template.subject', {
                initialValue: template.subject,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="收件人">
              <Tooltip title="多个收件人以  ,  分隔">
                {getFieldDecorator('template.sendTo', {
                  initialValue: template.sendTo,
                })(<Input.TextArea rows={3} placeholder="多个收件人以  ,  分隔" />)}
              </Tooltip>
            </Form.Item>
            <Form.Item label="附件">
              <Upload {...uploadProps}>
                <Button>
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item label="正文">
              <BraftEditor
                className={styles.emailEditor}
                value={emailEditor}
                onChange={e => {
                  setEmailEditor(e);
                }}
              />
            </Form.Item>
          </div>
        );
      case 'weixin':
        return (
          <div>
            <Form.Item label="应用ID">
              {getFieldDecorator('template.agentId', {
                initialValue: template.agentId,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="收信人ID">
              {getFieldDecorator('template.toUser', {
                initialValue: template.toUser,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="收信部门ID">
              {getFieldDecorator('template.toParty', {
                initialValue: template.toParty,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="按标签推送">
              {getFieldDecorator('template.toTag', {
                initialValue: template.toTag,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="内容">
              {getFieldDecorator('template.message', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: template.message,
              })(<Input.TextArea rows={3} />)}
            </Form.Item>
          </div>
        );
      case 'dingTalk':
        return (
          <div>
            <Form.Item label="应用ID">
              {getFieldDecorator('template.agentId', {
                initialValue: template.agentId,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="收信人ID">
              {getFieldDecorator('template.userIdList', {
                initialValue: template.userIdList,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="收信部门ID">
              {getFieldDecorator('template.departmentIdList', {
                initialValue: template.departmentIdList,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="全部用户">
              {getFieldDecorator('template.toAllUser', {
                initialValue: template.toAllUser,
              })(
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="true">是</Radio.Button>
                  <Radio.Button value="false">否</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="内容">
              {getFieldDecorator('template.message', {
                rules: [{ required: true, message: '请输入' }],
                initialValue: template.message,
              })(<Input.TextArea rows={3} />)}
            </Form.Item>
          </div>
        );
      case 'network':
        return (
          <div>
            <Form.Item label="消息">
              {getFieldDecorator('template.text', {
                initialValue: template.text || typeMap.get(provider) || '',
              })(<Input.TextArea rows={6} />)}
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };
  const saveData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      const id = props.data?.id;
      // const data = form.getFieldsValue();
      const { template } = fileValue;
      if (fileValue.type === 'email') {
        if (typeof template.sendTo === 'string') {
          template.sendTo = template.sendTo.split(',');
        }
        if (emailEditor !== null) {
          template.text = emailEditor.toHTML();
        }

        template.attachments = fileList;
        // 附件列表
      }
      fileValue.template = JSON.stringify(fileValue.template);
      props.save({ ...fileValue, id });
    });
  };

  return (
    <Modal
      visible
      title={props.data?.id ? "编辑通知模版" : '新建通知模版'}
      onCancel={() => props.close()}
      onOk={() => {
        saveData();
      }}
      width={1000}
    >
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
        <Form.Item label="模版名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入模版名称' }],
            initialValue: item.name,
          })(<Input />)}
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item label="通知类型" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '请输入通知类型' }],
                initialValue: item.type,
              })(
                <Select onChange={e => setItem({ type: e })}>
                  {typeList.map(i => (
                    <Select.Option key={i.id} value={i.id}>
                      {i.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="服务商" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              {getFieldDecorator('provider', {
                rules: [{ required: true, message: '请选择服务商' }],
                initialValue: item.provider,
              })(
                <Select onChange={e => setProvider(e)}>
                  {(typeList.find(i => i.id === item.type)?.providerInfos || []).map((e: any) => (
                    <Select.Option key={e.id} value={e.id}>
                      {e.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        {renderConfig()}
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
