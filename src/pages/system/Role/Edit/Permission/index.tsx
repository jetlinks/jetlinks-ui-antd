import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import Allocate from '@/pages/system/Role/Edit/Permission/Allocate';
import { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import { service } from '@/pages/system/Role';
import styles from './index.less';

const Permission = () => {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [data, setData] = useState<RoleItem>();
  const getDetail = async (id: string) => {
    const res = await service.detail(id);
    if (res.status === 200) {
      setData(res.result);
      service.queryGrantTree('role', id).subscribe((resp) => {
        if (resp.status === 200) {
          form.setFieldsValue({
            ...res.result,
            permission: {
              id: 'menu-permission',
              buttons: [],
              name: '菜单权限',
              children: [...resp.result],
            },
          });
        }
      });
    }
  };

  useEffect(() => {
    const { id } = params;
    if (id) {
      getDetail(id);
    } else {
      history.goBack();
    }
  }, [params, params.id]);

  const getDataList: any = (data1: any[]) => {
    if (Array.isArray(data1) && data1.length > 0) {
      return data1.map((item) => {
        const check = item.check;
        delete item.check;
        return {
          ...item,
          granted: check !== 3,
          children: item?.children ? getDataList(item.children) : [],
        };
      });
    }
    return [];
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={async (values: any) => {
        await service.update({
          ...data,
          name: values?.name,
          description: values?.description || '',
        });
        service
          .saveGrantTree('role', params?.id, {
            menus: getDataList([...values.permission?.children]),
          })
          .subscribe((resp) => {
            if (resp.status === 200) {
              message.success('操作成功');
            }
          });
      }}
    >
      <Card>
        <div className={styles.title}>基本信息</div>
        <Row>
          <Col span={14}>
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item label="说明" name="description">
              <Input.TextArea showCount maxLength={200} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Card style={{ marginTop: 20 }}>
        <div className={styles.title}>权限分配</div>
        <Form.Item name="permission" rules={[{ required: true }]}>
          <Allocate />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
};

export default Permission;
