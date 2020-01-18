export default async function SendCurrent(token) {
  return await fetch('https://geekhub-frontend-js-9.herokuapp.com/api/users/', {
    headers: {
      "x-access-token": token
    }
  })
  .then((response) => {
    return response;
  });
}