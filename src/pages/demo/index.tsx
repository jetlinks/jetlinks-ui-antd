import React, { useEffect } from "react";
import VideoPlayer from './VideoPlayer';
import Service from "./service";
import { Divider } from "antd";
import FlashVideo from "./FlashVideo";
const Demo = () => {

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        language: 'zh-CN',
        preload: 'auto',
        errorDisplay: true,
        width: 500,
        height: 300,
        userActions: {
            hotkeys: true
        },
        sources: [{
            src: 'rtmp://58.200.131.2:1935/livetv/hunantv',
            // src: 'rtmp://47.115.125.80:7016/flash/11:YWRtaW46YWRtaW4=',
            type: 'rtmp/flv'
        }]
    }

    const service = new Service();
    useEffect(() => {
        // service.propertyType('', '').subscribe(data => console.log(data))
    }, []);

    return (
        <div>
            {/* <VideoPlayer {...videoJsOptions} /> */}

            <Divider />
            <FlashVideo url="rtmp://47.115.125.80:7016/flash/11:YWRtaW46YWRtaW4=" width={500} height={300} />
        </div>
    )
}
export default Demo;