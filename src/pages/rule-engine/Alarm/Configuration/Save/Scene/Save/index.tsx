import { Modal, ProTableCard } from '@/components';
import SearchComponent from '@/components/SearchComponent';
import { SceneItem } from '@/pages/rule-engine/Scene/typings';
import { ExtraSceneCard } from '@/components/ProTableCard/CardItems/Scene';
import { service as sceneService } from '@/pages/rule-engine/Scene';
import { ActionType, ProColumns } from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { onlyMessage } from '@/utils/util';
import { service } from '@/pages/rule-engine/Alarm/Configuration';
interface Props {
  close: () => void;
  id: string;
  ok: () => void;
}

export default (props: Props) => {
  const { id } = props;
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useState<any>({});
  const [selectKeys, setSelectKeys] = useState<any[]>([]);

  const columns: ProColumns<SceneItem>[] = [
    {
      dataIndex: 'name',
      fixed: 'left',
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
    <Modal
      title={'新增'}
      maskClosable={false}
      open
      onCancel={() => {
        props.close();
      }}
      onOk={async () => {
        if (selectKeys.length > 0) {
          const list = selectKeys.map((item) => {
            return {
              alarmId: id,
              ruleId: item,
            };
          });
          const resp = await service.bindScene([...list]);
          if (resp.status === 200) {
            onlyMessage('操作成功');
            props.ok();
          }
        } else {
          onlyMessage('请选择至少一条数据', 'error');
        }
      }}
      width={1000}
    >
      <SearchComponent<SceneItem>
        field={columns}
        enableSave={false}
        model={'simple'}
        target={'alarm-scene-unbind'}
        onSearch={(data) => {
          actionRef.current?.reset?.();
          setSearchParams(data);
        }}
      />
      <div
        style={{
          height: 'calc(100vh - 400px)',
          overflowY: 'auto',
        }}
      >
        <ProTableCard<SceneItem>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          search={false}
          onlyCard={true}
          gridColumn={1}
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
                      column: 'id',
                      termType: 'alarm-bind-rule$not',
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
          rowSelection={{
            selectedRowKeys: selectKeys,
            onChange: (selectedRowKeys) => {
              console.log(selectedRowKeys);
              setSelectKeys(selectedRowKeys);
            },
          }}
          cardRender={(record) => (
            <ExtraSceneCard {...record} showTool={false} showBindBtn={false} cardType={'bind'} />
          )}
          params={searchParams}
          height={'none'}
        />
      </div>
    </Modal>
  );
};
