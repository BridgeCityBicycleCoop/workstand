import { message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { MembersTable } from './MembersTable';
import { retrieveMembers } from '../api';


const { Title } = Typography;

export const MembersList = () => {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const members = await retrieveMembers()
        const canonicalMembers = members.map(m => ({
          firstName: m.first_name,
          lastName: m.last_name,
          email: m.email,
          id: m.id,
        }));
        setMembers(canonicalMembers);
      } catch {
        message.error(
          'An error occurred while retrieving members. Try reloading the page.',
        );
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Title>Members</Title>
      <MembersTable members={members} />
    </div>
  );
};
