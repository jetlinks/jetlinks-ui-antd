import { Modal, Transfer, Tree } from "antd"
import { useState } from "react";
interface Props {
    visible: boolean;
    data: any;
    cancel: () => void;
}

const ChooseDepartment = (props: Props) => {
    const isChecked = (selectedKeys, eventKey) => selectedKeys.indexOf(eventKey) !== -1;

    const generateTree = (treeNodes = [], checkedKeys = []) =>
        treeNodes.map(({ children, ...props }) => ({
            ...props,
            disabled: checkedKeys.includes(props.key),
            children: generateTree(children, checkedKeys),
        }));

    const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
        const transferDataSource: any[] = [];
        function flatten(list = []) {
            list.forEach(item => {
                transferDataSource.push(item);
                flatten(item.children);
            });
        }
        flatten(dataSource);

        return (
            <Transfer
                {...restProps}
                showSearch
                titles={['选择', '已选']}
                targetKeys={targetKeys}
                dataSource={transferDataSource}
                className="tree-transfer"
                render={item => item.title}
                showSelectAll={false}
            >
                {({ direction, onItemSelect, selectedKeys }) => {
                    if (direction === 'left') {
                        const checkedKeys = [...selectedKeys, ...targetKeys];
                        return (
                            <Tree
                                blockNode
                                checkable
                                checkStrictly
                                defaultExpandAll
                                checkedKeys={checkedKeys}
                                treeData={generateTree(dataSource, targetKeys)}
                                onCheck={(_, { node: { key } }) => {
                                    onItemSelect(key, !isChecked(checkedKeys, key));
                                }}
                                onSelect={(_, { node: { key } }) => {
                                    onItemSelect(key, !isChecked(checkedKeys, key));
                                }}
                            />
                        );
                    }
                }}
            </Transfer>
        );
    };

    const treeData = [
        { key: '0-0', title: '0-0' },
        {
            key: '0-1',
            title: '0-1',
            children: [
                { key: '0-1-0', title: '0-1-0' },
                { key: '0-1-1', title: '0-1-1' },
            ],
        },
        { key: '0-2', title: '0-3' },
    ];

    const [targetKeys, setTargetKeys] = useState([]);
    const onChange = (keys: any) => {
        setTargetKeys(keys);
    };

    return (
        <Modal title="选择部门" width={900} visible={props.visible} onCancel={() => {
            props.cancel()
        }}>
            <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={onChange} />
        </Modal>
    )
}

export default ChooseDepartment