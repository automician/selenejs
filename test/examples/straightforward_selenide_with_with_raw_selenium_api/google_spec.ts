import * as webdriver from "selenium-webdriver";
import By = webdriver.By;
import until = webdriver.until;
import Key = webdriver.Key;
import {SelenideDriver} from "../../../lib/driver";
import {Configuration} from "../../../lib/configuration";


describe('Google.com', function () {
    this.timeout(0);

    const driver = new SelenideDriver(new webdriver.Builder().forBrowser('firefox').build(), new Configuration())

    after('tear down driver', async function () {
        await driver.quit();
    });

    it('searches text', async function () {
        await driver.get('http://google.com/ncr');
        await driver.findElement(By.name('q')).sendKeys('webdriver' + Key.ENTER);
        await driver.wait(until.titleIs('webdriver - Google Search'), 3000);
    });
});
