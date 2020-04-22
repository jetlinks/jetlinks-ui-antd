import React, { useState, Fragment, useEffect, useRef } from 'react';
import GridLayout from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import loadable from '@loadable/component';
import { Button, Divider, Card, Tooltip, message } from 'antd';
import { CloseCircleOutlined, EditOutlined, SaveOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import * as rxjs from 'rxjs';
import { map, toArray, } from 'rxjs/operators';
import styles from './index.less';
import AddItem from './add-item';
import { VisualizationItem } from './data';
import apis from '@/services';
import { randomString } from '@/utils/utils';

interface Props {
    type: string;
    target: string;
    name: string;
}

export interface ComponentProps {
    // config: any;
    onLoad: Function;
    edit: Function;
    ySize: number;
    id: string;
    ready: Function;
    preview: Function;
}
const Visualization: React.FC<Props> = props => {

    const [addItem, setAddItem] = useState(false);
    const [edit, setEdit] = useState<boolean>(false);

    const [layout, setLayout] = useState<any>([]);

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

    const renderCard = () => layout.map((item: any) => {
        let ChartComponent = null;
        if (item.component) {
            ChartComponent = loadable<ComponentProps>(() => import(`./charts/${item.component}`));
        }
        return (
            <Card
                key={item.i}
                id={item.i}
            >
                <div style={{ marginBottom: 50 }}>
                    <div style={{ float: 'left' }}>
                        {item.title}
                    </div>
                    <div style={{ float: 'right' }}>
                        <Fragment>
                            {edit && (
                                <>
                                    <CloseCircleOutlined onClick={() => removeCard(item)} />
                                    {
                                        item.doEdit &&
                                        <>
                                            <Divider type="vertical" />
                                            <EditOutlined onClick={() => {
                                                item.doEdit();
                                            }} />
                                        </>
                                    }


                                </>)}
                            {item.doReady &&
                                <>
                                    <Divider type="vertical" />
                                    <SyncOutlined onClick={() => { item.doReady() }} />
                                </>}
                        </Fragment>
                    </div>
                </div>
                {item.component && ChartComponent !== null ?
                    <ChartComponent
                        {...item.props}
                        ySize={item.y}
                        config={item.config || {}} /> :
                    item.i}
            </Card>)
    })

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

    return (
        <div>
            <GridLayout
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
                cols={12}
                rowHeight={30}
                width={1800}>
                {renderCard()}

            </GridLayout>
            <div className={styles.optionGroup}>
                {edit ?
                    <div style={{ float: 'right' }}>

                        <Tooltip title="新增" style={{ float: 'right' }}>
                            <Button
                                type="danger"
                                shape="circle"
                                size="large"
                                onClick={() => { setAddItem(true) }}
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
                    save={(item: any) => {

                        setLayout([...layout, {
                            i: randomString(6), x: 0, y: 0, w: 5, h: 10, ...item,
                        }])
                    }}
                />
            )}
        </div >

    )
}
export default Visualization;

