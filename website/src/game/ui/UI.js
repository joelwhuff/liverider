import {
    LEFT_TOOLBAR_EDITING,
    LEFT_TOOLBAR_VIEWING,
    LEFT_TOOLBAR_SPECTATING,
    RIGHT_TOOLBAR,
} from '../constant/ToolbarConstants.js';
import { TRACK_DEFAULT } from '../constant/TrackConstants.js';
import Toolbar from '../tool/Toolbar.js';
import Track from '../track/Track.js';
import CameraTool from '../tool/CameraTool.js';
import LineTool from '../tool/item/line/LineTool.js';

export default class UI {
    constructor(game, container) {
        this.game = game;

        this.container = container;

        this.options = null;

        this.gameScreen = null;
        this.canvas = null;
        this['left'] = null;
        this['right'] = null;

        this.settings = null;
        this.settingsIsOpen = false;
        this.gameWasPaused = false;

        this.chatButton = null;
        this.chatInput = null;
        this.chatIsOpen = true;

        this.screenOverlay = document.createElement('div');
        this.screenOverlay.id = 'screen-overlay';

        this.makeGameUI();
    }

    clearUI(state) {
        if (this['left']) {
            this.gameScreen.removeChild(this['left']);
            this['left'] = null;
        }
        if (this['right']) {
            this.gameScreen.removeChild(this['right']);
            this['right'] = null;
        }
    }

    createEditorUI(state) {
        // make container for buttons so i can just clear it
        let buttons = document.querySelectorAll('#game-options .item');
        if (buttons.length) {
            let gameOptions = document.getElementById('game-options');
            gameOptions.removeChild(document.getElementById('import'));
            buttons.forEach(button => {
                gameOptions.removeChild(button);
            });
        }
        this.makeButtons(state);
        this.makeToolbar(state, LEFT_TOOLBAR_EDITING, 'left');
        this.makeToolbar(state, RIGHT_TOOLBAR, 'right');

        state.track.toolManager.setTool(state.track.toolCollection.toolsByToolName.get(LineTool.toolName));
    }

    createRaceUI(state) {
        this.makeToolbar(state, state.track.spectating ? LEFT_TOOLBAR_SPECTATING : LEFT_TOOLBAR_VIEWING, 'left');

        state.track.toolManager.setTool(state.track.toolCollection.toolsByToolName.get(CameraTool.toolName));
    }

    makeGameUI() {
        let content = document.createElement('div');
        content.id = 'game-content';

        this.gameScreen = document.createElement('div');
        this.gameScreen.id = 'game-screen';

        this.canvas = document.createElement('canvas');

        this.gameScreen.appendChild(this.canvas);

        let chat = document.createElement('div');
        chat.classList.add('game-chat');
        this.settingsIsOpen = false;

        let chatInputContainer = document.createElement('div');
        chatInputContainer.classList.add('input-ctr');

        this.chatInput = document.createElement('input');
        this.chatInput.classList.add('input');
        this.chatInput.setAttribute('placeholder', 'Message');
        this.chatInput.setAttribute('spellcheck', false);
        this.chatInput.addEventListener('mousedown', () => {
            this.game.stateManager.track.event.gameInFocus = false;
        });
        this.chatInput.addEventListener('blur', () => {
            this.game.stateManager.track.event.gameInFocus = true;
        });
        this.chatInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        let chatPost = document.createElement('button');
        chatPost.classList.add('post');
        chatPost.textContent = 'Post';
        chatPost.addEventListener('click', () => {
            this.sendMessage();
        });

        chatInputContainer.append(this.chatInput, chatPost);

        this.chatMessages = document.createElement('div');
        this.chatMessages.classList.add('messages');

        chat.append(chatInputContainer, this.chatMessages);

        content.append(this.gameScreen, chat);

        this.options = document.createElement('div');
        this.options.id = 'game-options';

        let settingsButton = document.createElement('div');
        settingsButton.classList.add('settings');
        settingsButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#fff" d="M79.875 47.332a29.81 29.81 0 0 0-1.794-7.897l7.96-6.804a40.146 40.146 0 0 0-11.102-13.893l-8.395 6.239a29.87 29.87 0 0 0-7.296-3.517l-.356-10.455C56.031 10.355 53.058 10 50 10s-6.031.355-8.892 1.004l-.356 10.456a29.872 29.872 0 0 0-7.296 3.517l-8.395-6.239a40.146 40.146 0 0 0-11.102 13.893l7.96 6.804a29.828 29.828 0 0 0-1.794 7.897L10 50.009a39.831 39.831 0 0 0 3.948 17.34l10.286-1.982a30.134 30.134 0 0 0 5.054 6.324l-4.217 9.579a39.835 39.835 0 0 0 16.021 7.721l4.86-9.271c1.325.179 2.674.28 4.048.28s2.723-.101 4.047-.279l4.86 9.271a39.835 39.835 0 0 0 16.021-7.721l-4.217-9.579a30.16 30.16 0 0 0 5.054-6.324l10.286 1.982a39.831 39.831 0 0 0 3.948-17.34l-10.124-2.678zM50 65c-8.284 0-15-6.716-15-15 0-8.284 6.716-15 15-15s15 6.716 15 15c0 8.284-6.716 15-15 15z"/></svg>';
        settingsButton.addEventListener('click', () => {
            if (this.settingsIsOpen) {
                this.closeSettings();
            } else {
                this.openSettings();
            }
        });

        this.chatButton = document.createElement('div');
        this.chatButton.classList.add('chat');
        this.chatButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path fill="#fff" d="M54,2H6C2.748,2,0,4.748,0,8v33c0,3.252,2.748,6,6,6h28.558l9.703,10.673C44.454,57.885,44.724,58,45,58c0.121,0,0.243-0.022,0.361-0.067C45.746,57.784,46,57.413,46,57V47h8c3.252,0,6-2.748,6-6V8C60,4.748,57.252,2,54,2z"/></svg>';
        this.chatButton.addEventListener('click', () => {
            if (this.chatIsOpen) {
                chat.classList.remove('open');
            } else {
                chat.classList.add('open');
                this.chatButton.classList.remove('alert');
            }
            this.chatIsOpen = !this.chatIsOpen;
        });

        this.options.append(settingsButton, this.chatButton);

        this.container.append(this.options, content);
    }

    showScreenOverlay() {
        this.canvas.style.filter = 'blur(4px)';

        for (let toolbar of document.getElementsByClassName('toolbar')) {
            toolbar.style.filter = 'blur(4px)';
        }

        this.gameScreen.appendChild(this.screenOverlay);
    }

    hideScreenOverlay() {
        this.canvas.style.filter = 'none';

        for (let toolbar of document.getElementsByClassName('toolbar')) {
            toolbar.style.filter = 'none';
        }

        this.gameScreen.removeChild(this.screenOverlay);
    }

    closeSettings() {
        this.settingsIsOpen = false;

        this.hideScreenOverlay();
        this.screenOverlay.removeChild(this.settings);

        if (!this.gameWasPaused) {
            this.game.stateManager.track.pause(false);
        }
    }

    openSettings() {
        this.settingsIsOpen = true;

        this.gameWasPaused = this.game.stateManager.track.paused;
        this.game.stateManager.track.pause(true);

        this.settings = document.createElement('div');
        this.settings.id = 'settings';

        this.screenOverlay.appendChild(this.settings);

        this.showScreenOverlay();
    }

    sendMessage() {
        if (typeof this.chatInput.value === 'string' && this.chatInput.value.trim() !== '') {
            this.game.stateManager.room.sendJSON({ type: 'message', data: this.chatInput.value });
            this.addMessage(
                this.game.stateManager.track.user.name,
                this.game.stateManager.track.user.color,
                this.chatInput.value
            );
        }

        this.chatInput.value = '';
    }

    addMessage(name, color, text) {
        if (!this.chatIsOpen) {
            this.chatButton.classList.add('alert');
        }

        let msgContainer = document.createElement('div');

        let nameEl = document.createElement('div');
        nameEl.classList.add('message', 'name');
        nameEl.style.color = color;
        nameEl.textContent = name;

        let textEl = document.createElement('div');
        textEl.classList.add('message');
        textEl.textContent = text;

        msgContainer.append(nameEl, textEl);
        this.chatMessages.prepend(msgContainer);
    }

    makeButtons(state) {
        let importLabel = document.createElement('label');
        importLabel.classList.add('item');
        importLabel.setAttribute('for', 'import');
        importLabel.textContent = 'Import';

        let importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.id = 'import';
        importInput.style.display = 'none';
        importInput.addEventListener('change', () => {
            let file = importInput.files[0];

            if (file) {
                let reader = new FileReader();
                reader.onload = () => {
                    state.track.event.detach();
                    state.track = new Track(state.track.canvas, {
                        trackCode: reader.result,
                        room: state.manager.room,
                        user: state.track.user,
                    });
                    state.getTrackParser();
                    state.manager.pop();
                };

                reader.readAsText(file);
            }
        });

        let exportButton = document.createElement('button');
        exportButton.classList.add('item');
        exportButton.textContent = 'Export';
        exportButton.addEventListener('click', () => {
            state.manager.push('generator');
        });

        let uploadButton = document.createElement('button');
        uploadButton.classList.add('item');
        uploadButton.textContent = 'Clear';
        uploadButton.addEventListener('click', () => {
            state.track.event.detach();
            state.track = new Track(state.track.canvas, {
                trackCode: TRACK_DEFAULT,
                room: state.manager.room,
                user: state.track.user,
            });
            state.getTrackParser();
            state.manager.pop();
        });

        this.options.append(importLabel, exportButton, uploadButton, importInput);
    }

    makeToolbar(state, type, className) {
        let toolbar = new Toolbar(
            type,
            type.reduce((toolMap, toolClass) => {
                return { ...toolMap, [toolClass.toolName]: new toolClass(state.track) };
            }, {})
        );

        this[className] = toolbar.getDOM();
        toolbar.registerControls();
        this[className].classList.add(className);
        this.gameScreen.appendChild(this[className]);

        toolbar.attachToTrack(state.track);
    }
}
