import { Button, Col, List, Radio, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { paymentTypes } from '../constants';
import { Link, Router } from '@reach/router'

const { Paragraph, Title } = Typography;

const PaymentOptions = ({ onChange }) => {
  return (
    <div>
      <Title level={4}>Paid by</Title>
      <Radio.Group onChange size="large">
        {Array.from(paymentTypes.entries()).map(p => (
          <Radio.Button value={p[0]}>{p[1]}</Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};

export const AddMembership = ({ onChange, onSkip }) => {
  const [accepted, setAccepted] = useState(false);
  return (
    <Row>
      <Title level={3}>Add Membership</Title>
      <List
        header={
          <Typography.Text strong>Membership Responsibilities</Typography.Text>
        }
        footer={
          <Typography.Text secondary>
            If members fail to reasonably fulfill the following
            responsibilities, their privileges may be revoked
          </Typography.Text>
        }
      >
        <List.Item>Respect and Maintaining a Safe Space.</List.Item>
        <List.Item>
          Respect others and self (Racist, ableist, ageist, homophobic, sexist,
          and classist behavior and language will not be tolerated).
        </List.Item>
        <List.Item>
          Build positive relationships with BCBC Members and the community.
        </List.Item>
        <List.Item>
          Do not steal or borrow articles within the space for personal use.
        </List.Item>
        <List.Item>
          Stay up to date with BCBC initiatives and communications.
        </List.Item>
      </List>
      <Row>
        {accepted ? (
          <Col>
            <PaymentOptions
              onChange={onChange}
            />
          </Col>
        ) : (
          <Col>
            <Button onClick={() => setAccepted(true)} type="primary">
             Accept and pay for membership 
            </Button>
            <Link to="/">Not a member</Link>
          </Col>
        )}
      </Row>
    </Row>
  );
};
