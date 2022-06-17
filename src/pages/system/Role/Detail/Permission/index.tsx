import { Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import Allocate from '@/pages/system/Role/Detail/Permission/Allocate';
import { useEffect, useState } from 'react';
import { history, useParams } from 'umi';
import { service } from '@/pages/system/Role';
import { flattenArray, onlyMessage } from '@/utils/util';
import TitleComponent from '@/components/TitleComponent';

const Permission = () => {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [data, setData] = useState<RoleItem>();
  const [spinning, setSpinning] = useState<boolean>(true);
  const getDetail = async (id: string) => {
    setSpinning(true);
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
        setSpinning(false);
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
      return data1
        .filter(
          (i) =>
            i.check === 1 ||
            (i?.buttons || []).filter((it: any) => it.granted).length > 0 ||
            (i?.assetAccesses).filter((it: any) => it.granted).length > 0,
        )
        .map((item) => {
          const check = item.check;
          delete item.check;
          return {
            ...item,
            granted:
              check === 1 || (item?.buttons || []).filter((it: any) => it.granted).length > 0,
            children: item?.children,
          };
        });
    }
    return [];
  };

  return (
    <Spin spinning={spinning}>
      <Form
        layout="vertical"
        form={form}
        onFinish={async (values: any) => {
          await service.update({
            ...data,
            name: values?.name,
            description: values?.description || '',
          });
          const list = getDataList(flattenArray([...values.permission?.children]) || []) || [];
          service
            .saveGrantTree('role', params?.id, {
              menus: list || [],
            })
            .subscribe((resp) => {
              if (resp.status === 200) {
                onlyMessage('操作成功');
                history.goBack();
              }
            });
        }}
      >
        <Card>
          <TitleComponent data={'基本信息'} />
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
          <TitleComponent data={'权限分配'} />
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
    </Spin>
  );
};

export default Permission;
