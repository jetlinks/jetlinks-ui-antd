import { observer } from '@formily/react';
import type { TableColumnsType } from 'antd';
import { Button, Checkbox, Col, Form, Input, message, Row, Select, Spin, Table } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import encodeQuery from '@/utils/encodeQuery';
import { map, scan, takeLast } from 'rxjs/operators';
import { toArray } from 'rxjs';
import Service from '@/components/Authorization/service';
import styles from './index.less';
import _ from 'lodash';
import { AuthorizationModel } from '@/components/Authorization/autz';
import { useIntl } from '@@/plugin-locale/localeExports';
import DB from '@/db';

const service = new Service();

const permissionType = [
  { label: '全部', value: 'all' },
  { label: '默认', value: 'default' },
  { label: '系统', value: 'system' },
  { label: '业务功能', value: 'business' },
  { label: 'OpenAPI', value: 'open-api' },
  { label: '多租户', value: 'tenant' },
];

const tableName = 'permission';

const Authorization = observer((props: AuthorizationProps) => {
  const [form] = Form.useForm();
  const { target, close } = props;
  const intl = useIntl();
  const calculationSelectAll = useMemo(
    () => (permissionDB: PermissionItem[], data: Record<string, any>) => {
      // 计算是否全选
      const permissionCount = Object.values(data)
        .filter((item) => typeof item !== 'boolean')
        .reduce((acc, cur) => (cur as string[])?.length + (acc as number), 0);
      const autzCount = permissionDB
        .map((item) => item.actions.map((ac) => ac.action))
        .reduce((acc, cur) => (cur as string[])?.length + (acc as number), 0);
      return permissionCount === autzCount;
    },
    [target.id],
  );

  const queryDB = () => DB.getDB().table(tableName).reverse().sortBy('name');

  const insertDB = useCallback(
    async (permission: PermissionItem[]) => {
      DB.getDB().table(tableName).clear();
      DB.getDB().table(tableName).bulkAdd(permission);
      AuthorizationModel.data = await queryDB();
    },
    [AuthorizationModel.data],
  );

  const searchPermission = async (name: string, type: string) => {
    AuthorizationModel.filterParam.name = name;
    AuthorizationModel.filterParam.type = type;
    AuthorizationModel.data = await DB.getDB()
      .table(tableName)
      .where('name')
      .startsWith(name)
      .filter((item) => (type === 'all' ? item : (item.type || []).includes(type)))
      .distinct()
      .reverse()
      .sortBy('name');
  };

  const initAutzInfo = useCallback(async () => {
    if (!target.id) {
      message.error('被授权对象数据缺失!');
      return;
    }
    const permissionDB: PermissionItem[] = await queryDB();
    service
      .getAutzSetting(
        encodeQuery({
          paging: false,
          terms: {
            dimensionTarget: target.id,
          },
        }),
      )
      .pipe(
        map((item: AuthorizationItem) => ({ key: item.permission, actions: item.actions })),
        scan((result, value) => {
          // eslint-disable-next-line no-param-reassign
          result[value.key] = value.actions;
          // 计算是否是全选
          // 总权限数
          const actionCount = permissionDB.find((item) => item.id === value.key)?.actions?.length;
          const haveCount = value.actions?.length;
          // eslint-disable-next-line no-param-reassign
          result[`_${value.key}`] = actionCount === haveCount;
          return result;
        }, {}),
        takeLast(1),
      )
      .subscribe({
        next: (data) => {
          form.setFieldsValue(data);
          AuthorizationModel.checkAll = calculationSelectAll(permissionDB, data);
        },
        error: () => {},
        complete: () => {
          AuthorizationModel.spinning = false;

          if (props.type) {
            searchPermission('', props.type);
          }
        },
      });
  }, [target.id]);

  const initPermission = useCallback(() => {
    service
      .getPermission()
      .pipe(
        map((item) => {
          const type = item.properties?.type;
          return { ...item, type };
        }),
        toArray(),
      )
      .subscribe({
        next: insertDB,
        error: () => {},
        complete: initAutzInfo,
      });
  }, []);

  useEffect(() => {
    DB.updateSchema({
      permission: 'id,name,status,describe,type',
    }).then(() => {
      initPermission();
    });

    return () => {
      DB.getDB().table(tableName).clear();
      AuthorizationModel.spinning = true;
      DB.updateSchema({ permission: null });
    };
  }, [target.id]);

  const setAutz = (data: unknown[]) => {
    const permissions = Object.keys(data)
      .filter((i) => !i.startsWith('_'))
      .map((item) => ({
        id: item,
        actions: data[item],
      }));
    service
      .setAutzInfo({
        targetId: target.id,
        targetType: target.type,
        permissionList: permissions,
      })
      .subscribe(async () => {
        await message.success('授权成功');
      });
  };

  const columns: TableColumnsType<PermissionItem> = [
    {
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
      dataIndex: 'name',
      width: 200,
    },
    {
      title: intl.formatMessage({
        id: 'pages.system.authorization.actions',
        defaultMessage: '权限操作',
      }),
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
              form.setFieldsValue({
                [`_${record.id}`]: text.length === data.length,
              });
            }}
            options={text.map((item) => ({
              label: item.name,
              value: item.action,
              key: item.id,
            }))}
          />
        </Form.Item>
      ),
    },
    {
      title: (
        <Checkbox
          checked={AuthorizationModel.checkAll}
          onChange={async (e) => {
            const permissionDB: PermissionItem[] = await DB.getDB()
              .table(tableName)
              .reverse()
              .sortBy('name');
            const tempForm = _.cloneDeep(form.getFieldsValue());
            permissionDB.forEach((item) => {
              tempForm[item.id] = e.target.checked ? item.actions.map((i) => i.action) : [];
              tempForm[`_${item.id}`] = e.target.checked;
            });
            AuthorizationModel.checkAll = e.target.checked;
            form.setFieldsValue(tempForm);
          }}
        >
          {intl.formatMessage({
            id: 'pages.system.authorization.selectAll',
            defaultMessage: '全选',
          })}
        </Checkbox>
      ),
      width: 200,
      dataIndex: 'option',
      render: (text, record) => (
        <Form.Item name={`_${record.id}`} valuePropName="checked">
          <Checkbox
            onChange={(e) => {
              form.setFieldsValue({
                [record.id]: e.target.checked ? record.actions.map((item) => `${item.action}`) : [],
                [`_${record.id}`]: e.target.checked,
              });
            }}
          >
            {intl.formatMessage({
              id: 'pages.system.authorization.selectAll',
              defaultMessage: '全选',
            })}
          </Checkbox>
        </Form.Item>
      ),
    },
  ];

  return (
    <Spin spinning={AuthorizationModel.spinning} tip="数据加载中...">
      <Form
        onFinish={setAutz}
        size={'small'}
        form={form}
        wrapperCol={{ span: 20 }}
        labelCol={{ span: 3 }}
      >
        <Form.Item label="被授权主体">
          <Input value={target.name} disabled={true} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'pages.system.authorization.screen',
            defaultMessage: '筛选权限',
          })}
        >
          <Input.Group>
            <Row>
              <Col span={4}>
                <Select
                  onSelect={(type: string) =>
                    searchPermission(AuthorizationModel.filterParam.name, props.type || type)
                  }
                  style={{ width: '100%' }}
                  defaultValue={props.type || 'all'}
                  // 如果传了类型，那么授权不能更改类型
                  disabled={!!props.type}
                  options={permissionType}
                />
              </Col>
              <Col span={20}>
                <Input.Search
                  placeholder={intl.formatMessage({
                    id: 'pages.system.authorization.screen.tip',
                    defaultMessage: '请输入权限名称',
                  })}
                  onSearch={(name: string) =>
                    searchPermission(name, props.type || AuthorizationModel.filterParam?.type)
                  }
                />
              </Col>
            </Row>
          </Input.Group>
        </Form.Item>
        <Table
          className={styles.actionTable}
          size={'small'}
          rowKey="id"
          pagination={false}
          columns={columns}
          dataSource={AuthorizationModel.data}
        />
      </Form>
      <div className={styles.action}>
        <Button onClick={close} style={{ marginRight: 8 }}>
          {intl.formatMessage({
            id: 'pages.system.authorization.close',
            defaultMessage: '关闭',
          })}
        </Button>
        <Button onClick={form.submit} type="primary">
          {intl.formatMessage({
            id: 'pages.system.authorization.save',
            defaultMessage: '保存',
          })}
        </Button>
      </div>
    </Spin>
  );
});

export default Authorization;
