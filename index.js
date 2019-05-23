require("dotenv").config();

const { COINMARKETCAP_URL } = process.env;

const ora = require("ora");

const { launch, fetchData } = require("./lib/scraper");

const scrape = async () => {
  try {
    const url = COINMARKETCAP_URL;
    const spinner = ora("Please wait ...").start();
    const options = {};
    const { browser } = await launch({ options, spinner });

    const { data } = await fetchData({
      url: `${url}`,
      browser,
      spinner
    });

    spinner.succeed("done!");

    await browser.close();

    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

scrape();
