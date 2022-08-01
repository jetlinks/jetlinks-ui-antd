import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/utils/table.less';
import { Card, Tabs } from 'antd';
import Activation from './Activation'
import Renewal from './Renewal'

const queryTransactionList: React.FC<{}> = () => {
  return (
    <PageHeaderWrapper title="查询交易">
      <div className={styles.standardList}>
        <Card bordered={false}>
          <Tabs defaultActiveKey="Activation">
            <Tabs.TabPane tab="操作记录" key="Activation">
              <Activation />
            </Tabs.TabPane>
            <Tabs.TabPane tab="续费记录" key="Renewal">
              <Renewal />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </PageHeaderWrapper>
  )
};
export default queryTransactionList
