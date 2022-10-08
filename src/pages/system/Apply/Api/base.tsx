import Tree from '@/pages/system/Platforms/Api/leftTree';
import Table from '@/pages/system/Platforms/Api/basePage';
import SwaggerUI from '@/pages/system/Platforms/Api/swagger-ui';
import { useCallback, useEffect, useState } from 'react';
import { service } from '@/pages/system/Platforms';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import './index.less';
import { useLocation } from 'umi';
import { useDomFullHeight } from '@/hooks';
import Home from '../Home';

export const ApiModel = model<{
  data: any[] | undefined;
  baseUrl: string;
  showTable: boolean;
  components: any;
  swagger: any;
  debugger: any;
}>({
  data: [],
  baseUrl: '',
  showTable: true,
  components: {},
  swagger: {},
  debugger: {},
});

interface ApiPageProps {
  showDebugger?: boolean;
  /**
   * true 只展示已赋权的接口
   */
  isShowGranted?: boolean;
  /**
   * false：table暂时所有接口
   */
  isOpenGranted?: boolean;
  type?: 'all' | 'empowerment' | 'authorize';
  showHome?: boolean;
}

export default observer((props: ApiPageProps) => {
  const location = useLocation();
  const [operations, setOperations] = useState<string[] | undefined>(undefined);
  const [GrantKeys, setGrantKeys] = useState<string[] | undefined>(undefined);
  const { minHeight } = useDomFullHeight(`.platforms-api`);

  const initModel = () => {
    ApiModel.data = [];
    ApiModel.showTable = true;
    ApiModel.components = {};
    ApiModel.swagger = {};
    ApiModel.debugger = {};
  };

  /**
   *  获取能授权的接口ID
   */
  const getOperations = () => {
    service.apiOperations().then((resp: any) => {
      if (resp.status === 200) {
        setOperations(resp.result);
      }
    });
  };

  /**
   * 获取已授权的接口ID
   */
  const getApiGrant = useCallback(() => {
    const param = new URLSearchParams(location.search);
    const code = param.get('code');

    if (props.isOpenGranted === false) {
      service.apiOperations().then((resp: any) => {
        if (resp.status === 200) {
          setGrantKeys(resp.result);
        }
      });
    } else {
      service.getApiGranted(code!).then((resp: any) => {
        if (resp.status === 200) {
          setGrantKeys(resp.result);
        }
      });
    }
  }, [location, props.isOpenGranted]);

  useEffect(() => {
    initModel();
    getOperations();
    getApiGrant();
  }, []);

  useEffect(() => {
    console.log(ApiModel.data);
  }, [ApiModel.data]);

  return (
    <div className={'platforms-api'} style={{ minHeight }}>
      <div className={'platforms-api-tree'}>
        <Tree
          isShowGranted={props.isShowGranted}
          grantKeys={GrantKeys}
          operations={operations}
          showHome={props.showHome}
          type={props.type}
          onSelect={(data) => {
            // console.log(data);
            ApiModel.data = data;
            ApiModel.showTable = true;
          }}
        />
      </div>
      {ApiModel.showTable ? (
        <>
          {ApiModel.data && ApiModel.data.length !== 0 ? (
            <Table
              data={ApiModel.data}
              operations={operations}
              isOpenGranted={props.isOpenGranted}
              isShowGranted={props.isShowGranted}
              grantKeys={GrantKeys}
            />
          ) : (
            <Home />
          )}
        </>
      ) : (
        <SwaggerUI showDebugger={props.showDebugger} />
      )}
    </div>
  );
});
