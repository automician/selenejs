import * as webdriver from "selenium-webdriver";
import { WebDriver, By} from 'selenium-webdriver'
import {SelenideElement, WebDriverWebElementLocator} from "./elements";
import {Configuration} from "./configuration";
import {SelenideDriverCondition} from "./conditions";
import {wait} from "./wait";


function byOrCssToBy(locator: By | string): By {
    if (typeof locator === 'string') {
        return By.css(locator);
    }
    return locator;
}

export class SelenideDriver {

    private webdriver: WebDriver;
    private configuration: Configuration;

    constructor(webdriver: WebDriver, configuration: Configuration) {
        this.webdriver = webdriver;
        this.configuration = configuration;
    }

    async should(condition: SelenideDriverCondition): Promise<SelenideDriver> {
        await wait(condition(this.webdriver), this.configuration.timeout);
        return this;
    }

    element(locator: By | string): SelenideElement {
        const by = byOrCssToBy(locator);
        return new SelenideElement(new WebDriverWebElementLocator(by, this.webdriver), this.webdriver, this.configuration.timeout)
    }

    // **** IWebDriver methods ****

    controlFlow(): webdriver.promise.ControlFlow {
        return this.webdriver.controlFlow();
    }

    schedule<T>(command: webdriver.Command, description: string): webdriver.promise.Promise<T> {
        return this.webdriver.schedule<T>(command, description);
    }

    setFileDetector(detector: webdriver.FileDetector): void {
        this.webdriver.setFileDetector(detector);
    }

    getSession(): webdriver.promise.Promise<webdriver.Session> {
        return this.webdriver.getSession();
    }

    getCapabilities(): webdriver.promise.Promise<webdriver.Capabilities> {
        return this.webdriver.getCapabilities();
    }

    quit(): webdriver.promise.Promise<void> {
        return this.webdriver.quit();
    }

    actions(): webdriver.ActionSequence {
        return this.webdriver.actions();
    }

    touchActions(): webdriver.TouchSequence {
        return this.webdriver.touchActions();
    }

    executeScript<T>(script: string|Function, ...var_args: any[]): webdriver.promise.Promise<T> {
        return this.webdriver.executeScript<T>(script, ...var_args);
    }

    executeAsyncScript<T>(script: string|Function, ...var_args: any[]): webdriver.promise.Promise<T> {
        return this.webdriver.executeAsyncScript<T>(script, ...var_args);
    }

    call<T>(
        fn: (...var_args: any[]) => (webdriver.promise.Promise<T>|T),
        opt_scope?: any,
        ...var_args: any[]): webdriver.promise.Promise<T> {
        return this.webdriver.call<T>(fn, opt_scope, ...var_args);
    }

    wait<T>(
        condition: webdriver.promise.Promise<T>
            |webdriver.until.Condition<T>
            |((driver: webdriver.WebDriver) => T)
            |Function,
        timeout: number = this.configuration.timeout,
        opt_message?: string): webdriver.promise.Promise<T> {
        return this.webdriver.wait<T>(condition, timeout, opt_message);
    }

    sleep(ms: number): webdriver.promise.Promise<void> {
        return this.webdriver.sleep(ms);
    }

    getWindowHandle(): webdriver.promise.Promise<string> {
        return this.webdriver.getWindowHandle();
    }

    getAllWindowHandles(): webdriver.promise.Promise<string[]> {
        return this.webdriver.getAllWindowHandles();
    }

    getPageSource(): webdriver.promise.Promise<string> {
        return this.webdriver.getPageSource();
    }

    close(): webdriver.promise.Promise<void> {
        return this.webdriver.close();
    }

    get(url: string): webdriver.promise.Promise<void> {
        return this.webdriver.get(url);
    }

    getCurrentUrl(): webdriver.promise.Promise<string> {
        return this.webdriver.getCurrentUrl();
    }

    getTitle(): webdriver.promise.Promise<string> {
        return this.webdriver.getTitle();
    }

    findElement(locator: webdriver.By|Function): webdriver.WebElementPromise {
        return this.webdriver.findElement(locator);
    }

    /**
     * @deprecated This method will be removed when switching to selenium 3.0
     */
    isElementPresent(locatorOrElement: webdriver.By|Function): webdriver.promise.Promise<boolean> {
        return this.webdriver.isElementPresent(locatorOrElement);
    }

    findElements(locator: webdriver.By|Function): webdriver.promise.Promise<webdriver.WebElement[]> {
        return this.webdriver.findElements(locator);
    }

    takeScreenshot(): webdriver.promise.Promise<string> {
        return this.webdriver.takeScreenshot();
    }

    manage(): webdriver.Options {
        return this.webdriver.manage();
    }

    navigate(): webdriver.Navigation {
        return this.webdriver.navigate();
    }

    switchTo(): webdriver.TargetLocator {
        return this.webdriver.switchTo();
    }
}