import SearchComponent from '@/components/SearchComponent';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@jetlinks/pro-list';
import { Badge, Card } from 'antd';
import styles from './index.less';

const AccessConfig = () => {
  const dataSource = [
    {
      name: 'MQTT-官方协议接入',
      avatar: 'MQTT',
      state: 0,
      describe: ' 我是一条测试的描述我是一条测试的描述我是一条测试的描述我是一条测试',
    },
    {
      name: 'Modbus-TCP',
      avatar: 'Modbus-TCP',
      state: 0,
      describe: ' 我是一条测试的描述我是一条测试的描述我是一条测试',
    },
    {
      name: 'Modbus-TCP',
      avatar: 'Modbus',
      state: 1,
      describe: ' 我是一条测试的描述我是一条测试的描述',
    },
    {
      name: 'MQTT-官方协议接入',
      avatar: 'MQTT',
      state: 0,
      describe: ' 我是一条测试的描述',
    },
  ];

  return (
    <PageContainer>
      <Card>
        <SearchComponent field={[]} pattern={'simple'} onSearch={() => {}} />
        <ProList<any>
          pagination={{
            defaultPageSize: 8,
            showSizeChanger: false,
          }}
          showActions="always"
          rowKey="name"
          dataSource={dataSource}
          grid={{ gutter: 16, column: 2 }}
          showExtra="always"
          metas={{
            title: {
              dataIndex: 'name',
              render: (text, row) => (
                <div style={{ fontSize: 16 }}>
                  <div>
                    {text}
                    {/* <a style={{ marginLeft: '10px' }}>
                      <EditOutlined />
                    </a> */}
                    <Badge
                      color={row.state !== 1 ? 'red' : 'green'}
                      text={row.state !== 1 ? '禁用' : '正常'}
                      style={{ marginLeft: '20px' }}
                    />
                  </div>
                  <div className={styles.desc}>{row.describe}</div>
                </div>
              ),
            },
            avatar: {
              render: (text, reocrd) => <div className={styles.images}>{reocrd.avatar}</div>,
            },
            subTitle: {
              render: () => <div></div>,
            },
            content: {
              render: (text, row) => (
                <div className={styles.content}>
                  <div className={styles.server}>
                    <div className={styles.title}>MQTT服务</div>
                    <p>
                      <div>
                        <Badge color={'green'} text={'mqtt://192.1.1:8080'} />
                      </div>
                      <div>
                        <Badge color={'green'} text={'mqtt://192.1.1:8080'} />
                      </div>
                      <div>
                        <Badge color={'red'} text={'mqtt://192.1.1:8080'} />
                      </div>
                    </p>
                  </div>
                  <div className={styles.procotol}>
                    <div className={styles.title}>官方协议1.0</div>
                    <p style={{ color: 'rgba(0, 0, 0, .55)' }}>
                      {row.describe}
                      {row.describe}
                    </p>
                  </div>
                </div>
              ),
            },
            actions: {
              render: (text, row) => [
                <a key="edit">
                  <EditOutlined />
                  编辑
                </a>,
                <a key="warning">
                  {row.state === 1 ? (
                    <span>
                      <StopOutlined />
                      禁用
                    </span>
                  ) : (
                    <span>
                      <CheckCircleOutlined />
                      启用
                    </span>
                  )}
                </a>,
                <a key="remove">
                  <DeleteOutlined />
                  删除
                </a>,
              ],
            },
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default AccessConfig;
