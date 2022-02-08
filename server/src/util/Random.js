export default class Random {
    static generateFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    static generateInt(min, max) {
        return Math.floor(this.generateFloat(min, max + 1));
    }

    static generateFixed(min, max) {
        return parseFloat(this.generateFloat(min, max).toFixed(digits));
    }
}
