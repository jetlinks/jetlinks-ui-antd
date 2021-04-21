import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import styles from './index.less';
import { MoreOutlined } from '@ant-design/icons';
import { Drawer, Dropdown, Icon, Menu, Tooltip } from 'antd';
import MagnifyComponent from './magnify';
import QuickInsertComponent from './quick-insert';

interface Props {
    data: any;
    metaDataList: any[];
}

const VirtualEditorComponent = (props: Props) => {

    const [isMagnify, setIsMagnify] = useState<boolean>(false);
    const [isQuickInsert, setIsQuickInsert] = useState<boolean>(false);
    const [isAssign, setIsAssign] = useState<boolean>(false);
    const [editor, setEditor] = useState<any>(null);
    const [script, setScript] = useState(props.data.expands?.virtualRule?.script || '');
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
    const editorDidMountHandle = (editor: any, monaco: any) => {
        editor.focus();
    }
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
    return (
        <div className={styles.editorBox}>
            <div className={styles.editorTop}>
                <div className={styles.topLeft}>
                    {symbolList.map((item, index) => (
                        <span key={item.key} onClick={() => {
                            insertContent(symbolList[index].value)
                        }}>{item.value}</span>
                    ))}
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
                    <span onClick={() => {
                        setIsAssign(true);
                        setIsMagnify(true);
                    }}><Tooltip title="进行调试"><a>进行调试</a></Tooltip></span>
                    <span onClick={() => {
                        setIsQuickInsert(true);
                    }}><Tooltip title="快速添加"><a>快速添加</a></Tooltip></span>
                    <span onClick={() => {
                        setIsAssign(false);
                        setIsMagnify(true);
                    }}><Icon type="fullscreen" /></span>
                </div>
            </div>
            <MonacoEditor
                ref={l => setEditor(l && l.editor)}
                height="400"
                language='groovy'
                theme='vs'
                value={script}
                options={{
                    selectOnLineNumbers: true
                }}
                onChange={(value) => {
                    setScript(value);
                }}
                editorDidMount={(editor, monaco) => editorDidMountHandle(editor, monaco)}
            />
            {isMagnify && (
                <MagnifyComponent metaDataList={props.metaDataList} data={{
                    isAssign: isAssign,
                    ...props.data
                }} close={() => { setIsMagnify(false) }} />
            )}
            <Drawer title="快速添加" visible={isQuickInsert} width={400} onClose={() => { setIsQuickInsert(false); }}>
                <QuickInsertComponent insertContent={(data: string) => { insertContent(data) }} metaDataList={props.metaDataList} close={() => { setIsQuickInsert(false); }} />
            </Drawer>
        </div>
    );
};

export default VirtualEditorComponent;