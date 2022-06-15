import { Card, Form, Input, message, Select, Upload } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { useEffect, useState } from 'react';
import usePermissions from '@/hooks/permission';
import { PermissionButton } from '@/components';
import { UploadProps } from 'antd/lib/upload';
import Token from '@/utils/token';
import SystemConst from '@/utils/const';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import Service from './service';
import { useDomFullHeight } from '@/hooks';

const Basis = () => {
  const service = new Service();
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { permission: userPermission } = usePermissions('system/Basis');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { minHeight } = useDomFullHeight(`.basis`);

  const uploadProps: UploadProps = {
    showUploadList: false,
    listType: 'picture-card',
    accept: 'image/jpeg,image/png',
    action: `/${SystemConst.API_BASE}/file/static`,
    headers: {
      'X-Access-Token': Token.get(),
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('请上传.png.jpg格式的文件');
      }
      return isJpgOrPng;
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setLoading(true);
      }
      if (info.file.status === 'done') {
        setImageUrl(info.file.response.result);
        setLoading(false);
      }
    },
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const detail = async (data: any) => {
    const res = await service.detail(data);
    if (res.status === 200) {
      const basis = res.result?.filter((item: any) => item.scope === 'basis');
      const api = res?.result.filter((item: any) => item.scope === 'api');
      localStorage.setItem(SystemConst.AMAP_KEY, api[0].properties.api);
      // console.log(basis?.[0])
      setImageUrl(basis[0].properties?.logo);
      form.setFieldsValue({
        title: basis[0].properties.title,
        headerTheme: basis[0].properties.headerTheme,
        apikey: api[0].properties.api,
      });
      setInitialState({
        ...initialState,
        settings: {
          ...basis[0].properties,
        },
      });
    }
  };
  const save = async () => {
    const formData = await form.validateFields();
    if (formData && imageUrl !== '') {
      const item = [
        {
          scope: 'basis',
          properties: {
            title: formData.title,
            headerTheme: formData.headerTheme,
            navTheme: formData.headerTheme,
            logo: imageUrl,
          },
        },
        {
          scope: 'api',
          properties: {
            api: formData.apikey,
          },
        },
      ];
      const res = await service.save(item);
      if (res.status === 200) {
        message.success('保存成功');
        detail(['basis', 'api']);
      }
    } else {
      message.error('请上传图片');
    }
  };

  useEffect(() => {
    detail(['basis', 'api']);
  }, []);

  return (
    <PageContainer>
      <Card className="basis" style={{ minHeight }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          }}
        >
          <div style={{ width: 400 }}>
            <Form layout="vertical" form={form}>
              <Form.Item
                label="系统名称"
                name="title"
                rules={[{ required: true, message: '请输入系统名称' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="主题色"
                name="headerTheme"
                rules={[{ required: true, message: '请选择主题色' }]}
              >
                <Select>
                  <Select.Option value="light">白色</Select.Option>
                  <Select.Option value="dark">黑色</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="高德API Key"
                name="apikey"
                tooltip="配置后平台可调用高德地图GIS服务"
              >
                <Input />
              </Form.Item>
            </Form>
          </div>
          <div className={styles.content}>
            <div style={{ marginBottom: 8, display: 'flex' }}>
              系统logo
              <div className={styles.text}></div>
            </div>
            <Upload {...uploadProps}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  onError={() => {
                    setImageUrl(require('/public/images/img-miss.png'));
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          <div style={{ paddingTop: 215, color: '#a2a5a7' }}>推荐分辨率200*200</div>
        </div>
        <div>
          <PermissionButton
            type="primary"
            key="basis"
            onClick={async () => {
              save();
            }}
            isPermission={userPermission.update}
          >
            保存
          </PermissionButton>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Basis;
