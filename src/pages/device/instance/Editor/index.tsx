import { useState, Fragment, useEffect } from "react";
import React from "react";
import { Button, Descriptions, Statistic, message } from "antd";
import Info from "./detail/Info";
import Status from "./detail/Status";
import Log from "./detail/Log";
import Debugger from "./detail/Debugger";
import { router } from "umi";
import styles from './index.less';
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { connect } from "dva";
import ConnectState, { Dispatch } from "@/models/connect";
import { SimpleResponse } from "@/utils/common";
import { DeviceInstance } from "../data";
import encodeQueryParam from "@/utils/encodeParam";
import apis from "@/services";


interface Props {
    dispatch: Dispatch;
    location: Location;
}

interface State {
    data: Partial<DeviceInstance>;
    activeKey: string;
    logs: any;
    deviceState: any;
}

const Editor: React.FC<Props> = (props) => {
    const { dispatch, location: { pathname } } = props;

    const initState: State = {
        activeKey: 'info',
        data: {},
        logs: {},
        deviceState: {}
    };
    const [activeKey, setActiveKey] = useState(initState.activeKey);
    const [data, setData] = useState(initState.data);
    const [logs, setLogs] = useState(initState.logs);
    const [id, setId] = useState();
    const [deviceState, setDeviceState] = useState(initState.deviceState);

    const getInfo = (id: string) => {
        dispatch({
            type: 'deviceInstance/queryById',
            payload: id,
            callback: (response: SimpleResponse) => {
                if (response.status === 200) {
                    setData(response.result);
                }
            }
        })
    }

    useEffect(() => {
        if (pathname.indexOf('save') > 0) {
            const list = pathname.split('/');
            getInfo(list[list.length - 1]);
            setId(list[list.length - 1]);
        }

    }, []);

    const handleSearchLog = (terms: any) => {
        terms.terms = { ...terms.terms, 'deviceId': id };
        dispatch({
            type: 'deviceInstance/queryLog',
            payload: encodeQueryParam(terms),
            // payload: encodeQueryParam({
            //     terms: terms,
            //     sorts: {
            //         field: 'createTime',
            //         order: 'desc'
            //     },
            //     pageIndex: 0,
            //     pageSize: 10,
            // }),
            callback: (response: SimpleResponse) => {
                if (response.status === 200) {
                    setLogs(response.result)
                }
            }
        })
    }

    const getDeviceState = () => {
        apis.deviceInstance.runInfo(id).then(response => {
            deviceState.runInfo = response.result;
            setDeviceState({ ...deviceState });
        });
        // apis.deviceInstance.fireAlarm({ id }).then(response => {
        // })
    }
    const action = (
        <Fragment>
            {/* <Button>返回</Button> */}
            {/* <Button type='primary'>刷新</Button> */}
        </Fragment>
    );

    const tabList = [
        {
            key: 'info',
            tab: '设备信息',
        },
        {
            key: 'status',
            tab: '运行状态',
        },
        {
            key: 'log',
            tab: '日志管理',
        },
        // {
        //     key: 'debugger',
        //     tab: '在线调试',
        // },
    ];

    const info = {
        info: <Info data={data} />,
        status: <Status device={data} />,
        log: <Log
            data={logs}
            search={(param: any) => {
                handleSearchLog(param)
            }} />,
        debugger: <Debugger />,
    }

    const content = (
        <div style={{ marginTop: 30 }}>
            <Descriptions column={4}>
                <Descriptions.Item label="ID">{id}</Descriptions.Item>
                <Descriptions.Item label="型号"><div>{data.name}</div></Descriptions.Item>
            </Descriptions>
        </div>
    );

    const extra = (
        <div className={styles.moreInfo}>
            {/* <Statistic title="状态" value="未激活" /> */}
        </div>
    );
    return (
        <PageHeaderWrapper
            className={styles.instancePageHeader}
            style={{ marginTop: 0 }}
            title='设备:温度传感器'
            extra={action}
            content={content}
            extraContent={extra}
            tabList={tabList}
            tabActiveKey={activeKey}
            onTabChange={(key: string) => {

                if (key === 'log') {
                    handleSearchLog({
                        pageIndex: 0,
                        pageSize: 10,
                        terms: { 'deviceId': id }
                    })
                } else if (key === 'status') {
                    getDeviceState()
                }
                setActiveKey(key);
            }}
        >
            {info[activeKey]}
        </PageHeaderWrapper>
    );
}

export default connect(({ deviceInstance, loading }: ConnectState) => ({
    deviceInstance, loading,
}))(Editor);