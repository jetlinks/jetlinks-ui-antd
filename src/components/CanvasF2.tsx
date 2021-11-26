import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { Canvas } from '@tarojs/components'

interface Props {
    id: string;
    style?: any;
    className?: string;
    onInit: (config: Config) => any
}

interface Config {
    context: CanvasRenderingContext2D
    width: number
    height: number
    pixelRatio: number
}

const wrapEvent = (e: any) => {
    if (!e) return
    if (!e.preventDefault) {
        e.preventDefault = function () { }
    }
    return e
}

const CanvasF2: React.FC<Props> = (props) => {
    let charts: any;
    let chartsEl: any;
    //初始化chart
    const initCanvas = () => {
        const query = Taro.createSelectorQuery()
        query
            .select(`#${props.id}`)
            .fields({
                node: true,
                size: true,
            })
            .exec((res: any) => {
                const { node, width, height } = res[0];
                const context = node.getContext('2d');
                //高清设置，像素比
                const pixelRatio = Taro.getSystemInfoSync().pixelRatio;
                node.width = width * pixelRatio
                node.height = height * pixelRatio
                //chart全局设置
                const config = {
                    context,
                    width,
                    height,
                    pixelRatio
                }

                const chart = props.onInit(config)
                if (chart) {
                    charts = chart
                    chartsEl = chart.get('el')
                }
            })
    }

    const touchStart = (e :{preventDefault: () => void}) => {
       const element = chartsEl;
       if(element){
        element.dispatchEvent('touchstart', wrapEvent(e))
       } 
    }

    const touchMove = (e: any) => {
        const elment = chartsEl;
        e.stopPropagation()
        e.preventDefault()
        if (elment) {
            elment.dispatchEvent('touchmove', wrapEvent(e))
        }
    }

    const touchEnd = (e: { preventDefault: () => void }) =>{
        const element = chartsEl;
        if(element){
         element.dispatchEvent('touchend', wrapEvent(e))
        } 
    }


    useEffect(() => {
        setTimeout(() => {
            initCanvas()
        }, 100)
    }, [])

    return (
        <Canvas
            type='2d'
            id={props.id}
            style={props.style}
            className={props.className}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
        />
    )
}

export default CanvasF2;