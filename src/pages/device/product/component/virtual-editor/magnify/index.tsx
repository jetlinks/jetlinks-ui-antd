import React, { useEffect, useState } from "react";
import { AutoComplete, Descriptions, Dropdown, Icon, Input, Menu, Modal, Table, Tooltip } from "antd";
import QuickInsertComponent from '../quick-insert';
import styles from './index.less';
import { MoreOutlined } from "@ant-design/icons";
// import MonacoEditor from 'react-monaco-editor';
import { getWebsocket } from "@/layouts/GlobalWebSocket";
import AceEditor from "react-ace";
import moment from "moment";

interface Props {
    close: Function;
    data: any;
    metaDataList: any[];
    formData: any;
}

const MagnifyComponent: React.FC<Props> = (props) => {

    const [quickInsertVisible, setQuickInsertVisible] = useState<boolean>(props.data.isAssign);
    const [assignVisible, setAssignVisible] = useState<boolean>(props.data.isAssign);
    const [dataList, setDataList] = useState<any[]>([]);
    const [result, setResult] = useState<any[]>([]);
    const [subs, setSubs] = useState<any>();
    const [sub, setSub] = useState<any>();
    const [otherList, setOtherList] = useState<any[]>([]);
    const [isBeginning, setIsBeginning] = useState(true);
    const [editor, setEditor] = useState<any>(null);
    const [script, setScript] = useState(props.data.script || '');
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
        }, {
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
        }, {
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
            render: (text: string, record: any) =>
                <AutoComplete onChange={(value) => {
                    let data: any = otherList.find((item) => {
                        return item.id === value
                    })
                    handleChange({ id: value, type: data?.type }, record);
                }}>
                    {
                        otherList.map(item => <AutoComplete.Option key={item.id}>{item.id}</AutoComplete.Option>)
                    }
                </AutoComplete>
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
        console.log('开始调试...');

        let data: any[] = [];
        dataList.map(item => {
            data.push({
                id: item.id,
                current: item.current,
                last: item.last,
                type: item.type
            })
        })

        if (subs) {
            subs.unsubscribe()
        }
        const ws = getWebsocket(
            `virtual-property-debug-${props.data.id}-${new Date().getTime()}`,
            `/virtual-property-debug`,
            {
                virtualId: virtualId,
                property: props.data.id,
                virtualRule: {
                    ...virtualRule,
                    script: script
                },
                properties: [...data]
            },
        ).subscribe(
            (resp: any) => {
                const { payload } = resp;
                result.push({
                    time: new Date().getTime(),
                    log: JSON.stringify(payload)
                })
                setResult([...result]);
            },
            () => { }
            , () => {
                setIsBeginning(true);
            }
        )
        setSubs(ws);
    };

    const debugPropertyAgain = () => {

        let data: any[] = [];

        dataList.map(item => {
            data.push({
                id: item.id,
                current: item.current,
                last: item.last,
                type: item.type
            })
        })

        if (sub) {
            sub.unsubscribe()
        }
        const ws = getWebsocket(
            `virtual-property-debug-${props.data.id}-${new Date().getTime()}`,
            `/virtual-property-debug`,
            {
                virtualId: virtualId,
                property: props.data.id,
                virtualRule: {
                    ...virtualRule,
                    script: script
                },
                properties: [...data]
            },
        ).subscribe(
            (resp: any) => {
                // console.log(resp);
            }
        );
        setSub(ws);
    };

    const insertContent = (content: string) => {
        const cursorPosition = editor.getCursorPosition();
        editor.session.insert(cursorPosition, content);
    }


    useEffect(() => {
        let formData = props.formData.expands?.virtualRule || {
            windows: []
        };
        let data = props.data.expands?.virtualRule || {};
        let isUseWindow = props.formData?.windows?.includes('useWindow') || false;
        let isTimeWindow = props.formData.windows?.includes('timeWindow') || false;
        if (isUseWindow) {
            setVirtualRule({
                aggType: formData?.aggType || data?.aggType,
                script: formData?.script || data?.script,
                type: 'window',
                window: formData?.window || data?.window,
                windowType: isTimeWindow ? 'time' : 'num'
            })
        } else {
            setVirtualRule({
                type: 'script'
            })
        }

        setVirtualId(`${new Date().getTime()}-virtual-id`)
        if (props.metaDataList.length > 0) {
            let data: any[] = [];
            props.metaDataList.map(item => {
                if (item.id !== props.data.id) {
                    data.push({ id: item.id, type: item.valueType?.type })
                }
            })
            setOtherList([...data]);
        }
    }, []);

    // const editorDidMountHandle = (editor: any, monaco: any) => {
    //     editor.focus();
    // }

    return (
        <Modal
            closable={false}
            visible
            width={quickInsertVisible ? 1200 : 850}
            footer={false}
        >
            <div className={styles.box}>
                <div className={styles.boxLeft} style={{ width: quickInsertVisible ? '70%' : "100%" }}>
                    <div className={styles.header}>
                        <span>设置属性计算规则</span>
                        <div onClick={() => {
                            props.close(script);
                            sub && sub.unsubscribe();
                            subs && subs.unsubscribe();
                        }}><Icon type="fullscreen-exit" /></div>
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
                        {/* <MonacoEditor
                            ref={l => setEditor(l && l.editor)}
                            height={assignVisible ? 350 : 690}
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
                        /> */}
                        <AceEditor
                            ref={l => setEditor(l && l.editor)}
                            mode='groovy'
                            theme="eclipse"
                            name="app_code_editor"
                            key='simulator'
                            fontSize={14}
                            value={script}
                            showPrintMargin
                            showGutter
                            wrapEnabled
                            highlightActiveLine  //突出活动线
                            enableSnippets  //启用代码段
                            style={{ width: '100%', height: assignVisible ? 350 : 690 }}
                            onChange={(value) => {
                                setScript(value);
                                virtualRule.script = value;
                                setVirtualRule(virtualRule);
                            }}
                            setOptions={{
                                enableBasicAutocompletion: true,   //启用基本自动完成功能
                                enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                                enableSnippets: true,  //启用代码段
                                showLineNumbers: true,
                                tabSize: 2,
                            }}
                        />
                    </div>
                    {assignVisible && <div className={styles.assignBox}>
                        <div className={styles.assignBoxLeft}>
                            <div className={styles.leftHeader}>
                                <div className={styles.itemLeft}>
                                    <div className={styles.itemLeftHeader}>属性赋值</div>
                                    <div className={styles.itemRight}>请对上方规则使用的属性进行赋值</div>
                                </div>
                                {!isBeginning && virtualRule?.type === 'window' && (<div className={styles.item} onClick={() => {
                                    debugPropertyAgain();
                                }}><a>发送数据</a></div>)}
                            </div>
                            <Table rowKey="key" size="middle" columns={columns} dataSource={dataList} pagination={false} scroll={{ y: 195 }}
                                footer={() => <a onClick={() => {
                                    dataList.push({
                                        key: `${new Date().getTime()}`,
                                        id: '',
                                        current: '',
                                        last: '',
                                        type: ''
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
                                            subs && subs.unsubscribe();
                                        }}>停止运行</a>)}
                                    </div>
                                    <div onClick={() => {
                                        setResult([]);
                                    }}><a>清空</a></div>
                                </div>
                            </div>
                            {/* <MonacoEditor
                                height={295}
                                language='groovy'
                                theme='vs'
                                value={result}
                                options={{
                                    selectOnLineNumbers: true,
                                    readOnly: true
                                }}
                                editorDidMount={(editor, monaco) => editorDidMountHandle(editor, monaco)}
                            /> */}
                            <div className={styles.logBox}>
                                <Descriptions>
                                    {result.map((item: any, index: number) => {
                                        return <Descriptions.Item key={index} span={3}
                                            label={moment(item.time).format('HH:mm:ss')}>
                                            <Tooltip placement="top" title={item.log}>{item.log}</Tooltip>
                                        </Descriptions.Item>
                                    })}
                                </Descriptions>
                            </div>
                        </div>
                    </div>}
                </div>
                {quickInsertVisible && <div className={styles.boxRight}>
                    <div className={styles.rightHeader}>
                        <span>快速添加</span>
                        <div onClick={() => { setQuickInsertVisible(false) }}><Icon type="close" /></div>
                    </div>
                    <QuickInsertComponent insertContent={(data: string) => { insertContent(data) }} metaDataList={props.metaDataList} close={() => { }} />
                </div>}
            </div>
        </Modal>
    );
}
export default MagnifyComponent;