import React from 'react';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

export const Waiver = ({ onSkip }) => (
  <div>
    <Paragraph>
      By completing this form, I hereby assume all of the risks of participating
      and/or volunteering in the Bridge City Bicycle Co­operative. I realize
      that liability may arise from negligence or carelessness on the part of
      the persons or entities being released, from dangerous or defective
      equipment or property owned, maintained or controlled by them or because
      of their possible liability without fault. I acknowledge that this
      Accident Waiver and Release of Liability form will be used by the BCBC,
      sponsors and organizers, in which I may participate and that it will
      govern my actions and responsibilities during my use of its services. In
      consideration of my application and permitting me to participate in this
      program, I hereby take action for myself and assigns as follows: (A)
      Waive, Release and Discharge from any and all liability for my death,
      disability, personal injury, property damage, property theft or actions of
      any kind which may hereafter accrue to me including my travelling to and
      from space or using the shop's bicycle, equipment or other facilities, THE
      FOLLOWING ENTITIES OR PERSONS: The directors, officers, employees,
      volunteers, and representatives of the BCBC; (B) Indemnify and Hold
      Harmless the entities and persons set forth in (A) above from any and all
      liabilities and claims arising from my participation in the BCBC,
      including my use of a bicycle belonging to the BCBC, irrespective of
      whether the cause of the claims or liability arise from the negligence,
      acts or omissions of me, a third party, or the BCBC.
    </Paragraph>
    <Title level={4}>Human Readable Summary</Title>
    <p>
      Completing this form means you acknowledge that we can't be liable for:
    </p>
    <ol>
      <li>Your death</li>
      <li>Your disability</li>
      <li>Your injuries</li>
      <li>Damage to your bike</li>
      <li>Theft of your bike</li>
      <li>Bad stuff because of repairs at the shop</li>
    </ol>
    <Button size="large" type="primary" block onClick={onSkip}>
      Accept
    </Button>
  </div>
);
