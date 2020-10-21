import React, { useState, useEffect } from "react";
import { ComponentProps } from "..";
import { message, Button } from "antd";
import Service from "../service";

interface Props extends ComponentProps {
    config: any;
    productId: any;
    deviceId: any;
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

    const { deviceId, config } = props;
    const service = new Service();
    const handleClick = () => {
        if (config.sourceType === 'function') {
            service.exec(deviceId, config.function, config.runParam).subscribe(() => {
                message.success('操作成功');
            });
        }
    }

    return (
        <Button
            onClick={() => { handleClick() }}
            // style={{ width: width, height: height }}
            type={props.config.type || 'danger'}>
            {props.config.name}
        </Button>
    )
}
export default Action;
