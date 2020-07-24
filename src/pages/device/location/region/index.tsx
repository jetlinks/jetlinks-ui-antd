import React, {Fragment, useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Button, Divider, Drawer, message, Popconfirm, Spin, Table} from 'antd';
import styles from '@/utils/table.less';
import {ColumnProps} from 'antd/lib/table';
import apis from '@/services';
import SaveRegion from '@/pages/device/location/save/region';

interface Props extends FormComponentProps {
  close: Function;
}

interface State {
  regionList: any[];
  regionData: any;
  regionAllData: any;
}

const ManageRegion: React.FC<Props> = props => {
  const initState: State = {
    regionList: [],
    regionData: {},
    regionAllData: {},
  };

  const [regionList, setRegionList] = useState(initState.regionList);
  const [regionData, setRegionData] = useState(initState.regionData);
  const [regionAllData] = useState(initState.regionAllData);
  const [saveRegion, setSaveRegion] = useState(false);
  const [spinning, setSpinning] = useState(true);

  const handleSearch = (params?: any) => {
    regionList.splice(0, regionList.length);
    apis.location._search_geo_json(params)
      .then(response => {
          if (response.status === 200) {
            let list: any[] = [];
            response.result.features.map((item: any) => {
              list.push(item.properties);
              regionAllData[item.properties.id] = item;
            });
            setTreeData(list);
          }
          setSpinning(false);
        },
      ).catch(() => {
    });
  };


  const setTreeData = (arr: any[]) => {
    arr.forEach(function (item) {
      delete item.children;
    });
    let map = {};
    arr.forEach(i => {
      map[i.id] = i;
    });
    let treeData: any[] = [];
    arr.forEach(child => {
      const mapItem = map[child.parentId];
      if (mapItem) {
        (mapItem.children || (mapItem.children = [])).push(child);
      } else {
        treeData.push(child);
      }
    });
    setRegionList(treeData);
    setSpinning(false);
  };

  useEffect(() => {
    handleSearch({
      filter: {
        where: 'objectType not device',
        pageSize: 1000
      },
    });
  }, []);

  const saveByGeoJson = (data: any) => {
    apis.location.saveByGeoJson(data)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('区域信息保存成功');
          setTimeout(function () {
            handleSearch({
              filter: {
                where: 'objectType not device',
                pageSize: 1000
              },
            });
          }, 1000);
        }
      })
      .catch(() => {
      });
  };

  const _delete = (record: any) => {
    apis.location._delete(record.id)
      .then(response => {
          if (response.status === 200) {
            message.success('删除成功');
            setTimeout(function () {
              handleSearch({
                filter: {
                  where: 'objectType not device',
                  pageSize: 1000
                },
              });
            }, 1000);
          }
        },
      ).catch(() => {
    });
  };

  const columns: ColumnProps<any>[] = [
    {
      title: '区域标识',
      dataIndex: 'id',
      width: '50%',
    },
    {
      title: '区域名称',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record) => (
        <Fragment>
          <a
            onClick={() => {
              setSaveRegion(true);
              setRegionData(regionAllData[record.id]);
            }}
          >
            编辑
          </a>
          <Divider type="vertical"/>
          <Popconfirm
            title="确认删除此区域吗？"
            onConfirm={() => {
              setSpinning(true);
              _delete(record);
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  return (
    <Drawer
      visible
      title='区域管理'
      width='50%'
      onClose={() => props.close()}
      closable
    >
      <Spin tip="加载中..." spinning={spinning}>
        <div className={styles.tableListOperator}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              setSaveRegion(true);
              setRegionData({});
            }}
          >
            新建
          </Button>
        </div>
        <div className={styles.StandardTable} style={{paddingTop: 20}}>
          <Table
            dataSource={regionList}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </div>
      </Spin>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            props.close();
          }}
          style={{marginRight: 8}}
        >
          关闭
        </Button>
      </div>
      {saveRegion && (
        <SaveRegion data={regionData} save={(data: any) => {
          setSpinning(true);
          saveByGeoJson(data);
          setSaveRegion(false);
        }} close={() => {
          setSpinning(true);
          handleSearch({
            filter: {
              where: 'objectType not device',
              pageSize: 1000
            },
          });
          setSaveRegion(false);
        }}/>
      )}
    </Drawer>
  );
};

export default Form.create<Props>()(ManageRegion);
