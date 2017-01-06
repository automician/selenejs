import {SelenideElement} from "./elements";
import * as webdriver from "selenium-webdriver";
import Key = webdriver.Key;
import * as conditions from './conditions';
import be = conditions.be;

async function execute(element: SelenideElement, command: ()=>Promise<any>, condition?): Promise<any>{
    return command()
        .catch(async function (error) {
            await element.should(condition);
            await command();
        });
}

export function setValue(...var_args: string[]): (SelenideElement) => Promise<SelenideElement> {
    return async function (element: SelenideElement): Promise<SelenideElement> {

        const clearAndSendKeys = async () => {
            const webelement = element.getActualWebElement();
            await webelement.clear();
            await webelement.sendKeys(...var_args);
        };

        await execute(element, clearAndSendKeys, be.visible);

        return element;
    };
}

export async function pressEnter(element: SelenideElement): Promise<SelenideElement> {
    await execute(
        element,
        async () => await element.getActualWebElement().sendKeys(Key.ENTER),
        be.visible);

    return element;
}

export async function click(element: SelenideElement): Promise<SelenideElement> {
    await execute(
        element,
        async () => await element.getActualWebElement().click(),
        be.visible);

    return element;
}

