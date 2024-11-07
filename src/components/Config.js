//const API = 'http://192.168.173.176:5000/'
const API_URL = process.env.REACT_APP_API_URL || 'localhost';
const API_PORT = process.env.REACT_APP_API_PORT || '5002';
const API = 'http://' + API_URL + ':' + API_PORT + '/';

export default API;
