import { CanvasPanel, DetailPanel, NodePanel, EdgePanel } from 'gg-editor';

import React from 'react';
import DetailForm from './DetailForm';
import styles from './index.less';
import RuleModel from './RuleModel';

interface Props {
  data: any;
  save: Function;
}
const FlowDetailPanel: React.FC<Props> = props => (
  <DetailPanel className={styles.detailPanel}>
    <NodePanel>
      <DetailForm type="node" />
    </NodePanel>
    <EdgePanel>
      <DetailForm type="edge" />
    </EdgePanel>
    {/* <NodePanel>
      <DetailForm type="node" />
    </NodePanel>
    <EdgePanel>
      <DetailForm type="edge" />
    </EdgePanel>
    <GroupPanel>
      <DetailForm type="group" />
    </GroupPanel>
    <MultiPanel>
      <Card type="inner" size="small" title="Multi Select" bordered={false} />
    </MultiPanel>
    <CanvasPanel>
      <Card type="inner" size="small" title="模型信息" bordered={false} />
    </CanvasPanel> */}
    <CanvasPanel>
      <RuleModel data={props.data} save={(item: any) => props.save(item)} />
    </CanvasPanel>
  </DetailPanel>
);

export default FlowDetailPanel;
