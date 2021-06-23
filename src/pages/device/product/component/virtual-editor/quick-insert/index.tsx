import React, { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import styles from './index.less';
import ReactMarkdown from 'react-markdown';
import { Spin, Tree } from "antd";
import Service from '../service';
import PropertyComponent from './addProperty';

const { TreeNode } = Tree;

interface Props {
    close: Function;
    metaDataList: any[];
    insertContent: Function;
}

const QuickInsertComponent: React.FC<Props> = (props) => {

    const service = new Service('product/properties-edit');
    const [metaDataList, setMetaDataList] = useState<any[]>([]);
    const [metaList, setMetaList] = useState<any[]>([]);
    const [enterKey, setEnterKey] = useState<string>('property');
    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [propertyVisible, setPropertyVisible] = useState(false);
    const [property, setProperty] = useState({});

    const onSearch = (value: any) => {
        if(!value){
            setMetaDataList([...metaList])
            return;
        }
        let data: any[] = [];
        //只要满足就返回这个节点及其父节点
        metaList.map((item: any) => {
            let list1: any[] = []
            let list3: any[] = []
            if (item.children && item.children.length > 0) {
                item.children.map((child1: any) => {
                    let list2: any[] = []
                    if (child1.children && child1.children.length > 0) {
                        child1.children.map((child2: any) => {
                            if (child2.name.includes(value) && child2.children.length === 0){
                                list2.push(child2)
                            }
                        })
                    }else if (child1.name.includes(value) && child1.children.length === 0){
                        list1.push(child1)
                    }
                    if(list2.length > 0){
                        list3.push({...child1, children: [...list2]})
                    }
                })
            }
            if(list3.length > 0){
                data.push({...item, children: [...list3]})
            }
            if(list1.length > 0){
                data.push({...item, children: [...list1]})
            }
        })
        setMetaDataList([...data])
    }

    useEffect(() => {
        let children: any[] = [];
        if (props.metaDataList.length > 0) {
            props.metaDataList.map(item => {
                children.push({
                    id: item.id,
                    name: item.name,
                    children: [],
                    description: `### ${item.name}  
                    \n 数据类型：${item.valueType?.type}  
                    \n 是否只读：${item.expands?.readOnly}  
                    \n 可写数值范围：---`
                })
            })
        }
        let metaData = {
            id: 'property',
            name: '属性',
            children: [...children],
            description: '',
            code: ''
        }
        setLoading(true);
        service.getDescriptionList({}).subscribe(
            res => {
                if (res.status === 200) {
                    setMetaDataList([metaData, ...res.result]);
                    setMetaList([metaData, ...res.result]);//获取全部数据
                }
                setLoading(false);
            }
        )
    }, []);

    const rendertitle = (item: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px' }} onMouseEnter={() => {
            setEnterKey(item.id);
        }}>
            <div>{item.name}</div>
            {item.children.length === 0 && enterKey === item.id && (<div onClick={() => {
                if(item.code === undefined){
                    setPropertyVisible(true);
                    setProperty(item);
                }else{
                    props.insertContent(item.code)
                }
            }}><a>添加</a></div>)}
        </div>
    )

    const getView = (view: any) => {
        return (
            <TreeNode title={rendertitle(view)} value={view.id} key={view.id}>
                {
                    view.children && view.children.length > 0 ? view.children.map((v: any) => {
                        return getView(v);
                    }) : ''
                }
            </TreeNode>
        )
    };

    const getDataItem = (dataList: any, value: string) => {
        dataList.map((item: any) => {
            if (item.id === value) {
                setData(item)
            }
            if (item.children && item.children.length > 0) {
                getDataItem(item.children, value);
            }
        })
    }; //metaList

    return (
        <Spin spinning={loading}>
            <div className={styles.box}>
                <Search placeholder="搜索关键字" allowClear onSearch={onSearch} style={{ width: '100%' }} />
                <div className={styles.treeBox}>
                    <Tree
                        defaultExpandedKeys={['property']}
                        onSelect={(selectedKeys) => {
                            getDataItem(metaDataList, selectedKeys[0])
                        }}
                    >
                        {
                            metaDataList.map(item => {
                                return getView(item);
                            })
                        }
                    </Tree>
                </div>
                <div className={styles.explain}>
                    <ReactMarkdown>{data.description}</ReactMarkdown>
                </div>
            </div>
            {propertyVisible && <PropertyComponent data={property} close={() => {
                setPropertyVisible(false);
            }} ok={(data: any) => {
                props.insertContent(data);
                setPropertyVisible(false);
            }}/>}
        </Spin>
    );
}
export default QuickInsertComponent;