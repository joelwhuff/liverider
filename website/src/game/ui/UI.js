import { LEFT_TOOLBAR_EDITING, LEFT_TOOLBAR_VIEWING, RIGHT_TOOLBAR } from '../constant/ToolbarConstants.js';
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
        let importButton = document.createElement('button');
        let importLabel = document.createElement('label');
        importLabel.setAttribute('for', 'import');
        importLabel.innerHTML = 'Import';
        importButton.appendChild(importLabel);

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
        exportButton.innerHTML = 'Export';
        exportButton.addEventListener('click', () => state.manager.push('generator'));

        let uploadButton = document.createElement('button');
        uploadButton.innerHTML = 'Upload';

        let ui = document.createElement('div');
        ui.id = 'ui';
        ui.appendChild(importButton);
        ui.appendChild(importInput);
        ui.appendChild(exportButton);
        ui.appendChild(uploadButton);

        state.track.canvas.parentNode.appendChild(ui);
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
