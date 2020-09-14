import { Button, Icon } from "antd";
import React, { useEffect } from "react";
import { map } from "rxjs/operators";
import OptionGroup from "./OptionGroup";
import Service from "./service";

interface Props {
    type: string;
    target?: string;
    name?: string;
    metaData: any;
    productId: string;
}
const Visualization: React.FC<Props> = props => {
    const service = new Service('visualization');
    const { target, type } = props;
    useEffect(() => {
        service.getLayout({ target, type })
            .pipe(
                map((result: any) => JSON.parse(result.metadata || '[]')),
            )
            .subscribe((data) => {
                console.log(data, 'layout');
            })
    }, []);
    return (
        <div>
            <Button
                style={{ width: '300px', height: '200px' }}
                type="dashed"
                onClick={() => {
                    // setCurrent(undefined);
                    // setEdit(true)
                    // setAddItem(true);
                }}
            >
                <Icon type="plus" />
                   新增
                </Button>
            <OptionGroup edit={true} />
        </div>
    )
}
export default Visualization;