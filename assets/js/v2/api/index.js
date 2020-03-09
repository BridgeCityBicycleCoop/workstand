import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

const csrfToken = Cookies.get('csrftoken');
const headers = new Headers({ 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' });

const parseJson = response => {
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 500) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

export const createMember = (data) => fetch('/api/v1/members/', {
  credentials: 'same-origin',
  method: 'POST',
  headers,
  body: JSON.stringify(data),
})
  .then(checkStatus)
  .then(parseJson)
  .catch((error) => {
    console.log('request failed', error);
    throw error;
  });