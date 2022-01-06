export function setElementProps(element, parent, attributes = {}, textContent) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }

    if (textContent) {
        element.textContent = textContent;
    }

    if (parent) {
        parent.appendChild(element);
    }

    return element;
}

export function makeElement(type, parent, attributes, textContent) {
    let el = document.createElement(type);

    return setElementProps(el, parent, attributes, textContent);
}

export function makeSVGElement(type, parent, attributes) {
    let svgEl = document.createElementNS('http://www.w3.org/2000/svg', type);

    return setElementProps(svgEl, parent, attributes);
}
