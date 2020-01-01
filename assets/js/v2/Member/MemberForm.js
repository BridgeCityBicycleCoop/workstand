import React, { forwardRef } from 'react';
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
} from 'antd';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';

const { MonthPicker } = DatePicker;
const { TextArea } = Input;

const dateFormat = 'YYYY/MM/DD';

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

const UnwrappedForm = ({ member, form }) => {
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

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        fetch(`/api/v1/members/${member.id}/`, {
          method: 'PUT',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookie.get('csrftoken'),
          },
          body: JSON.stringify({
            ...values,
            date_of_birth: values.date_of_birth
              ? values.date_of_birth.format('YYYY-MM-DD')
              : null,
          }),
        });
      }
    });
  };

  return (
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
      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
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
    };
  },
})(UnwrappedForm);
