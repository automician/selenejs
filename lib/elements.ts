import * as webdriver from "selenium-webdriver";
import { WebDriver, By, WebElementPromise, IWebElementId } from 'selenium-webdriver'
import WebElement = webdriver.WebElement;
import Key = webdriver.Key;
import * as commands from './element_commands'
import Condition = webdriver.until.Condition;
import {wait} from "./wait";
import {SelenideElementCondition} from "./conditions";

export interface ILocator<T> {
    find(): T;
    description(): string;
}

export class WebDriverWebElementLocator implements ILocator<WebElementPromise> {
    private by: By;
    private driver: WebDriver;

    constructor(by: By, driver: WebDriver) {
        this.by = by;
        this.driver = driver;
    }

    find(): WebElementPromise {
        return this.driver.findElement(this.by);
    }

    description(): string {
        return this.by.toString();
    }

}

export class SelenideElement {
    private locator: ILocator<WebElementPromise>;
    private webdriver: WebDriver;
    private defaultTimeout: number;

    constructor(locator: ILocator<WebElementPromise>, webdriver: WebDriver, defaultTimeout: number) {
        this.locator = locator;
        this.webdriver = webdriver;
        this.defaultTimeout = defaultTimeout;
    }

    getActualWebElement(): WebElementPromise {
        return this.locator.find();
    }

    async should(condition: SelenideElementCondition): Promise<SelenideElement> {
        await wait(condition(this), this.defaultTimeout);
        return this;
    }

    // **** Additional actions methods ****

    async setValue(...var_args: string[]): Promise<SelenideElement>{
        return commands.setValue(...var_args)(this);
    }

    async pressEnter(): Promise<SelenideElement> {
        return commands.pressEnter(this);
    }


    // **** IWebElementFinders methods ****

    findElement(locator: webdriver.By|Function): webdriver.WebElementPromise {
        return this.getActualWebElement().findElement(locator);
    }

    /**
     *
     * @deprecated This method will be removed in selenium 3.0
     */
    isElementPresent(locator: webdriver.By|Function): webdriver.promise.Promise<boolean> {
        return this.getActualWebElement().isElementPresent(locator);
    }

    findElements(locator: webdriver.By|Function): webdriver.promise.Promise<webdriver.WebElement[]> {
        return this.getActualWebElement().findElements(locator);
    }

    // **** WebElement methods ****

    /**
     *
     * @deprecated will be removed...
     */
    getDriver(): WebDriver {
        return this.webdriver;
    }

    /**
     * @deprecated Use {@link #getId()} instead.
     */
    getRawId(): any {
        return this.getActualWebElement().getRawId();
    }

    takeScreenshot(opt_scroll?: boolean): webdriver.promise.Promise<string> {
        return this.getActualWebElement().takeScreenshot();
    }

    serialize(): webdriver.promise.Promise<IWebElementId> {
        /*
         * todo: seems like here "simple delegation" is not an option
         */
        return this.getActualWebElement().serialize();
    }

    // **** IWebElement methods ****

    async click(): Promise<SelenideElement> {
        return commands.click(this);
    }

    sendKeys(...var_args: string[]): webdriver.promise.Promise<void> {
        return this.getActualWebElement().sendKeys(...var_args);
    }

    getTagName(): webdriver.promise.Promise<string> {
        return this.getActualWebElement().getTagName();
    }

    getCssValue(styleProperty: string): webdriver.promise.Promise<string> {
        return this.getActualWebElement().getCssValue(styleProperty);
    }

    getAttribute(name: string): webdriver.promise.Promise<string> {
        return this.getActualWebElement().getAttribute(name);
    }

    getText(): webdriver.promise.Promise<string> {
        return this.getActualWebElement().getText();
    }

    getSize(): webdriver.promise.Promise<webdriver.ISize> {
        return this.getActualWebElement().getSize();
    }

    getLocation(): webdriver.promise.Promise<webdriver.ILocation> {
        return this.getActualWebElement().getLocation();
    }

    isEnabled(): webdriver.promise.Promise<boolean> {
        return this.getActualWebElement().isEnabled();
    }

    isSelected(): webdriver.promise.Promise<boolean> {
        return this.getActualWebElement().isSelected();
    }

    submit(): webdriver.promise.Promise<void> {
        return this.getActualWebElement().submit();
    }

    clear(): webdriver.promise.Promise<void> {
        return this.getActualWebElement().clear();
    }

    isDisplayed(): webdriver.promise.Promise<boolean> {
        return this.getActualWebElement().isDisplayed();
    }

    getOuterHtml(): webdriver.promise.Promise<string> {
        return this.getActualWebElement().getOuterHtml();
    }

    // getId(): webdriver.promise.Promise<webdriver.IWebElementId> { //todo: why IWebElement from d.ts describes it as Promise<IWebElementId> ???
    getId(): webdriver.promise.Promise<string> {
        return this.getActualWebElement().getId();
    }

    // getId(): webdriver.promise.Promise<webdriver.IWebElementId> {
    //     return this.getActualWebElement().getId();
    // }

    getInnerHtml(): webdriver.promise.Promise<string> {
        return this.getActualWebElement().getInnerHtml();
    }

}