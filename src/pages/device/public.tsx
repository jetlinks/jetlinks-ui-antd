import { groupBy } from "lodash";
import { units, Unit } from "@/utils/unit";
import { Select } from "antd";
import { ReactNode } from "react";
import React from "react";

export function renderUnit(): ReactNode {
    const grouped = groupBy(units, unit => unit.typeText);
    const types = Array.from(new Set<string>(units.map(unit => unit.typeText)));
    return (
        <Select >
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
}