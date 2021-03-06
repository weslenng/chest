import { Launcher } from "chrome-launcher";
import puppeteer from "puppeteer-core";

import loadMiddleware from "./load-middleware";
import requestMiddleware from "./request-middleware";

const startChromium = async (): Promise<void> => {
  const executablePath = Launcher.getFirstInstallation();
  if (!executablePath) {
    throw new TypeError('"executablePath" should be a string');
  }

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--start-maximized"],
    defaultViewport: null,
    executablePath,
    headless: false,
  });

  const page = await browser.newPage();
  
  await page.setRequestInterception(true);

  page.on("domcontentloaded", () => loadMiddleware(page));
  page.on("request", requestMiddleware);

  await page.goto(
    "https://www.chess.com/login_and_go?returnUrl=https%3A%2F%2Fwww.chess.com%2Flive"
  );
};

export default startChromium;
