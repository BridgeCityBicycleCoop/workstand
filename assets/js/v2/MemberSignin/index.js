import { Button, Col, Form, message, Modal, Row, Typography } from 'antd';
import fetch from 'isomorphic-fetch';
import React, { useEffect, useState } from 'react';
import { SignedIn } from './SignedIn';
import { WrappedSignInForm as SignInForm } from './SignInForm';

const { Title } = Typography;

const getStatus = member => {
  if (member.banned) {
    return 'BANNED';
  } else if (member.suspended) {
    return 'SUSPENDED';
  }
  return 'GOOD';
};

const memberModal = member => {
  debugger;
  Modal.error({
    title: 'Member Signed in!',
    content: member.first_name,
  });
};

export const MemberSignin = () => {
  const [currentlySignedIn, setCurrentlySignedIn] = useState([]);

  const fetchSignedIn = () =>
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
            notes: visit.member.notes
          })),
        );
      });

  useEffect(() => {
    fetchSignedIn();
  }, []);

  const signIn = (selectedMember, purpose) =>
    fetch('/members/signin/', {
      method: 'post',
      body: `id=${selectedMember}&purpose=${purpose}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => {
        if (response.status === 201) {
          return response.json()
        }
        throw new Error();
      })
      .catch(() => {
        message.error('Member already signed in');
      })
      .then(data => {
        memberModal(data.results);
        return fetchSignedIn();
      });

  return (
    <div>
      <Title>Sign-in Members</Title>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <SignInForm onSubmit={signIn} />
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
