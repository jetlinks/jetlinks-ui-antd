import { ItemPanel, Item } from 'gg-editor';

import { Collapse } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import items from './item';
import apis from '@/services';

const { Panel } = Collapse;

interface Props {}

interface State {
  supportNode: string[];
}

const RuleItemPanel: React.FC<Props> = () => {
  const initState: State = {
    supportNode: [],
  };

  const [supportNode, setSupportNode] = useState(initState.supportNode);

  useEffect(() => {
    apis.ruleEngine.nodeList().then(response => {
      if (response) {
        setSupportNode(response.result);
      }
    });
  }, []);

  const renderItems = () =>
    items.map(
      type =>
        type.items.length > 0 && (
          <Panel header={type.title} key={type.key}>
            <div style={{ textAlign: 'center' }}>
              {type.items.length > 0 &&
                type.items.map(
                  item =>
                    supportNode.findIndex(i => i === item.model.executor) > -1 && (
                      <Item
                        type={item.type}
                        size={item.size}
                        shape={item.shape}
                        model={item.model}
                        src={item.src}
                        key={item.model.executor}
                      />
                    ),
                )}
            </div>
          </Panel>
        ),
    );

  return (
    <ItemPanel className={styles.itemPanel}>
      <Collapse bordered={false} defaultActiveKey={['start']}>
        {renderItems()}
      </Collapse>
    </ItemPanel>
  );
};

export default RuleItemPanel;
