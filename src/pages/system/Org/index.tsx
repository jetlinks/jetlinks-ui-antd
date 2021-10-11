import { PageContainer } from '@ant-design/pro-layout';
import OrganizationChart from '@dabeng/react-orgchart';
import styles from './index.less';
import { Drawer, Menu, message, Modal } from 'antd';
import NodeTemplate from '@/pages/system/Org/NodeTemplate';
import { observer } from '@formily/react';
import React, { useEffect } from 'react';
import Service from '@/pages/system/Org/service';
import encodeQuery from '@/utils/encodeQuery';
import Save from '@/pages/system/Org/Save';
import { useIntl } from '@@/plugin-locale/localeExports';
import autzModel from '@/components/Authorization/autz';
import Authorization from '@/components/Authorization';
import { BindModel } from '@/components/BindUser/model';
import BindUser from '@/components/BindUser';
import OrgModel from '@/pages/system/Org/model';

export const service = new Service('organization');
const Org: React.FC = observer(() => {
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
    OrgModel.data = {
      id: null,
      name: intl.formatMessage({
        id: 'pages.system.org',
        defaultMessage: '机构管理',
      }),
      title: '组织架构',
      children: response.result,
    };
    hitCenter();
    return OrgModel;
  };

  const remove = async (id: string) => {
    await service.remove(id);
    await query();
    message.success(
      intl.formatMessage({
        id: 'pages.data.option.success',
        defaultMessage: '操作成功!',
      }),
    );
  };
  useEffect(() => {
    query();
  }, []);

  const menu = (nodeData: any) => {
    const addNext = (
      <Menu.Item key="addNext">
        <a key="addNext" onClick={() => OrgModel.addNext(nodeData)}>
          {intl.formatMessage({
            id: 'pages.system.org.option.add',
            defaultMessage: '添加下级',
          })}
        </a>
      </Menu.Item>
    );
    return nodeData.id === null ? (
      <Menu>{addNext}</Menu>
    ) : (
      <Menu>
        <Menu.Item key="edit">
          <a
            key="edit"
            onClick={() => {
              OrgModel.update(nodeData);
            }}
          >
            {intl.formatMessage({
              id: 'pages.data.option.edit',
              defaultMessage: '编辑',
            })}
          </a>
        </Menu.Item>
        {addNext}
        <Menu.Item key="autz">
          <a
            key="autz"
            onClick={() => {
              autzModel.autzTarget.id = nodeData.id;
              autzModel.autzTarget.name = nodeData.name;
              autzModel.visible = true;
            }}
          >
            {intl.formatMessage({
              id: 'pages.system.org.option.permission',
              defaultMessage: '权限分配',
            })}
          </a>
        </Menu.Item>
        <Menu.Item key="bindUser">
          <a
            key="bindUser"
            onClick={() => {
              BindModel.dimension = {
                id: nodeData.id,
                name: nodeData.name,
                type: 'org',
              };
              BindModel.visible = true;
            }}
          >
            {intl.formatMessage({
              id: 'pages.system.org.option.bindUser',
              defaultMessage: '绑定用户',
            })}
          </a>
        </Menu.Item>
        <Menu.Item key="delete">
          <a key="delete" onClick={() => remove(nodeData.id)}>
            {intl.formatMessage({
              id: 'pages.data.option.remove',
              defaultMessage: '删除',
            })}
          </a>
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <PageContainer>
      <div className={styles.orgContainer}>
        <OrganizationChart
          datasource={OrgModel.data}
          pan={true}
          NodeTemplate={(nodeData: any) => (
            <NodeTemplate data={nodeData.nodeData} action={menu(nodeData.nodeData)} />
          )}
        />
      </div>
      <Save refresh={query} />
      <Modal
        visible={BindModel.visible}
        closable={false}
        onCancel={() => {
          BindModel.visible = false;
          BindModel.bind = false;
        }}
        width={BindModel.bind ? '90vw' : '60vw'}
      >
        <BindUser />
      </Modal>
      <Drawer
        title={intl.formatMessage({
          id: 'pages.data.option.authorize',
          defaultMessage: '授权',
        })}
        width="50vw"
        visible={autzModel.visible}
        onClose={() => {
          autzModel.visible = false;
        }}
      >
        <Authorization
          close={() => {
            autzModel.visible = false;
          }}
          target={autzModel.autzTarget}
        />
      </Drawer>
    </PageContainer>
  );
});

export default Org;
