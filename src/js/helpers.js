import { TIMOUT_SEC } from './config';

// this function works if the request to the server is taking too much time to execute
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // Promise.race() used to execute when one of the promises fetches first either fullfilled or rejected
    const res = await Promise.race([fetch(url), timeout(TIMOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};
