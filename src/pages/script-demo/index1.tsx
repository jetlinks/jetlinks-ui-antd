import React, { Component } from 'react';
import { Rate, Input, DatePicker, Tag } from 'antd';
import Sortable from 'react-sortablejs';
import uniqueId from 'lodash/uniqueId';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import { indexToArray, getItem, setInfo, isPath, getCloneItem, itemRemove, itemAdd } from './utils';
import find from 'find-process';
import ReactDOM from 'react-dom';
const GlobalComponent = {
    Rate,
    Input,
    MonthPicker,
    RangePicker,
    WeekPicker,
}


const soundData = [
    {
        name: 'MonthPicker',
        attr: {}
    },
    {
        name: 'RangePicker',
        attr: {}
    },
    {
        name: 'WeekPicker',
        attr: {}
    },
    {
        name: 'Input',
        attr: {
            size: 'large',
            value: '第一个'
        }
    },
    {
        name: 'Containers',
        attr: {
            style: {
                border: '1px solid red'
            }
        },
    }
]

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Data: [{
                name: 'Input',
                attr: {
                    size: 'large',
                    value: '第一个'
                }
            }],
        };
    }

    // 拖拽的添加方法
    sortableAdd = evt => {
        // 组件名或路径
        const nameOrIndex = evt.clone.getAttribute('data-id');
        // 父节点路径
        const parentPath = evt.path[1].getAttribute('data-id');
        // 拖拽元素的目标路径
        const { newIndex } = evt;
        // 新路径 为根节点时直接使用index
        const newPath = parentPath ? `${parentPath}-${newIndex}` : newIndex;
        // 判断是否为路径 路径执行移动，非路径为新增
        if (isPath(nameOrIndex)) {
            // 旧的路径index
            const oldIndex = nameOrIndex;
            // 克隆要移动的元素
            const dragItem = getCloneItem(oldIndex, this.state.Data)
            // 比较路径的上下位置 先执行靠下的数据 再执行考上数据
            if (indexToArray(oldIndex) > indexToArray(newPath)) {
                // 删除元素 获得新数据
                let newTreeData = itemRemove(oldIndex, this.state.Data);
                // 添加拖拽元素
                newTreeData = itemAdd(newPath, newTreeData, dragItem)
                // 更新视图
                this.setState({ Data: newTreeData })
                return
            }
            // 添加拖拽元素
            let newData = itemAdd(newPath, this.state.Data, dragItem)
            // 删除元素 获得新数据
            newData = itemRemove(oldIndex, newData);

            this.setState({ Data: newData })
            return
        }

        // 新增流程 创建元素 => 插入元素 => 更新视图
        const id = nameOrIndex

        const newItem = _.cloneDeep(soundData.find(item => (item.name === id)))

        // 为容器或者弹框时增加子元素
        if (newItem.name === 'Containers') {
            const ComponentsInfo = _.cloneDeep(GlobalComponent[newItem.name])
            // 判断是否包含默认数据
            newItem.children = []
        }

        let Data = itemAdd(newPath, this.state.Data, newItem)

        this.setState({ Data })
    }

    render() {

        // 递归函数
        const loop = (arr, index) => (
            arr.map((item, i) => {
                const indexs = index === '' ? String(i) : `${index}-${i}`;
                if (item.children) {
                    return <div {...item.attr}
                        data-id={indexs}
                    >
                        <Sortable
                            key={uniqueId()}
                            style={{
                                minHeight: 100,
                                margin: 10,
                            }}
                            ref={c => c && (this.sortable = c.sortable)}
                            options={{
                                ...sortableOption,
                                // onUpdate: evt => (this.sortableUpdate(evt)),
                                onAdd: evt => (this.sortableAdd(evt)),
                            }}
                        >
                            {loop(item.children, indexs)}
                        </Sortable>
                    </div>
                }
                const ComponentInfo = GlobalComponent[item.name]
                return <div data-id={indexs} key={indexs}><ComponentInfo {...item.attr} key={indexs} /></div>
            })
        )

        const sortableOption = {
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            group: {
                name: 'formItem',
                pull: true,
                put: true,
            },
        }

        return (
            <>
                <h2>组件列表</h2>
                <Sortable
                    options={{
                        group: {
                            name: 'formItem',
                            pull: 'clone',
                            put: false,
                        },
                        sort: false,
                    }}
                >
                    {
                        soundData.map(item => {
                            return <div key={item.name} data-id={item.name} ><Tag>{item.name}</Tag></div>
                        })
                    }
                </Sortable>
                <h2>容器</h2>
                <Sortable
                    ref={c => c && (this.sortable = c.sortable)}
                    options={{
                        ...sortableOption,
                        // onUpdate: evt => (this.sortableUpdate(evt)),
                        onAdd: evt => (this.sortableAdd(evt)),
                    }}
                    key={uniqueId()}
                >
                    {loop(this.state.Data, '')}
                </Sortable>
            </>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('root'));
