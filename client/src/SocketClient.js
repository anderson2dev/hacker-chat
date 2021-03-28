export default class SocketClient {
  #serverConnection;

  constructor({ protocol, host, port }) {
   this.protocol = protocol;
   this.host = host;
   this.port = port;
  }

  async createConnection() {
    const options = {
      port: this.port,
      host: this.host,
      headers: {
        Connection: 'Upgrade',
        Upgrade: 'websocket'
      }
    }

    const http = await import(this.protocol);
    const req = http.request(options);
    req.end();
    return new Promise(resolve =>  {
      req.once('upgrade', (res, socket) => {
        resolve(socket);
      });
    });
  }

  async initialize(){
    this.#serverConnection =  await this.createConnection();
    console.log("I've connected to the server");
  }
}
