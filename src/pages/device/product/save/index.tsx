import React, {useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {
  Avatar,
  Button,
  Card,
  Cascader,
  Col,
  Drawer,
  Icon,
  Input,
  message,
  Radio,
  Row,
  Select,
  Tooltip,
  TreeSelect,
  Upload,
} from 'antd';
import {DeviceProduct} from '../data';
import {FormItemConfig} from '@/utils/common';
import apis from '@/services';
import styles from '@/pages/device/product/save/style.less';
import productImg from '@/pages/device/product/img/product.png';
import {UploadProps} from 'antd/lib/upload';
import {getAccessToken} from '@/utils/authority';
import {UploadOutlined} from '@ant-design/icons/lib';
import {ProtocolItem} from '@/pages/device/protocol/data';
import Classified from '@/pages/device/product/save/add/classified';
import encodeQueryParam from "@/utils/encodeParam";
import treeTool from 'tree-tool';

interface Props extends FormComponentProps {
  data: Partial<DeviceProduct>;
  close: Function;
  save: (data: Partial<DeviceProduct>) => void;
}

interface State {
  protocolSupports: any[];
  protocolTransports: any[];
  organizationList: any[];
  categoryLIst: any[];
  classifiedData: any;
  storagePolicy: string;
}

const Save: React.FC<Props> = props => {
  const initState: State = {
    protocolSupports: [],
    protocolTransports: [],
    organizationList: [],
    categoryLIst: [],
    classifiedData: {},
    storagePolicy: '',
  };

  const { getFieldDecorator, setFieldsValue } = props.form;
  // 消息协议
  const [protocolSupports, setProtocolSupports] = useState(initState.protocolSupports);
  // 消息协议
  const [organizationList, setOrganizationList] = useState(initState.organizationList);
  // 传输协议
  const [protocolTransports, setProtocolTransports] = useState(initState.protocolTransports);
  const [categoryLIst, setCategoryLIst] = useState(initState.categoryLIst);
  const [photoUrl, setPhotoUrl] = useState(props.data?.photoUrl);
  const [classifiedVisible, setClassifiedVisible] = useState(false);
  const [classifiedData, setClassifiedData] = useState(initState.classifiedData);

  const [storagePolicy, setStoragePolicy] = useState<any[]>([]);
  const [checkStorage, setCheckStorage] = useState<any>(initState.storagePolicy);
  const onMessageProtocolChange = (value: string) => {
    // 获取链接协议
    apis.deviceProdcut
      .protocolTransports(value)
      .then(e => {
        if (e.status === 200) {
          setProtocolTransports(e.result);
        }
      })
      .catch(() => {});
  };

  const setCategory = (list:any) =>{
    let idList: string[] = [];
    const pathList = treeTool.findPath(list, function (n: any) {
      return n.id == props.data.classifiedId
    }); // pathList所有父级data组成的
    if (pathList != null && pathList.length > 0) {
      idList = pathList.map((n: any) => n.id);// idList即为所求的上级所有ID
    }
    setFieldsValue({classifiedId: idList});
  };

  useEffect(() => {

    apis.deviceProdcut
      .protocolSupport()
      .then(e => {
        if (e.status === 200) {
          setProtocolSupports(e.result);
        }
      })
      .catch(() => {});

    apis.deviceProdcut
      .queryOrganization()
      .then((res: any) => {
        if (res.status === 200) {
          let orgList: any = [];
          res.result.map((item: any) => {
            orgList.push({ id: item.id, pId: item.parentId, value: item.id, title: item.name });
          });
          setOrganizationList(orgList);
        }
      })
      .catch(() => {});


    apis.deviceProdcut
      .deviceCategoryTree(encodeQueryParam({paging: false, sorts: {field: 'id', order: 'desc'}}))
      .then((response: any) => {
        if (response.status === 200) {
          setCategoryLIst(response.result);
          setCategory(response.result);
        }
      })
      .catch(() => {
      });

    // if (systemVersion === 'pro') {
    apis.deviceProdcut.storagePolicy().then(res => {
      if (res.status === 200) {
        setStoragePolicy(res.result);
      }
    });
    // }

    if (props.data && props.data.messageProtocol) {
      onMessageProtocolChange(props.data.messageProtocol);
    }
  }, []);

  const basicForm: FormItemConfig[] = [
    {
      label: '产品ID',
      key: 'id',
      styles: {
        lg: { span: 8 },
        md: { span: 12 },
        sm: { span: 24 },
      },
      options: {
        initialValue: props.data?.id,
        rules: [{ required: true, message: '请输入产品ID' }],
      },

      component: <Input placeholder="请输入产品ID " disabled={!!props.data?.id} />,
    },
    {
      label: '产品名称',
      key: 'name',
      options: {
        rules: [{ required: true, message: '请选择产品名称' }],
        initialValue: props.data?.name,
      },
      styles: {
        xl: { span: 8 },
        lg: { span: 8 },
        md: { span: 12 },
        sm: { span: 24 },
      },
      component: <Input style={{ width: '100%' }} placeholder="请输入" />,
    },
    {
      label: '所属品类',
      key: 'classifiedId',
      options: {
        rules: [{ required: true, message: '请选择所属品类' }],
      },
      styles: {
        xl: { span: 8 },
        lg: { span: 8 },
        md: { span: 12 },
        sm: { span: 24 },
      },
      component: (
        <Cascader
          fieldNames={{ label: 'name', value: 'id', children: 'children' }}
          options={categoryLIst}
          popupVisible={false}
          onChange={value => {
            if (value.length === 0) {
              setClassifiedData({});
            }
          }}
          onClick={() => {
            setClassifiedVisible(true);
          }}
          placeholder="点击选择品类"
        />
      ),
    },
    {
      label: '所属机构',
      key: 'orgId',
      options: {
        initialValue: props.data?.orgId,
      },
      styles: {
        xl: { span: 8 },
        lg: { span: 10 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: (
        <TreeSelect
          allowClear
          treeDataSimpleMode
          showSearch
          placeholder="所属机构"
          treeData={organizationList}
          treeNodeFilterProp="title"
          searchPlaceholder="根据机构名称模糊查询"
        />
      ),
    },
    {
      label: '消息协议',
      key: 'messageProtocol',
      options: {
        rules: [{ required: true, message: '请选择消息协议' }],
        initialValue: props.data?.messageProtocol,
      },
      styles: {
        xl: { span: 8 },
        lg: { span: 8 },
        md: { span: 12 },
        sm: { span: 24 },
      },
      component: (
        <Select
          placeholder="请选择"
          onChange={(value: string) => {
            onMessageProtocolChange(value);
          }}
        >
          {protocolSupports.map(e => (
            <Select.Option value={e.id} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },

    {
      label: '传输协议',
      key: 'transportProtocol',
      options: {
        rules: [{ required: true, message: '请选择传输协议' }],
        initialValue: props.data?.transportProtocol,
      },
      styles: {
        xl: { span: 8 },
        lg: { span: 10 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: (
        <Select placeholder="请选择">
          {protocolTransports.map(e => (
            <Select.Option value={e.id} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: (
        <span>
          存储策略&nbsp;
          <Tooltip
            title={
              checkStorage.description
                ? checkStorage.description
                : '使用指定的存储策略来存储设备数据'
            }
          >
            <Icon type="question-circle-o" />
          </Tooltip>
        </span>
      ),
      key: 'storePolicy',
      options: {
        initialValue: props.data?.storePolicy,
      },
      styles: {
        xl: { span: 8 },
        lg: { span: 10 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      component: (
        <Select
          onChange={e => setCheckStorage(storagePolicy.find(i => i.id === e))}
          placeholder="请选择"
        >
          {storagePolicy.map(e => (
            <Select.Option value={e.id} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      label: '设备类型',
      key: 'deviceType',
      options: {
        rules: [{ required: true, message: '请选择设备类型' }],
        initialValue:
          typeof props.data?.deviceType === 'string'
            ? props.data?.deviceType
            : (props.data?.deviceType || {}).value,
      },
      styles: {
        lg: { span: 8 },
        md: { span: 12 },
        sm: { span: 24 },
      },
      component: (
        <Radio.Group>
          <Radio value="device">直连设备</Radio>
          <Radio value="childrenDevice">网关子设备</Radio>
          <Radio value="gateway">网关设备</Radio>
        </Radio.Group>
      ),
    },
    {
      label: '描述',
      key: 'describe',
      styles: {
        xl: { span: 24 },
        lg: { span: 24 },
        md: { span: 24 },
        sm: { span: 24 },
      },
      options: {
        initialValue: props.data?.describe,
      },
      component: <Input.TextArea rows={3} placeholder="请输入描述" />,
    },
  ];

  const saveData = () => {
    const { form } = props;
    form.validateFields((err, fileValue) => {
      if (err) return;
      if (!fileValue.orgId) {
        fileValue.orgId = '';
      }
      const protocol: Partial<ProtocolItem> =
        protocolSupports.find(i => i.id === fileValue.messageProtocol) || {};

      props.save({
        ...fileValue,
        photoUrl,
        protocolName: protocol.name,
        classifiedId: classifiedData.id,
        classifiedName: classifiedData.name,
      });
    });
  };

  const uploadProps: UploadProps = {
    action: '/jetlinks/file/upload',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        setPhotoUrl(info.file.response.result?.id);
        message.success('上传成功');
      }
    },
  };

  return (
    <Drawer
      visible
      title={`${props.data?.id ? '编辑' : '新增'}产品`}
      width={500}
      onClose={() => props.close()}
      closable
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Card title="基本信息" style={{ marginBottom: 20 }} bordered={false}>
          <Form.Item label="图标">
            <>
              <div className={styles.avatar}>
                <Avatar size={80} src={(photoUrl || props.data?.photoUrl) ? `/jetlinks/file/${photoUrl || props.data?.photoUrl}?:X_Access_Token=${getAccessToken()}` : productImg} />
              </div>
              <Upload {...uploadProps} showUploadList={false}>
                <Button>
                  <UploadOutlined />
                  更换图片
                </Button>
              </Upload>
            </>
          </Form.Item>
          <Row gutter={16}>
            {basicForm.map(item => (
              <Col key={item.key}>
                <Form.Item label={item.label}>
                  {getFieldDecorator(item.key, item.options)(item.component)}
                </Form.Item>
              </Col>
            ))}
            {/* {(systemVersion === 'pro' ? basicForm : basicForm.filter(i => i.key !== 'storePolicy')).map(item => (
              <Col
                key={item.key}
              >
                <Form.Item label={item.label}>
                  {getFieldDecorator(item.key, item.options)(item.component)}
                </Form.Item>
              </Col>
            ))} */}
          </Row>
        </Card>
      </Form>

      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            props.close();
          }}
          style={{ marginRight: 8 }}
        >
          关闭
        </Button>
        <Button
          onClick={() => {
            saveData();
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
      {classifiedVisible && (
        <Classified
          choice={(item: any) => {
            const categoryId = item.categoryId;
            setFieldsValue({ classifiedId: categoryId });
            setClassifiedData(item);
            setClassifiedVisible(false);
          }}
          close={() => {
            setClassifiedVisible(false);
          }}
          data={classifiedData}
        />
      )}
    </Drawer>
  );
};

export default Form.create<Props>()(Save);
