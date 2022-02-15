export default class Random {
    static float(min, max) {
        return Math.random() * (max - min) + min;
    }

    static int(min, max) {
        return Math.floor(this.float(min, max + 1));
    }

    static fixed(min, max, digits) {
        return parseFloat(this.float(min, max).toFixed(digits));
    }

    static character() {
        return '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[this.int(0, 61)];
    }

    /**
     * @param {number} length
     * @returns {string}
     */
    static string(length) {
        let str = '';
        while (length--) {
            str += this.character();
        }
        return str;
    }
}
