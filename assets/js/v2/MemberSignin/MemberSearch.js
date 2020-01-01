import { AutoComplete, Icon, Input, Select, message } from 'antd';
import React, { useState } from 'react';
import fetch from 'isomorphic-fetch';

const { Option } = Select;

const renderOption = item => (
  <Option key={item.id} text={item.text}>
    <div className="global-search-item">
      <span className="global-search-item-desc">{item.text}</span>
    </div>
  </Option>
);

export const MemberSearch = ({ onSelect }) => {
  const [members, setMembers] = useState([]);

  const search = text =>
    text && fetch(`/members/search/${text}/`)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        message.error('Bad response from server');
      })
      .then(data => {
        if (data.results.length > 0) {
          setMembers(
            data.results.map(result => ({
              text: `${result.name}`,
              value: `${result.name} <${result.email}>`,
              id: result.id,
            })),
          );
        } else {
          // message.error('Member not found.');
        }
      });

  return (
    <div>
      <AutoComplete
        size="large"
        style={{ width: '100%' }}
        dataSource={members.map(renderOption)}
        onSelect={onSelect}
        onSearch={search}
        placeholder="Find member"
        optionLabelProp="text"
      >
        <Input suffix={<Icon type="search" />} />
      </AutoComplete>
    </div>
  );
};
