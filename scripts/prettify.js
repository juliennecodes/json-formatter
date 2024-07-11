const inputElement = document.getElementById('input');
const prettifyButton = document.getElementById('prettifyButton');
const outputElement = document.getElementById('output');

let keys = [];

const replacer = () => {
    let isInitial = true;

    return (key, value) => {
        if (isInitial) {
            isInitial = false;
            return value;
        }

        keys.push(key);
        return value;
    };
}

const removeDoubleQuotesFromKeys = (string, keys) => {
    let formatted = string;
    for(const key of keys) {
        formatted = formatted.replace(`"${key}":`, `${key}:`);
    }
    return formatted;
}
const prettify = () => {
    const input = inputElement.value;
    const object = JSON.parse(input);
    const text = JSON.stringify(object, replacer(), 4);

    const textWithoutDoubleQuotesAroundKeys = removeDoubleQuotesFromKeys(text, keys);
    const singleQuotesText = textWithoutDoubleQuotesAroundKeys.replace(/"/g, `'`);

    outputElement.textContent = singleQuotesText;
}

prettifyButton.addEventListener('click', () => {
    prettify();
});

outputElement.addEventListener('click', () => {
    const content = outputElement.textContent;
    navigator.clipboard.writeText(content).then(() => null);
})
