import React from "react";
import { FormItemConfig } from "@/utils/common";
import { Input } from "antd";

const basicConfig: FormItemConfig[] = [
    {
        label: '节点ID',
        key: 'id',
        styles: {
            lg: { span: 24 },
            md: { span: 24 },
            sm: { span: 24 },
        },
        // options: {
        //     initialValue: model.id,
        // },
        component:
            <Input readOnly />
    },
    {
        label: '节点类型',
        key: 'executor',
        styles: {
            lg: { span: 24 },
            md: { span: 24 },
            sm: { span: 24 },
        },
        // options: {
        //     initialValue: model.executor,
        // },
        component:
            <Input readOnly />
    },
    {
        label: '节点名称',
        key: 'label',
        styles: {
            lg: { span: 24 },
            md: { span: 24 },
            sm: { span: 24 },
        },
        // options: {
        //     initialValue: model.label,
        // },
        component:
            <Input />
    },
    {
        label: '大小',
        key: 'size',
        styles: {
            lg: { span: 24 },
            md: { span: 24 },
            sm: { span: 24 },
        },
        // options: {
        //     initialValue: model.size,
        // },
        component:
            <Input />,
    },
    {
        label: '颜色',
        key: 'color',
        styles: {
            lg: { span: 24 },
            md: { span: 24 },
            sm: { span: 24 },
        },
        // options: {
        //     initialValue: model.color,
        // },
        component:
            <Input />,
    }
];

export default basicConfig;