import SocketServer from './SocketServer.js';
import Event from 'events';
import SocketController from './SocketController.js';
import EventsConstants from './Utils/EventsConstants.js';
/*
async function testConn() {
  const options = {
    port: process.env.PORT || 9898,
    host: 'localhost',
    headers: {
      Connection: 'Upgrade',
      Upgrade: 'websocket'
    }
  }
  const http = await import('http');
  const req = http.request(options);
  req.end();
  req.on('upgrade', (res, socket) => {
    socket.on('data', data => {
      console.log('received', data.toString());  
    });

    setInterval(() => {
      socket.write('Hello!!!!');
    }, 500);
  })
}
*/
const port = process.env.PORT || 9898;
const socketServer = new SocketServer({port});
const eventEmiter = new Event();
const socketController = new SocketController({ socketServer });

try {
  const server = await socketServer.initialize(eventEmiter);
  console.log('server is runnig at', server.address().port)
} catch (e) {
  console.trace(e);
}
eventEmiter.on(
  EventsConstants.NEW_USER_CONNECTED, 
  socketController.onNewConnection.bind(socketController)
);

/*
eventEmiter.on(EventsConstants.NEW_USER_CONNECTED, socket => {
  console.log('connection established', socket.id);
  socket.on('data', (data)=> {
      console.log(data.toString());
      socket.write('word!1');
  })
});

await testConn();
*/
