import {InputNumber} from "antd";
import React, {useEffect, useCallback, useState, forwardRef} from "react";

interface ArrayInputNumberProps {
  onChange?: (e: any) => void
  value?: Array<number>
}

const ArrayInputNumber = (props: ArrayInputNumberProps) => {
  const [value, setValue] = useState<number | undefined>(undefined);
  const [value2, setValue2] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (props.value) {
      setValue(props.value[0]);
      setValue2(props.value[1]);
    }
  }, [props.value]);

  const chnageValue = useCallback((_value, type) => {
    let _arr = [value, value2];
    if (type === 1) {
      setValue(_value)
    } else {
      setValue2(_value)
    }
    _arr[type - 1] = _value;
    if (props.onChange) {
      props.onChange(
        {
          target: {
            value: _arr
          }
        }
      )
    }
  }, [value, value2]);

  return <div>
    <InputNumber value={value} onChange={(e) => {
      chnageValue(e, 1)
    }} placeholder='起始端口'/>
    至
    <InputNumber value={value2} onChange={(e) => {
      chnageValue(e, 2)
    }} placeholder='终止端口'/>
  </div>
};

export default forwardRef(ArrayInputNumber)
