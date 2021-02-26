import React from "react";
import { groupBy } from "lodash";
import { units, Unit } from "@/utils/unit";
import { Select } from "antd";


interface UnitProps {
    onChange?(value: any): void;
    value?: string;
}

const UnitComponent = React.forwardRef((props: UnitProps, ref) => {
    const grouped = groupBy(units, unit => unit.typeText);
    const types = Array.from(new Set(units.map(unit => unit.typeText)));
    function onValueChange(value: any) {
        props.onChange && props.onChange(value);
    }
    return (
        <Select onChange={(value: string) => onValueChange(value)} value={props.value}>
            {
                types.map(type => {
                    const typeData = grouped[type];
                    return (
                        <Select.OptGroup label={type} key={type}>
                            {
                                typeData.map((e: Unit) => {
                                    return <Select.Option value={e.id} key={e.id}>{e.name} / {e.symbol}</Select.Option>
                                })
                            }
                        </Select.OptGroup>
                    );
                })
            }
        </Select>
    );
});

export default UnitComponent;
