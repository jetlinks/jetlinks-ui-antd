import { Button, Card, Modal, Tree } from 'antd';
import './index.less';

interface Props {
  close: any;
}

const MapTree = (props: Props) => {
  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      disableCheckbox: true,
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
              disableCheckbox: true,
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
        },
      ],
    },
  ];

  // const filterTree = (treeData:any) =>{

  // }

  return (
    <Modal
      title="批量映射"
      visible
      onCancel={() => {
        props.close();
      }}
      onOk={() => {
        props.close();
      }}
      width="900px"
    >
      <div className="map-tree">
        <div className="map-tree-top">
          采集器的点位名称与属性名称一致时将自动映射绑定；有多个采集器点位名称与属性名称一致时以第1个采集器的点位数据进行绑定
        </div>
        <div className="map-tree-content">
          <Card title="源数据" className="map-tree-card">
            <Tree
              treeData={treeData}
              checkable
              defaultExpandedKeys={['0-0']}
              onCheck={(checked) => {
                console.log(checked, 'checked');
              }}
              // fieldNames={}
            />
          </Card>
          <div>
            <Button>加入右侧</Button>
          </div>
          <Card title="采集器" className="map-tree-card"></Card>
        </div>
      </div>
    </Modal>
  );
};
export default MapTree;
