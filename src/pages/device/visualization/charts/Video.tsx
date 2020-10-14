import React, { useState, useEffect } from "react";
import { ComponentProps } from "..";
import { message } from "antd";
import Service from "../service";
import FlashVideo from "@/components/VideoPlayer/FlashVideo";

interface Props extends ComponentProps {
    config: any;
    productId: any;
    deviceId: any;
}

const Video: React.FC<Props> = (props) => {
    const { config, deviceId } = props;
    const [width, setWidth] = useState<number>(1000);
    const [srcUrl, setSrcUrl] = useState<string | null>(null);
    const service = new Service();
    const videoJsOptions = {
        autoplay: true,
        controls: true,
        language: 'zh-CN',
        preload: 'auto',
        errorDisplay: true,
        userActions: {
            hotkeys: true
        },
        sources: [{
            src: srcUrl || '',
            type: 'rtmp/flv'
        }]
    }

    // 修改高度
    const [height, setHeight] = useState<number>(300);
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
        if (config.urlType === 'input') {
            setSrcUrl(config.url)
        } else if (config.urlType === 'switch') {
            service.propertySource(deviceId, config.property).subscribe((data) => {
                if (data?.value) {
                    let url = '';
                    if (typeof (data.value) === 'object') {
                        url = data.value[config.target];
                    } else if (typeof (data.value) === 'string') {
                        url = JSON.parse(data.value)[config.target];
                    }
                    setSrcUrl(url);
                } else {
                    message.error('不存在视频源数据!');
                }
            })
        }

    }, []);

    return (
        <div >
            {srcUrl && <FlashVideo url={srcUrl || ''} width={width} height={height} />}
        </div>
    )
}
export default Video;