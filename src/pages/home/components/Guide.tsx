import { Card, Col, Row } from 'antd';

interface Props {
  title: string;
  data: any[];
  jump?: (auth: boolean, url: string, param: string) => void;
}

const Guide = (props: Props) => {
  const { title, data, jump } = props;
  return (
    <Card>
      <div style={{ marginBottom: 15 }}>
        <h3>{title}</h3>
      </div>
      <Row gutter={24}>
        {data.map((item) => (
          <Col key={item.key} span={8}>
            <Card
              bordered
              onClick={() => {
                if (jump) {
                  jump(item.auth, item.url, item.param);
                }
              }}
            >
              {item.name}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default Guide;
