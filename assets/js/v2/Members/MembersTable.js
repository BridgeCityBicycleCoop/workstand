import React from 'react';
import { Table, Divider } from 'antd';
import { Link } from '@reach/router';

export const MembersTable = ({ members }) => {
  const columns = [
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'action',
      render: v => {
        return (
          <span>
            <Link to={`/members/${v.id}`}>view profile</Link>
            <Divider type="vertical" />
            <a>renew membership</a>
          </span>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={members} rowKey="id" />;
};
