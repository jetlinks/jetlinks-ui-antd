import React, { useState, useEffect, useRef } from "react";
import videojs, { VideoJsPlayerOptions, VideoJsPlayer } from "video.js";
import videozhCN from 'video.js/dist/lang/zh-CN.json';
import 'video.js/dist/video-js.css';
import 'videojs-flash';
interface Props extends VideoJsPlayerOptions { }
const VideoPlayer: React.FC<Props> = (props) => {
    const [node, setNode] = useState<any>(null);
    videojs.addLanguage('zh-CN', videozhCN);
    const instance = useRef<VideoJsPlayer>();
    useEffect(() => {
        const player = node && videojs(node, props);
        instance.current = player;
        return () => {
            player && player.dispose()
        };
    }, [node]);

    useEffect(() => {
        instance.current?.width(props.width || 200);
        instance.current?.height(props.height || 200);
    }, [props.width, props.height])

    return (
        <div>
            {/* <div data-vjs-player> 显示工具栏*/}
            <div>
                <video
                    ref={node => setNode(node)}
                    
                    className="video-js">
                </video>
            </div>
        </div>
    );
}
export default VideoPlayer;