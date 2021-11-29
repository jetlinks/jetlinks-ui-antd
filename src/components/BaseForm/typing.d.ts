interface RulesProps {
  trigger?: 'blur' | 'change' | ['change', 'blur']
  validator?: any;
  message?: string;
  required: boolean;
}
interface EnumProps {
  label: string;
  value: string;
}
interface FormItemOptionsProps {
  type: 'upload' | 'input'| 'select' | 'date' | 'switch' | 'checkbox' | 'radio' | 'textarea';
  placeholder?: string;
  inputTypes?: string;
  disabled?: boolean;
  enum?: EnumProps[];
}
export interface FormItemProps {
  name: string;
  rules?: RulesProps;
  label: string;
  visible?: boolean;
  formItemOptions: FormItemOptionsProps;
}
interface FormItemLayoutProps {
  labelCol: any;
  wrapperCol: any;
}
export interface FormProps {
  formItems: FormItemProps[];
  layout: string;
  formItemLayout?: FormItemLayoutProps;
}
