import React from "react";
import VideoPlayer from './VideoPlayer';
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
            type: 'rtmp/flv'
        }]
    }

    return (
        <div>
            <VideoPlayer {...videoJsOptions} />
        </div>
    )
}
export default Demo;