# SeleneJs - Concise API for Selenium in JavaScript [PROTOTYPE]x

This repo was an initial try to port [Selenide](http://selenide.org/) from Java and [Selene](https://github.com/yashaka/selene) from Python to JavaScript by [@yashaka](https://github.com/yashaka) (Iakiv Kramarenko)
After Iakiv had joined http://k-expert.com, the work on the port was moved to https://github.com/KnowledgeExpert/selenidejs, where under his leadership the work was continued, mainly by [@AleksanderPopov](https://github.com/AleksanderPopov), with the help of [other contributors](https://github.com/KnowledgeExpert/selenidejs/graphs/contributors).

Main features:
- Concise API for Selenium
- Ajax support
- PageObjects support

Todo:
- jQuery-style selectors
- improved PageObjects support (with probably some alternative syntax to "then.then.then")

NOTE: This was just a draft version and API was not fully finalized and implemented. The package was not available in npm, etc.

## Example

```typescript
//corresponding imports...

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

```
