import fetch from 'isomorphic-fetch';

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
      });
  },
};

export default Api;
