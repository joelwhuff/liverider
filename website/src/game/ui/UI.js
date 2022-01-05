import { LEFT_TOOLBAR_EDITING, LEFT_TOOLBAR_VIEWING, RIGHT_TOOLBAR } from '../constant/ToolbarConstants.js';
import Toolbar from '../tool/Toolbar.js';
import Track from '../track/Track.js';
import CameraTool from '../tool/CameraTool.js';
import SolidLineTool from '../tool/item/line/SolidLineTool.js';

export default class UI {
    static createEditorUI(state, track) {
        UI.makeButtons(state);
        UI.makeToolbar(track, LEFT_TOOLBAR_EDITING, 'left');
        UI.makeToolbar(track, RIGHT_TOOLBAR, 'right');

        track.toolManager.setTool(track.toolCollection.toolsByToolName.get(SolidLineTool.toolName));
    }

    static createRaceUI(track) {
        UI.makeToolbar(track, LEFT_TOOLBAR_VIEWING, 'left');

        track.toolManager.setTool(track.toolCollection.toolsByToolName.get(CameraTool.toolName));
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

        document.body.appendChild(ui);
    }

    static makeToolbar(track, type, side) {
        let toolbarEl = null;

        let toolbar = new Toolbar(
            type,
            type.reduce((toolMap, toolClass) => {
                return { ...toolMap, [toolClass.toolName]: new toolClass(track) };
            }, {})
        );

        toolbarEl = toolbar.getDOM();
        toolbar.registerControls();
        toolbarEl.classList.add(side);
        track.canvas.parentNode.appendChild(toolbarEl);

        toolbar.attachToTrack(track);
    }
}
