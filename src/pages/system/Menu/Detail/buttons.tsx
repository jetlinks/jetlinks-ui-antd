import { Button, Form, Input, Modal, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useCallback, useEffect, useState } from 'react';
import { service } from '@/pages/system/Menu';
import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { MenuButtonInfo, MenuItem } from '@/pages/system/Menu/typing';
import Permission from '@/pages/system/Menu/components/permission';
import { useRequest } from '@@/plugin-request/request';
import { PermissionButton } from '@/components';
import { onlyMessage } from '@/utils/util';
import { debounce } from 'lodash';

type ButtonsProps = {
  data: MenuItem;
  onLoad: () => void;
};

export default (props: ButtonsProps) => {
  const intl = useIntl();

  const [disabled, setDisabled] = useState(false); // 是否为查看
  const [buttonItems, setButtonItems] = useState<MenuButtonInfo[]>([]); // button Table数据源
  const [visible, setVisible] = useState(false); // Modal显示影藏
  const [id, setId] = useState(''); // 缓存ID
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { permission } = PermissionButton.usePermission('system/Menu');

  const { data: permissions, run: queryPermissions } = useRequest(service.queryPermission, {
    manual: true,
    formatResult: (response) => response.result,
  });

  useEffect(() => {
    if (visible) {
      // 每次打开Modal获取最新权限
      queryPermissions({ paging: false });
    }
    /* eslint-disable */
  }, [visible]);

  useEffect(() => {
    if (props.data) {
      setButtonItems(props.data.buttons || []);
    }
  }, [props.data]);

  const resetForm = () => {
    form.resetFields();
    setId('');
    setDisabled(false);
  };

  const filterThree = (e: any) => {
    const _data: any = {
      paging: false,
    };
    if (e.target.value) {
      _data.terms = [{ column: 'name$like', value: `%${e.target.value}%` }];
    }
    queryPermissions(_data);
  };

  /**
   * 更新菜单信息
   * @param data
   */
  const updateMenuInfo = useCallback(
    async (data: MenuButtonInfo[]) => {
      if (props.data.id) {
        setLoading(true);
        const response = await service.update({
          ...props.data,
          buttons: data,
        });
        setLoading(false);
        if (response.status === 200) {
          onlyMessage('操作成功!');
          props.onLoad();
          resetForm();
          setVisible(false);
        } else {
          onlyMessage('操作失败!', 'error');
        }
      }
      /* eslint-disable */
    },
    [props.data],
  );

  /**
   * 删除单个按钮
   */
  const deleteItem = useCallback(
    (buttonId) => {
      const filterButtons = buttonItems.filter((item) => item.id !== buttonId);
      setButtonItems(filterButtons);
      updateMenuInfo(filterButtons);
      /* eslint-disable */
    },
    [buttonItems],
  );

  /**
   * Model title处理，默认新增
   * @default 'pages.data.option.add'
   */
  const handleTitle = useCallback((): string => {
    let intlId = 'pages.data.option.add';
    if (disabled && id) {
      // 查看
      intlId = 'pages.data.option.view';
    } else if (!disabled && id) {
      // 编辑
      intlId = 'pages.data.option.edit';
    }
    return intl.formatMessage({
      id: intlId,
    });
    /* eslint-disable */
  }, [disabled, id]);

  /**
   * 获取表单数据
   */
  const saveData = useCallback(async () => {
    const formData = await form.validateFields();
    if (formData) {
      if (buttonItems.some((item) => item.id === formData.id)) {
        // 编辑
        updateMenuInfo(buttonItems.map((item) => (item.id === formData.id ? formData : item)));
      } else {
        updateMenuInfo([formData, ...buttonItems]);
      }
    }
    /* eslint-disable */
  }, [buttonItems]);

  const columns: ProColumns<MenuButtonInfo>[] = [
    {
      title: intl.formatMessage({
        id: 'page.system.menu.encoding',
        defaultMessage: '编码',
      }),
      width: 220,
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.name',
        defaultMessage: '名称',
      }),
      width: 300,
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.describe',
        defaultMessage: '说明',
      }),
      dataIndex: 'description',
      // render: (_, row) => () => {
      //   console.log(row)
      //   return (<> {row.describe || '-'}</>)
      // }
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      align: 'center',
      width: 240,
      render: (_, record) => [
        <PermissionButton
          key="edit"
          type={'link'}
          style={{ padding: 0 }}
          onClick={() => {
            form.setFieldsValue(record);
            setId(record.id);
            setDisabled(false);
            setVisible(true);
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            }),
          }}
          isPermission={permission.update}
        >
          <EditOutlined />
        </PermissionButton>,
        <Button
          key="view"
          type={'link'}
          style={{ padding: 0 }}
          onClick={() => {
            form.setFieldsValue(record);
            setId(record.id);
            setDisabled(true);
            setVisible(true);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.view',
              defaultMessage: '查看',
            })}
          >
            <SearchOutlined />
          </Tooltip>
        </Button>,
        <PermissionButton
          key="unBindUser"
          type={'link'}
          style={{ padding: 0 }}
          popConfirm={{
            title: intl.formatMessage({
              id: 'page.system.menu.table.delete',
              defaultMessage: '是否删除该按钮',
            }),
            onConfirm() {
              deleteItem(record.id);
            },
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.delete',
              defaultMessage: '删除',
            }),
          }}
          isPermission={permission.update}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  return (
    <>
      <ProTable<MenuButtonInfo>
        columns={columns}
        dataSource={buttonItems}
        search={false}
        columnEmptyText={''}
        pagination={false}
        headerTitle={[
          <PermissionButton
            onClick={() => {
              if (!props.data) {
                onlyMessage('请先新增菜单基本信息', 'warning');
                return;
              }
              form.resetFields();
              setVisible(true);
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            isPermission={permission.update}
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
      />
      {visible && (
        <Modal
          maskClosable={false}
          width={660}
          visible={visible}
          title={handleTitle()}
          onOk={() => {
            if (!disabled) {
              saveData();
            } else {
              resetForm();
              setVisible(false);
            }
          }}
          onCancel={() => {
            resetForm();
            setVisible(false);
          }}
          bodyStyle={{ paddingBottom: 0 }}
          confirmLoading={loading}
        >
          <Form form={form} layout={'vertical'}>
            <Form.Item
              name="id"
              label={intl.formatMessage({
                id: 'pages.system.org.encoding',
                defaultMessage: '编码',
              })}
              required={true}
              rules={[
                { required: true, message: '请输入编码' },
                { max: 64, message: '最多可输入64个字符' },
                {
                  pattern: /^[a-zA-Z0-9`!@#$%^&*()_+\-={}|\\\]\[;':",.\/<>?]+$/,
                  message: '请输入英文+数字+特殊字符（`!@#$%^&*()_+-={}|\\][;\':",./<>?）',
                },
                {
                  validator: (_, value, callback) => {
                    if (!(!disabled && id) && buttonItems.some((item) => item.id === value)) {
                      // 判断是否为新增
                      callback('重复编码');
                    }
                    callback();
                  },
                },
              ]}
            >
              <Input disabled={!!(disabled || id)} placeholder={'请输入编码'} />
            </Form.Item>
            <Form.Item
              name="name"
              label={intl.formatMessage({
                id: 'pages.table.name',
                defaultMessage: '名称',
              })}
              required={true}
              rules={[
                { required: true, message: '请输入名称' },
                { max: 64, message: '最多可输入64个字符' },
              ]}
            >
              <Input disabled={disabled} placeholder={'请输入名称'} />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({
                id: 'page.system.menu.permissions',
                defaultMessage: '权限',
              })}
              required={true}
              style={{
                marginBottom: 0,
              }}
            >
              <Input
                allowClear
                onChange={debounce(filterThree, 500)}
                style={{ width: 300, marginBottom: 12 }}
                placeholder={'请输入权限名称'}
              />
              <Form.Item name="permissions" rules={[{ required: true, message: '请选择权限' }]}>
                <Permission
                  title={intl.formatMessage({
                    id: 'page.system.menu.permissions.operate',
                    defaultMessage: '权限操作',
                  })}
                  disabled={disabled}
                  data={permissions}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item
              name="description"
              label={intl.formatMessage({
                id: 'pages.table.describe',
                defaultMessage: '说明',
              })}
            >
              <Input.TextArea
                disabled={disabled}
                placeholder={'请输入说明'}
                maxLength={200}
                showCount={true}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};
