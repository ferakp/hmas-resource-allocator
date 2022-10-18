const axios = require('axios').default;

let host = null;
let port = null;
let protocol = 'http';

const configInterval = setInterval(() => {
  if (process.env.HMAS_HOST && process.env.HMAS_PORT && process.env.NODE_ENV) {
    host = process.env.HMAS_HOST;
    port = process.env.HMAS_PORT;
    protocol = 'http';
    clearInterval(configInterval);
  }
}, 500);

/**
 * Retrieves status of HMAS Container
 * @return {object} with two fields: errors (array) and results (array)
 */
export async function getStatus() {
  try {
    let responseDetails = { errors: [], results: []};
    if (!checkConnection()) throw new Error();
    let response = await get('status', '', '');
    if (response === undefined || response === null || response === false) throw new Error();
    else {
      responseDetails.results = [response.data.data[0].attributes];
    }
    return responseDetails;
  } catch (err) {
    return { errors: [{ code: 'N/A', title: 'AXIOS ERROR', detail: 'Error occured while establishing connection to the server.' }] };
  }
}

const get = async (path, query, token) => {
  try {
    return await axios({
      url: protocol+'://' + host + ':' + port + '/api/v1/' + path + '/' + query,
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  } catch (err) {
    return false;
  }
};

const checkConnection = () => {
  if (host === null || port === null) return false;
  return true;
};
