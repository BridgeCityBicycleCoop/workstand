import React from 'react';
import { MForm } from '../Member/Form';
import { Form as AntForm } from 'antd';
import { createMember } from '../api';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const UnwrappedForm = ({ form }) => {
  return (
    <MForm
      form={form}
      handleSubmit={e => {
        e.preventDefault();
        form.validateFields((err, values) => {
          if (!err) {
            createMember(values);
          }
        });
      }}
      formItemLayout={formItemLayout}
    />
  );
};

export const Form = AntForm.create({ name: 'new' })(UnwrappedForm);
