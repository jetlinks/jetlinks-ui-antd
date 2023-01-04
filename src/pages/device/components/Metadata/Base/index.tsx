import type { ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'umi';
import DB from '@/db';
import type { MetadataItem, MetadataType } from '@/pages/device/Product/typings';
import MetadataMapping from './columns';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Edit from './Edit';
import { observer } from '@formily/react';
import MetadataModel from './model';
import { Store } from 'jetlinks-store';
import SystemConst from '@/utils/const';
import { useIntl } from '@@/plugin-locale/localeExports';
// import PropertyImport from '@/pages/device/Product/Detail/PropertyImport';
import { productModel } from '@/pages/device/Product';
import { InstanceModel } from '@/pages/device/Instance';
import { asyncUpdateMedata, removeMetadata } from '../metadata';
import type { permissionType } from '@/hooks/permission';
import { PermissionButton } from '@/components';
import { onlyMessage } from '@/utils/util';
import { message } from 'antd';

interface Props {
  type: MetadataType;
  target: 'product' | 'device';
  permission: Partial<permissionType>;
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
      onlyMessage('操作成功！');
      Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
      MetadataModel.edit = false;
      MetadataModel.item = {};
    } else {
      onlyMessage('操作失败！', 'error');
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
      align: 'left',
      width: 200,
      render: (_: unknown, record: MetadataItem) => [
        <PermissionButton
          isPermission={props.permission.update}
          type="link"
          key={'edit'}
          style={{ padding: 0 }}
          disabled={operateLimits('updata', type)}
          onClick={() => {
            MetadataModel.edit = true;
            MetadataModel.item = record;
            MetadataModel.type = type;
            MetadataModel.action = 'edit';
            if (!InstanceModel.detail?.independentMetadata && props.target === 'device') {
              message.warning('修改物模型后会脱离产品物模型');
            }
          }}
          tooltip={{
            title: operateLimits('updata', type) ? '当前的存储方式不支持编辑' : '编辑',
          }}
        >
          <EditOutlined />
        </PermissionButton>,
        <PermissionButton
          isPermission={props.permission.update}
          type="link"
          key={'delete'}
          style={{ padding: 0 }}
          popConfirm={{
            title: '确认删除？',
            onConfirm: async () => {
              await removeItem(record);
            },
          }}
          tooltip={{
            title: '删除',
          }}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  const initData = useCallback(async () => {
    const result = await DB.getDB().table(`${type}`).toArray();
    console.log(result);
    setData(result.sort((a, b) => b?.sortsIndex - a?.sortsIndex));
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
      // const result = await DB.getDB()
      //   .table(`${type}`)
      //   .where('name')
      //   .startsWithAnyOfIgnoreCase(name)
      //   .toArray();
      // setData(result.sort((a, b) => b?.sortsIndex - a?.sortsIndex));
      const result = await DB.getDB().table(`${type}`).toArray();
      const arr = result
        .filter((item) => item.name.indexOf(name) > -1)
        .sort((a, b) => b?.sortsIndex - a?.sortsIndex);
      // console.log(result, arr)
      setData(arr);
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
        // pagination={{
        //   pageSize: 5,
        // }}
        options={{
          density: false,
          fullScreen: false,
          reload: false,
          setting: false,
          search: true,
        }}
        toolbar={{
          search: {
            placeholder: '请输入名称',
            allowClear: true,
            onSearch: handleSearch,
          },
        }}
        toolBarRender={() => [
          // props.type === 'properties' && target === 'device' && (
          //   <PermissionButton
          //     isPermission={props.permission.update}
          //     onClick={() => {
          //       MetadataModel.importMetadata = true;
          //     }}
          //     key="button"
          //     icon={<ImportOutlined />}
          //     type="ghost"
          //   >
          //     导入属性
          //   </PermissionButton>
          // ),
          <PermissionButton
            isPermission={props.permission.update}
            key={'add'}
            onClick={() => {
              MetadataModel.edit = true;
              MetadataModel.item = undefined;
              MetadataModel.type = type;
              MetadataModel.action = 'add';
            }}
            disabled={operateLimits('add', type)}
            icon={<PlusOutlined />}
            type="primary"
            tooltip={{
              title: operateLimits('add', type) ? '当前的存储方式不支持新增' : '新增',
            }}
          >
            {intl.formatMessage({
              id: 'pages.searchTable.new',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
      />
      {/*{MetadataModel.importMetadata && <PropertyImport type={target} />}*/}
      {MetadataModel.edit && <Edit type={target} tabs={type} />}
    </>
  );
});
export default BaseMetadata;
