/**
 * How to use it:
 * type node index.js --user-name {your username} --room {the name of the room you wish to join}
 * --host-uri {the hostname}
 */

import TerminalController from './src/TerminalController.js';
import Events from 'events';
import CliConfig from './src/CliConfig.js';
import SocketClient from './src/SocketClient.js'

const config = CliConfig.parse(process.argv);
const socketClient = new SocketClient(config);
const componentEmitter = new Events();
const controller = new TerminalController();


try {
  await socketClient.initialize();
  await controller.initializeTable(componentEmitter);
} catch (e) {
  console.trace(e);
}
componentEmitter.emit('message:received', { userName:'amanda', message: 'hello!!' })
