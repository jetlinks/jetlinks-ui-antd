import { Button, Modal, Row, Col, Tree, Table, Card, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { service } from '../index';
import EditableFormTable from './EditTable'
interface Props {
  save: Function;
  data: any;
}
const SelectForm = (props: Props) => {
  const id = props.data.id || '';
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [addTableName, setAddTableName] = useState<string>("");
  const [rdbList, setRdbList] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any>({});
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  /**
   * 获取右边表格数据
   */

  const getTableData = (id: string, key: string) => {
    if(!!id){
      service.rdbTables(id, key).subscribe(resp => {
        if(resp.status === 200){
          const list = resp.result.columns.map((item: any) => {
            return {...item, id: item.name}
          })
          setDataSource({
            ...resp.result,
            columns: [...list]
          })
        }
      })
    }
  }

  /**
   * 查询左侧表格列表
   */
  const getTableList = (id: string) => {
    service.rdbTree(id).subscribe(resp => {
      if(resp.status === 200){
        setRdbList(resp.result)
        getTableData(id, resp.result[0].name);
        setDefaultSelectedKeys([rdbList[0]?.name]);
        setIsEdit(false);
      }
    })
  }

  useEffect(() => {
    if(id && id !== ''){
      getTableList(id)
    }
  }, [props.data])

  /**
   * 保存数据
   */
  const saveRdbTables = (data: any) => {
    service.saveRdbTables(id, data).subscribe(resp => {
      if(resp.status === 200){
        message.success('保存成功');
        getTableList(id);
      }
    })
  }

  return (
      <Modal width={1400}
         onCancel={() => {props.save(); setIsEdit(false);}}
         visible
         onOk={() => {
           setIsEdit(false);
           props.save()
         }}
      >
        <Row gutter={24} style={{marginTop: '20px'}}>
          <Col span={6}>
            <div style={{height: '700px', overflowY: "auto"}}>
              <Tree
                showLine
                defaultExpandAll
                selectedKeys={[...defaultSelectedKeys]}
                onSelect={(selectedKeys) => {
                  getTableData(id,selectedKeys[0]);
                  setDefaultSelectedKeys([...selectedKeys])
                }}
              >
                <Tree.TreeNode title={`tables(${rdbList.length})`} key={'tables'}>
                  {
                    rdbList.map(item => (
                      <Tree.TreeNode key={item.name} title={item.name} />
                    ))
                  }
                </Tree.TreeNode>
              </Tree>
            </div>
          </Col>
          <Col span={18}>
            <Card title={dataSource.name ? `表名称：${dataSource.name}` : ''} bordered={false} extra={
              <div>
                <Button icon={'table'} type={'dashed'} onClick={() => {
                  setAddVisible(true);
                  setAddTableName("");
                }}>添加表</Button>
                {
                  dataSource.name && <Button icon={"plus"} style={{margin: '0 20px'}} onClick={() => {
                    const list = [...dataSource.columns]
                    list.push({
                      id: Math.random()*500000000,
                      name: '',
                      type: '',
                      length: 0,
                      scale: 0,
                      notnull: false,
                      comment: ''
                      ,                  })
                    setDataSource({
                      ...dataSource,
                      columns: [...list]
                    })
                  }}>添加列</Button>
                }
                {
                  isEdit && <Button type={'primary'} onClick={() => {
                    saveRdbTables({
                      name: dataSource.name,
                      columns: [...data]
                    });
                    setIsEdit(false);
                  }}>保存</Button>
                }
              </div>
            }>
              <div style={{height: '600px', overflowY: "auto"}}>
                <EditableFormTable 
                  id={id}
                  table={dataSource?.name}
                  save={(data: any) => {
                    const list = data.map((item: any) => {
                      const obj = { ...item }
                      delete obj.id
                      return { ...obj }
                    })
                    setData([...list]);
                    setIsEdit(true);
                  }} data={dataSource?.columns || []} />
              </div>
            </Card>
          </Col>
        </Row>
        <Modal
          title="添加表"
          visible={addVisible}
          onOk={() => {
            if(addTableName){
              rdbList.push({
                name: addTableName
              })
              setRdbList([...rdbList]);
              setDefaultSelectedKeys([addTableName]);
              setDataSource({
                "name":addTableName,
                "columns": []
              })
              setAddVisible(false);
              setAddTableName("");
              setIsEdit(false);
            }else{
              message.error("请输入需要添加的表格的名称")
            }
          }}
          onCancel={() => {
            setAddVisible(false);
          }}
        >
          <Input value={addTableName} onChange={(event) => {
            setAddTableName(event.target.value)
          }} placeholder={"请输入需要添加的表格的名称"} />
        </Modal>
      </Modal>
  );
};
SelectForm.isFieldComponent = true;
export default SelectForm;
