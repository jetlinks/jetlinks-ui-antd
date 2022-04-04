import { useState, useCallback, useEffect } from 'react'
import IconList from './icon'
import { Modal } from 'antd'
import classNames from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import './index.less'

export interface IconProps {
  value?: string;
  onChange?: (icon: string) => void;
  disabled?: boolean;
}

export  default (props: IconProps) => {

  const [visible, setVisible] = useState(false)
  const [icon, setIcon] = useState(props.value || '')
  const [showMask, setShowMask] = useState(false)

  useEffect(() => {
    setIcon(props.value || '')
  }, [visible])

  const onSubmit = useCallback(() => {
    if (props.onChange) {
      props.onChange(icon)
    }
    closeModal()
  }, [icon])

  const closeModal = () => {
    setVisible(false)
  }

  return (
  <div className='menu-icon'>
    <div className="menu-icon-border">
      <Modal
        title='菜单图标'
        visible={visible}
        width={800}
        onOk={onSubmit}
        onCancel={closeModal}
      >
        <div className='menu-icon-items'>
          {
            IconList.map(item =>  
              <div
                className={classNames('icon-item', { active: icon === item})}
                onClick={
                  () => {
                    setIcon(item)
                  }
                }
              >
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={`#${item}`}></use>
                </svg>
              </div>
              )
          }
        </div>
      </Modal>
      <div
        className='menu-icon-content'
        onClick={() => {
        if (!props.disabled) {
          setVisible(true)
          }
        }}
        onMouseEnter={() => {
          setShowMask(true)
        }}
        onMouseLeave={() => {
          setShowMask(false)
        }}
      >
        {
          props.value ?
          <>
            <span className='menu-select-icon'>
              <svg className="icon" aria-hidden="true">
                  <use xlinkHref={`#${props.value}`}></use>
              </svg>
            </span>
            <div className={classNames('menu-icon-mask', { show: showMask})}>
              点击修改
            </div>
          </>
          :
          <>
            <PlusOutlined />
            <div>点击选择图标</div>
          </>
        }
      </div>
      {
        props.disabled &&
        <div className='menu-icon-disabled'>

        </div>
      }
    </div>
  </div>
  )
}