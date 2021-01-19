import React from "react";
import { Table } from "antd";
import { PaginationConfig, SorterResult } from "antd/lib/table";
import { converFilter } from "@/utils/utils";

interface Props {
    loading?: boolean;
    dataSource: any[];
    columns: any[];
    rowKey: string;
    onSearch: Function;
    paginationConfig: any | boolean;
    size?: 'small' | 'middle' | 'default';
    rowSelection?: any;
    onRow?: any;
    scroll?: any;
}
const ProTable = (props: Props) => {
    const { loading, dataSource, columns, rowKey, onSearch, paginationConfig } = props;

    const onTableChange = (
        pagination: PaginationConfig,
        filters: any,
        sorter: SorterResult<any>,
    ) => {
        onSearch({
            pageIndex: Number(pagination.current) - 1,
            pageSize: pagination.pageSize,
            sorts: sorter,
            terms: converFilter(filters, '$IN'),
        })
    };

    return (
        <Table
            {...props}
            size={props.size}
            // loading={loading}
            // dataSource={dataSource}
            // columns={columns}
            // rowKey={rowKey}
            onChange={onTableChange}
            pagination={typeof paginationConfig === "boolean" ? paginationConfig : {
                current: paginationConfig.pageIndex + 1,
                total: paginationConfig.total,
                pageSize: paginationConfig.pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total: number) =>
                    `共 ${total} 条记录 第  ${paginationConfig.pageIndex + 1}/${Math.ceil(
                        paginationConfig.total / paginationConfig.pageSize,
                    )}页`,
            }}
        />
    )
};
export default ProTable;
