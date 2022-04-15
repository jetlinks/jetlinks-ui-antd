import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'umi';
import DB from '@/db';
import type { MetadataItem, MetadataType } from '@/pages/device/Product/typings';
import MetadataMapping from './columns';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import Edit from './Edit';
import { observer } from '@formily/react';
import MetadataModel from './model';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { useIntl } from '@@/plugin-locale/localeExports';
import PropertyImport from '@/pages/device/Product/Detail/PropertyImport';
import { productModel } from '@/pages/device/Product';
import { InstanceModel } from '@/pages/device/Instance';
import { asyncUpdateMedata, removeMetadata } from '../metadata';

interface Props {
  type: MetadataType;
  target: 'product' | 'device';
}

const BaseMetadata = observer((props: Props) => {
  const { type, target = 'product' } = props;
  const intl = useIntl();
  const param = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<MetadataItem[]>([]);
  const typeMap = new Map<string, any>();

  typeMap.set('product', productModel.current);
  typeMap.set('device', InstanceModel.detail);

  const removeItem = async (record: MetadataItem) => {
    const removeDB = () => {
      return DB.getDB().table(`${type}`).delete(record.id!);
    };
    const _currentData = removeMetadata(type, [record], typeMap.get(target), removeDB);
    const result = await asyncUpdateMedata(target, _currentData);
    if (result.status === 200) {
      message.success('操作成功！');
      Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
      MetadataModel.edit = false;
      MetadataModel.item = {};
    } else {
      message.error('操作失败！');
    }
  };

  const limitsMap = new Map<string, any>();
  limitsMap.set('events-add', 'eventNotInsertable');
  limitsMap.set('events-updata', 'eventNotModifiable');
  limitsMap.set('properties-add', 'propertyNotInsertable');
  limitsMap.set('properties-updata', 'propertyNotModifiable');

  const operateLimits = (action: 'add' | 'updata', types: MetadataType) => {
    return (
      target === 'device' &&
      (typeMap.get('device')?.features || []).find(
        (item: { id: string; name: string }) => item.id === limitsMap.get(`${types}-${action}`),
      )
    );
  };

  const actions: ProColumns<MetadataItem>[] = [
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      width: 200,
      render: (_: unknown, record: MetadataItem) => [
        <Button
          key="editable"
          type="link"
          disabled={operateLimits('updata', type)}
          onClick={() => {
            MetadataModel.edit = true;
            MetadataModel.item = record;
            MetadataModel.type = type;
            MetadataModel.action = 'edit';
          }}
        >
          <Tooltip title="编辑">
            <EditOutlined />
          </Tooltip>
        </Button>,
        <a key="delete">
          <Popconfirm
            title="确认删除？"
            onConfirm={async () => {
              await removeItem(record);
            }}
          >
            <Tooltip title="删除">
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </a>,
      ],
    },
  ];

  const initData = useCallback(async () => {
    const result = await DB.getDB().table(`${type}`).toArray();
    setData(result);
  }, [param.id, type]);

  useEffect(() => {
    initData().then(() => setLoading(false));
  }, [initData]);

  useEffect(() => {
    const subscription = Store.subscribe(SystemConst.REFRESH_METADATA_TABLE, (flag) => {
      setTimeout(async () => {
        if (flag) {
          await initData();
        }
      }, 300);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = async (name: string) => {
    if (name) {
      const result = await DB.getDB()
        .table(`${type}`)
        .where('id')
        .startsWithAnyOfIgnoreCase(name)
        .toArray();
      setData(result);
    } else {
      await initData();
    }
  };
  return (
    <>
      <ProTable
        loading={loading}
        dataSource={data}
        size="small"
        columns={MetadataMapping.get(type)!.concat(actions)}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 5,
        }}
        options={{
          density: false,
          fullScreen: false,
          reload: false,
          setting: false,
          search: true,
        }}
        toolbar={{
          search: {
            onSearch: handleSearch,
          },
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              MetadataModel.importMetadata = true;
            }}
            key="button"
            icon={<ImportOutlined />}
            type="ghost"
          >
            导入属性
          </Button>,
          <Button
            onClick={() => {
              MetadataModel.edit = true;
              MetadataModel.item = undefined;
              MetadataModel.type = type;
              MetadataModel.action = 'add';
            }}
            disabled={operateLimits('add', type)}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.searchTable.new',
              defaultMessage: '新建',
            })}
          </Button>,
        ]}
      />
      {MetadataModel.importMetadata && <PropertyImport type={target} />}
      {MetadataModel.edit && <Edit type={target} />}
    </>
  );
});
export default BaseMetadata;
