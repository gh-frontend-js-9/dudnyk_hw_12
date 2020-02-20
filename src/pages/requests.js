let domain = 'https://geekhub-frontend-js-9.herokuapp.com';

export async function sendCurrentUserRequest(token) {
    return await fetch(domain + '/api/users/', {
      headers: {
        "x-access-token": token
      }
    });
}

export async function sendGetAdsRequest(timePeriod ,token) {
    return await fetch(domain + '/api/ads/' + timePeriod, {
        headers: {
            'x-access-token': token
        }
    });
}
