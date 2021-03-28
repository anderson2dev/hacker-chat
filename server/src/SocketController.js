export default class SocketController {
  #users = new Map();

  constructor ({socketServer}) {
    this.socketServer = socketServer;
  }

  onNewConnection(socket) {
    const  { id } = socket;
    console.log('Connection established', id);
    const userData =  { id, socket };
    this.#updateGlobalUserData(id, userData);
    socket.on('data', this.#onSocketData(id));
    //socket.on('error');
    //sockat.on('end'); 
  }

  #onSocketData(id) {
    return data => {
      console.log(data.toString());
    }
  }

  #onSocketClosed(id) {
    return end => {
      console.log('onSocketClosed', end.toString());
    }
  }

  #onSocketError(){
    return error => {
      console.trace(error);
    }
  }
  
  #updateGlobalUserData(socketId, userData){
    const users = this.#users;
    const user = users.get(socketId) ?? {};
    const updatedUserData = {
      ...user,
      ...userData,

    }
    users.set(socketId, updatedUserData);

    return users.get(socketId);
  }
}
