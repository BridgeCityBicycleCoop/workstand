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

const { MonthPicker } = DatePicker;
const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

const dateFormat = 'YYYY/MM/DD';

const idents = [
  'First Nations, Métis, or Inuit',
  'visible minority',
  'caucasian',
  'newcomer',
];

const genders = ['male', 'female'];

const onSubmit = (url, data) =>
  fetch(url, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookie.get('csrftoken'),
    },
    body: JSON.stringify(data),
  });

const Checkbox = forwardRef(({ initialValue, value, onChange, text }, ref) => (
  <AntCheckbox
    ref={ref}
    defaultChecked={initialValue}
    checked={value}
    onChange={onChange}
  >
    {text}
  </AntCheckbox>
));

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
    const response = await fetch(`/api/v1/memberships/`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken'),
      },
      body: JSON.stringify({
        created_at: created,
        payment: { type: type.payment },
        member: memberId,
      }),
    });
    if (response.ok) {
      const body = await response.json()
      setMemberships(ms => [...ms, body])
    } else {
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

const UnwrappedForm = ({ member, form, memberships }) => {
  const [selfIdentification, setSelfIdentification] = useState(
    idents.includes(member.self_identification) ||
      member.self_identification == null
      ? member.self_identification
      : 'other',
  );
  const [customSelfIdent, setCustomSelfIdent] = useState(
    !idents.includes(member.self_identification) ||
      member.self_identification == null
      ? member.self_identification
      : null,
  );

  const [gender, setGender] = useState(
    genders.includes(member.gender) || member.gender == null
      ? member.gender
      : 'other',
  );
  const [customGender, setCustomGender] = useState(
    !genders.includes(member.gender) || member.gender != null
      ? member.gender
      : null,
  );

  const { getFieldDecorator } = form;
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

  const postCodeFormat = v => {
    const v1 = v
      .trim()
      .toUpperCase()
      .replace(' ', '');
    if (v.length > 3) {
      const p1 = v1.slice(0, 3);
      const p2 = v1.slice(3);
      return `${p1} ${p2}`;
    }
    return v1;
  };

  const normalizeFormValues = values => ({
    ...values,
    date_of_birth: values.date_of_birth
      ? values.date_of_birth.format('YYYY-MM-DD')
      : null,
    self_identification:
      selfIdentification === 'other'
        ? customSelfIdent
        : values.self_identification,
    gender: gender === 'other' ? customGender : values.gender,
  });

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(`/api/v1/members/${member.id}/`, normalizeFormValues(values));
      }
    });
  };

  return (
    <Row gutter={16}>
      <Col span={14}>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="First name">
            {getFieldDecorator('first_name', {
              rules: [
                {
                  type: 'string',
                  max: 255,
                  min: 2,
                  message: 'Must be between 2 and 255 characters',
                },
                {
                  required: true,
                  message: 'First name cannot be empty.',
                },
              ],
            })(<Input size="large" />)}
          </Form.Item>
          <Form.Item label="Last name">
            {getFieldDecorator('last_name', {
              rules: [
                {
                  type: 'string',
                  max: 255,
                  min: 2,
                  message: 'Must be between 2 and 255 characters',
                },
                {
                  required: true,
                  message: 'Last name cannot be empty.',
                },
              ],
            })(<Input size="large" />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                Preferred name&nbsp;
                <Tooltip title="What do you want others to call you?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('preferred_name', {
              rules: [
                {
                  type: 'string',
                  max: 255,
                  min: 2,
                  message: 'Must be between 2 and 255 characters',
                },
              ],
            })(<Input size="large" />)}
          </Form.Item>
          <Form.Item
            label={
              <span>
                Preferred pronoun&nbsp;
                <Tooltip title="What prounouns do you prefer?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
          >
            {getFieldDecorator('preferred_pronoun', {
              rules: [
                {
                  type: 'string',
                  max: 255,
                  min: 2,
                  message: 'Must be between 2 and 255 characters',
                },
              ],
            })(<Input size="large" />)}
          </Form.Item>
          <Form.Item label="Email">
            {getFieldDecorator('email', {
              rules: [
                { type: 'email', message: 'A valid email is required' },
                {
                  required: true,
                  message: 'Email cannot be empty.',
                },
              ],
            })(<Input size="large" />)}
          </Form.Item>
          <Form.Item label="Email consent">
            {getFieldDecorator('email_consent')(<Checkbox size="large" />)}
          </Form.Item>
          <Form.Item label="Birthday">
            {getFieldDecorator('date_of_birth', {
              rules: [],
            })(<DatePicker size="large" format={dateFormat} />)}
          </Form.Item>
          <Form.Item label="Postal code">
            {getFieldDecorator('post_code', {
              normalize: v => postCodeFormat(v),
              rules: [
                {
                  type: 'string',
                  pattern: /[A-Z]{1}[0-9]{1}[A-Z]{1}\s{1}[0-9]{1}[A-Z]{1}[0-9]{1}/,
                  message: 'A valid postal code is required. Example H0H 0H0',
                  len: 7,
                },
              ],
            })(<Input size="large" />)}
          </Form.Item>
          <Form.Item label="Suspended">
            {getFieldDecorator('suspended')(<Checkbox size="large" />)}
          </Form.Item>
          <Form.Item label="Banned">
            {getFieldDecorator('banned')(<Checkbox size="large" />)}
          </Form.Item>
          <Form.Item label="Notes">
            {getFieldDecorator('notes', {})(<TextArea size="large" />)}
          </Form.Item>
          <Form.Item label="Involvement">
            {getFieldDecorator('involvement', { initialValue: ['3a5a719017'] })(
              <AntCheckbox.Group>
                <Row>
                  <Col span={24}>
                    <AntCheckbox value="21cd9799b6" size="large">
                      General
                    </AntCheckbox>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <AntCheckbox value="3a5a719017" size="large">
                      Volunteering
                    </AntCheckbox>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <AntCheckbox value="0ebb0b5468" size="large">
                      Events
                    </AntCheckbox>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <AntCheckbox value="84309225e7" size="large">
                      Workshops
                    </AntCheckbox>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <AntCheckbox value="c96d389517" size="large">
                      Shop
                    </AntCheckbox>
                  </Col>
                </Row>
              </AntCheckbox.Group>,
            )}
          </Form.Item>
          <Form.Item label="Self identification">
            {getFieldDecorator('self_identification')(
              <Radio.Group
                onChange={event => {
                  setSelfIdentification(event.target.value);
                  event.target.value !== 'other' && setCustomSelfIdent(null);
                }}
              >
                <Radio value="First Nations, Métis, or Inuit">
                  First Nations, Métis, or Inuit
                </Radio>
                <Radio value="visible minority">Visible Minority</Radio>
                <Radio value="caucasian">Caucasian</Radio>
                <Radio value="newcomer">Newcomer</Radio>
                <Radio value="other" style={{ width: '50%' }}>
                  Other &nbsp;
                  <Input
                    value={customSelfIdent}
                    disabled={selfIdentification !== 'other'}
                    onChange={event =>
                      setCustomSelfIdent(
                        !!event.target.value ? event.target.value : null,
                      )
                    }
                  />
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="Gender">
            {getFieldDecorator('gender')(
              <Radio.Group
                onChange={event => {
                  setGender(event.target.value);
                  event.target.value !== 'other' && setCustomGender(null);
                }}
              >
                <Radio value="female">Female</Radio>
                <Radio value="male">Male</Radio>
                <Radio value="other" style={{ width: '50%' }}>
                  Other &nbsp;
                  <Input
                    value={customGender}
                    disabled={gender !== 'other'}
                    onChange={event =>
                      setCustomGender(
                        !!event.target.value ? event.target.value : null,
                      )
                    }
                  />
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
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
      gender: Form.createFormField({
        value:
          genders.includes(props.member.gender) || props.member.gender == null
            ? props.member.gender
            : 'other',
      }),
    };
  },
})(UnwrappedForm);
