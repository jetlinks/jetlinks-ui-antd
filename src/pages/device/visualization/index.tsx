import React, { useState, Fragment, useEffect, useRef } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button, Divider, Card, Tooltip, message, Icon } from 'antd';
import { CloseCircleOutlined, EditOutlined, SaveOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import * as rxjs from 'rxjs';
import { map, toArray, } from 'rxjs/operators';
// import { Responsive, WidthProvider } from 'react-grid-layout';
import RGL, { WidthProvider } from 'react-grid-layout';
import styles from './index.less';
import AddItem from './add-item';
import { VisualizationItem } from './data';
import apis from '@/services';
import { randomString } from '@/utils/utils';
import GridCard from './GridCard';

// const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ReactGridLayout = WidthProvider(RGL);

// const ResponsiveGridLayout = WidthProvider(Responsive);
interface Props {
    type: string;
    target?: string;
    name?: string;
    metaData: any;
    productId: string;
}

export interface ComponentProps {
    config: any;
    onLoad: Function;
    edit: Function;
    ySize: number;
    id: string;
    ready: Function;
    preview: Function;
    productId: string;
    deviceId: string;
}
const Visualization: React.FC<Props> = props => {

    const [addItem, setAddItem] = useState(false);
    const [edit, setEdit] = useState<boolean>(false);

    const [layout, setLayout] = useState<any>([]);
    const [current, setCurrent] = useState<any>();

    const removeCard = (item: any) => {
        const temp = layout.findIndex((it: any) => item.i === it.i);
        layout.splice(temp, 1);
        setLayout([...layout]);
    }

    const tempRef = useRef<any>();


    useEffect(() => {
        let subscription: any;
        apis.visualization.getLayout({
            target: props.target,
            type: props.type
        }).then(response => {
            if (response.status === 200) {

                const currentLayout = response.result.metadata === "" ? [] : JSON.parse(response.result.metadata);
                subscription = rxjs.from(currentLayout).pipe(map((item: any) => {
                    const temp = item;
                    const tempProps = {
                        // item: item,
                        ready: (onReady: Function) => {
                            temp.doReady = onReady;
                        },
                        ref: tempRef,
                        onLoad: () => tempRef.current.onLoad(),
                        edit: (doEdit: Function) => {
                            temp.doEdit = doEdit;
                        },
                        complate: {},
                        loading: {},
                        hide: {},
                        onEvent: {},
                        id: item.i,
                    };
                    temp.props = tempProps;
                    return item;
                }))
                    .pipe(toArray())
                    .subscribe(
                        item => {
                            // console.log(item, 'tiem')
                            setLayout(item);
                        },
                        () => { message.error('error') },
                        () => { }
                    )
            }
        }).catch(() => {
            message.error('加载数据错误');
            setLayout([]);
        })

        return () => subscription && subscription.unsubscribe();
    }, []);


    const saveLayout = () => {

        apis.visualization.saveOrUpdate({
            metadata: JSON.stringify(layout),
            type: props.type,
            target: props.target,
            name: props.name,
            id: `${props.type}:${props.target}`
        } as VisualizationItem).then(response => {
            if (response.status === 200) {
                message.success('保存成功');
            }
        }).catch(() => {
            message.error('保存失败！');
        })
    }

    const layoutChange = (currnetLayout: any[]) => {
        const newLayout = layout.map((item: any) => {
            const temp = currnetLayout.find(i => i.i === item.i);
            return { ...item, ...temp, };
        });
        setLayout(newLayout);
    }


    const saveLayoutItem = (item: any) => {
        const id = randomString(8);
        if (current) {
            const index = layout.findIndex((i: any) => i.i === current.i);
            current.config = item;
            layout[index] = current;
            setLayout(layout);
        } else {
            setLayout([{
                i: id,
                x: 0,
                y: Infinity,
                config: item,
                h: 5,
                w: 5,
            }, ...layout]);
        }
        setAddItem(false);
    }

    const renderGridLayout = () =>
        (
            <>
                <ReactGridLayout
                    onLayoutChange={(item: any) => {
                        layoutChange(item)
                    }}
                    // cols={{ md: 12 }}
                    isResizable={edit}
                    isDraggable={edit}
                    onDragStop={() => {
                        setLayout([...layout])
                    }}
                    onResizeStop={() => {
                        setLayout([...layout])
                    }}
                    className="layout"
                    layout={layout}
                    rowHeight={30}
                >
                    {layout.map((item: any) => (
                        <Card
                            style={{ overflow: "hidden" }}
                            key={item.i}
                            id={item.i}
                        >

                            <div style={{ position: 'absolute', right: 15, top: 5, }}>
                                <div style={{ float: 'right' }}>
                                    <Fragment>
                                        {edit && (
                                            <>
                                                <Tooltip title="删除">
                                                    <CloseCircleOutlined onClick={() => removeCard(item)} />
                                                </Tooltip>
                                                <Divider type="vertical" />
                                                <Tooltip title="编辑">
                                                    <EditOutlined onClick={() => {
                                                        setAddItem(true);
                                                        setCurrent(item)
                                                    }} />
                                                </Tooltip>
                                            </>)}
                                        {item.doReady &&
                                            <>
                                                <Divider type="vertical" />
                                                <Tooltip title="刷新">
                                                    <SyncOutlined onClick={() => { item.doReady() }} />
                                                </Tooltip>

                                            </>}
                                    </Fragment>
                                </div>
                            </div>
                            <GridCard
                                {...item}
                                productId={props.productId}
                                deviceId={props.target} />
                        </Card>))}

                </ReactGridLayout>
            </>
        )


    return (
        <>
            {layout.length > 0 ? renderGridLayout() : (
                <Button
                    style={{ width: '300px', height: '200px' }}
                    type="dashed"
                    onClick={() => {
                        setCurrent(undefined);
                        setEdit(true)
                        setAddItem(true);
                    }}
                >
                    <Icon type="plus" />
                   新增
                </Button>
            )}

            <div className={styles.optionGroup}>
                {edit ?
                    <div style={{ float: 'right' }}>

                        <Tooltip title="新增" style={{ float: 'right' }}>
                            <Button
                                type="danger"
                                shape="circle"
                                size="large"
                                onClick={() => {
                                    setCurrent(undefined);
                                    setAddItem(true)
                                }}
                            >
                                <PlusOutlined />
                            </Button>
                        </Tooltip>
                        <div style={{ float: 'right', marginLeft: 10 }}>
                            <Tooltip title="保存" >
                                <Button
                                    type="primary"
                                    shape="circle"
                                    size="large"
                                    onClick={() => {
                                        setEdit(false);
                                        saveLayout();
                                    }}
                                >
                                    <SaveOutlined />
                                </Button>
                            </Tooltip>
                        </div>
                    </div> :
                    <div style={{ textAlign: 'center' }}>
                        <Tooltip title="编辑" >
                            <Button
                                type="danger"
                                shape="circle"
                                size="large"
                                onClick={() => setEdit(true)}
                            >
                                <EditOutlined />
                            </Button>
                        </Tooltip>
                    </div>
                }
            </div>
            {addItem && (
                <AddItem
                    close={() => { setAddItem(false) }}
                    metaData={props.metaData}
                    current={current}
                    save={(item: any) => {
                        saveLayoutItem(item);
                    }}
                />
            )}
        </ >

    )
}
export default Visualization;

