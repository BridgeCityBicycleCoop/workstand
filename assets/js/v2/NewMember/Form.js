import React, { useState, useEffect } from 'react';
import { MForm, normalizeFormValues } from '../Member/Form';
import { Form as AntForm, Button } from 'antd';
import { createMember } from '../api';

const formItemLayout = {
  labelCol: {
    md: { span: 24 },
    lg: { span: 8 },
  },
  wrapperCol: {
    md: { span: 24 },
    lg: { span: 16 },
  },
};

const hasErrors = fieldsError =>
  Object.keys(fieldsError).some(field => fieldsError[field]);

const UnwrappedForm = ({ form, onSkip, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    form.validateFields();
  }, []);
  return (
    <MForm
      button={
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          block
          disabled={submitting || hasErrors(form.getFieldsError())}
          loading={submitting}
        >
          Create new member
        </Button>
      }
      isNew
      form={form}
      handleSubmit={e => {
        e.preventDefault();
        form.validateFields((err, values) => {
          if (!err) {
            // setSubmitting(true);
            createMember({
              ...values,
              ...normalizeFormValues(values),
            }).then(
              (member) => {
                onSuccess(member);
                onSkip();
              }
            );
          }
        });
      }}
      formItemLayout={formItemLayout}
    />
  );
};

export const Form = AntForm.create({ name: 'new' })(UnwrappedForm);
