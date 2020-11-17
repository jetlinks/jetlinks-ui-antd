
import { QuestionCircleOutlined } from "@ant-design/icons"
import { createFormActions, FormPath } from "@formily/antd"
import { Tooltip } from "antd"
import React from "react"

const createRichTextUtils = () => {
    return {
        text(...args: any[]) {
            return React.createElement('span', {}, ...args)
        },
        link(text: React.ReactNode, href: any, target: any) {
            return React.createElement('a', { href, target }, text)
        },
        gray(text: React.ReactNode) {
            return React.createElement(
                'span',
                { style: { color: 'gray', margin: '0 3px' } },
                text
            )
        },
        red(text: React.ReactNode) {
            return React.createElement(
                'span',
                { style: { color: 'red', margin: '0 3px' } },
                text
            )
        },
        help(text: any, offset = 3) {
            return React.createElement(
                Tooltip,
                { title: text },
                <QuestionCircleOutlined
                    style={{ margin: '0 3px', cursor: 'default', marginLeft: offset }}
                />
            )
        },
        tips(text: React.ReactNode, tips: any) {
            return React.createElement(
                Tooltip,
                { title: tips },
                <span style={{ margin: '0 3px', cursor: 'default' }}>{text}</span>
            )
        }
    }
}

export const createLinkageUtils = () => {
    const { setFieldState } = createFormActions()
    const linkage = (key: string, defaultValue: any) => (path: string, value: any) =>
        setFieldState(path, state => {
            FormPath.setIn(state, key, value !== undefined ? value : defaultValue)
        })
    return {
        hide: linkage('visible', false),
        show: linkage('visible', true),
        enum: linkage('props.enum', []),
        loading: linkage('loading', true),
        loaded: linkage('loading', false),
        value: linkage('value', '')
    }
}
export default createRichTextUtils;