import React, { useEffect,useState } from 'react'
import Taro,{} from '@tarojs/taro'
import { Canvas } from '@tarojs/components'
import F2 from '@antv/f2';
interface Props {
    data: any
    title: string
    id: string
  }
const Status: React.FC<Props> = (props) => {

  const [data,setData]= useState<any>();

    useEffect(()=>{
      // if(props?.data && props.data.length!==0){
      //   setData(props.data)
      // }
        setTimeout(()=>{
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
                    const chart = new F2.Chart({
                        ...config
                      })
                      // charts=chart
                      chart.source(props.data, {
                        y: {
                          max: 100,
                          min: 0
                        }
                      });
                      chart.axis(false);
                      chart.tooltip(false);
                      chart.coord('polar', {
                        transposed: true,
                        innerRadius: 0.8,
                        radius: 0.85
                      });
                      chart.guide().arc({
                        start: [0, 0],
                        end: [1, 99.98],
                        top: false,
                        style: {
                          lineWidth: 14,
                          stroke: '#ccc'
                        }
                      });
                      chart.guide().text({
                        position: ['50%', '50%'],
                        content: `${props.title}\n${props.data[0].y}%`,
                        style: {
                          fill: '#1890FF'
                        }
                      });
                      chart.interval()
                        .position('x*y')
                        .size(14)
                        // .shape('polar-tick')
                        .color('l(90) 0:#1890ff 1:#70cdd0')
                        .animate({
                          appear: {
                            duration: 1200,
                            easing: 'cubicIn'
                          }
                        });
                      chart.render();
                      // chart.changeData(props.data);
                })
        },100)
    },[props.data])
    

    return (
        <Canvas id={props.id} type='2d' style={{ width: '100%', height: '100%' }}/>
    )
}
export default Status;