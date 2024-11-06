const getImageUrl = (name) => `https://localhost:7283/api/files/images/${name}`;
// const getImageUrl = (name: string) => `${process.env.MY_API_URL}/files/images/${name}`;
// const getImageUrl = (name: string) => `https://irbidrealestate-2de98705488d.herokuapp.com/api/files/images/${name}`;

export default getImageUrl;
