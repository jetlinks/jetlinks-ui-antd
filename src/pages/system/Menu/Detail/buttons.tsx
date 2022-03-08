import { Form, Input, Button, message, Modal, Popconfirm, Tooltip } from 'antd';
import { useIntl } from '@@/plugin-locale/localeExports';
import { useCallback, useEffect, useState } from 'react';
import { service } from '@/pages/system/Menu';
import ProTable from '@jetlinks/pro-table';
import type { ProColumns } from '@jetlinks/pro-table';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuButtonInfo, MenuItem } from '@/pages/system/Menu/typing';
import Permission from '@/pages/system/Menu/components/permission';
import { useRequest } from '@@/plugin-request/request';
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

  const { data: permissions, run: queryPermissions } = useRequest(service.queryPermission, {
    manual: true,
    formatResult: (response) => response.result.data,
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
      _data.terms = [{ column: 'name', value: e.target.value }];
    }
    queryPermissions(_data);
  };

  /**
   * 更新菜单信息
   * @param data
   */
  const updateMenuInfo = useCallback(
    async (data: MenuButtonInfo[]) => {
      const response = await service.update({
        ...props.data,
        buttons: data,
      });
      if (response.status === 200) {
        message.success('操作成功!');
        props.onLoad();
        resetForm();
        setVisible(false);
      } else {
        message.error('操作失败!');
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
        defaultMessage: '备注说明',
      }),
      dataIndex: 'describe',
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
        <a
          key="edit"
          onClick={() => {
            form.setFieldsValue(record);
            setId(record.id);
            setDisabled(false);
            setVisible(true);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          >
            <EditOutlined />
          </Tooltip>
        </a>,
        <a
          key="view"
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
        </a>,
        <Popconfirm
          key="unBindUser"
          title={intl.formatMessage({
            id: 'page.system.menu.table.delete',
            defaultMessage: '是否删除该按钮',
          })}
          onConfirm={() => {
            deleteItem(record.id);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.delete',
              defaultMessage: '删除',
            })}
          >
            <a key="delete">
              <DeleteOutlined />
            </a>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      <ProTable<MenuButtonInfo>
        columns={columns}
        dataSource={buttonItems}
        search={false}
        pagination={false}
        toolBarRender={() => [
          <Button
            onClick={() => {
              form.resetFields();
              setVisible(true);
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </Button>,
        ]}
      />
      <Modal
        width={660}
        visible={visible}
        title={handleTitle()}
        onOk={() => {
          saveData();
        }}
        onCancel={() => {
          resetForm();
          setVisible(false);
        }}
      >
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
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
            <Input disabled={!!(!disabled && id)} />
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
            <Input disabled={disabled} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'page.system.menu.permissions',
              defaultMessage: '权限',
            })}
            required={true}
          >
            <Input disabled={disabled} onChange={debounce(filterThree, 300)} />
            <Form.Item name="permissions" rules={[{ required: true, message: '请选择权限' }]}>
              <Permission
                title={intl.formatMessage({
                  id: 'page.system.menu.permissions.operate',
                  defaultMessage: '操作权限',
                })}
                disabled={disabled}
                data={permissions}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="describe"
            label={intl.formatMessage({
              id: 'pages.table.describe',
              defaultMessage: '描述',
            })}
          >
            <Input.TextArea disabled={disabled} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
