import { Component } from "react";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import React from "react";
import { Card, Table } from "antd";
import styles from "../style.less";
import { ColumnProps } from "antd/lib/table";

class Dictionary extends Component {

    columns: ColumnProps<any>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '分类',
            dataIndex: 'type',
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
        {
            title: '操作',
            render: () => "删除",
        }
    ]
    render() {
        return (
            <PageHeaderWrapper title="数据字典">
                <Card bordered={false}>
                    {/* <div className={styles.tableListForm}></div> */}
                    <Table
                        columns={this.columns}
                        rowKey={item => item.id}
                    />
                </Card>

            </PageHeaderWrapper>
        );
    }
}

export default Dictionary;
