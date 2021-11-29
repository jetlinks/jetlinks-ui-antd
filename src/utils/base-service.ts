import Axios from '@/utils/axios'
export const baseUrl = '/jetlinks'
interface IBaseService<T> {
  query: (params: any) => Promise<any>;
  save: (data: T) => Promise<any>;
  remove: (id: string) => Promise<any>;
}

class BaseService<T> implements IBaseService<T> {
  protected uri: string;

  protected headers = {
    'X-Access-Token': localStorage.getItem('x-access-token') || null
  };

  constructor (uri?: string) {
    this.uri = `${baseUrl}/${uri}`
  }

  query (params: any): Promise<any> {
    return Axios({
      url: `${this.uri}/_query/`,
      method: 'GET',
      params
    })
  }

  queryNoPaging (params: any): Promise<any> {
    return Axios({
      url: `${this.uri}/_query/no-paging?paging=false`,
      method: 'GET',
      params
    })
  }

  remove (id: string): Promise<any> {
    return Axios({
      url: `${this.uri}/${id}`,
      method: 'DELETE'
    })
  }

  save (data: T): Promise<any> {
    return Axios({
      url: `${this.uri}`,
      method: 'POST',
      data
    })
  }

  update (data: Partial<T>): Promise<any> {
    return Axios({
      url: `${this.uri}`,
      method: 'PATCH',
      data
    })
  }
}

export default BaseService
