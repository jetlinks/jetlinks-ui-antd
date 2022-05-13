import { Button, Table } from 'antd';

export default () => {
  // const [selectKeys, setSelectKeys] = useState<string[]>([])

  const save = () => {};

  return (
    <div>
      <Table
        columns={[
          {
            title: 'API',
            dataIndex: 'name',
          },
          {
            title: '说明',
            dataIndex: '',
          },
        ]}
      />
      <Button type={'primary'} onClick={save}>
        保存
      </Button>
    </div>
  );
};
