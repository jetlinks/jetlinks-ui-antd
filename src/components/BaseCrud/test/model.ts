import { reactive } from 'vue'
export type Option = {
  model: 'edit' | 'preview' | 'add';
  current: any;
  visible: boolean;
  add: () => void;
  update: (current: any) => void;
  close: () => void;
}
export const curdModel = reactive<Option>({
  model: 'preview',
  current: undefined,
  visible: false,

  add () {
    this.model = 'add'
    this.current = {}
    this.visible = true
  },

  update (current: any) {
    this.model = 'edit'
    this.current = current
    this.visible = true
  },

  close () {
    this.visible = false
    this.model = 'edit'
    this.current = {}
  }
})
