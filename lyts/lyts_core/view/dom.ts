import ly from "../ly";
import browser from "./browser";
import strings from "../commons/strings";
import lang from "../commons/lang";
import ElementWrapper from "./components/ElementWrapper";
import objects from "../commons/objects";


export enum SelectorType { ID, CLASS, TAG, ATTR }

/**
 * Parser for CSS selectors.
 */
export class SelectorParser {

    // ------------------------------------------------------------------------
    //                      c o n s t
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    //                      f i e l d s
    // ------------------------------------------------------------------------

    private readonly _selector: string;

    private _type: SelectorType;
    private _name: string;   // attribute name
    private _value: string;  // attribute value
    private _operator: string; // check operator

    // ------------------------------------------------------------------------
    //                      c o n s t r u c t o r
    // ------------------------------------------------------------------------

    constructor(selector: string) {
        this._selector = selector;

        this.parse();
    }

    // ------------------------------------------------------------------------
    //                      p u b l i c
    // ------------------------------------------------------------------------

    public get raw(): string {
        return this._selector;
    }

    public get type(): SelectorType {
        return this._type;
    }

    public get name(): string {
        return this._name;
    }

    public get value(): string {
        return this._value;
    }

    public get operator(): string {
        return this._operator;
    }

    public match(elem: HTMLElement): boolean {
        try {
            if (!!elem) {
                return this.matchElement(elem);
            }
        } catch (err) {
        }
        return false;
    }

    private matchElement(elem: Element): boolean {
        if (this.type === SelectorType.TAG) {
            return elem.tagName === this.value;
        } else if (this.type === SelectorType.ID) {
            return elem.id == this.value;
        } else if (this.type === SelectorType.CLASS) {
            let classes: string[] = elem.className.split(" ") || [];
            return classes.indexOf(this.value) > -1;
        } else if (this.type === SelectorType.ATTR) {
            if (!!this.operator) {
                if (elem.hasAttribute(this.name)) {
                    const attr_value = elem.getAttribute(this.name) || '';
                    if (this.operator === "=") {
                        return attr_value === this.value;
                    } else if (this.operator === "~=") {
                        // attribute value is a whitespace-separated list of words, one of which is exactly "val" (attribute="val1 val2")
                        return attr_value.split(" ").indexOf(this.value) > -1;
                    } else if (this.operator === "|=") {
                        // attribute value equals "val" or starts with
                        return strings.startWith(attr_value, this.value);
                    }
                }
            } else {
                // check only attribute
                return elem.hasAttribute(this.value);
            }
        }

        return false;
    }

    // ------------------------------------------------------------------------
    //                      p r i v a t e
    // ------------------------------------------------------------------------

    private parse() {
        if (!!this._selector) {
            // defaults
            this._operator = '';

            // check type and parse values
            if (SelectorParser.isSelectorID(this._selector)) {
                // selector id
                this._type = SelectorType.ID;
                this._name = "id";
                this._value = this._selector.substring(1);
            } else if (SelectorParser.isSelectorCLASS(this._selector)) {
                // selector class
                this._type = SelectorType.CLASS;
                this._name = "class";
                this._value = this._selector.substring(1);
            } else if (SelectorParser.isSelectorATTR(this._selector)) {
                // selector attribute [attribute]='value'
                this._type = SelectorType.ATTR;
                const selector = strings.replaceAll(["'", "[", "]"], "", this._selector);
                // [att=val] [att~=val] [att|=val]
                if (selector.indexOf("~=") > -1) {
                    // [att~=val] - Represents an element with the att attribute whose value is a whitespace-separated list of words, one of which is exactly "val"
                    const tokens: string[] = selector.split("~=");
                    this._name = tokens[0];
                    this._value = tokens[1];
                    this._operator = '~=';
                } else if (selector.indexOf("|=") > -1) {
                    // [att|=val] - Represents an element with the att attribute, its value either being exactly "val" or beginning with "val" immediately followed by "-" (U+002D).
                    const tokens: string[] = selector.split("|=");
                    this._name = tokens[0];
                    this._value = tokens[1];
                    this._operator = '|=';
                } else if (selector.indexOf("=") > -1) {
                    // [att=val]
                    const tokens: string[] = selector.split("=");
                    this._name = tokens[0];
                    this._value = tokens[1];
                    this._operator = '=';
                } else {
                    // [attr]
                    this._name = selector;
                    this._value = selector;
                    this._operator = '';
                }
            } else {
                // selector tag name
                this._type = SelectorType.TAG;
                this._name = this._selector;
                this._value = this._selector;
            }
        }
    }

    private static isSelectorID(selector: string): boolean {
        return !!selector ? strings.startWith(selector, "#") : false;
    }

    private static isSelectorCLASS(selector: string): boolean {
        return !!selector ? strings.startWith(selector, ".") : false;
    }

    private static isSelectorATTR(selector: string): boolean {
        return !!selector ? strings.startWith(selector, "[") && selector.indexOf("]") > -1 : false;
    }


}

/**
 * Default Export class.
 */
const doc: HTMLDocument = document;
const win: any = window;

class domClass {

    // ------------------------------------------------------------------------
    //                      f i e l d s
    // ------------------------------------------------------------------------

    private _ready: boolean;
    private _readyList: Function[];

    // ------------------------------------------------------------------------
    //                      c o n s t r u c t o r
    // ------------------------------------------------------------------------

    constructor() {
        const is_IE: boolean = !objects.get(doc, "addEventListener");
        this._readyList = [];
        this._ready = (doc.readyState === "complete" || (!is_IE && doc.readyState === "interactive"));
        if (!this._ready) {
            if (!is_IE) {
                // first choice is DOMContentLoaded event
                doc.addEventListener("DOMContentLoaded", this.onDocumentReady.bind(this), false);
                // backup is window load event
                win.addEventListener("load", this.onDocumentReady.bind(this), false);
            } else {
                // must be IE
                ly.objects.get(doc, "attachEvent")("onreadystatechange", this.onDocumentReadyStateChange.bind(this));
                win.attachEvent("onload", this.onDocumentReady.bind(this));
            }
        }
    }

    // ------------------------------------------------------------------------
    //                      p r o p e r t i e s
    // ------------------------------------------------------------------------

    public get document(): HTMLDocument {
        return doc;
    }

    public get window(): Window {
        return win;
    }

    // ------------------------------------------------------------------------
    //                      p u b l i c
    // ------------------------------------------------------------------------

    public ready(callback: Function, bind_context: any): void {
        if (ly.lang.isFunction(callback)) {
            const callback_to_invoke: Function = callback.bind(bind_context || this);
            if (dom._ready) {
                ly.lang.funcDelay(callback_to_invoke, 1);
            } else {
                dom._readyList.push(callback_to_invoke);
            }
        }
    }

    public setDesignMode(value: boolean): void {
        if (value) {
            doc.designMode = 'on';
        } else {
            doc.designMode = 'off'
        }
    }

    public parse(text: string): Node {
        let parser: DOMParser = new DOMParser();
        let doc: HTMLDocument = parser.parseFromString(text, "text/html");
        return doc;
    }

    public getElementById(id: string): HTMLElement | null {
        return doc.getElementById(id);
    }

    public getElementsByTagName(tag_name: string): Element[] {
        const response: Element[] = [];
        const list: HTMLCollectionOf<Element> = doc.getElementsByTagName(tag_name);
        const count = list.length;
        for (let i = 0; i < count; i++) {
            const elem: Element | null = list.item(i);
            if (!!elem) {
                response.push(elem);
            }
        }
        return response;
    }

    public getElementsByClassName(class_name: string): Element[] {
        const response: Element[] = [];
        const list: HTMLCollectionOf<Element> = doc.getElementsByClassName(class_name);
        const count = list.length;
        for (let i = 0; i < count; i++) {
            const elem: Element | null = list.item(i);
            if (!!elem) {
                response.push(elem);
            }
        }
        return response;
    }

    public getParentTargetByAttribute(e: Event | Element | null | undefined, attribute?: string): HTMLElement | undefined {
        attribute = attribute || "data-event";
        try {
            if (!!e) {
                if (e instanceof Event) {
                    return this.getParentTargetByAttribute(e.target as Element, attribute);
                } else if (!!ly.objects.get(e, "target")) {
                    // event like object
                    return this.getParentTargetByAttribute(ly.objects.get(e, "target") as Element, attribute);
                } else {
                    if (this.hasAttribute(e, attribute)) {
                        // ly.console.log("dom.getParentTargetByAttribute#hasAttribute", e);
                        return e as HTMLElement;
                    } else {
                        // ly.console.log("dom.getParentTargetByAttribute#parent", e, e["parentElement"]);
                        return this.getParentTargetByAttribute(e["parentElement"], attribute);
                    }
                }
            }
        } catch (err) {
            ly.console.error("dom.getParentTargetByAttribute", err);
        }
        return undefined;
    }

    /**
     * Return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
     * @param e
     */
    public offset(e: Event | HTMLElement | null | undefined): { top: number, left: number } {
        if (!!e) {
            if (e instanceof HTMLElement) {
                const elem = e as HTMLElement;
                const rect = elem.getBoundingClientRect(),
                    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
            } else if (e instanceof ElementWrapper) {
                const elem = e as ElementWrapper;
                return this.offset(elem.htmlElement);
            } else {
                return this.offset(e.target as HTMLElement);
            }
        }
        return {
            top: 0, left: 0
        }
    }

    public injectStyle(css: string, target: string = 'head'): void {
        const head: any = (doc as any)[target] || doc.getElementsByTagName(target)[0];
        const style: any = doc.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(doc.createTextNode(css));
        }

        head.appendChild(style);
    }

    public createAttribute(name: string): Attr {
        return doc.createAttribute(name);
    }

    public createElement(tag: string = 'div', target: string | HTMLElement = 'body'): HTMLElement {
        let parent: HTMLElement | null = null;
        if (target instanceof HTMLElement) {
            parent = target;
        } else if (ly.lang.isString(target)) {
            parent = (doc as any)[target] || doc.getElementsByTagName(target)[0];
        }

        const element: HTMLElement = doc.createElement(tag);
        if (!!parent) {
            parent.appendChild(element);
        }

        return element;
    }

    public newElement(inner_html: string = '', append_to_selector?: string): HTMLElement {
        let elem;
        if (!!inner_html) {
            let wrapper = doc.createElement("div");
            wrapper.innerHTML = inner_html;
            if (wrapper.childElementCount > 1) {
                elem = wrapper;
            } else {
                elem = wrapper.firstChild as HTMLElement;
            }
        }

        elem = elem || doc.createElement("div");

        if (!!append_to_selector) {
            const parent: Array<HTMLElement> = this.get(append_to_selector);
            if (parent.length > 0) {
                parent[0].appendChild(elem);
            }
        }

        return elem;
    }

    public buildElement(tag: string, inner_html: string): HTMLElement {
        const response: HTMLElement = doc.createElement(tag);
        response.innerHTML = inner_html;
        return response;
    }

    public getFirst(selector: string = '', target?: HTMLElement): HTMLElement | undefined {
        const response: Array<HTMLElement> = this.get(selector, target);
        return response.length > 0 ? response[0] : undefined;
    }

    public getLast(selector: string = '', target?: HTMLElement): HTMLElement | undefined {
        const response: Array<HTMLElement> = this.get(selector, target);
        return response.length > 0 ? response[response.length - 1] : undefined;
    }

    public get(selector: string = '', target?: HTMLElement): Array<HTMLElement> {
        if (!!selector) {
            const selector_parser: SelectorParser = new SelectorParser(selector);
            if (!!target) {
                return this.getElementFromParent(target, selector_parser);
            } else {
                return this.getElementFromDocument(selector_parser);
            }
        }
        return [];
    }

    public forEachChild(elem: HTMLElement, func: (child: HTMLElement) => void, deep: boolean = false): void {
        if (lang.isFunction(func) && !!elem && !!elem.children) {
            const count = elem.children.length;
            for (let i = 0; i < count; i++) {
                const child: HTMLElement = elem.children.item(i) as HTMLElement;
                if (!!child) {
                    func(child);
                    if (deep && child.children.length > 0) {
                        // recursive
                        this.forEachChild(child, func, deep);
                    }
                }
            }
        }
    }

    public map(elem: HTMLElement, func: (child: HTMLElement) => boolean, deep: boolean = false): HTMLElement[] {
        const response = new Array<HTMLElement>();
        if (lang.isFunction(func) && !!elem && !!elem.children) {
            const count = elem.children.length;
            for (let i = 0; i < count; i++) {
                const child: HTMLElement = elem.children.item(i) as HTMLElement;
                if (!!child) {
                    if (func(child)) {
                        response.push(child);
                    }
                    if (deep && child.children.length > 0) {
                        // recursive
                        response.push(...this.map(child, func, deep));
                    }
                }
            }
        }
        return response;
    }

    public isInput(elem: Element | undefined) {
        return !!elem
            ? elem.tagName.toLowerCase() === "input"
            : false;
    }

    public isInputButton(elem: Element | undefined) {
        return !!elem
            ? this.isInput(elem) && elem.getAttribute("type") === "button"
            : false;
    }

    public isInputText(elem: HTMLElement | undefined) {
        return !!elem
            ? this.isInput(elem) && elem.getAttribute("type") === "text"
            : false;
    }

    public isInputCheck(elem: HTMLElement | undefined) {
        return !!elem
            ? this.isInput(elem) && elem.getAttribute("type") === "checkbox"
            : false;
    }

    public isTextArea(elem: Element | undefined) {
        return !!elem
            ? elem.tagName.toLowerCase() === "textarea"
            : false;
    }

    public isSelect(elem: Element | undefined) {
        return !!elem
            ? elem.tagName.toLowerCase() === "select"
            : false;
    }

    public getValue(elem: HTMLElement | undefined): any {
        if (!!elem) {
            if (this.isInput(elem)) {
                const e = elem as HTMLInputElement;
                if (!!e) {
                    const type = e.getAttribute("type");
                    if (type === "checkbox") {
                        return e.checked;
                    } else if (!!e.value) {
                        return e.value;
                    }
                }
            } else if (this.isSelect(elem)) {
                let value: string = "";
                const e = elem as HTMLSelectElement;
                if (!!e) {
                    const count: number = e.options.length
                    for (let i = 0; i < count; i++) {
                        const option: HTMLOptionElement | null = e.options.item(i);
                        if (!!option && option.selected) {
                            value = option.value
                            break;
                        }
                    }
                }
                return value
            } else if (this.isTextArea(elem)) {
                const e = elem as HTMLTextAreaElement;
                return !!e ? e.value : null;
            } else {
                const tag_name: string = elem.tagName.toLowerCase();
                if (tag_name === "img") {
                    return elem.getAttribute("src");
                } else {
                    return elem.innerHTML;
                }
            }
        }
        return null;
    }

    public setValue(elem: HTMLElement | undefined, value: any): void {
        if (!!elem) {
            if (this.isInput(elem)) {
                const e = elem as HTMLInputElement;
                if (!!e) {
                    const type = e.getAttribute("type");
                    if (type === "checkbox") {
                        e.checked = !!value;
                    } else {
                        e.value = value;
                    }
                }
            } else if (this.isSelect(elem)) {
                const e = elem as HTMLSelectElement;
                if (!!e) {
                    const count: number = e.options.length
                    for (let i = 0; i < count; i++) {
                        const option: HTMLOptionElement | null = e.options.item(i);
                        if (!!option) {
                            const opt_value = option.value
                            option.selected = value == opt_value;
                        }
                    }
                }
            } else if (this.isTextArea(elem)) {
                const e = elem as HTMLTextAreaElement;
                e.value = value;
            } else {
                const tag_name: string = elem.tagName.toLowerCase();
                if (tag_name === "img" && !!value) {
                    elem.setAttribute("src", value);
                } else {
                    elem.innerHTML = value;
                }
            }
        }
    }

    public classAdd(elem: HTMLElement | undefined, class_name: string | string[]): boolean {
        if (!!elem && !!elem.classList) {
            let classes: string[] = lang.toArray<string>(class_name);
            for (let aclass of classes) {
                if (!elem.classList.contains(aclass)) {
                    elem.classList.add(aclass)
                }
            }
            return true;
        }
        return false;
    }

    public classRemove(elem: HTMLElement | undefined, class_name: string | string[]): boolean {
        if (!!elem && !!elem.classList) {
            let classes: string[] = lang.toArray<string>(class_name);
            for (let aclass of classes) {
                if (elem.classList.contains(aclass)) {
                    elem.classList.remove(aclass)
                }
            }
            return true;
        }
        return false;
    }

    public classHas(elem: HTMLElement | undefined, class_name: string | string[]): boolean {
        if (!!elem && !!elem.classList) {
            let classes: string[] = lang.toArray<string>(class_name);
            for (let aclass of classes) {
                if (elem.classList.contains(aclass)) {
                    return true;
                }
            }
        }
        return false;
    }

    // ------------------------------------------------------------------------
    //                      p r i v a t e
    // ------------------------------------------------------------------------

    private hasAttribute(elem: any, name: string): boolean {
        try {
            // ly.console.log("dom.hasAttribute", name, elem);
            if (elem instanceof Element) {
                // ly.console.log("dom.hasAttribute#Element", elem);
                const html_elem: Element = elem as Element;
                return html_elem.hasAttribute(name);
            } else if (!!objects.get(elem, "hasAttribute")) {
                // ly.console.log("dom.hasAttribute#func()", name, elem.hasAttribute(name));
                return elem.hasAttribute(name);
            } else if (!!ly.objects.get(elem, name)) {
                // ly.console.log("dom.hasAttribute#ly.objects.get", elem);
                return true;
            }
        } catch (ignored) {
            // ignored
        }
        return false;
    }

    private onDocumentReadyStateChange(): void {
        if (doc.readyState === "complete") {
            this.onDocumentReady();
        }
    }

    private onDocumentReady(): void {
        this._ready = true;
        this._readyList.forEach((callback) => {
            ly.lang.funcDelay(callback, 1000);
        });
        this._readyList = [];
    }

    private getElementFromDocument(selector: SelectorParser): Array<HTMLElement> {
        const list = [];
        if (!!selector && browser.isReady()) {
            if (selector.type === SelectorType.ID) {
                const result: any = doc.getElementById(selector.value);
                if (!!result) {
                    list.push(result);
                }
            } else if (selector.type === SelectorType.CLASS) {
                const result: HTMLCollectionOf<Element> = doc.getElementsByClassName(selector.value);
                const count = result.length;
                for (let i = 0; i < count; i++) {
                    list.push(result.item(i));
                }
            } else if (selector.type === SelectorType.TAG) {
                const result: HTMLCollectionOf<Element> = doc.getElementsByTagName(selector.value);
                const count = result.length;
                for (let i = 0; i < count; i++) {
                    list.push(result.item(i));
                }
            } else if (selector.type === SelectorType.ATTR) {
                const children: HTMLCollection = doc.body.children;
                for (let i = 0; i < children.length; i++) {
                    const elem: HTMLElement = children.item(i) as HTMLElement;
                    const found: Array<HTMLElement> = this.getElementFromParent(elem, selector);
                    if (found.length > 0) {
                        list.push(...found);
                    }
                }
            }
        }

        return list;
    }

    private getElementFromParent(elem: HTMLElement, selector: SelectorParser): Array<HTMLElement> {
        const list = new Array<HTMLElement>();
        if (!!selector && browser.isReady()) {
            list.push(...this.map(elem, (child) => {
                return selector.match(child);
            }, true));
        }
        return list;
    }

    // ------------------------------------------------------------------------
    //                      S I N G L E T O N
    // ------------------------------------------------------------------------

    private static __instance: domClass;

    public static instance(): domClass {
        if (null == domClass.__instance) {
            domClass.__instance = new domClass();
        }
        return domClass.__instance;
    }

}

const dom: domClass = domClass.instance();
export default dom;