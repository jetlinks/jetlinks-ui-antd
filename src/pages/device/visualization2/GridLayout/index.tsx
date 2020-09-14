import { CloseCircleOutlined, EditOutlined, SyncOutlined } from "@ant-design/icons";
import { Card, Divider, Tooltip } from "antd";
import React, { Fragment } from "react";
import ReactGridLayout from "react-grid-layout";
import GridCard from "../GridCard";

interface Props {
    layout: any[];
    edit: boolean;
    productId: string;
    target: any;
}
const GridLayout: React.FC<Props> = props => {
    const { layout, edit } = props;
    return (
        <>
            <ReactGridLayout
                onLayoutChange={(item: any) => {
                    // layoutChange(item)
                }}
                // cols={{ md: 12 }}
                // isResizable={edit}
                // isDraggable={edit}
                onDragStop={() => {
                    // setLayout([...layout])
                }}
                onResizeStop={() => {
                    // setLayout([...layout])
                }}
                className="layout"
                // layout={layout}
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
                                                <CloseCircleOutlined onClick={() => {
                                                    // removeCard(item)
                                                }} />
                                            </Tooltip>
                                            <Divider type="vertical" />
                                            <Tooltip title="编辑">
                                                <EditOutlined onClick={() => {
                                                    // setAddItem(true);
                                                    // setCurrent(item)
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
}
export default GridLayout;