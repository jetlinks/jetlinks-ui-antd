/**
 * 数据存储
 */
import { reactive, ref } from 'vue'
import BaseService from '@/utils/base-service'
import encodeQuery from '@/utils/encodeQuery'
import { message } from 'ant-design-vue'

export interface ResultType<T> {
  pageIndex: number;
  pageSize: number;
  total: number;
  data: Array<T>;
}
export type PaginationType = {
  current: number;
  pageSize: number;
}
export type SorterType = {
  columnKey: string;
  field: string;
  order: string;
}

export default function curdModel<T> (url: string) {
  const service = new BaseService<T>(url)
  const dataSource = reactive<ResultType<T>>({
    pageIndex: 0,
    pageSize: 10,
    total: 0,
    data: []
  })
  const visible = ref<boolean>(false)
  const model = ref<string>('') // add edit
  const current = ref<T | undefined>()

  const query = (params: any) => {
    service.query(encodeQuery(params)).then(resp => {
      if (resp.data.status === 200) {
        const result = resp.data.result
        dataSource.data = result.data
        dataSource.pageSize = result.pageSize
        dataSource.total = result.total
        dataSource.pageIndex = result.pageIndex
      }
    })
  }

  // 新增
  const add = async (data: T) => {
    service.save(data).then(resp => {
      if (resp.data.status === 200) {
        message.success('新增成功！')
        query({ pageSize: 10, pageIndex: 0 })
      }
    })
  }
  // 删除
  const remove = async (id: string) => {
    service.remove(id).then(resp => {
      if (resp.data.status === 200) {
        message.success('删除成功！')
        query({ pageSize: 10, pageIndex: 0 })
      }
    })
  }
  // 修改
  const update = async (data: T) => {
    service.update(data).then(resp => {
      if (resp.data.status === 200) {
        message.success('更新成功！')
        query({ pageSize: 10, pageIndex: 0 })
      }
    })
  }

  const handleTableChange = (page: PaginationType, filters: any, sorter: SorterType) => {
    const sorts: any = {}
    query({
      sorts,
      pageSize: page?.pageSize,
      pageIndex: page?.current - 1
    })
  }
  const showModal = () => {
    visible.value = true
  }
  return {
    service,
    dataSource,
    visible,
    model,
    current,
    query,
    add,
    remove,
    update,
    handleTableChange,
    showModal
  }
}
