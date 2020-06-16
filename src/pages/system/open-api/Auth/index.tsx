import React, { useState, useEffect } from "react";
import { Drawer, Tree } from "antd";
import { zip } from "rxjs";
import { map } from "rxjs/operators";
import Service from "../service";
import encodeQueryParam from "@/utils/encodeParam";

interface Props {
    close: Function;
    current: any;
}
const Auth = (props: Props) => {

    const service = new Service('open-api');
    const [treeData, setTreeData] = useState<{ children: any; title: any; key: any; }[]>();

    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

    useEffect(() => {
        const selected: string[] = [];
        zip(service.permission.auth(encodeQueryParam({
            terms: {
                dimensionTarget: props.current.userId,
            }
        })),
            service.permission.query({})).pipe(
                map(list =>
                    list[1].map(item => ({
                        ...item,
                        children: (item.children || []).map((i: any) => {
                            const flag = (list[0].find(j => j.key === item.key)?.actions || []).includes(i.key);
                            if (flag) selected.push(`${item.key}:${i.key}`);
                            return {
                                ...i,
                                key: `${item.key}:${i.key}`,
                                enabled: flag,
                            }
                        }),
                    }))
                )
            ).subscribe(data => {
                setTreeData(data);
                setCheckedKeys(selected);
            });
    }, [])


    const onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onCheck = keys => {
        setCheckedKeys(keys);
        const list: { id: string, actions: string[] }[] = [];
        keys.filter((i: string) => i.indexOf(':') > 0).forEach((j: string) => {
            const id = j.split(':')[0];
            const action = j.split(':')[1];
            const temp = list.findIndex(i => i.id === id);
            if (temp > -1) {
                list[temp].actions.push(action);
            } else {
                list.push({ id, actions: [action] });
            }
        });
        console.log(list, 'fff');
        service.permission.save({
            targetId: props.current.userId,
            targetType: 'open-api',
            permissionList: list,
        }).subscribe(() => {
            console.log('成功');
        })
    };

    const onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeys);
    };


    const save = () => {
        // jetlinks/autz-setting/detail/_save
        const json = {
            "targetId": "1270664441306820608",
            "targetType": "user",
            "permissionList": [
                { "id": "protocol-supports", "actions": ["query", "save", "delete"] },
                { "id": "tenant-manager", "actions": ["query", "save"] },
                { "id": "organization", "actions": ["query", "save", "delete"] },
                { "id": "user", "actions": ["query", "save", "delete"] },
                { "id": "dimension", "actions": ["query", "save", "delete"] },
                { "id": "device-firmware-manager", "actions": ["publish", "query", "save", "delete"] }
            ]
        };

    }
    return (
        <Drawer
            title="授权"
            width="50VW"
            visible
            onClose={() => props.close()}
        >
            <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                treeData={treeData}
            />
        </Drawer>
    )
}
export default Auth;