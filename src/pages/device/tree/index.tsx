import ProTable from '@/pages/system/permission/component/ProTable';
import encodeQueryParam from '@/utils/encodeParam';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Icon, Input, message, Popconfirm, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { router } from 'umi';
import { GroupItem } from './data';
import Save from './save';
import Service from './service';

interface Props {}
const GroupList: React.FC<Props> = props => {
  const service = new Service('device');
  const [loading, setLoading] = useState<boolean>(false);
  const [saveVisible, setSaveVisible] = useState<boolean>(false);
  const [current, setCurrnet] = useState<any>({});
  const [list, setList] = useState<any>({});
  const [add, setAdd] = useState<boolean>(false);
  const [searchParam, setSearchParam] = useState<any>({
    pageSize: 10,
    sorts: {
      order: 'descend',
      field: 'id',
    },
  });
  const search = (params?: any) => {
    setSearchParam(params);
    setLoading(true);
    const defaultTerms = { parentId$isnull: true };
    service
      .groupList(
        encodeQueryParam({
          ...params,
          terms: { ...defaultTerms, ...params?.terms },
        }),
      )
      .subscribe(
        d => setList(d),
        () => message.error('刷新重试'),
        () => setLoading(false),
      );
  };
  useEffect(() => {
    search(searchParam);
  }, []);

  const saveGroup = (item: GroupItem) => {
    if (current.id) {
      //编辑
      service.saveOrUpdataGroup(item).subscribe(
        () => message.success('保存成功'),
        () => {},
        () => {
          setSaveVisible(false);
          search(searchParam);
        },
      );
    } else {
      //新增
      service.saveGroup(item).subscribe(
        () => message.success('保存成功'),
        () => {},
        () => {
          setSaveVisible(false);
          search(searchParam);
        },
      );
    }
  };
  return (
    <PageHeaderWrapper title="设备分组">
      <Card bordered={false} style={{ marginBottom: 10 }}>
        <Row>
          <Button
            type="primary"
            style={{ marginLeft: 8 }}
            onClick={() => {
              setSaveVisible(true);
              setAdd(true);
              setCurrnet({});
            }}
          >
            <Icon type="plus" />
            新建分组
          </Button>
          <span style={{ marginLeft: 20 }}>
            <label>分组名称：</label>
            <Input.Search
              style={{ width: '20%' }}
              placeholder="分组名称"
              onSearch={value => {
                search({
                  terms: {
                    name$LIKE: value,
                  },
                  pageSize: searchParam.pageSize,
                });
              }}
            />
          </span>
        </Row>
      </Card>
      <Card>
        <ProTable
          loading={loading}
          dataSource={list?.data}
          columns={[
            { title: '标识', dataIndex: 'id' },
            { title: '名称', dataIndex: 'name' },
            { title: '描述', dataIndex: 'description' },
            {
              title: '操作',
              render: (_, record: any) => (
                <>
                  <a
                    onClick={() => {
                      router.push({
                        pathname: '/device/tree/detail',
                        query: { id: record.id },
                      });
                    }}
                  >
                    查看
                  </a>
                  <Divider type="vertical" />
                  <a
                    onClick={() => {
                      setCurrnet(record);
                      setAdd(false);
                      setSaveVisible(true);
                    }}
                  >
                    编辑
                  </a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确认删除此分组？"
                    onConfirm={() => {
                      service.removeGroup(record.id).subscribe(
                        () => message.success('删除成功!'),
                        () => message.error('删除失败'),
                        () => search(),
                      );
                    }}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </>
              ),
            },
          ]}
          rowKey="id"
          onSearch={(params: any) => {
            search(params);
          }}
          paginationConfig={list}
        />
      </Card>
      {saveVisible && (
        <Save
          flag={add}
          data={current}
          close={() => {
            setSaveVisible(false);
          }}
          save={(item: GroupItem) => saveGroup(item)}
        />
      )}
    </PageHeaderWrapper>
  );
};
export default GroupList;
