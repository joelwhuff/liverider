export let random = (min, max) => {
    return Math.random() * (max - min) + min;
};

export let randomInt = (min, max) => {
    return Math.floor(random(min, max + 1));
};

export let generateColorfulRGB = () => {
    let values = [randomInt(165, 255), randomInt(0, 220), randomInt(0, 90)];

    let red = values.splice(randomInt(0, 2), 1)[0];
    let green = values.splice(randomInt(0, 1), 1)[0];
    let blue = values[0];

    return `rgb(${red},${green},${blue})`;
};
