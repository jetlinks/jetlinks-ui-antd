import encodeQueryParam from "@/utils/encodeParam";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Button, Card, Col, Divider, Drawer, Icon, Input, message, Modal, Popconfirm, Row, Table, Tooltip } from "antd";
import React, { Fragment, useEffect, useReducer } from "react";
import ChoiceDevice from "../group/save/bind/ChoiceDevice";
import { GroupItem } from "./data";
import Save from "./save";
import Service from "./service";
import DeviceInfo from '@/pages/device/instance/editor/index';
import { router } from "umi";

interface Props { 
    location:any;
}
interface State{
    data:any[];
    deviceData:any;
    saveVisible:boolean;
    bindVisible:boolean;
    detailVisible:boolean;
    current:Partial<GroupItem>;
    parentId:string|null;
    deviceIds:string[];
    device:any;
}
const DeviceTree: React.FC<Props> = (props) => {
    const { location: { query } } = props;

    const initialState:State={
        data:[],
        deviceData:{},
        saveVisible:false,
        bindVisible:false,
        detailVisible:false,
        current:{},
        parentId:query.id,
        deviceIds:[],
        device:{}
    };
    const reducer=(state:State,action:any)=>{
        switch(action.type){
            case 'operation':
                return { ...state, ...action.payload };
            default:
                throw new Error();
        }
    }

    const [state,dispatch]=useReducer(reducer,initialState);

    const {data,deviceData,saveVisible,bindVisible,detailVisible,current,parentId,deviceIds,device}=state;
    const service = new Service('device');
    const search = (param?: any) => {
        const defaultTerms = {
            terms: {
                id: query.id
            },
            paging: false
        };
        service.groupTree(encodeQueryParam(
            {
                ...defaultTerms,
                terms: { ...defaultTerms.terms, ...param?.terms }
            })).subscribe((resp) => {
                dispatch({
                    type:'operation',
                    payload: {
                        data: resp[0]?.children
                    },
                })
            })
    }
    useEffect(() => {
        search();
    }, []);
    const saveGroup = (item: GroupItem) => {
        service.saveGroup({ id:item.id,name:item.name, parentId }).subscribe(
            () => message.success('添加成功'),
            () => { },
            () => {
                dispatch({ type: 'operation', payload: { saveVisible: false, parentId: null}})
                search();
            })
    }

    const searchDevice = (item: GroupItem | any) => {
        service.groupDevice(encodeQueryParam({
            terms: {
                'id$dev-group': item.id ,
                name$LIKE:item.searchValue
            }
        })).subscribe((resp) => {
            dispatch({
                type:'operation',
                payload:{
                    deviceData:resp,
                    deviceIds: resp.data.map((item: any) => item.id)
                }
            })
        })
    }
    const bindDevice = () => {
        service.bindDevice(parentId!, deviceIds).subscribe(
            () => message.success('绑定成功'),
            () => message.error('绑定失败'),
            () => {
                dispatch({
                    type:'operation',payload:{
                    bindVisible: false
                }})
                searchDevice({ id: parentId });
            })
    }
    const unbindDevice = (deviceId: string[]) => {
        service.unbindDevice(parentId!, deviceId).subscribe(
            () => message.success('解绑成功'),
            () => message.error('解绑失败'),
            () => {
                dispatch({
                    type: 'operation', payload: {
                        bindVisible: false
                    }})
                searchDevice({ id: parentId });
            })
    }

    const unbindAll = () => {
        service.unbindAll(parentId!).subscribe(
            () => message.success('解绑成功'),
            () => message.error('解绑失败'),
            () => {
                dispatch({ type:'operation',payload:{
                    bindVisible:false
                }})
                searchDevice({ id: parentId });
            })
    }

    return (
        <PageHeaderWrapper title={
            (
                <>
                    分组详情
                    <Divider type="vertical"/>
                    <Icon 
                     style={{color:'#1890FF'}}
                     type="rollback"
                     onClick={() => router.push('/device/tree')} />
                </>
            )
        }>
            <Card>
                <Row gutter={24}>
                    <Col span={8}>
                        <Table
                            title={() => (
                                <>
                                    分组
                                    <span style={{ marginLeft: 20,marginRight:10 }}>
                                        <Input.Search
                                            style={{ width: '60%' }}
                                            placeholder="输入名称后自动查询"
                                            onChange={()=>search()}
                                            onSearch={(value) => {                                                
                                                if(value){
                                                    const tempData = data.filter((item:any)=>item.name.indexOf(value) > -1)
                                                    dispatch({ type: 'operation', payload: { data: tempData}})
                                                }else{
                                                    search()
                                                }
                                            }}
                                        />
                                    </span>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            dispatch({
                                                type:'operation',payload:{
                                                 saveVisible: true,
                                                 parentId:query.id
                                            }})
                                        }}>新增</Button>
                                </>
                            )}
                            onRow={(item)=>{
                               return{
                                   onClick: ()=>{ 
                                       searchDevice(item);
                                       dispatch({ type: 'operation', payload: { parentId: item.id}})
                                   }
                               } 
                            }}
                            bordered={false}
                            pagination={false}
                            dataSource={data}
                            size="small"
                            rowKey={(item: any) => item.id}
                            columns={[
                                { title: '序号', dataIndex: 'id' },
                                { title: '名称', dataIndex: 'name' },
                                {
                                    title: '操作',
                                    width:140,
                                    render: (_, record) => (
                                        <Fragment>
                                            <Icon
                                                type="edit"
                                                onClick={() => {
                                                    dispatch({
                                                        type:'operation',payload:{
                                                        current: record, saveVisible: true 
                                                    }})
                                                }}
                                            />
                                            <Divider type="vertical" />
                                            <Tooltip title="新增子分组">
                                                <Icon
                                                    type="plus"
                                                    onClick={() => {
                                                        dispatch({
                                                            type:'operation',payload:{
                                                            parentId:record.id,
                                                            saveVisible:true,
                                                        }})
                                                    }} />
                                            </Tooltip>
                                            <Divider type="vertical" />
                                           <Tooltip title="删除">
                                                <Popconfirm
                                                    title="确认删除分组？"
                                                    onConfirm={() => {
                                                        service.removeGroup(record.id).subscribe(
                                                            () => message.success('删除成功!'),
                                                            () => message.error('删除失败'),
                                                            () => search()
                                                        )
                                                    }} >
                                                    <Icon type="close" />
                                                </Popconfirm>
                                           </Tooltip>
                                            <Divider type="vertical" />
                                         <Tooltip title="绑定设备">
                                                <Icon type="apartment" onClick={() => {
                                                    dispatch({
                                                        type:'operation',
                                                        payload:{
                                                            bindVisible:true,
                                                            parentId:record.id}
                                                        })
                                                }} />
                                         </Tooltip>
                                        </Fragment>
                                    )
                                }
                            ]} />
                    </Col>
                    <Col span={16}>
                        <Table
                            title={() => (

                                <Fragment>
                                    设备
                                  
                                        <span style={{ marginLeft: 20 }}>
                                            <Input.Search
                                                style={{ width: '30%' }}
                                                placeholder="输入名称后自动查询"
                                                onSearch={(value) => searchDevice({
                                                    id:parentId,
                                                    searchValue:value,
                                                })}
                                            />
                                        </span>
                                     
                                    <Popconfirm
                                        title="解绑全部设备？"
                                        onConfirm={() => unbindAll()}
                                    >
                                        <Button
                                            style={{ marginLeft: 10 }}
                                            type="danger"
                                        >解绑全部</Button>
                                    </Popconfirm>
                                </Fragment>

                            )}
                            dataSource={deviceData?.data}
                            size="small"
                            rowKey={(item: any) => item.id}
                            columns={[
                                { title: '序号', dataIndex: 'id' },
                                { title: '名称', dataIndex: 'name' },
                                { title: '产品名称', dataIndex: 'productName' },
                                { title: '状态', dataIndex: 'state', render: (text) => text.text },
                                {
                                    title: '操作', render: (_, record) => (
                                        <Fragment>
                                            <Tooltip title="详情">
                                                <Icon type="info" onClick={
                                                    () => {
                                                        dispatch({
                                                            type:'operation',
                                                            payload:{
                                                                device:record,
                                                                detailVisible:true,
                                                        }})
                                                    }} />
                                            </Tooltip>
                                            <Divider type="vertical" />
                                            <Tooltip title="解绑">
                                                <Popconfirm
                                                    title="确认解绑?"
                                                    onConfirm={() => {
                                                        unbindDevice([record.id])
                                                    }} >
                                                    <Icon type="close" />
                                                </Popconfirm>
                                            </Tooltip>

                                        </Fragment>
                                    )
                                }
                            ]}
                        />
                    </Col>
                </Row>
            </Card>
            {
                saveVisible && (
                    <Save
                        data={current}
                        close={() => { dispatch({ type: 'operation', payload: { saveVisible: false, current: {}}}) }}
                        save={(item: GroupItem) => saveGroup(item)}
                    />
                )
            }
            {bindVisible && (
                <Modal
                    title="绑定设备"
                    visible
                    width='80vw'
                    onCancel={() => {
                        dispatch({
                            type:'operation',
                            payload:{
                                deviceIds:[],
                                bindVisible:false,
                                parentId:null,
                            }
                        })
                    }}
                    onOk={() => { bindDevice() }}
                >
                    <ChoiceDevice 
                    deviceList={deviceIds} 
                    save={(item: any[]) => {
                        dispatch({
                            type:'operation',payload:{
                            deviceIds:item
                        }})
                    }} />
                </Modal>
            )}
            {
                detailVisible && (
                    <Drawer
                        visible
                        width='80vw'
                        title='设备详情'
                        onClose={() => {
                            dispatch({
                                type:'operation',payload:{
                                detailVisible:false
                            }})}}
                    >
                        <DeviceInfo location={{
                            pathname: `/device/instance/save/${device.id}`,
                            search: '',
                            hash: "",
                            query: {},
                            state: undefined,
                        }} />
                    </Drawer>
                )
            }
        </PageHeaderWrapper>
    )
}
export default DeviceTree;