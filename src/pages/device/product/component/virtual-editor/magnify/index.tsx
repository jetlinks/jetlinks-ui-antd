import React, { useEffect, useState } from "react";
import { AutoComplete, Dropdown, Icon, Input, Menu, Modal, Table, Tabs, Tooltip } from "antd";
import QuickInsertComponent from '../quick-insert';
import styles from './index.less';
import { MoreOutlined } from "@ant-design/icons";
import MonacoEditor from 'react-monaco-editor';
import { getWebsocket } from "@/layouts/GlobalWebSocket";

interface Props {
    close: Function;
    data: any;
    metaDataList: any[];
}

const MagnifyComponent: React.FC<Props> = (props) => {

    const [quickInsertVisible, setQuickInsertVisible] = useState<boolean>(props.data.isAssign);
    const [assignVisible, setAssignVisible] = useState<boolean>(props.data.isAssign);
    const [dataList, setDataList] = useState<any[]>([]);
    const [result, setResult] = useState<string>('');
    const [subs, setSubs] = useState<any>();
    const [sub, setSub] = useState<any>();
    const [otherList, setOtherList] = useState<any[]>([]);
    const [isBeginning, setIsBeginning] = useState(true);
    const [editor, setEditor] = useState<any>(null);
    const [script, setScript] = useState(props.data.expands?.virtualRule?.script || '');
    const [virtualRule, setVirtualRule] = useState(props.data.expands?.virtualRule || {});
    const [virtualId, setVirtualId] = useState('');
    const symbolList = [
        {
            key: 'add', 
            value: '+'
        },
        {
            key: 'subtract', 
            value: '-'
        },
        {
            key: 'multiply', 
            value: '*'
        },
        {
            key: 'divide', 
            value: '/'
        },{
            key: 'parentheses',
            value: '()'
        },
        {
            key: 'cubic',
            value: '^'
        }
    ]
    const otherSymbolList = [
        {
            key: 'dayu', 
            value: '>'
        },
        {
            key: 'dayudengyu', 
            value: '>='
        },
        {
            key: 'dengyudengyu', 
            value: '=='
        },
        {
            key: 'xiaoyudengyu', 
            value: '<='
        },{
            key: 'xiaoyu',
            value: '<'
        },
        {
            key: 'jiankuohao',
            value: '<>'
        },
        {
            key: 'andand',
            value: '&&'
        },
        {
            key: 'huohuo',
            value: '||'
        },
        {
            key: 'fei',
            value: '!'
        },
        {
            key: 'and',
            value: '&'
        },
        {
            key: 'huo',
            value: '|'
        },
        {
            key: 'bolang',
            value: '~'
        }
    ]

    const handleChange = (value: any, record: any) => {
        for (let i in value) {
            record[i] = value[i];
            dataList.map((item) =>
                item.key == record.key ? { ...item, [i]: value[i] } : item)
            setDataList([...dataList])
        }
    }

    const columns = [
        {
            title: '属性ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            render: (text: string, record: any) => <AutoComplete dataSource={otherList} />
        },
        {
            title: '属性当前值',
            dataIndex: 'current',
            key: 'current',
            render: (text: string, record: any) => <Input value={text} onChange={(e) => {
                handleChange({ current: e.target.value }, record);
            }} />
        },
        {
            title: '属性上一值',
            dataIndex: 'last',
            key: 'last',
            render: (text: string, record: any) => <Input value={text} onChange={(e) => {
                handleChange({ last: e.target.value }, record);
            }} />
        },
        {
            title: '',
            with: 200,
            align: 'center',
            render: (text: string, record: any, index: number) => (
                <span onClick={() => {
                    dataList.splice(index, 1);
                    setDataList([...dataList]);
                }}>
                    <Icon type="delete" />
                </span>
            ),
        }
    ];
    const debugProperty = () => {
        console.log('开始调试');
        if (subs) {
            subs.unsubscribe()
        }
        const ws = getWebsocket(
            `virtual-property-debug-${props.data.id}-${new Date().getTime()}`,
            `/virtual-property-debug`,
            {
                virtualId: virtualId,
                property: props.data.id,
                virtualRule: virtualRule,
                properties: [...dataList]
            },
        ).subscribe(
            (resp: any) => {
                const { payload } = resp;
                setResult(payload);
                setIsBeginning(true);
            }
        );
        setSubs(ws);
    };

    const debugPropertyAgain = () => {
        if (sub) {
            sub.unsubscribe()
        }
        const ws = getWebsocket(
            `virtual-property-debug-${props.data.id}-${new Date().getTime()}`,
            `/virtual-property-debug`,
            {
                virtualId: virtualId,
                property: props.data.id,
                virtualRule: virtualRule,
                properties: [...dataList]
            },
        ).subscribe(
            (resp: any) => {
                console.log(resp);
            }
        );
        setSub(ws);
    };

    const insertContent = (content: string) => {
        const position = editor.getPosition();
        editor.executeEdits('', [
            {
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                },
                text: content
            }
        ]);
    }


    useEffect(() => {
        setVirtualId(`${new Date().getTime()}-virtual-id`)
        if (props.metaDataList.length > 0) {
            let data: any[] = [];
            props.metaDataList.map(item => {
                if (item.id !== props.data.id) {
                    data.push(item.id)
                }
            })
            setOtherList([...data]);
        }
    }, []);

    const menu = () => {
        return (
            <Menu onClick={(e) => {
                console.log(e.key)
                // insertContent(item)
            }}>
                {
                    otherSymbolList.map(item => {
                        <Menu.Item key={item.key}>{item.value}</Menu.Item>
                    })
                }
            </Menu>
        )
    }

    const editorDidMountHandle = (editor: any, monaco: any) => {
        editor.focus();
    }

    return (
        <Modal
            closable={false}
            visible
            width={quickInsertVisible ? 1200 : 840}
            footer={false}
        >
            <div className={styles.box}>
                <div className={styles.boxLeft} style={{ width: quickInsertVisible ? '68%' : "100%" }}>
                    <div className={styles.header}>
                        <span>设置属性计算规则</span>
                        <div onClick={() => { props.close() }}><Icon type="fullscreen-exit" /></div>
                    </div>
                    <div className={styles.editorBox} style={{ height: assignVisible ? '400px' : '740px' }}>
                        <div className={styles.editorTop}>
                            <div className={styles.topLeft}>
                                {symbolList.map((item: any, index: number) => {
                                    return <span key={item.key} onClick={() => {
                                        insertContent(symbolList[index].value)
                                    }}>{item.value}</span>
                                })}
                                <span>
                                    <Dropdown overlay={() => (
                                        <Menu>
                                            {
                                                otherSymbolList.map((item, index) => (
                                                    <Menu.Item key={item.key} onClick={() => {
                                                        insertContent(otherSymbolList[index].value)
                                                    }}>{item.value}</Menu.Item>
                                                ))
                                            }
                                        </Menu>
                                    )}>
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <MoreOutlined />
                                        </a>
                                    </Dropdown>
                                </span>
                            </div>
                            <div className={styles.topRight}>
                                <span onClick={() => { setAssignVisible(true) }}><Tooltip title="进行调试"><a>进行调试</a></Tooltip></span>
                                <span onClick={() => { setQuickInsertVisible(true) }}><Tooltip title="快速添加"><a>快速添加</a></Tooltip></span>
                            </div>
                        </div>
                        <MonacoEditor
                            ref={l => setEditor(l && l.editor)}
                            height={assignVisible ? 350 : 700}
                            language='groovy'
                            theme='vs'
                            value={script}
                            options={{
                                selectOnLineNumbers: true
                            }}
                            onChange={(value) => {
                                setScript(value);
                                virtualRule.script = value;
                                setVirtualRule(virtualRule);
                            }}
                            editorDidMount={(editor, monaco) => editorDidMountHandle(editor, monaco)}
                        />
                    </div>
                    {assignVisible && <div className={styles.assignBox}>
                        <div className={styles.assignBoxLeft}>
                            <div className={styles.leftHeader}>
                                <div className={styles.itemLeft}>属性赋值</div>
                                <div className={styles.itemRight}>请对上方规则使用的属性进行赋值</div>
                                {!isBeginning && props.data.expands?.virtualRule?.type === 'window' && (<div className={styles.item} onClick={() => {
                                    debugPropertyAgain();
                                }}><a>发送数据</a></div>)}
                            </div>
                            <Table rowKey="key" size="middle" columns={columns} dataSource={dataList} pagination={false} scroll={{ y: 195 }}
                                footer={() => <a onClick={() => {
                                    dataList.push({
                                        key: `${new Date().getTime()}`,
                                        id: '',
                                        current: '',
                                        last: ''
                                    })
                                    setDataList([...dataList]);
                                }}><Icon type="plus-circle" /> 添加</a>}
                            />
                        </div>
                        <div className={styles.assignBoxRight}>
                            <div className={styles.editorTop}>
                                <div className={styles.topLeft}>
                                    {/* <div>运行详情</div>
                                    <div>错误</div> */}
                                    <div>运行结果</div>
                                </div>
                                <div className={styles.topRight}>
                                    <div>
                                        {isBeginning ? (<a onClick={() => {
                                            setIsBeginning(false);
                                            debugProperty()
                                        }}>开始运行</a>) : (<a onClick={() => {
                                            setIsBeginning(true);
                                            subs.unsubscribe();
                                        }}>停止运行</a>)}
                                    </div>
                                    <div onClick={() => {
                                        setResult('')
                                    }}><a>清空</a></div>
                                </div>
                            </div>
                            <MonacoEditor
                                height={295}
                                language='groovy'
                                theme='vs'
                                value={result}
                                options={{
                                    selectOnLineNumbers: true,
                                    readOnly: true
                                }}
                                editorDidMount={(editor, monaco) => editorDidMountHandle(editor, monaco)}
                            />
                        </div>
                    </div>}
                </div>
                {quickInsertVisible && <div className={styles.boxRight}>
                    <div className={styles.rightHeader}>
                        <span>快速添加</span>
                        <div onClick={() => { setQuickInsertVisible(false) }}><Icon type="close" /></div>
                    </div>
                    <QuickInsertComponent insertContent={(data: string) => {insertContent(data)}} metaDataList={props.metaDataList} close={() => { }} />
                </div>}
            </div>
        </Modal>
    );
}
export default MagnifyComponent;


 // const menu = () => {
    //     return (
    //         <Menu>
    //             <Menu.Item>
    //                 <div className={styles.menuBox}>
    //                     <div>&gt;</div>
    //                     <div>&gt;=</div>
    //                     <div>==</div>
    //                     <div>&lt;=</div>
    //                     <div>&lt;</div>
    //                     <div>&lt;&gt;</div>
    //                     <div>&amp;&amp;</div>
    //                     <div>||</div>
    //                     <div>!</div>
    //                     <div>&amp;</div>
    //                     <div>|</div>
    //                     <div>~</div>
    //                 </div>
    //             </Menu.Item>
    //         </Menu>
    //     )
    // }