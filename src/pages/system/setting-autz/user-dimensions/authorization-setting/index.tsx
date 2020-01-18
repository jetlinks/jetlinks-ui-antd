import React, { useEffect, useState } from "react";
import { Descriptions, Card, Checkbox, Col, Divider, Button, Affix, Anchor, Spin, message } from "antd";
import apis from "@/services";
import encodeQueryParam from "@/utils/encodeParam";
import { DimensionsSetting, DimensionsItem } from "@/pages/system/dimensions/data";
import { PermissionItem } from "@/pages/system/permission/data";
import FieldAccess from "./field-access";

interface Props {
    dimension: Partial<DimensionsItem>;
}

interface State {
    permissionList: PermissionItem[];
    // currentList: DimensionsSetting[];
    mergeData: any[];
    loading: boolean;
    fieldAccessVisible: boolean;
    checkedPermission: Partial<PermissionItem>;
}

const AuthorizationSetting: React.FC<Props> = (props) => {
    const initState: State = {
        permissionList: [],
        // currentList: [],
        mergeData: [],
        loading: true,
        fieldAccessVisible: false,
        checkedPermission: {},
    }

    const [permissionList, setPermissionList] = useState(initState.permissionList);
    // const [currentList, setCurrentList] = useState(initState.currentList);
    const [mergeData, setMergeData] = useState(initState.mergeData);
    const [loading, setLoading] = useState(initState.loading);
    const [fieldAccessVisible, setFieldAccessVisible] = useState(initState.fieldAccessVisible);
    const [checkedPermission, setCheckedPermission] = useState(initState.checkedPermission);

    useEffect(() => {
        setLoading(true);
        getPermissionList();
    }, [props.dimension]);

    const getPermissionList = () => {
        apis.permission.listNoPaging().then(p => {
            if (p.status === 200) {
                if (props.dimension && props.dimension.id) {
                    const params = {
                        terms: { dimensionTarget: props.dimension.id, }
                    };
                    apis.dimensions.queryAutz(encodeQueryParam(params)).then(e => {
                        if (e.status === 200) {

                            const temp = (p.result).map((item: PermissionItem) => {
                                const autz = (e.result).find((i: DimensionsSetting) => i.permission === item.id);
                                //增加all选项
                                if (autz) {
                                    (autz.actions || []).length >= (item.actions || []).length ? autz.actions.push('all') : autz;
                                }
                                return autz ? { 'current': autz, ...item } : item;
                            });
                            setPermissionList(temp);
                        }
                    }).catch(() => {

                    });
                } else {
                    setPermissionList(p.result);
                }
                setLoading(false);
            }
        }).catch(() => {

        });
    }

    const saveFieldsAccess = (permision: PermissionItem) => {
        const index = permissionList.findIndex(p => p.id === permision.id);
        permissionList[index] = permision;
    }

    /*
    * * checkItem:  选择权限
    * * permissionID :权限ID
    * * item :权限
    * */
    const checkItem = (permissionId: string, item?: string) => {
        const permission = permissionList.find(e => e.id === permissionId);
        if (!permission) return;
        const index = permissionList.findIndex(e => e.id === permissionId);
        if (permission.current) {
            let currentActions = permission.current.actions || [];
            //存在current才会有删除的可能
            if (item) {
                const y = currentActions.find((e: string) => e === item);
                if (y) {
                    //如果存在则删除
                    permission.current.actions = currentActions.filter((e: string) => e !== item && e !== 'all');
                } else {
                    currentActions.push(item);
                }
                if (currentActions.length >= (permission.actions || []).length) {
                    currentActions.push('all');
                }
            } else {
                if (currentActions.find((e: string) => e === 'all')) {
                    const { current, ...temp } = permission;
                    permissionList[index] = temp;
                } else {
                    let current = {
                        actions: ['all', ...((permission.actions || []).map((e: any) => e.action))],
                    }
                    permission.current = current
                    permissionList[index] = permission;
                }
            }
        } else {
            if (item) {
                let current = {
                    actions: [item],
                }
                permissionList[index] = { current, ...permission };
            } else {
                let current = {
                    actions: ['all', ...((permission.actions || []).map((e: any) => e.action))],
                }
                permissionList[index] = { current, ...permission };
            }
        }
        setPermissionList(permissionList);
        setMergeData([]);
    }

    const saveAutzSetting = () => {
        //组装成接口所需格式
        setLoading(true);
        const data: any[] = [];
        permissionList.forEach(p => {
            let action = ((p.current || {}).actions || []).filter(e => e !== 'all');
            data.push({
                'id': (p.current || {}).id,
                'permission': p.id,
                'dimensionType': props.dimension.typeId,
                'dimensionTypeName': props.dimension.typeName,
                'dimensionTarget': props.dimension.id,
                'dimensionTargetName': props.dimension.name,
                'state': 1,
                'actions': action,
                'priority': 10,
                'merge': true,
                'dataAccesses': p.dataAccesses,
            });
        });
        apis.dimensions.saveAutzSetting(data).then(e => {
            if (e.status === 200) {
                message.success('保存成功');
            } else {
                message.error('保存失败');
            }
        }).finally(() => {
            setLoading(false);
            setMergeData([]);
            getPermissionList();
        })
    }

    return (
        <Spin spinning={loading}>
            <Card
            >
                <Descriptions title={(props.dimension || {}).name}>
                    <Descriptions.Item>{(props.dimension || {}).describe}</Descriptions.Item>
                </Descriptions>

                <Col span={20}>
                    {

                        permissionList.map(permission => {
                            return (
                                <Card
                                    id={permission.id}
                                    key={permission.id}
                                    title={permission.name}
                                    bordered={false}
                                    extra={
                                        <span>
                                            {
                                                permission.optionalFields &&
                                                <span>
                                                    <Button type="link" onClick={() => { setFieldAccessVisible(true); setCheckedPermission(permission) }}>字段权限</Button>
                                                    <Divider type="vertical" />
                                                </span>
                                            }
                                            {/* <Button type="link" onClick={() => message.warn('开发中')}>数据权限</Button> */}
                                        </span>
                                    }
                                >
                                    <Checkbox.Group style={{ width: '100%' }} value={(permission.current || {}).actions}>
                                        <Col span={6} style={{ marginBottom: 10 }}>
                                            <Checkbox
                                                value="all"
                                                onClick={() => checkItem(permission.id)}
                                                indeterminate={
                                                    ((permission.current || {}).actions || []).length > 0 &&
                                                    ((permission.current || {}).actions || []).length < (permission.actions || []).length
                                                }
                                            >全选</Checkbox>
                                        </Col>

                                        {
                                            (permission.actions || []).map((action: any) => {
                                                return (
                                                    <Col span={6} style={{ marginBottom: 10 }} key={action.action}>
                                                        <Checkbox value={action.action} onClick={() => { checkItem(permission.id, action.action) }}>{action.name}</Checkbox>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Checkbox.Group>
                                </Card>

                            )
                        }
                        )
                    }

                    <Affix offsetBottom={20} style={{ float: "right" }}>
                        <Button
                            type="primary"
                            onClick={() => { saveAutzSetting() }}
                        >
                            保存
                        </Button>
                    </Affix>
                </Col>
                {/* <Col span={3} push={1} style={{ height: 600, overflow: 'auto' }}>
                    <Affix>
                        <Anchor>
                            {
                                permissionList.map(permission =>
                                    <Anchor.Link href={'#' + permission.id} title={permission.name} key={permission.id} />
                                )
                            }
                        </Anchor>
                    </Affix>
                </Col> */}

            </Card>
            {
                fieldAccessVisible &&
                <FieldAccess
                    close={() => setFieldAccessVisible(false)}
                    data={checkedPermission}
                    save={(item: PermissionItem) => saveFieldsAccess(item)}
                />
            }
        </Spin>

    );
}

export default AuthorizationSetting;