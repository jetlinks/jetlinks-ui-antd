import { UploadImage } from '@/components';
import { Col, Form, Input, Row, Select } from 'antd';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useModel } from '@@/plugin-model/useModel';
import { service } from '../index';

interface Props {
  getData?: Function;
}

const Basis = forwardRef((props: Props, ref) => {
  const [form] = Form.useForm();
  const { initialState, setInitialState } = useModel<any>('@@initialState');

  const saveData = () => {
    return new Promise(async (resolve) => {
      const formData = await form.validateFields().catch(() => {
        resolve(false);
      });
      if (formData) {
        const item = [
          {
            scope: 'front',
            properties: {
              ...formData,
              apikey: '',
              basePath: '',
            },
          },
          {
            scope: 'amap',
            properties: {
              api: formData.apikey,
            },
          },
          {
            scope: 'paths',
            properties: {
              basePath: formData.basePath,
            },
          },
        ];
        const res = await service.save(item);
        if (res.status === 200) {
          resolve(true);
          setInitialState({
            ...initialState,
            settings: {
              ...initialState?.settings,
              logo: formData.logo,
              title: formData.title,
            },
          });
          const ico: any = document.querySelector('link[rel="icon"]');
          if (ico !== null) {
            ico.href = formData.ico;
          }
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  };

  useImperativeHandle(ref, () => ({
    save: saveData,
  }));

  useEffect(() => {
    if (props.getData) {
      props.getData(form);
    }
  }, []);

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{
        logo: require('/public/logo.png'),
        ico: require('/public/favicon.ico'),
        backgroud: require('/public/images/login.png'),
        apikey: '',
      }}
    >
      <Row gutter={[24, 24]}>
        <Col span={10}>
          <Form.Item
            label="系统名称"
            name="title"
            rules={[{ max: 64, message: '最多可输入64个字符' }]}
          >
            <Input placeholder={'请输入系统名称'} />
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
          <Form.Item label="高德API Key" name="apikey" tooltip="配置后平台可调用高德地图GIS服务">
            <Input placeholder={'请输入高德API Key'} />
          </Form.Item>
          <Form.Item
            label="base-path"
            name="basePath"
            tooltip="系统后台访问的url"
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
                    <div>支持jpg,png</div>
                  </>
                }
              >
                <UploadImage />
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
                <UploadImage size={1} types={['image/x-icon']} backgroundSize={'inherit'} />
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
                <div>支持4M以内的图片:支持jpg、png</div>
                <div>建议尺寸1400x1080</div>
              </>
            }
          >
            <UploadImage size={4} style={{ width: 570, height: 415 }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});
export default Basis;
