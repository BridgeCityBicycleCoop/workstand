import React, { useState } from 'react';
import { Form, Col, Row, Button } from 'antd';
import { MemberSearch } from './MemberSearch';
import { PurposeSelect } from './PurposeSelect';

const SignInForm = ({ form, onSubmit }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [purpose, setPurpose] = useState('FIX');
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(selectedMember, purpose);
      }
    });
  };
  return (
    <Form className="ant-advanced-search-form" onSubmit={handleSubmit}>
      {/* <Row gutter={24}></Row> */}
      <Row gutter={16}>
        <Col span={8}>
          <MemberSearch onSelect={setSelectedMember} />
        </Col>
        <Col span={2}>
          <PurposeSelect value={purpose} onSelect={setPurpose} />
        </Col>
        <Col span={8}>
          <Button type="primary" size="large" htmlType="submit">
            Sign in
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export const WrappedSignInForm = Form.create({ name: 'login_form' })(
  SignInForm,
);
