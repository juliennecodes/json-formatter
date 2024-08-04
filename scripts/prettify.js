const getRandomString = () => {
    const stringValues = ['apple', 'banana', 'cherry', 'dragonfruit', 'fig', 'grapefruit', 'lychee', 'mango', 'strawberry'];
    const randomIndex = Math.floor(Math.random() * stringValues.length)
    return stringValues[randomIndex];
}

const getRandomNumber = () => {
    const numberValues = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    const randomIndex = Math.floor(Math.random() * numberValues.length)
    return numberValues[randomIndex];
};


const inputElement = document.getElementById('input');
const prettifyButton = document.getElementById('prettifyButton');
const outputElement = document.getElementById('output');
const toggleKeysElement = document.getElementById('toggleKeys');
const toggleValuesElement = document.getElementById('toggleValues');
const copyContentElement = document.querySelector(".copyContent");

let shouldAnonymizeValues = false;
let shouldAnonymizeKeys = false;


let keys = [];

const createReplacer = () => {
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

const createAnonymousReplacer = () => {
    let isInitial = true;

    return (key, value) => {
        if (isInitial) {
            isInitial = false;
            if (typeof value === 'string') {
                return getRandomString();
            } else if (typeof value === 'number') {
                return getRandomNumber();
            } else {
                return value;
            }
        }

        keys.push(key);

        if (typeof value === 'string') {
            return getRandomString();
        } else if (typeof value === 'number') {
            return getRandomNumber();
        } else {
            return value;
        }
    };
}

const anonymizeKeys = (string, keys) => {
    let formatted = string;
    for (const [index, key] of keys.entries()) {
        formatted = formatted.replace(`"${key}":`, `property${index}:`);
    }
    return formatted;
}

const removeDoubleQuotesFromKeys = (string, keys) => {
    let formatted = string;
    for (const key of keys) {
        formatted = formatted.replace(`"${key}":`, `${key}:`);
    }
    return formatted;
}

const prettify = () => {
    const input = inputElement.value;
    const object = JSON.parse(input);

    let text = JSON.stringify(object,
        shouldAnonymizeValues ? createAnonymousReplacer() : createReplacer(),
        4);

    if (shouldAnonymizeKeys) {
        text = anonymizeKeys(text, keys);
    }

    const textWithoutDoubleQuotesAroundKeys = removeDoubleQuotesFromKeys(text, keys);
    const singleQuotesText = textWithoutDoubleQuotesAroundKeys.replace(/"/g, `'`);

    outputElement.textContent = singleQuotesText;
}

prettifyButton.addEventListener('click', () => {
    prettify();
});

copyContentElement.addEventListener('click', () => {
    const content = outputElement.textContent;
    navigator.clipboard.writeText(content).then(() => null);
})

toggleKeysElement.addEventListener('click', () => {
    shouldAnonymizeKeys = toggleKeysElement.checked;
})
toggleValuesElement.addEventListener('click', () => {
    shouldAnonymizeValues = toggleValuesElement.checked;
})
