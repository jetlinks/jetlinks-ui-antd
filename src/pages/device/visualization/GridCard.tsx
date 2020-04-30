import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import { ComponentProps } from ".";

interface Props extends ComponentProps {
    item: any;
    id: string;
    config: any;
    props: any;
    h: number;
}
const GridCard = (props: Props) => {
    const [ChartComponent, setChartComponent] = useState<any>();
    useEffect(() => {
        const component = loadable<ComponentProps>(() => import(`./charts/${props.config?.component}`));
        setChartComponent(component);
    }, []);

    return (
        <div>
            {ChartComponent && <ChartComponent
                style={{ padding: 10 }}
                {...props.props}
                ySize={props.h}
                config={props.config}
                productId={props.productId}
                deviceId={props.deviceId}
            />}
        </div>

    )
}
export default GridCard;