import { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { PermissionButton, ProTableCard } from '@/components';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import SceneCard from '@/components/ProTableCard/CardItems/scene';
import { useRef, useState } from 'react';
import { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useIntl } from '@@/plugin-locale/localeExports';
import useLocation from '@/hooks/route/useLocation';
// import { service } from "@/pages/rule-engine/Alarm/Configuration";
import { service as sceneService } from '@/pages/rule-engine/Scene';
import Save from './Save';
// import SearchComponent from "@/components/SearchComponent";

export default () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const { permission } = PermissionButton.usePermission('rule-engine/Alarm/Configuration');
  const location = useLocation();
  const id = location?.query?.id || '';
  const [visible, setVisible] = useState<boolean>(false);
  const [searchParams] = useState<any>({});

  const columns: ProColumns<SceneItem>[] = [
    {
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
      width: 300,
      title: intl.formatMessage({
        id: 'pages.table.name',
        defaultMessage: '名称',
      }),
    },
    {
      dataIndex: 'triggerType',
      title: intl.formatMessage({
        id: 'pages.ruleEngine.scene.triggers',
        defaultMessage: '触发方式',
      }),
      valueType: 'select',
      valueEnum: {
        manual: {
          text: '手动触发',
          status: 'manual',
        },
        timer: {
          text: '定时触发',
          status: 'timer',
        },
        device: {
          text: '设备触发',
          status: 'device',
        },
      },
    },
    {
      dataIndex: 'description',
      title: intl.formatMessage({
        id: 'pages.system.description',
        defaultMessage: '说明',
      }),
      hideInSearch: true,
    },
    {
      dataIndex: 'state',
      title: intl.formatMessage({
        id: 'pages.searchTable.titleStatus',
        defaultMessage: '状态',
      }),
      valueType: 'select',
      valueEnum: {
        started: {
          text: '正常',
          status: 'started',
        },
        disable: {
          text: '禁用',
          status: 'disable',
        },
      },
    },
  ];

  return (
    <>
      {/*<SearchComponent*/}
      {/*  field={columns}*/}
      {/*  target={'alarm-scene'}*/}
      {/*  onSearch={(data) => {*/}
      {/*    actionRef.current?.reset?.();*/}
      {/*    setSearchParams(data);*/}
      {/*  }}*/}
      {/*/>*/}
      <ProTableCard<SceneItem>
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 1366 }}
        params={searchParams}
        columnEmptyText={''}
        // @ts-ignore
        request={(params) => {
          if (!id) {
            return {
              code: 200,
              result: {
                data: [],
                pageIndex: 0,
                pageSize: 0,
                total: 0,
              },
              status: 200,
            };
          }
          return sceneService.query({
            ...params,
            terms: [
              ...(params?.terms || []),
              {
                terms: [
                  {
                    column: 'sceneId',
                    value: id,
                  },
                ],
                type: 'and',
              },
            ],
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
          });
        }}
        rowKey="id"
        search={false}
        onlyCard={true}
        headerTitle={[
          <PermissionButton
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            isPermission={permission.update}
            onClick={() => {
              setVisible(true);
            }}
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
        ]}
        cardRender={(record) => (
          <SceneCard
            {...record}
            showBindBtn={false}
            cardType={'bind'}
            actions={[
              <PermissionButton
                key={'unbind'}
                type={'link'}
                style={{ padding: 0 }}
                isPermission={permission.update}
                popConfirm={{
                  title: '确认解绑？',
                  onConfirm: () => {
                    console.log(record.id);
                  },
                }}
                tooltip={{
                  title: <span>解绑</span>,
                }}
              >
                <DeleteOutlined />
              </PermissionButton>,
            ]}
          />
        )}
      />
      {visible && (
        <Save
          id={id}
          close={() => {
            setVisible(false);
          }}
        />
      )}
    </>
  );
};
