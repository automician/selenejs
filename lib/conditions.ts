import * as webdriver from "selenium-webdriver";
import {SelenideElement} from "./elements";
import WebElement = webdriver.WebElement;
import WebDriver = webdriver.WebDriver;
import {ICondition, Condition} from "./wait";
import WebElementPromise = webdriver.WebElementPromise;
import WebDriverError = webdriver.error.WebDriverError;
import IThenable = webdriver.promise.IThenable;
import {SelenideDriver} from "./driver";

export abstract class ElementCondition implements ICondition<webdriver.promise.Promise<WebElement>> {
    abstract matches(webelement: WebElementPromise): webdriver.promise.Promise<boolean>;
    abstract actual(): webdriver.promise.Promise<string>;
    abstract expected(): string;

    element: SelenideElement;

    constructor(element: SelenideElement) {
        this.element = element;
    }

    fn(): webdriver.promise.Promise<WebElement> {
        const webelement = this.element.getActualWebElement();
        return this.matches(webelement)
            .then(isMatched => {
                if (isMatched) {
                    return webelement;
                } else {
                    throw new WebDriverError("condition have not matched");
                }
            });
    }

    description(): string {
        return `matching element: ${this.element}
                    ${this.constructor.name}
                        expected: ${this.expected()}
                        actual: ${this.actual()}`;
    }

    toString(): string {
        return this.description();
    }
}


class ElementVisible extends ElementCondition {
    private _actual: webdriver.promise.Promise<boolean | undefined>;

    constructor(element: SelenideElement) {
        super(element);
        this._actual = webdriver.promise.fulfilled(undefined);
    }

    matches(webelement: WebElementPromise): webdriver.promise.Promise<boolean> {
        return webelement.then(it => {
            this._actual = it.isDisplayed();
            return this._actual;
        });
    }

    actual(): webdriver.promise.Promise<string> {
        return this._actual.then(it => String(it));
    }

    expected(): string {
        return "true";
    }

}


class ElementExactText extends ElementCondition {
    private _actual: webdriver.promise.Promise<string | undefined>;
    private text: string;

    constructor(element: SelenideElement, text: string) {
        super(element);
        this.text = text;
        this._actual = webdriver.promise.fulfilled(undefined);
    }

    matches(webelement: WebElementPromise): webdriver.promise.Promise<boolean> {
        return webelement.then(it => {
            this._actual = it.getText();
            return this._actual;
        }).then( actualText => {
            return actualText == this.text;
        });
    }

    actual(): webdriver.promise.Promise<string> {
        return this._actual.then(it => String(it));
    }

    expected(): string {
        return this.text;
    }

}

/*
 * todo: consider implementing ElementCondition the same "simple" way...
 * this will lead to refactoring wait method to report final timeout error only based on "reason"
 * not condition.toString() (based on condition.description()) and "reason"
 */
function driverTitle(driver: SelenideDriver, title: string): Condition<webdriver.promise.Promise<boolean>> {
    return new Condition("driver title", () => {
        return driver.getTitle().then(actualTitle => {
            if (actualTitle == title) {
                return true;
            }
            throw new Error(`actual title: ${actualTitle} \ndid not match expected: ${title}`);
        });
    });
}

export type SelenideElementCondition = (SelenideElement) => ElementCondition
export type SelenideDriverCondition = (SelenideDriver) => Condition<webdriver.promise.Promise<boolean>>


export namespace be {
    /*
     * usage: `wait(be.visible(element), 3000)`
     */
    export const visible: SelenideElementCondition = (element: SelenideElement) => new ElementVisible(element);
}


export namespace have {
    /*
     * usage: `wait(have.exactText(text)(element), 3000)`
     */
    export function exactText(text: string): SelenideElementCondition {
        return (element: SelenideElement) => new ElementExactText(element, text);
    }

    export function title(text: string): SelenideDriverCondition {
        return (driver: SelenideDriver) => driverTitle(driver, text);
    }
}

