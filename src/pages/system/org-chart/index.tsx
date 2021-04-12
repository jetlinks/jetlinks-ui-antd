import { SmallDashOutlined, UserOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import OrganizationChart from '@dabeng/react-orgchart';
import { Avatar, Dropdown, Menu, message } from 'antd';
import styles from './index.less';

import React from 'react';
const ds = {
  id: 'n1',
  name: 'Lao Lao',
  title: 'general manager',
  children: [
    { id: 'n2', name: 'Bo Miao', title: 'department manager' },
    {
      id: 'n3',
      name: 'Su Miao',
      title: 'department manager',
      children: [
        { id: 'n4', name: 'Tie Hua', title: 'senior engineer' },
        {
          id: 'n5',
          name: 'Hei Hei',
          title: 'senior engineer',
          children: [
            { id: 'n6', name: 'Dan Dan', title: 'engineer' },
            { id: 'n7', name: 'Xiang Xiang', title: 'engineer' },
          ],
        },
        { id: 'n8', name: 'Pang Pang', title: 'senior engineer' },
      ],
    },
    { id: 'n9', name: 'Hong Miao', title: 'department manager' },
    {
      id: 'n10',
      name: 'Chun Miao',
      title: 'department manager',
      children: [{ id: 'n11', name: 'Yue Yue', title: 'senior engineer' }],
    },
  ],
};
const OrgChart = () => {
  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      </Menu.Item>
      <Menu.Item disabled>
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item disabled>
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      </Menu.Item>
      <Menu.Item>a danger item</Menu.Item>
    </Menu>
  );
  return (
    <PageHeaderWrapper title="组织架构图">
      <div className={styles.testContainer}>
        <OrganizationChart
          datasource={ds}
          draggable
          onClickNode={(node: any) => {
            message.success(JSON.stringify(node));
          }}
          NodeTemplate={(nodeData: any) => {
            return (
              <div className={styles.node}>
                <div className={styles.top}>
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      marginRight: '12px',
                    }}
                  >
                    重庆市顺达行车监控技术服务有限公司
                  </span>
                  <Avatar size="small" icon={<UserOutlined />} />
                </div>

                <div className={styles.content}>
                  <div className={styles.item}>
                    <div>
                      <span className={styles.mark}>标识</span>
                      <span>xxxxxxxxxx</span>
                    </div>
                    <div>
                      <span className={styles.mark}>子节点</span>
                      <span>90099999999999999</span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: '100%',
                      verticalAlign: 'bottom',
                      alignSelf: 'flex-end',
                      paddingBottom: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    <Dropdown overlay={menu}>
                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <SmallDashOutlined />
                      </a>
                    </Dropdown>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </PageHeaderWrapper>
  );
};
export default OrgChart;
