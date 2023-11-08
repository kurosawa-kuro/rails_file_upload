const { chromium } = require('@playwright/test');

// 非同期のsetup関数を定義します。
async function setupBrowser() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    return { browser, page };
}

// 非同期のteardown関数を定義します。
async function teardownBrowser(browser) {
    if (browser) {
        await browser.close();
    }
}

// スクリーンショットを撮るヘルパー関数を定義します。
async function takeScreenshot(page) {
    if (page) {
        await page.screenshot({ path: './test/playwright/test-failure.png' });

    }
}

// Jestのテストブロックを定義します。
test('Indexページに"New"というテキストが表示されている', async () => {
    const { browser, page } = await setupBrowser();

    try {
        await page.goto('http://localhost:3000/microposts');
        const isVisible = await page.isVisible('text="New"');
        expect(isVisible).toBeTruthy();
    } catch (error) {
        console.error('テストに失敗しました:', error);
        await takeScreenshot(page);
        throw error;
    } finally {
        await teardownBrowser(browser);
    }
});

test('"New"というテキストをクリックしたらhttp://localhost:3000/microposts/newに遷移する', async () => {
    const { browser, page } = await setupBrowser();

    try {
        await page.goto('http://localhost:3000/microposts');
        // 'New'というテキストをクリックします。
        await page.click('text="New"');
        // ページの遷移が完了するのを待ちます。
        await page.waitForLoadState('networkidle');
        // 現在のURLが期待するURLと一致するかを確認します。
        expect(page.url()).toBe('http://localhost:3000/microposts/new');
    } catch (error) {
        console.error('テストに失敗しました:', error);
        await takeScreenshot(page);
        throw error;
    } finally {
        await teardownBrowser(browser);
    }
});

test('newページでタイトルに"AAA"と入力する', async () => {
    const { browser, page } = await setupBrowser();

    try {
        // Navigate to the new micropost page
        await page.goto('http://localhost:3000/microposts/new');

        // Wait for the input element to be visible
        await page.waitForSelector('input[name="micropost[title]"]', { state: 'visible' });

        // Fill the input with 'AAA'
        await page.fill('input[name="micropost[title]"]', 'AAA');

        // Wait for any network activity to finish after filling the input
        await page.waitForLoadState('networkidle');

        // Retrieve the input value to confirm it's been set correctly
        const inputValue = await page.inputValue('input[name="micropost[title]"]');

        // Expect the input value to be 'AAA'
        expect(inputValue).toBe('AAA');
    } catch (error) {
        // If there's an error, log it and take a screenshot
        console.error('テストに失敗しました:', error);
        await takeScreenshot(page);
        throw error; // Re-throw the error so Jest recognizes the test as failed
    } finally {
        // Finally, tear down the browser regardless of the test outcome
        await teardownBrowser(browser);
    }
});

test('newページでタイトルに"AAA"と入力し、画像を選択する', async () => {
    const { browser, page } = await setupBrowser();
    const timeoutValue = 20000; // Ensure that the timeout is sufficient for your test environment

    try {
        await page.goto('http://localhost:3000/microposts/new');
        await page.waitForSelector('input[name="micropost[title]"]', { state: 'visible' });
        await page.fill('input[name="micropost[title]"]', 'AAA');
        await page.waitForLoadState('networkidle');

        // Specify the path to the image file relative to the test file or the root of the project
        const imageFilePath = './test/fixtures/files/image5.png';

        // Wait for the file input element to be visible
        await page.waitForSelector('input[type="file"]', { state: 'visible' });

        // Set the file to the file input element
        await page.setInputFiles('input[type="file"]', imageFilePath);

        // Additional code here to submit the form if needed and verify that the file was uploaded successfully

        const inputValue = await page.inputValue('input[name="micropost[title]"]');
        expect(inputValue).toBe('AAA');

        // Optionally, after form submission, check the response or page behavior to confirm the image was uploaded
    } catch (error) {
        console.error('テストに失敗しました:', error);
        await takeScreenshot(page);
        throw error;
    } finally {
        await teardownBrowser(browser);
    }
});

