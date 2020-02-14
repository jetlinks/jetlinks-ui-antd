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
    emailEditor: null,
    fileList: [],
  };
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const [item, setItem] = useState(initState.item);
  const [typeList, setTypeList] = useState(initState.typeList);
  const [emailEditor, setEmailEditor] = useState(initState.emailEditor);
  const [fileList, setFileList] = useState(initState.fileList);

  const uploadProps: UploadProps = {
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    // showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        fileList.push({
          id: info.file.uid,
          name: info.file.name,
          location: info.file.response.result,
        });
        setFileList([...fileList]);
      }
    },
    onRemove(info) {
      const list = fileList.filter(e => e !== info.uid);
      setFileList([...list]);
    },
  };

  useEffect(() => {
    if (item.id) {
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

  const renderConfig = () => {
    const { type } = item;
    const template = item.template ? JSON.parse(item.template) : {};
    switch (type) {
      case 'sms':
        return (
          <div>
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
          </div>
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
                initialValue: template.message,
              })(<Input.TextArea rows={3} />)}
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };
  const saveData = () => {
    const id = props.data?.id;
    const data = form.getFieldsValue();
    const { template } = data;
    if (data.type === 'email') {
      template.sendTo = (template.sendTo || '').split(',');
      if (emailEditor !== null) {
        template.text = emailEditor.toHTML();
      }
      template.attachments = fileList;
      // 附件列表
    }
    data.template = JSON.stringify(data.template);
    props.save({ ...data, id });
  };

  return (
    <Modal
      visible
      title="编辑通知模版"
      onCancel={() => props.close()}
      onOk={() => {
        saveData();
      }}
      width={800}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="模版名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入模版名称' }],
            initialValue: item.name,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="通知类型">
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
        <Form.Item label="服务商">
          {getFieldDecorator('provider', {
            rules: [{ required: true, message: '请选择服务商' }],
            initialValue: item.provider,
          })(
            <Select>
              {(typeList.find(i => i.id === item.type)?.providerInfos || []).map((e: any) => (
                <Select.Option key={e.id} value={e.id}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        {renderConfig()}
      </Form>
    </Modal>
  );
};

export default Form.create<Props>()(Save);
