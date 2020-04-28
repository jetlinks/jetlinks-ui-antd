import React, { useState, Fragment, useEffect, useRef } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import loadable from '@loadable/component';
import { Button, Divider, Card, Tooltip, message, Icon } from 'antd';
import { CloseCircleOutlined, EditOutlined, SaveOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import * as rxjs from 'rxjs';
import { map, toArray, } from 'rxjs/operators';
// import { Responsive, WidthProvider } from 'react-grid-layout';
import styles from './index.less';
import AddItem from './add-item';
import { VisualizationItem } from './data';
import apis from '@/services';
import { randomString } from '@/utils/utils';
import ReactGridLayout from 'react-grid-layout';

// const ResponsiveGridLayout = WidthProvider(Responsive);
interface Props {
    type: string;
    target?: string;
    name?: string;
    metaData: any;
    productId: string;
}

export interface ComponentProps {
    // config: any;
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

        return () => subscription.unsubscribe();
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

    const renderGridLayout = () =>
        (
            <>
                <ReactGridLayout
                    // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    onLayoutChange={(item: any) => {
                        layoutChange(item)
                    }}
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
                    width={1800}>
                    {layout.map((item: any) => {
                        let ChartComponent = null;
                        if (item.config?.component) {
                            ChartComponent = loadable<ComponentProps>(() => import(`./charts/${item.config?.component}`));
                        }
                        return (
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
                                {item.config?.component && ChartComponent !== null ?
                                    <ChartComponent
                                        style={{ padding: 10 }}
                                        {...item.props}
                                        ySize={item.y}
                                        config={item.config}
                                        productId={props.productId}
                                        deviceId={props.target}
                                    /> :
                                    item.i}
                            </Card>)
                    })}

                </ReactGridLayout>
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
            </>
        )


    const saveLayoutItem = (item: any) => {
        if (current) {
            const index = layout.findIndex((i: any) => i.i === current.i);
            current.config = item;
            layout[index] = current;
        } else {
            layout.push({ i: randomString(8), x: 5, y: 10, w: 5, h: 10, config: item })
        }
        setLayout(layout);
        setAddItem(false);
    }

    return (
        <div>
            {layout.length > 0 ? renderGridLayout() : (

                <Button
                    style={{ width: '300px', height: '200px' }}
                    type="dashed"
                    onClick={() => {
                        setCurrent(undefined);
                        setAddItem(true);
                    }}
                >
                    <Icon type="plus" />
                    新增
                </Button>
            )}

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
        </div >

    )
}
export default Visualization;

