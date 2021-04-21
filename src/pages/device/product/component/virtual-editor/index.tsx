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

    const menu = () => {
        return (
            <Menu>
                <Menu.Item>&gt;</Menu.Item>
                <Menu.Item>&gt;=</Menu.Item>
                <Menu.Item>&gt;</Menu.Item>
                <Menu.Item>&gt;=</Menu.Item>
                <Menu.Item>==</Menu.Item>
                <Menu.Item>&lt;=</Menu.Item>
                <Menu.Item>&lt;</Menu.Item>
                <Menu.Item>&lt;&gt;</Menu.Item>
                <Menu.Item>&amp;&amp;</Menu.Item>
                <Menu.Item>||</Menu.Item>
                <Menu.Item>!</Menu.Item>
                <Menu.Item>&amp;</Menu.Item>
                <Menu.Item>|</Menu.Item>
                <Menu.Item>~</Menu.Item>
            </Menu>
        )
    }
    const editorDidMountHandle = (editor: any, monaco: any) => {
        editor.focus();
    }
    return (
        <div className={styles.editorBox}>
            <div className={styles.editorTop}>
                <div className={styles.topLeft}>
                    <span>+</span>
                    <span>-</span>
                    <span>*</span>
                    <span>/</span>
                    <span>()</span>
                    <span>^</span>
                    <span>
                        <Dropdown overlay={menu}>
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
                    language={'javascript'}
                    theme={'vs'}
                    value={''}
                    options={{
                        selectOnLineNumbers: true
                    }}
                    onChange={(value) => {  
                        console.log(editor)
                    }}
                    editorDidMount={(editor, monaco) => editorDidMountHandle(editor, monaco)}
                />
            {isMagnify && (
                <MagnifyComponent metaDataList={props.metaDataList} data={{
                    isAssign: isAssign,
                    ...props.data
                }} close={() => { setIsMagnify(false) }} />
            )}
            <Drawer title="快速添加" visible={isQuickInsert} width={400} onClose={() => {setIsQuickInsert(false);}}>
                <QuickInsertComponent metaDataList={props.metaDataList} close={() => { setIsQuickInsert(false); }} />
            </Drawer>
        </div>
    );
};

export default VirtualEditorComponent;