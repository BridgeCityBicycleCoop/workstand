import {
  Button,
  Checkbox as AntCheckbox,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Radio,
  Row,
  Select,
  Tooltip,
  Typography,
} from 'antd';
import React, { useState, forwardRef, useEffect } from 'react';

const { MonthPicker } = DatePicker;
const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

export const normalizeFormValues = values => ({
  ...values,
  date_of_birth: values.date_of_birth
    ? values.date_of_birth.format('YYYY-MM-DD')
    : null,
  self_identification:
    values.self_identification === 'other'
      ? values.custom_self_identification
      : values.self_identification,
  gender: values.gender === 'other' ? values.custom_gender : values.gender,
});

const postCodeFormat = v => {
  if (v == undefined) {
    return '';
  }

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

const dateFormat = 'YYYY/MM/DD';

export const idents = [
  'First Nations, Métis, or Inuit',
  'visible minority',
  'caucasian',
  'newcomer',
];

export const genders = ['male', 'female'];

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

export const MForm = ({
  formItemLayout,
  handleSubmit,
  form,
  member,
  isNew,
  button,
}) => {
  const { getFieldDecorator } = form;
  const [isVisible, setIsVisible] = useState({});
  const selfIdent = form.getFieldValue('self_identification');
  const gender = form.getFieldValue('gender');

  useEffect(() => {
    setIsVisible(v => {
      return {
        ...v,
        self_identification: selfIdent == undefined ? false : !idents.includes(selfIdent),
        gender: gender == undefined ? false : !genders.includes(gender),
      };
    });
  }, []);

  const errors = Object.entries(form.getFieldsError())
    .filter(v => !!v[1])
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: form.isFieldTouched(k) ? form.getFieldError(k) : '',
      }),
      {},
    );

  const getItemValidationProps = k => ({
    validateStatus: errors[k] ? 'error' : '',
    help: errors[k],
  });
  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="First name" {...getItemValidationProps('first_name')}>
        {getFieldDecorator('first_name', {
          rules: [
            {
              type: 'string',
              max: 255,
              min: 2,
              message: 'Must be between 2 and 255 characters',
            },
            { required: true, message: 'First name cannot be empty.' },
          ],
        })(<Input size="large" />)}{' '}
      </Form.Item>
      <Form.Item label="Last name" {...getItemValidationProps('last_name')}>
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
      <Form.Item label="Email" {...getItemValidationProps('email')}>
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
      <Form.Item label="Postal code" {...getItemValidationProps('post_code')}>
        {getFieldDecorator('post_code', {
          normalize: v => postCodeFormat(v),
          rules: [
            {
              required: true,
              message: 'Postal code is required. Example H0H 0H0',
            },
            {
              type: 'string',
              pattern: /[A-Z]{1}[0-9]{1}[A-Z]{1}\s{1}[0-9]{1}[A-Z]{1}[0-9]{1}/,
              message: 'A valid postal code is required. Example H0H 0H0',
              len: 7,
            },
          ],
        })(<Input size="large" />)}
      </Form.Item>
      {!isNew && (
        <fieldset>
          <Title level={4}>Member status</Title>
          <Form.Item label="Suspended">
            {getFieldDecorator('suspended')(<Checkbox size="large" />)}
          </Form.Item>
          <Form.Item label="Banned">
            {getFieldDecorator('banned')(<Checkbox size="large" />)}
          </Form.Item>
          <Form.Item label="Notes">
            {getFieldDecorator('notes', {})(<TextArea size="large" />)}
          </Form.Item>
        </fieldset>
      )}
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
              setIsVisible(v => {
                return {
                  ...v,
                  self_identification: event.target.value === 'other',
                };
              });
            }}
            name="self_identification"
          >
            <Radio value="First Nations, Métis, or Inuit">
              First Nations, Métis, or Inuit
            </Radio>
            <Radio value="visible minority">Visible Minority</Radio>
            <Radio value="caucasian">Caucasian</Radio>
            <Radio value="newcomer">Newcomer</Radio>
            <Radio value="other" style={{ width: '50%' }}>
              Other &nbsp;
            </Radio>
            {isVisible['self_identification'] &&
              getFieldDecorator('custom_self_identification', {})(<Input />)}
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item label="Gender">
        {getFieldDecorator('gender')(
          <Radio.Group
            onChange={event => {
              setIsVisible(v => {
                return {
                  ...v,
                  gender: event.target.value === 'other',
                };
              });
            }}
          >
            <Radio value="female">Female</Radio>
            <Radio value="male">Male</Radio>
            <Radio value="other" style={{ width: '50%' }}>
              Other &nbsp;
              {isVisible['gender'] &&
                getFieldDecorator('custom_gender', {})(<Input />)}
            </Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      {/* <Form.Item wrapperCol={{ span: 12, offset: 6 }}> */}
      <Row type="flex" justify="end">
        {button || (
          <Button size="large" type="primary" htmlType="submit">
            Save
          </Button>
        )}
      </Row>
    </Form>
  );
};

MForm.defaultProps = {
  button: null,
  isNew: false,
  member: {
    gender: null,
    self_identification: null,
  },
};
