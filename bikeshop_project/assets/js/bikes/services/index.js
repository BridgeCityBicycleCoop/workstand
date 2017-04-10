import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

const csrfToken = Cookies.get('csrftoken')
const headers = new Headers({ 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' });

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

const parseJson = response => response.json();

const Api = {
  fetchBikes() {
    return fetch('/api/v1/bikes/', {
      credentials: 'same-origin',
    })
      .then(checkStatus)
      .then(parseJson)
      .then(data => data)
      .catch((error) => {
        console.log('request failed', error);
        throw error;
      });
  },
  updateBike(data) {
    return fetch(data.url, {
      credentials: 'same-origin',
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
      .then(checkStatus)
      .then(parseJson)
      .then(data => data)
      .catch((error) => {
        console.log('request failed', error);
        throw error;
      });
  },
  saveBike(data) {
    return fetch(`/api/v1/bikes/`, {
      credentials: 'same-origin',
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
      .then(checkStatus)
      .then(parseJson)
      .then(data => data)
      .catch((error) => {
        console.log('request failed', error);
        throw error;
      });
  },
  cpicBike(id) {
    fetch(`/api/v1/bikes/${id}/check/`, {
      credentials: 'same-origin',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    })
      .then(checkStatus)
      .then(parseJson)
      .then(data => data)
      .catch((error) => {
        console.log('request failed', error);
        throw error;
      });
  }
};

export default Api;
