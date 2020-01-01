import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Typography, message } from 'antd';
import { SignedIn } from './SignedIn';
import { MemberSearch } from './MemberSearch';
import fetch from 'isomorphic-fetch';
import { PurposeSelect } from './PurposeSelect';

const { Title } = Typography;

const getStatus = member => {
  if (member.banned) {
    return 'BANNED';
  } else if (member.suspended) {
    return 'SUSPENDED';
  }
  return 'GOOD';
};

export const MemberSignin = () => {
  const [purpose, setPurpose] = useState('FIX');
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentlySignedIn, setCurrentlySignedIn] = useState([]);

  useEffect(() => {
    fetch('/members/signin/')
      .then(response => response.json())
      .then(visits => {
        setCurrentlySignedIn(
          visits.map(visit => ({
            id: visit.member.id,
            status: getStatus(visit.member),
            purpose: visit.purpose,
            firstName: visit.member.first_name,
            lastName: visit.member.last_name,
            fullName: `${visit.member.first_name} ${visit.member.last_name}`,
            value: `${visit.member.first_name} ${visit.member.last_name} <${visit.member.email}>`,
            at: visit.created_at,
          })),
        );
      });
  }, []);

  const signIn = () => {
    fetch('/members/signin/', {
      method: 'post',
      body: `id=${selectedMember}&purpose=${purpose}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => {
        if (response.status === 201) {
          return response.json();
        }
        throw new Error();
      })
      .catch(() => {
        message.error('Member already signed in');
      });
  };

  return (
    <div>
      <Title>Sign-in Members</Title>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form
            className="ant-advanced-search-form"
            onSubmit={() => console.log('Submitted')}
          >
            {/* <Row gutter={24}></Row> */}
            <Row gutter={16}>
              <Col span={8}>
                <MemberSearch onSelect={setSelectedMember} />
              </Col>
              <Col span={2}>
                <PurposeSelect value={purpose} onSelect={setPurpose} />
              </Col>
              <Col span={8}>
                <Button type="primary" size="large" onClick={signIn}>
                  Sign in
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <SignedIn members={currentlySignedIn} />
        </Col>
      </Row>
    </div>
  );
};
