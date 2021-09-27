import { observer } from '@formily/react';
import type { TableColumnsType } from 'antd';
import { Button, Checkbox, Col, Form, Input, Row, Select, Table } from 'antd';
import Service from '@/pages/system/User/Authorization/service';
import { useEffect } from 'react';
import { model } from '@formily/reactive';
import encodeQuery from '@/utils/encodeQuery';
import { map, scan, takeLast } from 'rxjs/operators';
import db from '@/pages/system/User/Authorization/db';
import { toArray } from 'rxjs';

const service = new Service();

const AuthorizationModel = model<{
  data: PermissionItem[];
  checkedPermission: Map<string, Set<string>>;
}>({
  data: [],
  checkedPermission: new Map(),
});
const Authorization = observer(() => {
  const [form] = Form.useForm();
  useEffect(() => {
    service
      .getPermission()
      .pipe(
        map((item) => {
          const type = item.properties?.type;
          return { ...item, type };
        }),
        toArray(),
      )
      .subscribe(async (permission: any) => {
        db.table('permission').clear();
        db.table('permission').bulkAdd(permission);
        AuthorizationModel.data = await db.table('permission').reverse().sortBy('name');
      });
    service
      .getAutzSetting(
        encodeQuery({
          paging: false,
          terms: {
            dimensionTarget: '11f0075aa18835be6217f52902985c75',
          },
        }),
      )
      .pipe(
        map((item: AuthorizationItem) => ({ key: item.permission, actions: item.actions })),
        scan((result, value) => {
          // eslint-disable-next-line no-param-reassign
          result[value.key] = value.actions.map((ac) => `${value.key}@${ac}`);
          return result;
        }, {}),
        takeLast(1),
      )
      .subscribe((data) => {
        form.setFieldsValue(data);
      });
  }, []);

  const columns: TableColumnsType<PermissionItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '权限操作',
      dataIndex: 'actions',
      render: (text: { action: string; name: string; id: string }[], record) => (
        <Form.Item name={record.id}>
          <Checkbox.Group
            name={record.id}
            onChange={(data) => {
              AuthorizationModel.checkedPermission.set(
                record.id,
                new Set<string>(data as string[]),
              );
            }}
            options={text.map((item) => ({
              label: item.name,
              value: `${record.id}@${item.action}`,
              key: item.id,
            }))}
          />
        </Form.Item>
      ),
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      render: (text, record) => (
        <>
          <Checkbox
            onChange={(e) => {
              form.setFieldsValue({
                [record.id]: e.target.checked
                  ? record.actions.map((item) => `${record.id}@${item.action}`)
                  : [],
              });
            }}
          >
            全选
          </Checkbox>
        </>
      ),
    },
  ];
  return (
    <>
      <Form
        onFinish={(data) => {
          console.log(data, 'd');
        }}
        size={'small'}
        form={form}
        wrapperCol={{ span: 20 }}
        labelCol={{ span: 2 }}
      >
        <Form.Item label="被授权主体">
          <Select mode="multiple" />
        </Form.Item>
        <Form.Item label="筛选权限">
          <Input.Group>
            <Row>
              <Col span={4}>
                <Select
                  onSelect={async (value: string) => {
                    AuthorizationModel.data = await db
                      .table('permission')
                      .filter((item) =>
                        value === 'all' ? item : (item.type || []).includes(value),
                      )
                      .distinct()
                      .reverse()
                      .sortBy('name');
                  }}
                  style={{ width: '100%' }}
                  options={[
                    { label: '全部', value: 'all' },
                    { label: '默认', value: 'default' },
                    { label: '系统', value: 'system' },
                    { label: '业务功能', value: 'business' },
                    { label: 'OpenAPI', value: 'open-api' },
                    { label: '多租户', value: 'tenant' },
                  ]}
                />
              </Col>
              <Col span={20}>
                <Input.Search
                  placeholder="请输入权限名称"
                  onSearch={async (value) => {
                    AuthorizationModel.data = await db
                      .table('permission')
                      .where('name')
                      .startsWith(value)
                      .distinct()
                      .reverse()
                      .sortBy('name');
                  }}
                />
              </Col>
            </Row>
          </Input.Group>
        </Form.Item>
        <Table
          style={{ height: '75vh', overflow: 'auto' }}
          size={'small'}
          rowKey="id"
          pagination={false}
          columns={columns}
          dataSource={AuthorizationModel.data}
        />
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
          onClick={async () => {
            // props.close();
          }}
          style={{ marginRight: 8 }}
        >
          关闭
        </Button>
        <Button onClick={form.submit} type="primary">
          保存
        </Button>
      </div>
    </>
  );
});

export default Authorization;
