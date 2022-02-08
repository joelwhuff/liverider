import Random from './Random.js';

export default class Color {
    static #setValueBrightness(color, brightness = 1) {
        return Math.max(0, Math.min(255, Math.round(color * brightness)));
    }

    static #generateValues(brightness) {
        let values = [Random.generateInt(165, 255), Random.generateInt(0, 220), Random.generateInt(0, 90)].map(value =>
            this.#setValueBrightness(value)
        );

        let r = values.splice(Random.generateInt(0, 2), 1)[0];
        let g = values.splice(Random.generateInt(0, 1), 1)[0];
        let b = values[0];

        return [
            this.#setValueBrightness(r, brightness),
            this.#setValueBrightness(g, brightness),
            this.#setValueBrightness(b, brightness),
        ];
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
        let [r, g, b] = this.#generateValues(brightness);

        return `rgb(${r},${g},${b})`;
    }

    /**
     * @param {number} [brightness]
     * @returns {string} CSS hex value
     */
    static randomHex(brightness) {
        let [r, g, b] = this.#generateValues(brightness).map(this.#valueToHex);

        return `#${r}${g}${b}`;
    }
}
