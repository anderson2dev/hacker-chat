
import http from 'http';
import {v4} from 'uuid';
import eventsConstants from './Utils/EventsConstants.js';
 
export default class SocketServer {
  constructor({ port }) {
    this.port = port;
  }

  async initialize(eventEmiter) {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('hey bro wassup?');

    });
    server.on('upgrade', (req, socket)=> {
      socket.id = v4();
      const headers = [
        'HTTP/1.1 101 Web Socket Protocol Handshake',
        'Upgrade: WebSocket',
        'Connection: Upgrade',
        ''
      ].map(line => line.concat('\r\n')).join('');
      socket.write(headers);
      eventEmiter.emit(eventsConstants.NEW_USER_CONNECTED, socket);
    })

    return new Promise((resolve, reject) => {
      server.on('error', reject);
      server.listen(this.port, () => resolve(server));
    });
  }
}
