import React, { useState } from 'react';
import { Table, Divider, Icon, Button, Input } from 'antd';
import { Link } from '@reach/router';

const FilterDropdown = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  onSearch,
}) => (
  <div style={{ padding: 8 }}>
    <Input
      placeholder={`Search name`}
      value={selectedKeys[0]}
      onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={confirm}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
    <Button
      type="primary"
      onClick={confirm}
      icon="search"
      size="small"
      style={{ width: 90, marginRight: 8 }}
    >
      Search
    </Button>
    <Button
      onClick={clearFilters}
      size="small"
      style={{ width: 90 }}
    >
      Reset
    </Button>
  </div>
);

const getColumnSearchProps = dataIndex => ({
  filterDropdown: props => <FilterDropdown {...props} />,
  filterIcon: filtered => (
    <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase()),
  onFilterDropdownVisibleChange: visible => {
    if (visible) {
      setTimeout(() => this.searchInput.select());
    }
  },
});

export const MembersTable = ({ members }) => {
  const columns = [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      filterDropdown: props => (
        <FilterDropdown {...props} />
      ),
      onFilter: (value, record) =>
        record.firstName
          .concat(record.lastName)
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      filterIcon: filtered => (
        <Icon
          type="search"
          style={{ color: filtered ? '#1890ff' : undefined }}
        />
      ),
    },
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
