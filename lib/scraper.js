const puppeteer = require("puppeteer");

class Scraper {
  /**
   * Launch page
   * @param {Object} params launch options
   * @return {Object} Browser object
   */
  async launch(params) {
    const { options, spinner } = params;
    const {
      headless = true,
      args = ["--start-fullscreen", "--window-size=1200,1040"]
    } = options;

    spinner.text = "Lauching browser";

    const browser = await puppeteer.launch({
      headless,
      args
    });

    return {
      browser
    };
  }

  /**
   * Load Page
   * @param {Object} data Go to data
   * @return {Object} Error object
   */
  async loadPage(data) {
    const { browser, url, spinner } = data;

    const page = await browser.newPage();

    //   set view port
    await page.setViewport({
      width: 1800,
      height: 1000
    });

    spinner.text = `loading ${url}`;

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 0
    });

    return {
      page
    };
  }

  /**
   * Fetch Data
   * @param {Object} data params
   * @return {Object} Counts
   */
  async fetchData(data) {
    const browse = new Scraper();

    const { url, browser, spinner } = data;

    const { page } = await browse.loadPage({
      url,
      browser,
      spinner
    });

    await page.waitForSelector("#currencies", {
      timeout: 0
    });

    // const currencies = await page.$$eval("table tbody tr", trs =>
    //   trs.map(tr => {
    //     console.log({ tr });
    //     return tr.text;
    //   })
    // );

    const currencies = await page.evaluate(() => {
      const rowNodeList = document.querySelectorAll("table tbody tr");
      const rowArray = Array.from(rowNodeList);

      return rowArray.map(tr => {
        const dataNodeList = tr.querySelectorAll("td");
        const dataArray = Array.from(dataNodeList);

        const [
          rank,
          name,
          marketCap,
          price,
          volume24h,
          circulatingSupply,
          change24h
        ] = dataArray.map(td => td.innerText);

        return {
          rank: Number(rank),
          name,
          marketCap,
          price,
          volume24h,
          circulatingSupply,
          change24h
        };
      });
    });

    //console.log({ dataArray });

    //[ 'One', 'Two', 'Three', 'Four' ]
    // console.log(currencies);

    // const currencies = await page.$$("#currencies");

    console.log({ currencies });

    return {
      data: currencies
    };
  }
}

module.exports = new Scraper();
