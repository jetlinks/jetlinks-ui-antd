import { Card, Input, Switch } from 'antd';
// import { useEffect } from 'react';
import './index.less';
import { useDomFullHeight } from '@/hooks';
import ChannelList from './channelList';

const Editable = () => {
  const { minHeight } = useDomFullHeight('.modbus');

  // const data = [
  //   {
  //     "id": "1657787131289",
  //     "title": "",
  //     "decs": "这个活动真好玩",
  //     "state": "open",
  //     "created_at": "2020-05-26T09:42:56Z"
  //   },
  //   {
  //     "id": "1657787131290",
  //     "title": "活动名称1",
  //     "decs": "这个活动真好玩",
  //     "state": "open",
  //     "created_at": "2020-05-26T09:42:56Z"
  //   },
  // ]
  // useEffect(() => {
  //   const id = data.map((item) => item.id)
  //   // setEditableRowKeys(id)
  // }, [])
  return (
    <Card className="modbus" style={{ minHeight }}>
      <div className="edit-top">
        <Switch checkedChildren={'正常采集'} unCheckedChildren={'停止采集'} defaultChecked />
        <Input.Search
          placeholder="请输入属性"
          allowClear
          style={{ width: 190 }}
          onSearch={(value) => {
            console.log(value);
          }}
        />
      </div>
      <div className="edit-table">
        <ChannelList></ChannelList>
        {/* <EditableProTable
          rowKey="id"
          columns={columns}
          recordCreatorProps={false}
          value={data}
          editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            onValuesChange: (record) => {
              console.log(record)
            },
            actionRender: (row, config, defaultDoms) => {
              return [
                <Button onClick={() => {
                  console.log(row, config)
                }}>启用</Button>
              ];
            },
          }}
        /> */}
      </div>
    </Card>
  );
};
export default Editable;
