import { UploadImage } from '@/components';
import { Card, Col, Form, Input, Row, Select } from 'antd';
import Service from './service';
import { useModel } from '@@/plugin-model/useModel';
import usePermissions from '@/hooks/permission';
import { PermissionButton } from '@/components';
import { onlyMessage } from '@/utils/util';
import SystemConst from '@/utils/const';
import { useEffect } from 'react';
import { useDomFullHeight } from '@/hooks';
import { PageContainer } from '@ant-design/pro-layout';

const Basis = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { permission: userPermission } = usePermissions('system/Basis');
  const [form] = Form.useForm();
  const service = new Service();
  const { minHeight } = useDomFullHeight(`.basis`);

  const detail = async (data: any) => {
    const res = await service.detail(data);
    if (res.status === 200) {
      const basis = res.result?.filter((item: any) => item.scope === 'front');
      const api = res.result?.filter((item: any) => item.scope === 'amap');
      const basePath = res.result?.filter((item: any) => item.scope === 'paths');
      localStorage.setItem(SystemConst.AMAP_KEY, api[0].properties.apiKey);
      form.setFieldsValue({
        ...basis[0].properties,
        apiKey: api[0].properties.apiKey,
        'base-path': basePath[0].properties['base-path'],
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
    if (formData) {
      const item = [
        {
          scope: 'front',
          properties: {
            ...formData,
            apiKey: '',
            'base-path': '',
          },
        },
        {
          scope: 'amap',
          properties: {
            apiKey: formData.apiKey,
          },
        },
        {
          scope: 'paths',
          properties: {
            'base-path': formData['base-path'],
          },
          // properties: {
          //   basePath: formData.basePath,
          // },
        },
      ];
      const res = await service.save(item);
      if (res.status === 200) {
        onlyMessage('保存成功');
        detail(['front', 'amap', 'paths']);
      }
    }
  };

  useEffect(() => {
    detail(['front', 'amap', 'paths']);
  }, []);
  return (
    <PageContainer>
      <Card className="basis" style={{ minHeight }}>
        <Form layout="vertical" form={form}>
          <Row gutter={[24, 24]}>
            <Col span={10}>
              <Form.Item
                label="系统名称"
                name="title"
                rules={[
                  { required: true, message: '名称必填' },
                  { max: 64, message: '最多可输入64个字符' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="主题色"
                name="headerTheme"
                initialValue="light"
                rules={[{ required: true, message: '请选择主题色' }]}
              >
                <Select>
                  <Select.Option value="light">白色</Select.Option>
                  <Select.Option value="dark">黑色</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="高德API Key"
                name="apiKey"
                tooltip="配置后平台可调用高德地图GIS服务"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="base-path"
                name="base-path"
                tooltip="访问后台服务器的url"
                required
                rules={[{ required: true, message: 'base-path必填' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Row gutter={[24, 24]}>
                <Col>
                  <Form.Item
                    name={'logo'}
                    label="系统logo"
                    extra={
                      <>
                        <div>推荐尺寸200*200</div>
                        <div>支持jpg,png,jfif,pjp,pjpeg,jpeg</div>
                      </>
                    }
                  >
                    <UploadImage errorMessage={'请上传.jpg.png.jfif.pjp.pjpeg.jpeg格式的图片'} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name={'ico'}
                    label="浏览器页签"
                    tooltip="浏览器tab页中显示的图片元素"
                    extra={
                      <>
                        <div>推荐尺寸64*64</div>
                        <div>支持ico格式</div>
                      </>
                    }
                  >
                    <UploadImage
                      size={1}
                      types={['image/x-icon']}
                      backgroundSize={'inherit'}
                      errorMessage={'请上传ico格式的图片'}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={14}>
              <Form.Item
                name={'backgroud'}
                label="登录背景图"
                extra={
                  <>
                    <div>支持4M以内的图片: 支持jpg,png,jfif,pjp,pjpeg,jpeg</div>
                    <div>建议尺寸1400x1080</div>
                  </>
                }
                rules={[{ required: true, message: '请上传背景图' }]}
              >
                <UploadImage
                  size={4}
                  style={{ width: 570, height: 415 }}
                  errorMessage={'请上传.jpg.png.jfif.pjp.pjpeg.jpeg格式的图片'}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <PermissionButton
          type="primary"
          key="basis"
          onClick={() => {
            save();
          }}
          isPermission={userPermission.update}
        >
          保存
        </PermissionButton>
      </Card>
    </PageContainer>
  );
};

export default Basis;
