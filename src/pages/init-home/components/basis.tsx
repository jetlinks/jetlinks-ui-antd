import { UploadImage } from '@/components';
import { Col, Form, Input, Row, Select } from 'antd';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { service } from '../index'

interface Props {
  getData?: Function;
}

const Basis = forwardRef((props: Props, ref) => {
  const [form] = Form.useForm();

  const saveData = () => {
    return new Promise(async resolve => {
      const formData = await form.validateFields().catch(() => {
        resolve(false)
      })
      if (formData) {
        const item = [
          {
            scope: 'basis',
            properties: {
              ...formData,
              apikey: '',
            },
          },
          {
            scope: 'api',
            properties: {
              api: formData.apikey,
            },
          },
        ];
        const res = await service.save(item)
        if (res.status === 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      } else {
        resolve(false)
      }
    })
  }

  useImperativeHandle(ref, () => ({
    save: saveData
  }))

  useEffect(() => {
    if (props.getData) {
      props.getData(form);
    }
  }, []);

  return (
    <Form layout="vertical" form={form}>
      <Row gutter={[24, 24]}>
        <Col span={10}>
          <Form.Item label="系统名称" name="title">
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
