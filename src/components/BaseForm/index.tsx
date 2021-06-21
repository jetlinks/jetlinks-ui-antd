import React, { PureComponent } from 'react';
import { Form, Col } from 'antd'
import { FormComponentProps, FormProps, GetFieldDecoratorOptions } from 'antd/es/form/Form';
import { FormItemProps } from 'antd/es/form/FormItem';
import styles from './index.less'

const FormItem = Form.Item

interface ItemProps extends FormItemProps {
  name?: string
  render?: () => React.ReactNode
  rules?: Array<{}>
  column?: number
  options?: GetFieldDecoratorOptions
  title?: string | React.ReactNode
}

type Items = Array<ItemProps>

interface BaseFormProps extends FormComponentProps, Omit<FormProps, 'form'> {
  items: Items
  data?: any
  column?: number
}

class BaseForm extends PureComponent<BaseFormProps> {

  handleItems(props: BaseFormProps) {
    const { items, column = 1, form } = props
    const { getFieldDecorator } = form
    return items.map((item, index) => {
      //
      const { name, render, options, title, ...extra } = item
      const _column = title ? 24 : (24 / column) * (item.column || 1)

      return <Col span={_column} key={`form_col_${name || index}`} style={{ padding: '0 12px' }}>
        {
          !title ?
            <FormItem {...extra}>
              {
                name ? getFieldDecorator(name, options)(render!()) : render!()
              }
            </FormItem>
            : this.handleTitle(title)
        }
      </Col>
    })
  }

  handleTitle(title: ItemProps['title']) {

    if (typeof title === 'string') {
      return <div className={styles.form_title}>{title}</div>
    } else {
      return title
    }
  }

  render() {
    const { items, form, data, column, ...extra } = this.props
    return <div style={{ overflow: 'hidden' }}>
      <Form {...extra}>
        {this.handleItems(this.props)}
      </Form>
    </div>
  }
}

const WrappedBaseForm = Form.create<BaseFormProps>({
  name: 'base_form',
  mapPropsToFields(props) {
    const { data, items } = props
    let _data = {}
    if (data) {
      items.forEach(item => {
        if (item.name) {
          _data[item.name] =
            Form.createFormField({
              value: data[item.name]
            })
        }
      })
    }
    return _data
  }
})(BaseForm);

export default WrappedBaseForm
