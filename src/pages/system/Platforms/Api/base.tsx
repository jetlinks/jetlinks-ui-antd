import Tree from '@/pages/system/Platforms/Api/leftTree';
import Table from '@/pages/system/Platforms/Api/basePage';
import SwaggerUI from '@/pages/system/Platforms/Api/swagger-ui';
import { useEffect, useState } from 'react';
import { service } from '@/pages/system/Platforms';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import './index.less';

export const ApiModel = model<{
  data: any[];
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
  isShowGranted?: boolean;
}

export default observer((props: ApiPageProps) => {
  const [operations, setOperations] = useState<string[]>([]);

  const initModel = () => {
    ApiModel.data = [];
    ApiModel.baseUrl = '';
    ApiModel.showTable = true;
    ApiModel.components = {};
    ApiModel.swagger = {};
    ApiModel.debugger = {};
  };

  const getOperations = () => {
    service.apiOperations().then((resp: any) => {
      if (resp.status === 200) {
        setOperations(resp.result);
      }
    });
  };

  useEffect(() => {
    initModel();
    getOperations();
  }, []);

  return (
    <div className={'platforms-api'}>
      <div className={'platforms-api-tree'}>
        <Tree
          onSelect={(data) => {
            ApiModel.data = data;
            ApiModel.showTable = true;
          }}
        />
      </div>
      {ApiModel.showTable ? (
        <Table data={ApiModel.data} operations={operations} isShowGranted={props.isShowGranted} />
      ) : (
        <SwaggerUI showDebugger={props.showDebugger} />
      )}
    </div>
  );
});
