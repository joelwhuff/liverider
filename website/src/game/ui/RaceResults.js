import { CLOSE_SVG } from '../constant/UIConstants.js';
import Time from '../numeric/Time.js';

export default class RaceResults {
    constructor(parent, stateManager) {
        this.parent = parent;

        this.stateManager = stateManager;
    }

    render(room, results) {
        this.container = document.createElement('div');
        this.container.classList.add('race-results');

        let top = document.createElement('div');
        top.classList.add('top');

        let title = document.createElement('div');
        title.classList.add('title');
        title.textContent = 'Race Results';

        let closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = CLOSE_SVG;
        closeButton.onclick = () => {
            this.destroy();
        };

        top.append(title, closeButton);
        this.container.appendChild(top);

        let prevTime = -1;
        let curPosition = 0;
        results.forEach(result => {
            let user = room.users.get(result.id) || room.track.user;

            if (prevTime !== result.finalTime) {
                ++curPosition;
            }

            let resultEl = document.createElement('div');
            resultEl.classList.add('result');
            resultEl.style.color = user.color;

            let resultName = document.createElement('div');
            resultName.classList.add('name');
            resultName.textContent = `${curPosition}${['st', 'nd', 'rd'][curPosition - 1] || 'th'}: ${user.name}`;

            let resultTime = document.createElement('div');
            resultTime.classList.add('time');
            resultTime.textContent = result.finalTime
                ? Time.format(result.finalTime * this.stateManager.game.frameDuration)
                : 'Did not finish';

            resultEl.append(resultName, resultTime);
            this.container.appendChild(resultEl);

            prevTime = result.finalTime;
        });

        this.parent.appendChild(this.container);
    }

    destroy() {
        if (this.container) {
            this.parent.removeChild(this.container);
        }
        this.container = null;
    }
}
