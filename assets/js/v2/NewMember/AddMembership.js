import {
  Button,
  Col,
  List,
  message,
  Radio,
  Row,
  Typography,
  notification,
} from 'antd';
import React, { useState } from 'react';
import { paymentTypes } from '../constants';
import { Link, navigate, Router } from '@reach/router';
import Cookie from 'js-cookie';
import { createMembership } from '../api';

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

const handleSave = async (created, type, member) => {
  try {
    const response = await createMembership(created, type, member.id);
    notification.success({
      message: `Added ${member.first_name}`,
      description: `${member.first_name} ${member.last_name} has been successfully created. They can now sign in.`,
      duration: 10,
    });
    navigate(`/`);
  } catch {
    notification.error({
      message: `Failed to add membership`,
      description: `Unable to add a new membership to ${member.first_name} ${member.last_name}. Please add the membership on ${member.first_name}'s profile page.`,
      duration: 0,
      btn: <Link to={`/members/${member.id}`}>Profile</Link>,
    });
  }
};

export const AddMembership = ({ onChange, onSkip, member }) => {
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
              onChange={event => {
                let paymentType = event.target.value;
                handleSave(new Date().toISOString(), paymentType, member);
              }}
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
