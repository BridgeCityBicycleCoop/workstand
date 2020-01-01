import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import fetch from 'isomorphic-fetch';
import { MembersTable } from './MembersTable';

const { Title } = Typography;

export const Members = ({children}) => {
  return (
    <div>
      {children}
    </div>
  );
};
