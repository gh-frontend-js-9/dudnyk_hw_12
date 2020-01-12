export default async function SendCurrent(token) {
  return await fetch('http://localhost:3000/api/users/current', {
    headers: {
      "x-access-token": token
    }
  })
  .then((response) => {
    return response;
  });
}