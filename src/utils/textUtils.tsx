
import { QuestionCircleOutlined } from "@ant-design/icons"
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
export default createRichTextUtils;