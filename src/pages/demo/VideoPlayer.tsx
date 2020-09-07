import React, { useState, useEffect } from "react";
import videojs, { VideoJsPlayerOptions } from "video.js";
import videozhCN from 'video.js/dist/lang/zh-CN.json';
import 'video.js/dist/video-js.css';
import 'videojs-flash';
interface Props extends VideoJsPlayerOptions { }
const VideoPlayer: React.FC<Props> = (props) => {
    const [node, setNode] = useState<any>(null);
    videojs.addLanguage('zh-CN', videozhCN);
    useEffect(() => {
        const player = node ? videojs(node, props) : null;
        return () => {
            player && player.dispose()
        };
    }, [node]);

    return (
        <div>
            <div data-vjs-player>
                <video
                    ref={node => setNode(node)}
                    className="video-js">
                </video>
            </div>
        </div>
    );
}
export default VideoPlayer;