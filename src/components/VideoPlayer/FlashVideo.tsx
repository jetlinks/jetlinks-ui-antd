import React from "react"

interface Props {
    width: number,
    height: number,
    url: string,
}
const FlashVideo: React.FC<Props> = (props) => {
    const { width, height, url } = props;
    return (
        <embed src={require('./StrobeMediaPlayback.swf')}
            width={width} height={height}
            quality="high"
            bgcolor="#000000"
            name="StrobeMediaPlayback"
            allowfullscreen="true"
            pluginspage="http://www.adobe.com/go/getflashplayer"
            flashvars={`&&src=${url}&&autoHideControlBar=true&&streamType=live&&autoPlay=true`}
            type="application/x-shockwave-flash">
        </embed>
    )
}
export default FlashVideo