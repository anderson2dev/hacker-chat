import ComponentsBuilder from './ComponentsBuilder.js';
import {comunicationStatus} from './utils/ComunicationProtocol.js';
import {userStatus} from './utils/UserStatus.js';
export default class TerminalController {
  #userColors = new Map();

  constructor() {

  }
  
  #pickCollor() {
    return `#${((1 << 24) * Math.random()|0).toString(16)}-fg` ;
  }

  #getUserCollor(userName) {
    if (this.#userColors.has(userName)) 
      return this.#userColors.get(userName);
    const collor = this.#pickCollor();
    this.#userColors.set(userName, collor);
    return collor;
  }

  #onInputReceived(eventEmitter) {
    return function () {
      const message = this.getValue();
      console.log(message);
      this.clearValue();
    }
  }

  #onStatusUpdated({ screen, status }) {
    
    return users => {
      const { content } = status.items.shift();
      status.clearItems();
      status.addItem(content);
      users.forEach( userName => {
          const color = this.#getUserCollor(userName);
          status.addItem(`{${color}}{bold}${ userName }{/}`);
      });
      screen.render();
    }
  }

  #onMessageReceived({ screen, chat }) {
    
    return msg => {
      const { userName, message } =  msg;
      const collor = this.#getUserCollor(userName);
      chat.addItem(`{${collor}}{bold}${ userName }: {/} ${ message } `), 
      screen.render()
    }
  }

  #onActivityLogUpdated({ screen, activityLog }) {
    return msg => {
      const [userName] = msg.split(/\s/);
      const collor = this.#getUserCollor(userName);
      activityLog.addItem(`{${collor}}{bold}${ msg.toString() }{/}`);
      screen.render();
    }
  }

  #registerEvents(eventEmitter, components) {
    eventEmitter.on(comunicationStatus.MESSAGE_RECEIVED, this.#onMessageReceived(components));
    eventEmitter.on(comunicationStatus.ACTIVITY_LOG_UPDATED, this.#onActivityLogUpdated(components));
    eventEmitter.on(comunicationStatus.STATUS_UPDATED, this.#onStatusUpdated(components));
  }

  async initializeTable(eventEmitter) {
    const component = new ComponentsBuilder()
      .setScreen({ title: 'Hacker chat' })
      .setComponentLayout()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setStatusComponent()
      .setActivityLogComponent()
      .build();
    this.#registerEvents(eventEmitter, component);
    component.input.focus();
    component.screen.render();
       
  }
}
