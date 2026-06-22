const PC_LOCAL_IP = '192.168.1.9'; // Ton IP PC

const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

export const API_URL = isLocalhost
  ? 'http://localhost:3001'
  : `http://${PC_LOCAL_IP}:3001`;

export const SOCKET_URL = API_URL;