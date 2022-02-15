import { CLOSE_SVG } from '../constant/UIConstants.js';
import Time from '../numeric/Time.js';

export default class RaceResults {
    constructor(parent, stateManager) {
        this.parent = parent;

        this.stateManager = stateManager;
    }

    render(results) {
        this.container = document.createElement('div');
        this.container.classList.add('race-results');

        let closeButtonContainer = document.createElement('div');
        let closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = CLOSE_SVG;
        closeButton.onclick = () => {
            this.destroy();
        };
        closeButtonContainer.appendChild(closeButton);

        this.container.appendChild(closeButtonContainer);

        results.forEach((result, index) => {
            let resultEl = document.createElement('div');
            resultEl.classList.add('result');

            let resultName = document.createElement('div');
            resultName.classList.add('name');
            resultName.textContent = `${index + 1}${['st', 'nd', 'rd'][index] || 'th'} ${result.name}`;

            let resultTime = document.createElement('div');
            resultTime.classList.add('time');
            resultTime.textContent = result.finalTime
                ? Time.format(result.finalTime * this.stateManager.game.frameDuration)
                : 'Did not finish';

            resultEl.append(resultName, resultTime);
            this.container.appendChild(resultEl);
        });

        this.parent.appendChild(this.container);
    }

    destroy() {
        this.parent.removeChild(this.container);
    }
}
