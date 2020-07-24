import React, {Fragment, useEffect, useState} from 'react';
import {FormComponentProps} from 'antd/lib/form';
import Form from 'antd/es/form';
import {Button, Drawer, Select, Spin, Table} from 'antd';
import apis from "@/services";
import styles from "@/utils/table.less";
import {ColumnProps} from "antd/lib/table";
import Search from "antd/es/input/Search";

interface Props extends FormComponentProps {
  data?: any;
  close: Function;
  choice: Function;
}

interface State {
  categoryLIst: any[];
  categoryAllLIst: any[];
}

const Classified: React.FC<Props> = props => {
  const initState: State = {
    categoryLIst: [],
    categoryAllLIst: [],
  };

  const [spinning, setSpinning] = useState(true);
  const [categoryLIst, setCategoryLIst] = useState(initState.categoryLIst);
  const [categoryAllLIst, setCategoryAllLIst] = useState(initState.categoryAllLIst);

  useEffect(() => {
    apis.deviceProdcut.deviceCategoryTree()
      .then((response: any) => {
        if (response.status === 200) {
          setCategoryLIst(response.result);
          response.result.map((item: any) => {
            item.children?.map((i: any) => {
              if (i.children) {
                i.children.map((data: any) => {
                  data['parentName'] = i.name;
                  data['categoryId'] = [item.id, i.id, data.id];
                  categoryAllLIst.push(data);
                })
              } else {
                i['parentName'] = item.name;
                i['categoryId'] = [item.id, i.id];
                categoryAllLIst.push(i);
              }
            });
          });
          setSpinning(false);
        }
      })
      .catch(() => {
      });
  }, []);

  const assemblyData = () => {
    let list: any[] = [];
    categoryLIst.map((item: any) => {
      item.children?.map((i: any) => {
        if (i.children) {
          i.children.map((data: any) => {
            data['parentName'] = i.name;
            data['categoryId'] = [item.id, i.id, data.id];
            list.push(data);
          })
        } else {
          i['parentName'] = item.name;
          i['categoryId'] = [item, i.id];
          list.push(i);
        }
      });
      setCategoryAllLIst(list);
    });
  };

  const findCategoryByPid = (value: string) => {
    categoryAllLIst.splice(0, categoryAllLIst.length);
    if (value === 'all') {
      assemblyData();
    } else {
      const category: Partial<any> =
        categoryLIst.find(i => i.id === value) || {};
      let list: any[] = [];
      category.children?.map((i: any) => {
        if (i.children) {
          i.children.map((data: any) => {
            data['parentName'] = i.name;
            data['categoryId'] = [value, i.id, data.id];
            list.push(data);
          })
        } else {
          i['parentName'] = category.name;
          i['categoryId'] = [value, i.id];
          list.push(i);
        }
        setCategoryAllLIst(list);
      });
    }
  };

  const findCategoryByVague = (value: string) => {
    if (value === '') {
      categoryAllLIst.splice(0, categoryAllLIst.length);
      assemblyData();
    } else {
      let list: any[] = [];
      categoryAllLIst.map((item: any) => {
        if (item.name.indexOf(value) !== -1 || item.parentName.indexOf(value) !== -1) {
          list.push(item);
        }
      });
      categoryAllLIst.splice(0, categoryAllLIst.length);
      setCategoryAllLIst(list);
    }
  };

  const columns: ColumnProps<any>[] = [
    {
      title: '品类名称',
      dataIndex: 'name',
    },
    {
      title: '所属场景',
      dataIndex: 'parentName',
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
              props.choice(record);
            }}>
              选择
            </a>
          )}
        </Fragment>
      ),
    },
  ];

  return (
    <Drawer
      visible
      title='选择品类'
      width='40%'
      onClose={() => props.close()}
      closable
    >
      <Spin spinning={spinning}>
        <div style={{paddingBottom: 20}}>
          <Select
            style={{width: '43%'}} defaultValue='all'
            onChange={(value: string) => {
              findCategoryByPid(value);
            }}
          >
            <Select.Option value="all">全部领域</Select.Option>
            {(categoryLIst || []).map(item => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
          <Search
            allowClear
            placeholder="请输入品类名称或者所属场景"
            enterButton
            onChange={(event: any) => {
              if (event.target.value === '') {
                assemblyData();
              }
            }}
            onSearch={value => {
              findCategoryByVague(value);
            }}
            style={{width: '43%', paddingLeft: 20}}
          />
        </div>
        <div className={styles.StandardTable}>
          <Table
            dataSource={categoryAllLIst || []}
            columns={columns}
            rowKey='id'
            pagination={{
              pageSize: 8,
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
