import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, Dropdown } from 'antd';
import ProTable from '@jetlinks/pro-table';
import type { ProColumns, ActionType, RequestData } from '@jetlinks/pro-table';

import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type BaseService from '@/utils/BaseService';
import * as React from 'react';
import Save from '@/components/BaseCrud/save';
import type { ISchema } from '@formily/json-schema';
import { CurdModel } from '@/components/BaseCrud/model';
import type { ISchemaFieldProps } from '@formily/react/lib/types';
import type { ModalProps } from 'antd/lib/modal/Modal';
import type { TablePaginationConfig } from 'antd/lib/table/interface';
import type { Form } from '@formily/core';
import SearchComponent from '@/components/SearchComponent';
import { useRef, useState } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { SearchConfig } from '@ant-design/pro-form/lib/components/Submitter';

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
};

const BaseCrud = <T extends Record<string, any>>(props: Props<T>) => {
  const intl = useIntl();
  const ref = useRef<ProFormInstance>();
  const {
    columns,
    service,
    title,
    menu,
    schema,
    defaultParams,
    actionRef,
    schemaConfig,
    modelConfig,
    request,
    toolBar,
    pagination,
    search,
    formEffect,
    form,
    moduleName,
  } = props;

  const [param, setParam] = useState({});
  return (
    <>
      <SearchComponent<T>
        field={columns}
        onSearch={async (data) => {
          // actionRef.current?.reset?.();
          actionRef.current?.setPageInfo?.({ pageSize: 10 });
          setParam(data);
        }}
        target={moduleName}
        onReset={() => {
          // 重置分页及搜索参数
          actionRef.current?.reset?.();
          setParam({});
        }}
      />
      <ProTable<T>
        params={param}
        formRef={ref}
        columns={columns}
        actionRef={actionRef}
        options={{ fullScreen: true }}
        request={request || (async (params = {}) => service.query(params))}
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
        headerTitle={title}
        defaultParams={defaultParams}
        toolBarRender={() =>
          toolBar || [
            <Button onClick={CurdModel.add} key="button" icon={<PlusOutlined />} type="primary">
              {intl.formatMessage({
                id: 'pages.data.option.add',
                defaultMessage: '新增',
              })}
            </Button>,
            menu && (
              <Dropdown key="menu" overlay={menu}>
                <Button>
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            ),
          ]
        }
      />
      <Save
        reload={() => actionRef.current?.reload()}
        service={service}
        schema={schema}
        schemaConfig={schemaConfig}
        modelConfig={modelConfig}
        formEffect={formEffect}
        customForm={form}
      />
    </>
  );
};

export default BaseCrud;
