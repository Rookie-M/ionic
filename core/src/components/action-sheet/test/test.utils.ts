import { newE2EPage } from '@stencil/core/testing';

import { generateE2EUrl } from '../../../utils/test/utils';

export async function testActionSheet(
  type: string,
  selector: string,
  rtl = false,
  afterScreenshotHook = async (..._args: any[]): Promise<void> => {/**/}
) {
  try {
    const pageUrl = generateE2EUrl('action-sheet', type, rtl);

    const page = await newE2EPage({
      url: pageUrl
    });

    const screenshotCompares = [];

    const presentBtn = await page.find(selector);
    await presentBtn.click();

    let actionSheet = await page.find('ion-action-sheet');
    await actionSheet.waitForVisible();

    screenshotCompares.push(await page.compareScreenshot());

    await afterScreenshotHook(page, screenshotCompares, actionSheet);

    await actionSheet.callMethod('dismiss');
    await actionSheet.waitForNotVisible();

    screenshotCompares.push(await page.compareScreenshot('dismiss'));

    actionSheet = await page.find('ion-action-sheet');
    expect(actionSheet).toBe(null);

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  } catch (err) {
    throw err;
  }
}

export async function testActionSheetBackdrop(
  page: any,
  screenshotCompares: any,
  actionSheet: any
) {
  try {
    console.log('backdrop hook');
    const backdrop = await page.find('ion-backdrop');
    await backdrop.click();

    screenshotCompares.push(await page.compareScreenshot(`dismiss backdrop`));

    const isVisible = await actionSheet.isVisible();
    expect(isVisible).toBe(true);
} catch (err) {
    throw err;
  }
}

export async function testActionSheetAlert(
  page: any,
  screenshotCompares: any
) {
  try {
    const openAlertBtn = await page.find({ text: 'Open Alert' });
    await openAlertBtn.click();

    const alert = await page.find('ion-alert');
    await alert.waitForVisible();
    await page.waitFor(250);

    screenshotCompares.push(await page.compareScreenshot(`alert open`));

    const alertOkayBtn = await page.find({ contains: 'Okay' });
    await alertOkayBtn.click();
  } catch (err) {
    throw err;
  }
}
