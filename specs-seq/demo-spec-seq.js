import playwright from 'playwright';
import config from 'config';
import assert from 'assert';

const mochaTimeoutMS = config.get( 'mochaTimeoutMS' );

describe( 'Playwright 1', function() {
	this.timeout( mochaTimeoutMS );

	let browser;

	before( async function() {
		browser = await playwright.chromium.launch();
	} );

	it( 'can wait for an element to appear', async function() {
		const context = await browser.newContext();
		const page = await context.newPage( `${ config.get( 'baseURL' )}` );
		await page.waitForSelector('#content > ul > li:nth-child(1) > a');
	} );

	it.skip( 'can handle alerts', async function() {
		const context = await browser.newContext();
		const page = await context.newPage();
		page.on('dialog', async dialog => {
			await dialog.accept();
		});
		await page.goto( `${ config.get( 'baseURL' )}/leave` );
		await page.click( '#homelink' );
		await page.waitForSelector( '#elementappearsparent', { visible: true, timeout: 5000 } );
	} );

	it.skip( 'can check for errors when there should be none', async function() {
		const context = await browser.newContext();
		const page = await context.newPage();
		let errors = '';
		page.on('pageerror', pageerr => {
			errors = errors + pageerr;
		});
		await page.goto( `${ config.get( 'baseURL' )}` );
		assert.equal( errors, '' );
	} );

	it.skip( 'can use xpath selectors to find elements', async function() {
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.goto( `${ config.get( 'baseURL' )}` );
		await page.waitForSelector( '//span[contains(., "Scissors")]' );
		await page.click( '//span[contains(., "Scissors")]' );
		await page.waitForSelector( '//div[contains(., "Scissors clicked!")]' );
	} );

	after( async function() {
		await browser.close();
	} );
} );
