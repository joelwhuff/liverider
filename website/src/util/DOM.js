export function makeElement(type, attributes = [], parent, textContent) {
    let element = document.createElement(type);

    for (let i = attributes.length - 1; i >= 1; i -= 2) {
        element.setAttribute(attributes[i - 1], attributes[i]);
    }

    if (textContent) {
        element.textContent = textContent;
    }

    if (parent) {
        parent.appendChild(element);
    }

    return element;
}
