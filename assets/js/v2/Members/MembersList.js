import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import fetch from 'isomorphic-fetch';
import { MembersTable } from './MembersTable';

const { Title } = Typography;

export const MembersList = () => {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    fetch('/api/v1/members')
      .then(r => r.json())
      .then(members =>
        members.map(m => ({
          firstName: m.first_name,
          lastName: m.last_name,
          email: m.email,
          id: m.id,
        })),
      )
      .then(members => setMembers(members));
  }, []);
  return (
    <div>
      <Title>Members</Title>
      <MembersTable members={members} />
    </div>
  );
};
