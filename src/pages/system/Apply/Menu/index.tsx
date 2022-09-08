import { Modal, Tree } from 'antd';
import { useEffect, useState } from 'react';
import { service } from '../index';

interface Props {
  close: Function;
  data: string;
}

const MenuPage = (props: Props) => {
  const [treeData, setTreeData] = useState<undefined | any[]>(undefined);
  const [keys, setKeys] = useState<any>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const getTree = async () => {
    const res = await service.queryOwner(['iot']);
    if (res.status === 200) {
      const resp = await service.queryOwnerTree(res.result?.[0]);
      if (resp.status === 200) {
        setTreeData(resp.result);
        // console.log(resp.result)
      }
    }
  };

  // const filterTree = (tree:any[],parms: any[]) => {
  //     return tree.filter(item=>{
  //         console.log(item)
  //         return parms?.indexOf(item.id) > -1
  //     }).map(i=>{
  //         i = Object.assign({},i)
  //         if(i.children){
  //             i.children = filterTree(i.children,parms)
  //         }
  //         return i
  //     })
  // }

  useEffect(() => {
    getTree();
  }, []);

  return (
    <Modal
      visible
      maskClosable={false}
      title="集成菜单"
      width={800}
      onCancel={() => {
        props.close();
      }}
      onOk={() => {
        // if(treeData && treeData.length!==0){
        //     const item = filterTree(treeData,keys.checked)
        //     console.log(item)
        // }
        // console.log(keys)
      }}
    >
      <Tree
        fieldNames={{
          title: 'name',
          key: 'id',
        }}
        checkable
        // checkStrictly={true}
        treeData={treeData}
        checkedKeys={keys}
        autoExpandParent={true}
        onCheck={(_keys: any, e) => {
          console.log(e);
          setKeys(_keys);
        }}
        expandedKeys={expandedKeys}
        onExpand={(_keys: any[]) => {
          setExpandedKeys(_keys);
        }}
      />
    </Modal>
  );
};

export default MenuPage;
