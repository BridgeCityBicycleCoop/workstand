import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export const PurposeSelect = ({ onSelect, value }) => (
  <Select
    defaultValue="FIX"
    style={{ width: '100%' }}
    onSelect={onSelect}
    size="large"
    value={value}
  >
    <Option value="VOLUNTEER">Volunteer</Option>
    <Option value="FIX">Fix</Option>
    <Option value="BUILD">Build</Option>
    <Option value="WORKSHOP">Workshop</Option>
    <Option value="DONATE">Donate</Option>
    <Option value="STAFF">Staff</Option>
    <Option value="PARTS">Parts</Option>
    <Option value="BUY_BIKE">Buy Bike</Option>
    <Option value="TOUR">Tour / Visit</Option>
  </Select>
);

PurposeSelect.defaultProps = {
  value: 'FIX',
};
