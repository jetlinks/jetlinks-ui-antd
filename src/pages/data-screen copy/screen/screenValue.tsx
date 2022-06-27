import React, { useEffect, useState } from 'react';
import { List, Tooltip, Modal, Card, Avatar } from "antd";
import styles from './index.less';
import api from '@/services'
import { EditOutlined, SwitcherOutlined, DeleteOutlined, EyeOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
// import screenData from './mock'
import Button from 'antd/es/button';
import Save from './save'
import AutoHide from '@/pages/analysis/components/Hide/autoHide';
const { confirm } = Modal;

interface Props {
    data:any
}

const ScreenValue = (props: Props) => {

    const [dataList, setDataList] = useState({
        data: [],
        pageIndex: 0,
        total: 0,
        pageSize: 0
    });
    const [saveVisible, setSaveVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [param, setParam] = useState({});

    const handleSearch = () => {
        api.screen.query({ }).then(res => {
            if (res.status === 200) {
                setDataList(res.result)
            }
        })
    }
    let delConfirm = (id: string) => {
        confirm({
            title: '删除大屏',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                api.screen.remove(id).then(res => {
                    if (res.status === 200) {
                        handleSearch()
                    }
                })
            }
        });
    }
    function copyConfirm() {
        confirm({
            title: '复制大屏',
            icon: <ExclamationCircleOutlined />,
            content: '确认复制',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    useEffect(() => {
        handleSearch();
    }, []);
    return (
        <div>
            <div className={styles.cardList}>
                {/* <Button icon="plus" type="primary" onClick={i => setSaveVisible(true)}>新建大屏</Button> */}
                <List<any>
                    rowKey="id"
                    grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                    dataSource={ dataList.data || []}
                    pagination={{
                        current: dataList.pageIndex + 1,
                        total: dataList.total,
                        pageSize: dataList.pageSize,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        // hideOnSinglePage: true,
                        pageSizeOptions: ['8', '16', '40', '80'],
                        // // style: { marginTop: -20 },
                        showTotal: (total: number) =>
                            `共 ${total} 条记录 第  ${dataList.pageIndex + 1}/${Math.ceil(
                                dataList.total / dataList.pageSize,
                            )}页`
                    }}
                    renderItem={item => {
                        if (item && item.id) {
                            return (
                                <List.Item key={item.id}>
                                    <Card hoverable bodyStyle={{ paddingBottom: 20 }}
                                        actions={[
                                            <Tooltip placement="bottom" title="删除">
                                                <DeleteOutlined onClick={() => {delConfirm(item.id)}} />
                                            </Tooltip>,
                                            <Tooltip placement="bottom" title="编辑">
                                                <EditOutlined onClick={() => {setEditVisible(true); setParam({id: item.id, name: item.name, description: item.description, catalogId: props.data})}} />
                                            </Tooltip>,
                                            <Tooltip placement="bottom" title="查看">
                                                <DeleteOutlined onClick={() => {}} />
                                                {/* <EyeOutlined onClick={i => { window.open(`http://localhost:8080/view/${item.id}`, '_blank') }} /> */}
                                            </Tooltip>,
                                            <Tooltip placement="bottom" title="复制">
                                                <SwitcherOutlined onClick={copyConfirm} />
                                            </Tooltip>
                                        ]}
                                    >
                                        <Card.Meta
                                            avatar={<Avatar size={40} src="https://oss.bladex.vip/caster/upload/20200512/f26107bbb77a84949285617848745d81.jpg"/>}
                                            title={<AutoHide title={item.name} style={{ width: '95%' }} />}
                                            description={<AutoHide title={item.id} style={{ width: '95%' }} />}
                                        />
                                        <div className={styles.status}>
                                            <p>已{item.state.text}</p>
                                        </div>
                                    </Card>
                                </List.Item>
                            );
                        }
                        return;
                    }}
                />
            </div>
            {saveVisible && <Save data={props.data} close={() => {
                setSaveVisible(false)
            }} save={() => {setSaveVisible(false);handleSearch();}} />}
            {editVisible && <Save data={param} close={() => {
                setEditVisible(false)
            }} save={() => {setEditVisible(false);handleSearch();}} />}
        </div >
    )
}
export default ScreenValue;
