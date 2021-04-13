import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, Upload, message, Tag, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd/lib/upload';
import moment from 'moment';
import styles from './index.less';
import { getAccessToken } from '@/utils/authority';
import { TenantItem } from '../../data';
import Service from '../../service';
import defaultimg from '@/assets/default.png';

interface Props extends FormComponentProps {
  data: Partial<TenantItem>;
}
const BasicInfo = (props: Props) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);

  const [photo, setPhoto] = useState(data?.photo);
  const {
    form: { getFieldDecorator, getFieldsValue },
  } = props;
  const service = new Service('tenant');
  const uploadProps: UploadProps = {
    // accept: ,
    action: '/jetlinks/file/static',
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'uploading') {
        setLoading(true);
      }
      if (info.file.status === 'done') {
        setPhoto(info.file.response.result);
        message.success('上传成功');
        setLoading(false);
      }
    },
  };

  const updateInfo = () => {
    setLoading(true);
    const temp = getFieldsValue();
    service.update({ ...data, ...temp, photo }).subscribe(
      response => {
        setLoading(false);
      },
      () => {},
      () => message.success('保存成功'),
    );
  };
  const formLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
  };
  return (
    <div className={styles.right}>
      <Spin spinning={loading}>
        <div className={styles.baseView}>
          <div className={styles.left}>
            <Form {...formLayout}>
              <Form.Item label="租户名称">
                {getFieldDecorator('name', {
                  initialValue: data?.name,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="状态">
                <Tag>{data?.state?.text}</Tag>
              </Form.Item>
              <Form.Item label="创建时间">
                {moment(data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </Form.Item>

              <Form.Item label="说明">
                {getFieldDecorator('description', {
                  initialValue: data?.description,
                })(<Input.TextArea placeholder="说明" rows={4} />)}
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ marginLeft: 200 }}
                  htmlType="submit"
                  type="primary"
                  onClick={updateInfo}
                >
                  更新基本信息
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles.right}>
            <>
              <div className={styles.avatar_title}>头像</div>
              <div className={styles.avatar}>
                <img src={photo || data?.photo || defaultimg} alt="avatar" />
              </div>
              <Upload {...uploadProps} showUploadList={false}>
                <div className={styles.button_view}>
                  <Button>
                    <UploadOutlined />
                    更换图片
                  </Button>
                </div>
              </Upload>
            </>
          </div>
        </div>
      </Spin>
    </div>
  );
};
export default Form.create<Props>()(BasicInfo);
