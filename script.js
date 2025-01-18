const textInput = document.getElementById("textInput");
const keyboard = document.getElementById("keyboard");

class VirtualKeyboard {
    constructor(inputElement, keyboardElement) {
        this.inputElement = inputElement;
        this.keyboardElement = keyboardElement;
        this.layouts = {
            en: [
                ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
                ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
                ["Caps Lock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
                ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
                ["Ctrl", "Alt", "Space", "Alt", "Ctrl"]
            ],
            ru: [
                ["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
                ["Tab", "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ", "\\"],
                ["Caps Lock", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "Enter"],
                ["Shift", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ".", "Shift"],
                ["Ctrl", "Alt", "Space", "Alt", "Ctrl"]
            ],
            jp: [
                ["ぬ", "ふ", "あ", "う", "え", "お", "や", "ゆ", "よ", "わ", "ほ", "へ", "Backspace"],
                ["Tab", "た", "て", "い", "す", "か", "ん", "な", "に", "ら", "せ", "゛", "゜", "\\"],
                ["Caps Lock", "ち", "と", "し", "は", "き", "く", "ま", "の", "り", "れ", "け", "Enter"],
                ["Shift", "つ", "さ", "そ", "ひ", "こ", "み", "も", "ね", "る", "め", "Shift"],
                ["Ctrl", "Alt", "Space", "Alt", "Ctrl"]
            ]
        };
        this.currentLayout = "en";
        this.capsLock = false;
        this.init();
    }

    init() {
        this.renderKeyboard();
        this.setupEventListeners();
    }

    renderKeyboard() {
        this.keyboardElement.innerHTML = "";
        this.layouts[this.currentLayout].forEach(row => {
            const rowElement = document.createElement("div");
            rowElement.className = "row";
            row.forEach(key => {
                const keyElement = document.createElement("div");
                keyElement.className = "key";
                keyElement.textContent = this.getKeyText(key);

                if (key === "Space") {
                    keyElement.classList.add("extra-wide-key");
                    keyElement.style.width = "300px";
                    keyElement.addEventListener("mousedown", () => this.handleKeyInput(" "));
                } else if (key === "Backspace") {
                    keyElement.classList.add("wide-key");
                    this.addHoldingEvent(keyElement, () => {
                        this.inputElement.value = this.inputElement.value.slice(0, -1);
                    });
                } else if (key === "Enter") {
                    keyElement.classList.add("wide-key");
                    keyElement.addEventListener("mousedown", () => this.handleKeyInput("\n"));
                } else if (key === "Caps Lock") {
                    keyElement.classList.add("wide-key");
                    keyElement.addEventListener("mousedown", () => this.toggleCapsLock());
                } else if (["Shift", "Alt", "Ctrl", "Tab"].includes(key)) {
                    keyElement.classList.add("wide-key");
                } else {
                    this.addHoldingEvent(keyElement, () => this.handleKeyInput(this.getKeyText(key)));
                }
                
                rowElement.appendChild(keyElement);
            });
            this.keyboardElement.appendChild(rowElement);
        });
    }

    getKeyText(key) { 
        if (key.length === 1 && /[a-zA-Zа-яёА-ЯЁ]/.test(key)) {
            return this.capsLock ? key.toUpperCase() : key.toLowerCase();
        }
        return key;
    }

    addHoldingEvent(element, callback) {
        let interval;
        element.addEventListener("mousedown", () => {
            callback();
            interval = setInterval(callback, 100);
        });
        ["mouseup", "mouseleave"].forEach(event => {
            element.addEventListener(event, () => clearInterval(interval));
        });
    }

    handleKeyInput(char) {
        this.inputElement.value += char;
    }

    toggleCapsLock() {
        this.capsLock = !this.capsLock;
        this.renderKeyboard(); 
    }

    switchLanguage() {
        const languages = Object.keys(this.layouts);
        const currentIndex = languages.indexOf(this.currentLayout);
        this.currentLayout = languages[(currentIndex + 1) % languages.length];
        this.renderKeyboard();
    }

    setupEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "CapsLock") {
                this.toggleCapsLock();
                event.preventDefault();
            } else if (event.key === "Backspace") {
                this.inputElement.value = this.inputElement.value.slice(0, -1);
            } else if (event.key.length === 1) {
                this.inputElement.value += this.capsLock ? event.key.toUpperCase() : event.key.toLowerCase();
            } else if (event.shiftKey && event.altKey) {
                this.switchLanguage();
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new VirtualKeyboard(textInput, keyboard);
});
