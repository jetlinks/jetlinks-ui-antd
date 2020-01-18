import React, { useEffect, useState, Fragment } from "react";
import { Menu, Icon, message, Divider, Modal, Layout } from "antd";
import apis from "@/services";
import Save from "../../dimensions/save";
import User from "./user";
import SaveDimensionsType from "@/pages/system/dimensions/type";
import { DimensionsItem, DimensionType } from "@/pages/system/dimensions/data";
import encodeQueryParam from "@/utils/encodeParam";
import { UserItem } from "../../users/data";
import AuthorizationSetting from "./authorization-setting";

interface Porps {
    type: 'user' | 'setting';
}
interface State {
    dimensionList: DimensionsItem[];
    typeList: DimensionType[];
    focusItem: Partial<DimensionsItem>;
    focusItemType: Partial<DimensionType>;
    typeVisible: boolean;
    itemVisible: boolean;
    userList: UserItem[];
}
const UserDimensions: React.FC<Porps> = (props) => {
    const initState: State = {
        dimensionList: [],
        typeList: [],
        focusItem: {},
        focusItemType: {},
        typeVisible: false,
        itemVisible: false,
        userList: [],
    }

    const [dimensionList, setDimensionList] = useState(initState.dimensionList);
    const [typeList, setTypeList] = useState(initState.typeList);
    const [focusItem, setfocusItem] = useState(initState.focusItem);
    const [focusItemType, setfocusItemType] = useState(initState.focusItemType);
    const [typeVisible, setTypeVisible] = useState(initState.typeVisible);
    const [itemVisible, setItemVisible] = useState(initState.itemVisible);
    const [userList, setUserList] = useState(initState.userList);

    useEffect(() => {
        getDimensions();
        getDimensionUser();
    }, []);

    const getDimensions = () => {
        apis.dimensions.typeList().then(e => {
            if (e && e.status === 200) {
                let tempType = e.result;
                apis.dimensions.treeList().then(d => {
                    if (d.status === 200) {
                        d.result.map((dr: DimensionsItem) => {
                            let type = e.result.find((t: DimensionType) => t.id === dr.typeId);
                            if (type) {
                                let typeName = type.name;
                                let tempDimension = d.result.map((item: DimensionsItem) => { return { typeName, ...item } });
                                setDimensionList(tempDimension);
                            }
                        })

                    }
                });
                setTypeList(tempType);
            }
        }).catch(() => {

        });
    }

    const deleteItemGroup = (id: string) => {
        Modal.confirm({
            title: '确认删除此分类？',
            content: '删除此维度分类后，其下维度将自动分类到“未分类维度”里。',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                apis.dimensions.deleteDimensionTypeById(id).then(response => {
                    if (response.status === 200) {
                        message.success('删除成功');
                        getDimensions();
                    }
                }).catch(() => {

                })
            },
            onCancel() {
            },
        });
    }

    const editItemGroup = (id: string) => {
        setTypeVisible(true);
    }

    const saveItemGroup = (item: DimensionType) => {
        apis.dimensions.saveOrUpdateType(item).then(e => {
            if (e.status === 200) {
                message.success('保存成功');
            }
        }).catch(() => {

        });
        getDimensions();
        setTypeVisible(false);
    }

    const saveItem = (data: DimensionsItem) => {
        apis.dimensions.saveOrUpdate(data).then(e => {
            if (e.status === 200) {
                message.success('保存成功');
                getDimensions();
                setItemVisible(false);
            }
        }).catch(() => {

        });
    }

    const deleteItem = (id: string) => {
        Modal.confirm({
            title: '确定删除此维度？',
            content: '删除此维度后，此维度下员工所具有的权限会受到影响。',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                apis.dimensions.deleteDimension(id).then(e => {
                    if (e.status === 200) {
                        message.success("删除成功");
                    }
                }).catch(() => {

                });

            },
            onCancel() {
            },
        });
    }

    const renderSubMenu = () => {
        return typeList.map(e =>
            <Menu.ItemGroup
                key={e.id}
                onMouseEnter={() => setfocusItemType(e)}
                // onMouseLeave={() => setfocusItemType({})}
                onClick={() => setfocusItemType(e)}
                title={
                    <Fragment >
                        {e.name}
                        {
                            focusItemType.id === e.id &&
                            <span style={{ float: "right" }}>
                                <Icon type="edit" onClick={() => { editItemGroup(e.id) }} />
                                <Divider type="vertical" />
                                <Icon type="minus-circle" onClick={() => deleteItemGroup(e.id)} />
                                <Divider type="vertical" />
                                <Icon type="plus-circle" onClick={() => setItemVisible(true)} />
                            </span>
                        }
                    </Fragment>
                }
            >
                {
                    dimensionList.filter(i => i.typeId === e.id)
                        .map(menu =>
                            <Menu.Item
                                key={menu.id}
                                onClick={() => { setfocusItem(menu); getDimensionUser(menu.id) }}
                            >
                                <span>
                                    {menu.name}
                                    {
                                        focusItem.id === menu.id &&
                                        <span style={{ float: "right" }}>
                                            <Icon type="edit" onClick={() => setItemVisible(true)} />
                                            <Divider type="vertical" />
                                            <Icon type="minus-circle" onClick={() => deleteItem(menu.id)} />
                                        </span>
                                    }
                                </span>
                            </Menu.Item>
                        )
                }
            </Menu.ItemGroup>
        );
    }

    const getDimensionUser = (id?: string) => {
        apis.users.listNoPaging(encodeQueryParam({
            terms: {
                'id$in-dimension': id
            },
            paging: false,
        })).then(e => {
            if (e.status === 200) {
                setUserList(e.result);
            }
        }).catch((e) => {
            message.error(e.result);
            return;
        });
    }

    return (
        <Layout>
            <Layout.Sider theme="light">
                <Menu
                    style={{ width: 200 }}
                    mode="inline"
                    theme="light"
                >
                    <Menu.Item
                        onClick={() => {
                            getDimensionUser();
                            setfocusItem({});
                        }}
                    >
                        <span>
                            全部分类
                            <span style={{ float: "right" }}>
                                <Icon type="plus-circle" onClick={() => {
                                    setfocusItemType({})
                                    setTypeVisible(true);
                                    getDimensionUser();
                                }} />
                            </span>
                        </span>
                    </Menu.Item>
                    {renderSubMenu()}
                </Menu>
            </Layout.Sider>

            <Layout.Content >
                {
                    props.type === 'user' ?
                        <User data={userList} dimensionId={focusItem.id} />
                        :
                        <AuthorizationSetting dimension={focusItem} />
                }
            </Layout.Content>
            {
                typeVisible &&
                <SaveDimensionsType
                    save={(data: DimensionType) => { saveItemGroup(data); getDimensions() }}
                    close={() => {
                        setTypeVisible(false);
                        getDimensions();
                        setfocusItemType({});
                    }}
                    data={focusItemType}
                />
            }
            {
                itemVisible &&
                <Save
                    close={() => {
                        getDimensionUser(focusItem.id);
                        setItemVisible(false);
                        setfocusItem({});
                    }}
                    data={focusItem}
                    type={focusItemType}
                    save={(data: DimensionsItem) => { saveItem(data); getDimensions() }}
                />
            }
        </Layout>
    );
}
export default UserDimensions;