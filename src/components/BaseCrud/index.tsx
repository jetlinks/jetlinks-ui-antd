import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, Card, Tooltip } from 'antd';
import type { ActionType, ProColumns, RequestData } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';

import { PlusOutlined } from '@ant-design/icons';
import type BaseService from '@/utils/BaseService';
import * as React from 'react';
import { useRef, useState } from 'react';
import Save from '@/components/BaseCrud/save';
import type { ISchema } from '@formily/json-schema';
import { CurdModel } from '@/components/BaseCrud/model';
import type { ISchemaFieldProps } from '@formily/react/lib/types';
import type { ModalProps } from 'antd/lib/modal/Modal';
import type { TablePaginationConfig } from 'antd/lib/table/interface';
import type { Form } from '@formily/core';
import SearchComponent from '@/components/SearchComponent';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { SearchConfig } from '@ant-design/pro-form/lib/components/Submitter';
import { useDomFullHeight } from '@/hooks';

export type Option = {
  model: 'edit' | 'preview' | 'add';
  current: any;
  visible: boolean;
  add: () => void;
  update: (current: any) => void;
  close: () => void;
};

declare type OverlayFunc = () => React.ReactElement;
export type Props<T> = {
  columns: ProColumns<T>[];
  service: BaseService<T>;
  title: string;
  menu?: React.ReactElement | OverlayFunc;
  schema: ISchema;
  schemaConfig?: ISchemaFieldProps;
  defaultParams?: Record<string, any>;
  actionRef: React.MutableRefObject<ActionType | undefined>;
  modelConfig?: ModalProps & { loading?: boolean };
  request?: (params: any) => Promise<Partial<RequestData<T>>>;
  toolBar?: React.ReactNode[];
  pagination?: false | TablePaginationConfig;
  search?: false | SearchConfig;
  formEffect?: () => void; // 与form参数 只有一个生效
  form?: Form;
  /** @name 用于存储搜索历史记录的标记*/
  moduleName?: string; //
  footer?: React.ReactNode;
  disableAdd?: boolean;
  scroll?: any;
};

const BaseCrud = <T extends Record<string, any>>(props: Props<T>) => {
  const { minHeight } = useDomFullHeight(`.BaseCrud`);
  const intl = useIntl();
  const ref = useRef<ProFormInstance>();
  const {
    columns,
    service,
    // title,
    // menu,
    schema,
    defaultParams,
    actionRef,
    schemaConfig,
    modelConfig,
    request,
    // toolBar,
    pagination,
    search,
    formEffect,
    form,
    moduleName,
    footer,
    scroll,
  } = props;

  const [param, setParam] = useState({});

  return (
    <>
      <SearchComponent<T>
        field={columns}
        onSearch={async (data) => {
          actionRef.current?.setPageInfo?.({ pageSize: 10 });
          setParam(data);
        }}
        target={moduleName}
      />
      <Card className="BaseCrud" style={{ minHeight }}>
        <ProTable<T>
          params={param}
          formRef={ref}
          columns={columns}
          actionRef={actionRef}
          scroll={scroll}
          columnEmptyText={''}
          options={{ fullScreen: false }}
          request={
            request ||
            (async (params = {}) =>
              service.query({
                ...params,
                sorts: [{ name: 'createTime', order: 'desc' }], // 默认排序
              }))
          }
          editable={{
            type: 'multiple',
          }}
          rowKey="id"
          search={
            search === false
              ? false
              : {
                  labelWidth: 'auto',
                }
          }
          form={{
            syncToUrl: false,
          }}
          pagination={
            pagination === false
              ? false
              : {
                  pageSize: 10,
                }
          }
          dateFormatter="string"
          headerTitle={
            <Tooltip title={props.disableAdd ? '暂无权限，请联系管理员' : ''}>
              <Button
                disabled={props.disableAdd}
                onClick={CurdModel.add}
                key="button"
                icon={<PlusOutlined />}
                type="primary"
              >
                {intl.formatMessage({
                  id: 'pages.data.option.add',
                  defaultMessage: '新增',
                })}
              </Button>
            </Tooltip>
          }
          defaultParams={defaultParams}
          // toolBarRender={() =>
          //   toolBar || [
          //     <Button onClick={CurdModel.add} key="button" icon={<PlusOutlined />} type="primary">
          //       {intl.formatMessage({
          //         id: 'pages.data.option.add',
          //         defaultMessage: '新增',
          //       })}
          //     </Button>,
          //     menu && (
          //       <Dropdown key="menu" overlay={menu}>
          //         <Button>
          //           <EllipsisOutlined />
          //         </Button>
          //       </Dropdown>
          //     ),
          //   ]
          // }
        />
        <Save
          reload={() => actionRef.current?.reload()}
          service={service}
          schema={schema}
          schemaConfig={schemaConfig}
          modelConfig={modelConfig}
          formEffect={formEffect}
          customForm={form}
          footer={footer}
        />
      </Card>
    </>
  );
};

export default BaseCrud;
