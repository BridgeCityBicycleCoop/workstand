import React, { forwardRef, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Tooltip,
  Icon,
  Checkbox as AntCheckbox,
  Button,
  Radio,
  Table,
  Typography,
  Select,
  message,
} from 'antd';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import { MForm, idents, genders, normalizeFormValues } from './Form';
import { createMembership } from '../api';

const { MonthPicker } = DatePicker;
const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const InlineMembershipForm = ({ form, onSubmit }) => {
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <Form.Item>
        {form.getFieldDecorator('payment')(
          <Select
            size="large"
            style={{ width: 200 }}
            placeholder="Payment type"
          >
            <Option value="CASH" initialValue>
              Cash
            </Option>
            <Option value="VOLUNTEERING">Volunteering</Option>
            <Option value="SQUARE">Square</Option>
            <Option value="YOUTH">Youth</Option>
            <Option value="UNKNOWN">Unknown</Option>
            <Option value="NONE">None</Option>
            <Option value="PAYPAL">Paypal</Option>
            <Option value="CHEQUE">Cheque</Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedInlineMembershipForm = Form.create({ name: 'inline_membership' })(
  InlineMembershipForm,
);

const Memberships = ({ memberships: m, memberId }) => {
  const [memberships, setMemberships] = useState(m);
  const [adding, setAdding] = useState(false);
  
  const handleSave = async (created, type) => {
    try {
      const data = await createMembership(created, type.payment, memberId);
      setMemberships(ms => [...ms, data]);
      message.success('Membership successfully added.');
    } catch {
      message.error('Unable to save membership.');
    }
    setAdding(false);
  };

  const handleAdd = () => setAdding(true);

  return (
    <div>
      <Title level={2}>Membership history</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Table
            rowKey="renewed_at"
            columns={columns}
            dataSource={memberships}
            pagination={false}
          ></Table>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {adding ? (
            <WrappedInlineMembershipForm
              onSubmit={handleSave.bind(null, new Date().toISOString())}
            />
          ) : (
            <Button onClick={handleAdd.bind(null, memberId)}>Add</Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

const columns = [
  {
    title: 'Created',
    dataIndex: 'renewed_at',
    render: v => new Date(v).toLocaleDateString(),
  },
  { title: 'Payment', dataIndex: 'payment.type' },
  {
    title: 'Expires',
    dataIndex: 'expires_at',
    render: v => new Date(v).toLocaleDateString(),
  },
];

const UnwrappedForm = ({ member, form, memberships, onSubmit }) => {
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

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(member.id, normalizeFormValues(values));
      }
    });
  };

  return (
    <Row gutter={16}>
      <Col span={14}>
        <MForm
          formItemLayout={formItemLayout}
          handleSubmit={handleSubmit}
          member={member}
          form={form}
        />
      </Col>
      <Col span={10}>
        <Memberships memberships={memberships} memberId={member.id} />
      </Col>
    </Row>
  );
};

export const MemberForm = Form.create({
  name: 'member',
  mapPropsToFields(props) {
    return {
      first_name: Form.createFormField({
        value: props.member.first_name,
      }),
      last_name: Form.createFormField({
        value: props.member.last_name,
      }),
      preferred_name: Form.createFormField({
        value: props.member.preferred_name,
      }),
      date_of_birth: Form.createFormField({
        value: props.member.date_of_birth
          ? moment(props.member.date_of_birth)
          : null,
      }),
      post_code: Form.createFormField({
        value: props.member.post_code,
      }),
      email: Form.createFormField({
        value: props.member.email,
      }),
      banned: Form.createFormField({
        value: props.member.banned,
      }),
      suspended: Form.createFormField({
        value: props.member.suspended,
      }),
      email_consent: Form.createFormField({
        value: props.member.email_consent,
      }),
      notes: Form.createFormField({
        value: props.member.notes,
      }),
      involvement: Form.createFormField({
        value: props.member.involvement,
      }),
      preferred_pronoun: Form.createFormField({
        value: props.member.preferred_pronoun,
      }),
      self_identification: Form.createFormField({
        value:
          idents.includes(props.member.self_identification) ||
          props.member.self_identification == null
            ? props.member.self_identification
            : 'other',
      }),
      custom_self_identification: Form.createFormField({
        value: idents.includes(props.member.self_identification)
          ? null
          : props.member.self_identification,
      }),
      gender: Form.createFormField({
        value:
          genders.includes(props.member.gender) || props.member.gender == null
            ? props.member.gender
            : 'other',
      }),
      custom_gender: Form.createFormField({
        value: genders.includes(props.member.gender)
          ? null
          : props.member.gender,
      }),
    };
  },
})(UnwrappedForm);
