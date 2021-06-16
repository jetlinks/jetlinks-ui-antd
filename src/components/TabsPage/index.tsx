import React, { useState } from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import TabPane, { TabPaneProps } from './TabPane';
import styles from './index.less';

interface TabsPageProps {
  children: React.ReactNode
  onChange?: (key: string | number) => void
}

const parseTabList = (children: React.ReactNode) => {
  return toArray(children).map((node: React.ReactElement<TabPaneProps>, index) => {
    const key = node.key !== undefined ? String(node.key) : undefined
    return {
      key,
      ...node.props,
      node
    }
  }).filter(tab => tab)
}

function TabsPage(props: TabsPageProps) {

  const tabs = parseTabList(props.children)

  const [activeKey, setActiveKey] = useState(tabs[0].key)


  return (
    <div className={styles.tabsPages}>
      <div className={styles.tabsBar}>
        {
          tabs.map(item => {
            const activeClass = activeKey === item.key ? styles.active : ''
            return <div
              className={`${styles.barItem} ${activeClass}`}
              key={item.key}
              onClick={() => {
                if (props.onChange) {
                  props.onChange(item.key!)
                }
                setActiveKey(item.key)
              }}
            >
              {
                item.img && <img src={item.img} alt="" />
              }
              <div className={styles.right}>
                <h2>
                  {item.title}
                </h2>
                {
                  item.International &&
                  <div> {item.International} </div>
                }
              </div>
            </div>
          })
        }
      </div>
      <div className={styles.content}>
        {
          tabs.map(item => {
            item.active = activeKey === item.key
            return <TabPane {...item} />
          })
        }
      </div>
    </div>
  );
}

TabsPage.TabsPane = TabPane

export default TabsPage;
