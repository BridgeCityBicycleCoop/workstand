import { Button, Col, List, message, Radio, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { paymentTypes } from '../constants';
import { Link, navigate, Router } from '@reach/router'
import Cookie from 'js-cookie';

const { Paragraph, Title } = Typography;

const PaymentOptions = ({ onChange }) => {
  return (
    <div>
      <Title level={4}>Paid by</Title>
      <Radio.Group onChange={onChange} size="large">
        {Array.from(paymentTypes.entries()).map(p => (
          <Radio.Button value={p[0]}>{p[1]}</Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};

const handleSave = async (created, type, memberId) => {
  const response = await fetch(`/api/v1/memberships/`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookie.get('csrftoken'),
    },
    body: JSON.stringify({
      created_at: created,
      payment: { type: type.payment },
      member: memberId,
    }),
  });
  if (response.ok) {
    const body = await response.json();
    message.success("huzzah");
    navigate(`/`);
  } else {
    message.error('Unable to save membership.');
  }
};

export const AddMembership = ({ onChange, onSkip, member}) => {

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
              onChange={(event) => {
                let paymentType = event.target.value;
                handleSave(new Date().toISOString(),paymentType,member.id);
              }
            }
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
