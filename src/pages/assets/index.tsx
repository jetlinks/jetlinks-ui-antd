import React, {useEffect, useState} from "react";
import {GridContent, PageHeaderWrapper} from "@ant-design/pro-layout";
import styles from './index.less';
import {Menu} from "antd";
import {Dispatch} from "@/models/connect";
import ClassifyBind from "./classify";
import DeviceBind from "./device";
import ProductBind from "./product";

interface Props {
    dispatch: Dispatch;
    location: Location;
}

const AccountSettings: React.FC<Props> = (props) => {
    const {
        location: {pathname},
    } = props;

    const [mode, setMode] = useState<'inline' | 'horizontal'>('inline');
    const [selectKey, setSelectKey] = useState('classify');
    const [orgId, setorgId] = useState<string>("");
    const [targetType, setTargetType] = useState<string>("");
    const [menuMap] = useState({
        classify: '分类',
        product: '产品',
        device: '设备'
    });

    useEffect(() => {
        if (pathname.indexOf('assets') > 0) {
            const list = pathname.split('/');
            setorgId(list[list.length - 2]);
            setTargetType(list[list.length - 1]);
        }
    }, []);

    const renderChildren = () => {
        switch (selectKey) {
            case 'classify':
                return <ClassifyBind targetId={orgId} targetType={targetType}/>;
            case 'product':
                return <ProductBind targetId={orgId} targetType={targetType}/>;
            case 'device':
                return <DeviceBind targetId={orgId} targetType={targetType}/>;
            default:
                break;
        }
        return null;
    };

    const getMenu = () => Object.keys(menuMap).map((item) => <Menu.Item key={item}>{menuMap[item]}</Menu.Item>);

    return (
        <PageHeaderWrapper title="资产分配">
            <GridContent>
                <div
                    className={styles.main}
                >
                    <div className={styles.leftMenu}>
                        <Menu
                            mode={mode}
                            selectedKeys={[selectKey]}
                            onClick={({key}) => {
                                setSelectKey(key)
                            }}
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
        </PageHeaderWrapper>
    )
};


export default AccountSettings;