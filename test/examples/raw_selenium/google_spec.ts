// import * as webdriver from "selenium-webdriver";
import * as webdriver from "selenium-webdriver/lib/webdriver"
import { Builder, By, Key, until } from "selenium-webdriver"


/**
 * Created by ayia on 12/28/16.
 */


describe('Google.com', function () {
    this.timeout(0)

    const driver = new Builder().forBrowser('firefox').build()

    after('tear down driver', async function () {
        await driver.quit()
    })

    it('searches text', async function () {
        await driver.get('http://google.com/ncr')
        await driver.findElement(By.name('q')).sendKeys('webdriver' + Key.ENTER)
        await driver.wait(until.titleIs('webdriver - Google Search'), 3000)
    })
})
