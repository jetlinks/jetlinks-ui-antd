import React, {Fragment, useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Button, Drawer, Spin, Table} from 'antd';
import apis from "@/services";
import styles from "@/utils/table.less";
import {ColumnProps} from "antd/lib/table";
import treeTool from 'tree-tool';
import Search from "antd/es/input/Search";
import encodeQueryParam from "@/utils/encodeParam";

interface Props extends FormComponentProps {
  data?: any;
  close: Function;
  choice: Function;
}

const Classified: React.FC<Props> = props => {

  const [spinning, setSpinning] = useState(true);
  const [categoryLIst, setCategoryLIst] = useState<any[]>([]);
  const [categoryAllLIst, setCategoryAllLIst] = useState<any[]>([]);

  useEffect(() => {
    apis.deviceProdcut.deviceCategoryTree(encodeQueryParam({paging: false, sorts: {field: 'id', order: 'desc'}}))
      .then((response: any) => {
        if (response.status === 200) {
          setCategoryLIst(response.result);
          setCategoryAllLIst(response.result);
          setSpinning(false);
        }
      })
      .catch(() => {
      });
  }, []);

  const columns: ColumnProps<any>[] = [
    {
      title: '标识',
      align: 'left',
      dataIndex: 'key',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '操作',
      width: '120px',
      align: 'center',
      render: (record: any) => (
        <Fragment>
          {props.data.id === record.id ? (
            <span>
              已选择
            </span>
          ) : (
            <a onClick={() => {
              let idList: string[] = [];
              const pathList = treeTool.findPath(categoryAllLIst, function (n: any) {
                return n.id == record.parentId
              }); // pathList所有父级data组成的
              if (pathList != null && pathList.length > 0) {
                idList = pathList.map(n => n.id);// idList即为所求的上级所有ID
              }
              idList.push(record.id);
              record['categoryId'] = idList;
              props.choice(record);
            }}>
              选择
            </a>
          )}
        </Fragment>
      ),
    },
  ];

  const instance = treeTool.createInstance(categoryAllLIst, {pid: 'parentId'});

  const findCategoryByVague = (value: string) => {
    if (value === '') {
      categoryLIst.splice(0, categoryLIst.length);
      setCategoryLIst(categoryAllLIst);
    } else {
      let result = instance.findNodeAll(categoryAllLIst, function (node: any) {
        return node.name.indexOf(value) != -1;
      });
      setCategoryLIst(result);
    }
  };

  return (
    <Drawer
      visible
      title='选择品类'
      width='50%'
      onClose={() => props.close()}
      closable
    >
      <Spin spinning={spinning}>
        <Search
          allowClear
          placeholder="请输入品类名称或者所属场景"
          enterButton
          onSearch={value => {
            findCategoryByVague(value);
          }}
          style={{width: '43%', paddingBottom: 20}}
        />
        <div className={styles.StandardTable}>
          <Table
            dataSource={categoryLIst || []}
            columns={columns}
            rowKey='id'
            pagination={{
              pageSize: 10,
            }}
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
        >
          关闭
        </Button>
      </div>

    </Drawer>
  );
};

export default Form.create<Props>()(Classified);
