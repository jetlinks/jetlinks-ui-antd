import {PageHeaderWrapper} from '@ant-design/pro-layout';
import OrganizationChart from '@dabeng/react-orgchart';
import {Menu, message} from 'antd';
import styles from './index.less';
import React, {useEffect, useState} from 'react';
import NodeTemplate from './NodeTemplate';
import apis from '@/services';
import encodeQueryParam from '@/utils/encodeParam';
import Save from './save';
import Authorization from '@/components/Authorization';
import BindUser from '@/pages/system/org/user';
import {router} from "umi";

const OrgChart = () => {
    const [list, setList] = useState<any>({});
    const [edit, setEdit] = useState<boolean>(false);
    const [current, setCurrent] = useState<any>({});
    const [autzVisible, setAutzVisible] = useState(false);
    const [userVisible, setUserVisible] = useState(false);
    const [parentId, setParentId] = useState(null);

    const hitCenter = () => {
        const orgChart = document.getElementsByClassName('orgchart-container')[0];
        const {width} = orgChart.getBoundingClientRect();
        orgChart.scrollLeft = width;
    };
    const handleSearch = () => {
        apis.org.list(encodeQueryParam({paging: false, terms: {typeId: 'org'}})).then(resp => {
            const data = {
                id: null,
                name: '机构管理',
                title: '组织架构',
                children: resp.result,
            };
            setList(data);
            hitCenter();
        });
    };
    useEffect(() => {
        handleSearch();
    }, []);

    const saveData = (data: any) => {
        if (data.id) {
            apis.org
                .saveOrUpdate(data)
                .then(res => {
                    if (res.status === 200) {
                        message.success('保存成功');
                    }
                })
                .then(() => {
                    handleSearch();
                });
        } else {
            apis.org
                .add(data)
                .then(res => {
                    if (res.status === 200) {
                        message.success('保存成功');
                    }
                })
                .then(() => {
                    handleSearch();
                });
        }
    };

    const remove = (id: string) => {
        apis.org
            .remove(id)
            .then(resp => {
                if (resp.status === 200) {
                    message.success('操作成功');
                }
            })
            .finally(() => {
                handleSearch();
            });
    };
    const menu = (nodeData: any) => {
        return nodeData.id === null ? (
            <Menu>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setCurrent({});
                            setParentId(nodeData);
                            setEdit(true);
                        }}
                    >
                        添加下级
                    </a>
                </Menu.Item>
            </Menu>
        ) : (
            <Menu>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setParentId(null);
                            setCurrent(nodeData);
                            setEdit(true);
                        }}
                    >
                        编辑
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setCurrent({});
                            setParentId(nodeData);
                            setEdit(true);
                        }}
                    >
                        添加下级
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setCurrent(nodeData);
                            setAutzVisible(true);
                        }}
                    >
                        权限分配
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setCurrent(nodeData);
                            setUserVisible(true);
                        }}
                    >
                        绑定用户
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            router.push(`/system/org-chart/assets/${nodeData.id}/org`);
                        }}
                    >
                        资产分配
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            remove(nodeData.id);
                        }}
                    >
                        删除
                    </a>
                </Menu.Item>
            </Menu>
        );
    };

    return (
        <PageHeaderWrapper title="机构管理">
            <div className={styles.orgContainer}>
                <OrganizationChart
                    datasource={list}
                    // draggable
                    // onClickNode={(node: any) => {
                    //   message.success(JSON.stringify(node));
                    // }}
                    pan={true}
                    // zoom={true}
                    NodeTemplate={(nodeData: any) => (
                        <NodeTemplate data={nodeData.nodeData} action={menu(nodeData.nodeData)}/>
                    )}
                />
                {edit && (
                    <Save
                        data={current}
                        close={() => {
                            setEdit(false);
                        }}
                        save={(item: any) => {
                            saveData(item);
                            setEdit(false);
                        }}
                        parentId={parentId}
                    />
                )}
                {autzVisible && (
                    <Authorization
                        close={() => {
                            setAutzVisible(false);
                            setCurrent({});
                        }}
                        target={current}
                        targetType="org"
                    />
                )}
                {userVisible && (
                    <BindUser
                        data={current}
                        close={() => {
                            setUserVisible(false);
                        }}
                    />
                )}
            </div>
        </PageHeaderWrapper>
    );
};
export default OrgChart;
