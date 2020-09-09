import React, { useState, useEffect } from "react";
import { ComponentProps } from "..";
import { message, Button } from "antd";

interface Props extends ComponentProps {
    config: any;
}

const Action: React.FC<Props> = (props) => {
    const [width, setWidth] = useState<number>(100);

    // 修改高度
    const [height, setHeight] = useState<number>(80);
    useEffect(() => {
        const div = document.getElementById(props.id);
        if (div) {
            setHeight(div.offsetHeight - 50);
            setWidth(div.offsetWidth - 50);
        }
    }, [props.ySize]);
    // 注册方法
    useEffect(() => {
        if (props.ready) {
            props.ready(() => {
                message.success(`更新。。。${props.id}`);
            });
        }
        if (props.edit) {
            props.edit(() => props.config);
        }

    }, []);

    return (
        <Button
            onClick={() => { message.success('操作') }}
            // style={{ width: width, height: height }}
            type={props.config.type || 'danger'}>
            {props.config.name}
        </Button>
    )
}
export default Action;