import blessed from 'blessed';

export default class ComponentsBuilder {
  constructor() { }
  
  #screen;
  #input;
  #chat;
  #layout;
  #status;
  #activityLog;

  setStatusComponent() {
    this.#status = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      width: '25%',
      height: '90%',
      items: ['{bold} Users on room {/}:']
    });
    return this;
  }

  setActivityLogComponent() {
    this.#activityLog = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      width: '25%',
      height: '90%',
      style: {
        fg: 'yellow',
      },
      items: ['{bold} Activity log{/}:']
    });
    return this;
  }

  #baseComponent() {
    return {
      border: 'line',
      mouse: true,
      keys: true,
      top: 0,
      scrollbar: {
        ch: ' ',
        inverse: true        
      },
      /** Enables the use of colors and tags when typing texts */
      tags: true

    };
  }

  setChatComponent() {
    this.#chat = blessed.list({
      ...this.#baseComponent(),
      parent: this.#layout,
      align: 'left',
      width: '50%',
      height: '90%',
      items: ['{bold}Messenger{/}', '']
    });
    return this;
  }

  setScreen({ title }) {
    this.#screen = blessed.screen({ 
      smartCSR: true,
      title 
    });
    this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0)); 
    return this;     
  }

  setComponentLayout() {
    this.#layout = blessed.layout({
      parent: this.#screen,
      height: '100%',
      width: '100%'
    });
    return this;
  }

  setInputComponent(onEnterPressed) {
    const input = blessed.textarea({
      parent: this.#screen,
      bottom: 0,
      height: '10%',
      //width: '100%',
      inputOnFocus: true,
      padding: {
        top: 1,
        left: 2
      },
      style: {
        fg: '#f6f6f6',
        bg: '#353535'
      }
    });
    input.key('enter', onEnterPressed);
    this.#input = input;
    return this;
  }

  build(){
    const components = {
      screen: this.#screen,
      input: this.#input,
      chat: this.#chat,
      activityLog: this.#activityLog,
      status: this.#status,

    }
    return components;
  }
}
