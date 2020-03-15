import { Col, Row, Spin, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { retrieveMember, retrieveMemberships } from '../api';
import { MemberForm } from './MemberForm';

const { Title } = Typography;

export const Member = ({ id }) => {
  const [member, setMember] = useState(null);
  const [memberships, setMemberships] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const member = await retrieveMember(id);
        setMember(member);
      } catch {
        message.error('There was an error retrieving member details.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberships = await retrieveMemberships(id);
        setMemberships(memberships);
      } catch {
        message.error(
          "There was an error retrieving the member's membership details.",
        );
      }
    };
    fetchData();
  }, []);

  return member ? (
    <Row>
      <Col span={14}>
        <Title>
          {member.first_name} {member.last_name}
        </Title>
        <MemberForm member={member} memberships={memberships} />
      </Col>{' '}
    </Row>
  ) : (
    <Row type="flex" justify="center" align="middle">
      <Col span={2}>
        <Spin size="large" />
      </Col>
    </Row>
  );
};
