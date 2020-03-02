import { Button, Col, message, PageHeader, Row, Steps } from 'antd';
import React, { useState } from 'react';
import { Form } from './Form';
import { Waiver } from './Waiver';
import { AddMembership } from './AddMembership';

const { Step } = Steps;

const steps = [
  {
    title: 'Waiver',
    content: ({onSkip}) => <Waiver onSkip={onSkip} />,
  },
  {
    title: 'Member Details',
    content: ({onSkip}) => <Form onSkip={onSkip} />,
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
      <div style={{ marginBottom: '16px' }}>
        <Steps current={step}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <Row>
        <Col span={12} offset={6}>
          {steps[step].content({ onSkip: () => console.log('Skipped') })}
        </Col>
      </Row>
      <Row>
        <Col span={4} offset={18}>
          {step > 0 && (
            <Button size="large" style={{ marginRight: 8 }} onClick={prev}>
              Previous
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
