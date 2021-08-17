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
  modelConfig?: ModalProps;
  request?: (params: any) => Promise<Partial<RequestData<T>>>;
  toolBar?: React.ReactNode[];
};

const BaseCrud = <T extends Record<string, any>>(props: Props<T>) => {
  const intl = useIntl();

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
  } = props;

  return (
    <>
      <ProTable<T>
        columns={columns}
        actionRef={actionRef}
        options={{ fullScreen: true }}
        request={request || (async (params = {}) => service.query(params))}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        form={{
          syncToUrl: false,
        }}
        pagination={{
          pageSize: 10,
        }}
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
      />
    </>
  );
};

export default BaseCrud;
