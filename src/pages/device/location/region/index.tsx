import React, { Fragment, useEffect, useState } from 'react';
import { FormComponentProps } from 'antd/lib/form';
import Form from 'antd/es/form';
import { Button, Divider, Drawer, message, Popconfirm, Spin, Table } from 'antd';
import styles from '@/utils/table.less';
import { ColumnProps } from 'antd/lib/table';
import apis from '@/services';
import SaveRegion from '@/pages/device/location/save/region';

interface Props extends FormComponentProps {
  close: Function;
}

interface State {
  regionList: any[];
  regionData: any;
}

const ManageRegion: React.FC<Props> = props => {
  const initState: State = {
    regionList: [],
    regionData: {},
  };

  const [regionList, setRegionList] = useState(initState.regionList);
  const [regionData, setRegionData] = useState(initState.regionData);
  const [saveRegion, setSaveRegion] = useState(false);
  const [spinning, setSpinning] = useState(true);
  const [regionIndex, setRegionIndex] = useState(-1);

  const handleSearch = (params?: any) => {
    regionList.splice(0, regionList.length);
    apis.location._search_geo_json(params)
      .then(response => {
          if (response.status === 200) {
            response.result.features.map((item: any) => {
              regionList.push(item);
            });
            setRegionList([...regionList]);
            setSpinning(false);
          }
        },
      ).catch(() => {
    });
  };

  useEffect(() => {
    handleSearch({
      'filter': {
        'where': 'objectType not device',
      },
    });
  }, []);

  const saveByGeoJson = (data: any, index: number) => {
    apis.location.saveByGeoJson(data)
      .then((response: any) => {
        if (response.status === 200) {
          message.success('区域信息保存成功');
          if (index === -1) {
            data.features.map((item: any) => {
              regionList.push(item);
            });
            setRegionList([...regionList]);
          } else {
            regionList.splice(index, 1, data.features[0]);
            setRegionList([...regionList]);
          }
        }
      })
      .catch(() => {
      });
  };

  const _delete = (record: any, index: number) => {
    apis.location._delete(record.properties.id)
      .then(response => {
          if (response.status === 200) {
            message.success('删除成功');
            regionList.splice(index, 1);
            setRegionList([...regionList]);
          }
          setSpinning(false);
        },
      ).catch(() => {
    });
  };

  const columns: ColumnProps<any>[] = [
    {
      title: '区域标识',
      dataIndex: 'properties.id',
    },
    {
      title: '区域名称',
      dataIndex: 'properties.name',
    },
    {
      title: '操作',
      width: '20%',
      render: (text, record, index: number) => (
        <Fragment>
          <a
            onClick={() => {
              setRegionIndex(index);
              setSaveRegion(true);
              setRegionData(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical"/>
          <Popconfirm
            title="确认删除此区域吗？"
            onConfirm={() => {
              setSpinning(true);
              _delete(record, index);
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
              setRegionIndex(-1);
              setSaveRegion(true);
              setRegionData({});
            }}
          >
            新建
          </Button>
        </div>
        <div className={styles.StandardTable} style={{ paddingTop: 20 }}>
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
          style={{ marginRight: 8 }}
        >
          关闭
        </Button>
      </div>
      {saveRegion && (
        <SaveRegion data={regionData} regionIndex={regionIndex} save={(data: any, index: number) => {
          saveByGeoJson(data, index);
          setSaveRegion(false);
        }} close={() => {
          setRegionIndex(-1);
          setSaveRegion(false);
        }}/>
      )}
    </Drawer>
  );
};

export default Form.create<Props>()(ManageRegion);
