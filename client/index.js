import TerminalController from './src/TerminalController.js';
import Events from 'events';

const componentEmitter = new Events();
const controller = new TerminalController();
await controller.initializeTable(componentEmitter);
