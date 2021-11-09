import Taro from "@tarojs/taro";
import getBaseUrl from './baseUrl';
// import interceptors from './interceptors';

// interceptors.forEach(item=>Taro.addInterceptor(item))

class httpRequest {

  baseOptions(params:any, method:any){
    let { url, data } = params;
    let contentType = "application/json";
    contentType = params.contentType || contentType;
    const BASE_URL = getBaseUrl(url);
    const option = {
      url: BASE_URL + url,
      data: data,
      method: method,
      header: {
        'content-type': contentType,
        'x-access-token': '7ab4c7232bf6580afd2f4586d368be0f',
        'Authorization': Taro.getStorageSync('Authorization')
      }
    };
    return  Taro.request(option)
  }

  get(url:string,data:any){
    return this.baseOptions({
      url,
      data
    },'GET')
  };
  
  // get(url:string, params:any) {
  //   let option = { url, params };
  //   return this.baseOptions(option,'GET');
  // }

  post(url:string, data:any, contentType:string){
    return this.baseOptions({
      url,
      data,
      contentType
    },'POST')
  };

  put(url:string,data:any){
    return this.baseOptions({
      url,
      data
    },'PUT')
  };

  delete(url:string,data:any){
    return this.baseOptions({
      url,
      data
    },'DELETE')
  };

}

export default new httpRequest()