// 菜单管理
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, message, Tooltip } from 'antd';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { useHistory } from 'umi';
import SearchComponent from '@/components/SearchComponent';
import Service from './service';
import type { MenuItem } from './typing';
import moment from 'moment';
import { getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { PermissionButton } from '@/components';

export const service = new Service('menu');

type ModelType = {
  visible: boolean;
  current: Partial<MenuItem>;
  parentId: string | undefined;
};

export const State = model<ModelType>({
  visible: false,
  current: {},
  parentId: undefined,
});

export default observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const [param, setParam] = useState({});
  const history = useHistory();
  const { permission } = PermissionButton.usePermission('system/Menu');

  const deleteItem = async (id: string) => {
    const response: any = await service.remove(id);
    if (response.status === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功!',
        }),
      );
    }
    actionRef.current?.reload();
  };

  /**
   * 跳转详情页
   * @param id
   * @param pId
   * @param basePath
   */
  const pageJump = (id?: string, pId?: string, basePath?: string) => {
    // 跳转详情
    history.push(
      `${getMenuPathByParams(MENUS_CODE['system/Menu/Detail'], id)}?pId=${pId || ''}&basePath=${
        basePath || ''
      }`,
    );
  };

  const columns: ProColumns<MenuItem>[] = [
    {
      title: intl.formatMessage({
        id: 'page.system.menu.encoding',
        defaultMessage: '编码',
      }),
      width: 300,
      dataIndex: 'code',
      fixed: 'left',
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.name',
        defaultMessage: '名称',
      }),
      width: 220,
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.url',
        defaultMessage: '页面地址',
      }),
      dataIndex: 'url',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.sort',
        defaultMessage: '排序',
      }),
      width: 80,
      dataIndex: 'sortIndex',
      valueType: 'digit',
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.describe',
        defaultMessage: '说明',
      }),
      width: 200,
      dataIndex: 'describe',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.createTime',
        defaultMessage: '创建时间',
      }),
      width: 180,
      valueType: 'dateTime',
      dataIndex: 'createTime',
      render: (_, record) => {
        return record.createTime ? moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 240,
      fixed: 'right',
      render: (_, record) => [
        <Button
          type="link"
          key="view"
          style={{ padding: 0 }}
          onClick={() => {
            pageJump(record.id, record.parentId || '');
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
          type="link"
          style={{ padding: 0 }}
          key="editable"
          isPermission={permission.add}
          tooltip={{
            title: intl.formatMessage({
              id: 'page.system.menu.table.addChildren',
              defaultMessage: '新增子菜单',
            }),
          }}
          onClick={() => {
            State.current = {
              parentId: record.id,
            };
            // State.visible = true;
            pageJump('', record.id, record.url);
          }}
        >
          <PlusCircleOutlined />
        </PermissionButton>,
        <PermissionButton
          key="delete"
          type="link"
          style={{ padding: 0 }}
          isPermission={permission.delete}
          popConfirm={{
            title: intl.formatMessage({
              id: 'page.system.menu.table.delete',
              defaultMessage: '是否删除该菜单',
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
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  /**
   * table 查询参数
   * @param data
   */
  const searchFn = (data: any) => {
    setParam(data);
  };

  // const modalCancel = () => {
  //   State.current = {};
  //   State.visible = false;
  //   form.resetFields();
  // };

  // const saveData = async () => {
  //   const formData = await form.validateFields();
  //   if (formData) {
  //     const _data = {
  //       ...formData,
  //       parentId: State.current.parentId,
  //     };
  //     const response: any = await service.save(_data);
  //     if (response.status === 200) {
  //       message.success('操作成功！');
  //       modalCancel();
  //       pageJump(response.result.id);
  //     } else {
  //       message.error('操作成功！');
  //     }
  //   }
  // };

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        target="menu"
        onSearch={searchFn}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   searchFn({});
        // }}
      />
      <ProTable<MenuItem>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 1366 }}
        pagination={false}
        search={false}
        params={param}
        request={async (params) => {
          const response = await service.queryMenuThree({ ...params, paging: false });
          return {
            code: response.message,
            result: {
              data: response.result,
              pageIndex: 0,
              pageSize: 0,
              total: 0,
            },
            status: response.status,
          };
        }}
        headerTitle={
          <PermissionButton
            isPermission={permission.add}
            onClick={() => {
              pageJump();
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>
        }
      />
      {/*<Modal*/}
      {/*  title={intl.formatMessage({*/}
      {/*    id: State.current.parentId*/}
      {/*      ? 'pages.system.menu.option.addChildren'*/}
      {/*      : 'pages.data.option.add',*/}
      {/*    defaultMessage: '新增',*/}
      {/*  })}*/}
      {/*  visible={State.visible}*/}
      {/*  width={660}*/}
      {/*  onOk={saveData}*/}
      {/*  onCancel={modalCancel}*/}
      {/*>*/}
      {/*  <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>*/}
      {/*    <Form.Item*/}
      {/*      name="code"*/}
      {/*      label={intl.formatMessage({*/}
      {/*        id: 'page.system.menu.encoding',*/}
      {/*        defaultMessage: '编码',*/}
      {/*      })}*/}
      {/*      required={true}*/}
      {/*      rules={[*/}
      {/*        { required: true, message: '请输入编码' },*/}
      {/*        { max: 64, message: '最多可输入64个字符' },*/}
      {/*        {*/}
      {/*          pattern: /^[a-zA-Z0-9`!@#$%^&*()_+\-={}|\\\]\[;':",.\/<>?]+$/,*/}
      {/*          message: '请输入英文+数字+特殊字符（`!@#$%^&*()_+-={}|\\][;\':",./<>?）',*/}
      {/*        },*/}
      {/*      ]}*/}
      {/*    >*/}
      {/*      <Input />*/}
      {/*    </Form.Item>*/}
      {/*    <Form.Item*/}
      {/*      name="name"*/}
      {/*      label={intl.formatMessage({*/}
      {/*        id: 'pages.table.name',*/}
      {/*        defaultMessage: '名称',*/}
      {/*      })}*/}
      {/*      required={true}*/}
      {/*      rules={[*/}
      {/*        { required: true, message: '请输入名称' },*/}
      {/*        { max: 64, message: '最多可输入64个字符' },*/}
      {/*      ]}*/}
      {/*    >*/}
      {/*      <Input />*/}
      {/*    </Form.Item>*/}
      {/*  </Form>*/}
      {/*</Modal>*/}
    </PageContainer>
  );
});
