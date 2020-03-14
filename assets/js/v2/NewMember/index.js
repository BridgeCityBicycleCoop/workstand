import { Button, Col, message, PageHeader, Row, Steps } from 'antd';
import React, { useState } from 'react';
import { Form } from './Form';
import { Waiver } from './Waiver';
import { AddMembership } from './AddMembership';

const { Step } = Steps;

const steps = [
  {
    title: 'Waiver',
    content: ({ onSkip }) => <Waiver onSkip={onSkip} />,
  },
  {
    title: 'Member Details',
    content: ({ onSkip, onSuccess }) => <Form onSkip={onSkip} onSuccess={onSuccess} />,
  },
  {
    title: 'Membership',
    content: ({ onSkip, member }) => <AddMembership onSkip={onSkip} member={member} />,
  },
];

export const NewMember = () => {
  const [step, setStep] = useState(0);
  const [member, setMember] = useState(null);

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
        <Col lg={{ offset: 6, span: 12 }} md={{ offset: 2, span: 22 }}>
          {steps[step].content({ onSkip: next, onSuccess: setMember, member })}
        </Col>
      </Row>
    </div>
  );
};
