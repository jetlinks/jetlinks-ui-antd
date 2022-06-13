// 部门管理
import { PageContainer } from '@ant-design/pro-layout';
import { useState } from 'react';
import { Card } from 'antd';
import Service from '@/pages/system/Department/service';
import type { DepartmentItem } from '@/pages/system/Department/typings';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import Assets from './Assets';
import Tree from './Tree';
import './style';
import { useDomFullHeight } from '@/hooks';

export const service = new Service('organization');

type ModelType = {
  visible: boolean;
  current: Partial<DepartmentItem>;
  parentId: string | undefined;
};
export const State = model<ModelType>({
  visible: false,
  current: {},
  parentId: undefined,
});

export default observer(() => {
  const [parentId, setParentId] = useState('');
  const { minHeight } = useDomFullHeight(`.department`);

  return (
    <PageContainer>
      <Card className={'department'} style={{ minHeight }}>
        <div className={'department-warp'}>
          <div className={'department-left'}>
            <Tree onSelect={setParentId} />
          </div>
          <div className={'department-right'}>
            <Assets parentId={parentId} />
          </div>
        </div>
      </Card>
      {/*<SearchComponent<DepartmentItem>*/}
      {/*  field={columns}*/}
      {/*  defaultParam={[{ column: 'typeId', value: 'org', termType: 'eq' }]}*/}
      {/*  onSearch={async (data) => {*/}
      {/*    // 重置分页数据*/}
      {/*    actionRef.current?.reset?.();*/}
      {/*    setParam(data);*/}
      {/*  }}*/}
      {/*  // onReset={() => {*/}
      {/*  //   // 重置分页及搜索参数*/}
      {/*  //   actionRef.current?.reset?.();*/}
      {/*  //   setParam({});*/}
      {/*  // }}*/}
      {/*  target="department"*/}
      {/*/>*/}
      {/*<ProTable<DepartmentItem>*/}
      {/*  columns={columns}*/}
      {/*  actionRef={actionRef}*/}
      {/*  request={async (params) => {*/}
      {/*    const response = await service.queryOrgThree({*/}
      {/*      paging: false,*/}
      {/*      sorts: [sortParam],*/}
      {/*      ...params,*/}
      {/*    });*/}
      {/*    setTreeData(response.result);*/}
      {/*    return {*/}
      {/*      code: response.message,*/}
      {/*      result: {*/}
      {/*        data: response.result,*/}
      {/*        pageIndex: 0,*/}
      {/*        pageSize: 0,*/}
      {/*        total: 0,*/}
      {/*      },*/}
      {/*      status: response.status,*/}
      {/*    };*/}
      {/*  }}*/}
      {/*  onChange={(_, f, sorter: any) => {*/}
      {/*    if (sorter.order) {*/}
      {/*      setSortParam({ name: sorter.columnKey, order: sorter.order.replace('end', '') });*/}
      {/*    } else {*/}
      {/*      setSortParam({ name: 'sortIndex', value: 'asc' });*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  rowKey="id"*/}
      {/*  expandable={{*/}
      {/*    expandedRowKeys: [...rowKeys.current],*/}
      {/*    onExpandedRowsChange: (keys) => {*/}
      {/*      rowKeys.current = keys as React.Key[];*/}
      {/*      setExpandedRowKeys(keys as React.Key[]);*/}
      {/*    },*/}
      {/*  }}*/}
      {/*  pagination={false}*/}
      {/*  search={false}*/}
      {/*  params={param}*/}
      {/*  headerTitle={*/}
      {/*    <PermissionButton*/}
      {/*      isPermission={permission.add}*/}
      {/*      onClick={() => {*/}
      {/*        State.visible = true;*/}
      {/*      }}*/}
      {/*      key="button"*/}
      {/*      icon={<PlusOutlined />}*/}
      {/*      type="primary"*/}
      {/*    >*/}
      {/*      {intl.formatMessage({*/}
      {/*        id: 'pages.data.option.add',*/}
      {/*        defaultMessage: '新增',*/}
      {/*      })}*/}
      {/*    </PermissionButton>*/}
      {/*  }*/}
      {/*/>*/}
      {/*<Save<DepartmentItem>*/}
      {/*  parentChange={(pId) => {*/}
      {/*    return getSortIndex(treeData, pId);*/}
      {/*  }}*/}
      {/*  title={*/}
      {/*    State.current.parentId*/}
      {/*      ? intl.formatMessage({*/}
      {/*          id: 'pages.system.department.option.add',*/}
      {/*          defaultMessage: '新增子部门',*/}
      {/*        })*/}
      {/*      : undefined*/}
      {/*  }*/}
      {/*  service={service}*/}
      {/*  onCancel={(type, pId) => {*/}
      {/*    if (pId) {*/}
      {/*      expandedRowKeys.push(pId);*/}
      {/*      rowKeys.current.push(pId);*/}
      {/*      setExpandedRowKeys(expandedRowKeys);*/}
      {/*    }*/}
      {/*    if (type) {*/}
      {/*      actionRef.current?.reload();*/}
      {/*    }*/}
      {/*    State.current = {};*/}
      {/*    State.visible = false;*/}
      {/*  }}*/}
      {/*  data={State.current}*/}
      {/*  visible={State.visible}*/}
      {/*  schema={schema}*/}
      {/*/>*/}
    </PageContainer>
  );
});
