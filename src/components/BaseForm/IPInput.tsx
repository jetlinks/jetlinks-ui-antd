import React, { useCallback, useState, useEffect, useRef } from 'react';
import { InputNumber, Checkbox } from 'antd';
import styles from './IPInput.less';

interface IPInputProps {
  onChange?: (e: any) => void
  disabled?: boolean
  readOnly?: boolean
  value?: string
}

function IpInput(props: IPInputProps) {
  const [arr, setArr] = useState<Array<number | undefined>>([undefined, undefined, undefined, undefined])

  const [focus, setFocus] = useState(false)


  useEffect(() => {
    if (props.value) {
      setArr(handleValue(props.value))
    }
  }, [props.value])

  const handleValue = (value: string) => {
    let _str = value
    if (value.includes('http://')) {
      _str = _str.replace('http://', '')
    }
    return _str.split('.').map(Number)
  }

  const onChange = (value: number | undefined, type: number) => {
    arr[type] = value

    if (props.onChange) {
      props.onChange({
        target: {
          value: arr.some((item: any) => item === undefined) ? undefined : arr.join('.')
        }
      })
    }
  }

  const handleChildren = () => {
    const children: Array<React.ReactNode> = []

    arr.forEach((item, index) => {
      children.push(
        <InputNumber
          key={`Ip-${index}`}
          value={item}
          disabled={props.disabled}
          className={styles.input}
          max={255}
          min={0}
          maxLength={3}
          placeholder='请输入'
          onChange={e => { onChange(e, index) }}
          onFocus={() => { setFocus(true) }}
          onBlur={() => { setFocus(false) }}
          readOnly={props.readOnly}
        />
      )
      // if (index !== arr.length - 1) {
      //   children.push(<div className={`${styles.point} ${props.disabled ? styles.disabled : ''}`}>.</div>)
      // }
    })

    return children
  }

  return (
    <div className={styles.box}>
      <div className={`${styles.border} ${focus ? styles.focus : ''} `}>
        {handleChildren()}
      </div>
    </div>
  );
}

export default IpInput;
