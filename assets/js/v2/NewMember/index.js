import { Button, Col, message, PageHeader, Row, Steps } from 'antd';
import React, { useState } from 'react';
import { Form } from './Form';
import { Waiver } from './Waiver';
import { AddMembership } from './AddMembership';

const { Step } = Steps;

const steps = [
  {
    title: 'Waiver',
    content: () => <Waiver />,
  },
  {
    title: 'Member Details',
    content: () => <Form />,
  },
  {
    title: 'Membership',
    content: ({ onSkip }) => <AddMembership onSkip={onSkip} />,
  },
];

export const NewMember = () => {
  const [step, setStep] = useState(0);

  const next = () => setStep(v => v + 1);
  const prev = () => setStep(v => v - 1);
  return (
    <div>
      <PageHeader title="New Member" subTitle="Add a new BCBC member" />
      <Steps current={step}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Row>
        <Col span={12} offset={6}>
          {steps[step].content({ onSkip: () => console.log('Skipped') })}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {step < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {step === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success('Processing complete!')}
            >
              Done
            </Button>
          )}
          {step > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={prev}>
              Previous
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
