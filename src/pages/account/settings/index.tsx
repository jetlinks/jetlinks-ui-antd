import React, { useState } from "react";
import { GridContent } from "@ant-design/pro-layout";
import styles from './index.less';
import { Menu } from "antd";
import BaseView from "./base";
import SecurityView from "./security";
import BindingView from "./binding";
import NotificationView from "./notification";

interface Props { }
const AccountSettings: React.FC<Props> = (props) => {

    const [mode, setMode] = useState<'inline' | 'horizontal'>('inline');
    const [selectKey, setSelectKey] = useState('base');
    const [menuMap, setMenuMap] = useState({
        base: '基本设置',
        security: '安全设置',
        // binding: '通知记录',
        notification: '通知订阅'
    });

    const renderChildren = () => {
        switch (selectKey) {
            case 'base':
                return <BaseView />;
            case 'security':
                return <SecurityView />;
            case 'binding':
                return <BindingView />;
            case 'notification':
                return <NotificationView />;
            default:
                break;

        }
        return null;
    }
    const getMenu = () => Object.keys(menuMap).map((item) => <Menu.Item key={item}>{menuMap[item]}</Menu.Item>)
    return (
        <GridContent>
            <div
                className={styles.main}
            >
                <div className={styles.leftMenu}>
                    <Menu
                        mode={mode}
                        selectedKeys={[selectKey]}
                        onClick={({ key }) => { setSelectKey(key) }}
                    >
                        {getMenu()}
                    </Menu>
                </div>
                <div className={styles.right}>
                    <div className={styles.title}>{menuMap[selectKey]}</div>
                    {renderChildren()}
                </div>

            </div>
        </GridContent>
    )
}


export default AccountSettings;