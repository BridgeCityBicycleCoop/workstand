import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Spin } from 'antd';
import { MemberForm } from './MemberForm';

const { Title } = Typography;

export const Member = ({ id }) => {
  const [member, setMember] = useState(null);
  const [memberships, setMemberships] = useState(null);

  useEffect(() => {
    fetch(`/api/v1/members/${id}`)
      .then(r => r.json())
      .then(member => setMember(member));
  }, []);

  useEffect(() => {
    fetch(`/api/v1/memberships/?member_id=${id}`)
      .then(r => r.json())
      .then(setMemberships);
  }, []);

  return (
    <Row>
      {member ? (
        <>
          <Col span={14}>
            <Title>
              {member.first_name} {member.last_name}
            </Title>
            <MemberForm member={member} memberships={memberships} />
          </Col>{' '}
        </>
      ) : (
        <Col span={24}>
          <Spin />
        </Col>
      )}
    </Row>
  );
};
