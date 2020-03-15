import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

const csrfToken = Cookies.get('csrftoken');
const headers = new Headers({
  'X-CSRFToken': csrfToken,
  'Content-Type': 'application/json',
});

const parseJson = response => {
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 500) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

export const createMember = data =>
  fetch('/api/v1/members/', {
    credentials: 'same-origin',
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJson)
    .catch(error => {
      console.log('request failed', error);
      throw error;
    });

export const createMembership = (created, type, memberId) =>
  fetch(`/api/v1/memberships/`, {
    method: 'POST',
    credentials: 'same-origin',
    headers,
    body: JSON.stringify({
      created_at: created,
      payment: { type },
      member: memberId,
    }),
  })
    .then(checkStatus)
    .then(parseJson)
    .catch(error => {
      console.log('request failed', error);
      throw error;
    });

export const retrieveMember = id =>
  fetch(`/api/v1/members/${id}`, { credentials: 'same-origin', headers })
    .then(checkStatus)
    .then(parseJson)
    .catch(error => {
      console.log('request failed', error);
      throw error;
    });

export const retrieveMemberships = id =>
  fetch(`/api/v1/memberships/?member_id=${id}`, {
    credentials: 'same-origin',
    headers,
  })
    .then(checkStatus)
    .then(parseJson)
    .catch(error => {
      console.log('request failed', error);
      throw error;
    });

export const updateMember = (id, data) =>
  fetch(`/api/v1/members/${id}/`, {
    method: 'PUT',
    credentials: 'same-origin',
    headers,
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJson)
    .catch(error => {
      console.log('request failed', error);
      throw error;
    });
