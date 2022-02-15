import Random from './Random.js';

export default class Color {
    static #setValueBrightness(value, brightness = 1) {
        return Math.max(0, Math.min(255, Math.round(value * brightness)));
    }

    static #generateValues(brightness) {
        let values = [Random.int(170, 255), Random.int(0, 255), Random.int(0, 85)].map(value =>
            this.#setValueBrightness(value, brightness)
        );

        let r = values.splice(Random.int(0, 2), 1)[0];
        let g = values.splice(Random.int(0, 1), 1)[0];
        let b = values[0];

        return [r, g, b];
    }

    static #valueToHex(value) {
        let hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    /**
     * @param {number} [brightness]
     * @returns {string} CSS rgb value
     */
    static randomRGB(brightness) {
        return `rgb(${this.#generateValues(brightness).join(',')})`;
    }

    /**
     * @param {number} [brightness]
     * @returns {string} CSS hex value
     */
    static randomHex(brightness) {
        return '#' + this.#generateValues(brightness).map(this.#valueToHex).join('');
    }
}
