const express = require("express");
const { chromium } = require("playwright");

const app = express();
const port = 3000; // Change this to any available port you prefer

app.use(express.json());

async function takeScreenshot(url) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url);
    // const elementHandle = await page.$(selector);
    // if (!elementHandle) {
    //   throw new Error(`Element with selector "${selector}" not found.`);
    // }
    const screenshot = await page.screenshot();
    return screenshot;
  } catch (error) {
    console.error("Error occurred:", error);
    return null;
  } finally {
    await browser.close();
  }
}

app.get("/", function (req, res) {
  res.send("This is a service that takes screen shots of web page, please head to /screenshot and provide a valid url");
});

app.get("/screenshot", async (req, res) => {
  console.log(req.query);
  const url = req.query.url || null;
  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    const screenshot = await takeScreenshot(url);
    if (screenshot) {
      // Set the response content type as 'image/png'
      res.setHeader("Content-Type", "image/png");
      // Send the screenshot binary data as the response
      res.send(screenshot);
    } else {
      res.status(500).json({ error: "Failed to capture the screenshot." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred." });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
