import * as webdriver from "selenium-webdriver";
import By = webdriver.By;
import {SelenideDriver} from "../../../lib/driver";
import {pressEnter} from "../../../lib/element_commands";
import until = webdriver.until;
import {Configuration} from "../../../lib/configuration";
import {have} from "../../../lib/conditions";


describe('Google.com', function () {
    this.timeout(0);

    const driver = new SelenideDriver(new webdriver.Builder().forBrowser('firefox').build(), new Configuration());

    after('tear down driver', async function () {
        await driver.quit();
    });

    it('searches text', async function () {
        await driver.get('http://google.com/ncr');
        await driver.element(By.name('q')).setValue('webdriver').then(pressEnter);
        await driver.element(".srg>.g .r>a").click();  // here an implicit wait for visibility of first result is included
        await driver.should(have.title('Selenium WebDriver'));
    });
});
