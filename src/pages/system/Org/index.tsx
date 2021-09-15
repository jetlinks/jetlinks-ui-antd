import { PageContainer } from '@ant-design/pro-layout';
import OrganizationChart from '@dabeng/react-orgchart';
import styles from './index.less';
import { Menu, message } from 'antd';
import NodeTemplate from '@/pages/system/Org/NodeTemplate';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import { useEffect } from 'react';
import Service from '@/pages/system/Org/service';
import encodeQuery from '@/utils/encodeQuery';
import type { ObsModel, OrgItem } from '@/pages/system/Org/typings';
import Save from '@/pages/system/Org/Save';
import { useIntl } from '@@/plugin-locale/localeExports';

const obs = model<ObsModel>({
  edit: false,
  parentId: '',
  data: {},
  current: {},
  authorize: true,

  update(data: Partial<OrgItem>) {
    this.current = data;
    this.edit = true;
    this.parentId = undefined;
  },

  addNext(parentData: Partial<OrgItem>) {
    this.parentId = parentData.id;
    this.edit = true;
    this.current = {};
  },

  authorized(data: Partial<OrgItem>) {
    this.current = data;
    this.authorize = true;
  },
  closeEdit() {
    this.current = {};
    this.edit = false;
  },
});

const service = new Service('organization');
const Org = observer(() => {
  const intl = useIntl();
  const hitCenter = () => {
    const orgChart = document.getElementsByClassName('orgchart-container')[0];
    const { width } = orgChart.getBoundingClientRect();
    orgChart.scrollLeft = width;
  };

  const query = async () => {
    const response = await service.queryTree(
      encodeQuery({
        paging: false,
        terms: { typeId: 'org' },
      }),
    );
    obs.data = {
      id: null,
      name: intl.formatMessage({
        id: 'pages.system.org',
        defaultMessage: '机构管理',
      }),
      title: '组织架构',
      children: response.result,
    };
    hitCenter();
    return obs;
  };

  const remove = async (id: string) => {
    await service.remove(id);
    message.success('操作成功');
  };
  useEffect(() => {
    query();
  }, []);

  const menu = (nodeData: any) => {
    return nodeData.id === null ? (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={() => obs.addNext(nodeData)}>
            添加下级
          </a>
        </Menu.Item>
      </Menu>
    ) : (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // setParentId(null);
              // setCurrent(nodeData);
              // setEdit(true);
            }}
          >
            编辑
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={() => obs.addNext(nodeData)}>
            添加下级
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // setCurrent(nodeData);
              // setAutzVisible(true);
            }}
          >
            权限分配
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              // setCurrent(nodeData);
              // setUserVisible(true);
            }}
          >
            绑定用户
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" onClick={() => remove(nodeData.id)}>
            删除
          </a>
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <PageContainer>
      <div className={styles.orgContainer}>
        <OrganizationChart
          datasource={obs.data}
          pan={true}
          NodeTemplate={(nodeData: any) => (
            <NodeTemplate data={nodeData.nodeData} action={menu(nodeData.nodeData)} />
          )}
        />
      </div>
      <Save obs={obs} />
    </PageContainer>
  );
});

export default Org;
