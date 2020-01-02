import { ItemPanel, Item } from 'gg-editor';

import { Collapse, Card } from 'antd';
import React, { Component } from 'react';
import styles from './index.less';
import items from './item';
import { ItemType } from './RuleItem';
const { Panel } = Collapse;

interface RuleItemPanelProps {

}

interface RuleItemPanelState {
    itemData: ItemType[];
}

class RuleItemPanel extends Component<RuleItemPanelProps, RuleItemPanelState>{

    state: RuleItemPanelState = {
        itemData: [],
    }

    componentDidMount() {
        this.setState({
            itemData: items,
        })
        const me = this;
        // this.state.data = { "nodes": [{ "type": "node", "size": "72*72", "shape": "flow-circle", "color": "#FA8C16", "label": "启动任务", "executor": "timer", "x": 423.84375, "y": 167, "id": "67a26f33", "remark": "测试Timer", "config": { "cron": "0 1-2 * * * ? ", "defaultData": "dsfsfs" }, "index": 0 }, { "type": "node", "size": "80*48", "shape": "flow-capsule", "color": "#B37FEB", "label": "Querys", "executor": "sql", "x": 419.84375, "y": 296, "id": "c289e872", "remark": "测试查询sdf", "config": { "dataSourcedId": "mysql", "stream": true, "transaction": true, "script": "select * from table;" }, "index": 1 }, { "type": "node", "size": "120*48", "shape": "flow-rect", "color": "#1890FF", "label": "数据转换", "executor": "dataMapping", "x": 576.84375, "y": 353, "id": "cdd8828a", "index": 3, "remark": "sdfs", "config": { "mappings": [{ "key": "0", "source": "12312", "target": "31231", "type": "132" }], "keepSourceData": true } }], "edges": [{ "source": "67a26f33", "sourceAnchor": 2, "target": "c289e872", "targetAnchor": 0, "id": "9e1baa72", "index": 2 }, { "source": "c289e872", "sourceAnchor": 1, "target": "cdd8828a", "targetAnchor": 0, "id": "501d68ca", "index": 4 }] };
        // if (window.onRuleEditorInited) {
        //     window.onRuleEditorInited({
        //         setItemData: function (data: any) {
        //             me.state.itemData = data;
        //         },
        //     });
        // }
    }

    renderItems = () => {
        const { itemData } = this.state;

        return itemData.map(type => (
            <Panel header={type.title} key={type.key}>
                <div style={{ textAlign: 'center' }}>
                    {type.items.length > 0 ? type.items.map(item => (
                        <Item
                            type={item.type}
                            size={item.size}
                            shape={item.shape}
                            model={item.model}
                            src={item.src}
                            key={item.id}
                        />
                    )) : ""}
                </div>
            </Panel>
        ))
    }

    render() {
        return (
            <ItemPanel className={styles.itemPanel}>
                <Collapse bordered={false} defaultActiveKey={['start']}>
                    {
                        this.renderItems()
                    }
                </Collapse>
            </ItemPanel>
        );
    }
}

export default RuleItemPanel;
