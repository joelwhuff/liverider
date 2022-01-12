import { LEFT_TOOLBAR_EDITING, LEFT_TOOLBAR_VIEWING, RIGHT_TOOLBAR } from '../constant/ToolbarConstants.js';
import { TRACK_DEFAULT } from '../constant/TrackConstants.js';
import Toolbar from '../tool/Toolbar.js';
import Track from '../track/Track.js';
import CameraTool from '../tool/CameraTool.js';
import SolidLineTool from '../tool/item/line/SolidLineTool.js';

export default class UI {
    static clearUI(state) {
        let gameEl = state.manager.track.canvas.parentNode;
        while (gameEl.lastChild !== gameEl.firstChild) {
            gameEl.removeChild(gameEl.lastChild);
        }
    }

    static makeGameUI(container) {
        let options = document.createElement('div');
        options.id = 'game-options';

        let settingsButton = document.createElement('div');
        settingsButton.classList.add('settings');
        settingsButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#fff" d="M79.875 47.332a29.81 29.81 0 0 0-1.794-7.897l7.96-6.804a40.146 40.146 0 0 0-11.102-13.893l-8.395 6.239a29.87 29.87 0 0 0-7.296-3.517l-.356-10.455C56.031 10.355 53.058 10 50 10s-6.031.355-8.892 1.004l-.356 10.456a29.872 29.872 0 0 0-7.296 3.517l-8.395-6.239a40.146 40.146 0 0 0-11.102 13.893l7.96 6.804a29.828 29.828 0 0 0-1.794 7.897L10 50.009a39.831 39.831 0 0 0 3.948 17.34l10.286-1.982a30.134 30.134 0 0 0 5.054 6.324l-4.217 9.579a39.835 39.835 0 0 0 16.021 7.721l4.86-9.271c1.325.179 2.674.28 4.048.28s2.723-.101 4.047-.279l4.86 9.271a39.835 39.835 0 0 0 16.021-7.721l-4.217-9.579a30.16 30.16 0 0 0 5.054-6.324l10.286 1.982a39.831 39.831 0 0 0 3.948-17.34l-10.124-2.678zM50 65c-8.284 0-15-6.716-15-15 0-8.284 6.716-15 15-15s15 6.716 15 15c0 8.284-6.716 15-15 15z"/></svg>';
        options.appendChild(settingsButton);

        let content = document.createElement('div');
        content.id = 'game-content';

        let screen = document.createElement('div');
        screen.id = 'game-screen';

        let canvas = document.createElement('canvas');

        let chat = document.createElement('div');
        chat.classList.add('game-chat');
        let chatOpen = false;

        let chatButton = document.createElement('div');
        chatButton.classList.add('chat');
        chatButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path fill="#fff" d="M54,2H6C2.748,2,0,4.748,0,8v33c0,3.252,2.748,6,6,6h28.558l9.703,10.673C44.454,57.885,44.724,58,45,58c0.121,0,0.243-0.022,0.361-0.067C45.746,57.784,46,57.413,46,57V47h8c3.252,0,6-2.748,6-6V8C60,4.748,57.252,2,54,2z"/></svg>';
        chatButton.addEventListener('click', () => {
            if (chatOpen) {
                chat.classList.remove('open');
            } else {
                chat.classList.add('open');
            }
            chatOpen = !chatOpen;
        });
        options.appendChild(chatButton);

        screen.appendChild(canvas);
        content.append(screen, chat);
        container.append(options, content);

        let setContextProperties = ctx => {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.font = '16px Ubuntu-R';
        };

        let setCanvasSize = () => {
            canvas.width = screen.clientWidth;
            canvas.height = screen.clientHeight;

            setContextProperties(canvas.getContext('2d'));
        };

        // new ResizeObserver(() => {
        //     setCanvasSize();
        // }).observe(screen);

        // setCanvasSize();

        return canvas;
    }

    static createEditorUI(state) {
        UI.makeButtons(state);
        UI.makeToolbar(state, LEFT_TOOLBAR_EDITING, 'left');
        UI.makeToolbar(state, RIGHT_TOOLBAR, 'right');

        state.track.toolManager.setTool(state.track.toolCollection.toolsByToolName.get(SolidLineTool.toolName));
    }

    static createRaceUI(state) {
        UI.makeToolbar(state, LEFT_TOOLBAR_VIEWING, 'left');

        state.track.toolManager.setTool(state.track.toolCollection.toolsByToolName.get(CameraTool.toolName));
    }

    static makeButtons(state) {
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
                    state.track = new Track(state.track.canvas, { trackCode: reader.result });
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
            state.track = new Track(state.track.canvas, { trackCode: TRACK_DEFAULT });
            state.getTrackParser();
            state.manager.pop();
        });

        let options = document.getElementById('game-options');
        options.appendChild(importLabel);
        options.appendChild(exportButton);
        options.appendChild(uploadButton);
        options.appendChild(importInput);
    }

    static makeToolbar(state, type, className) {
        let toolbarEl = null;

        let toolbar = new Toolbar(
            type,
            type.reduce((toolMap, toolClass) => {
                return { ...toolMap, [toolClass.toolName]: new toolClass(state.track) };
            }, {})
        );

        toolbarEl = toolbar.getDOM();
        toolbar.registerControls();
        toolbarEl.classList.add(className);
        state.track.canvas.parentNode.appendChild(toolbarEl);

        toolbar.attachToTrack(state.track);
    }
}
