const functions = require("./functions");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (str) => new Promise((resolve) => rl.question(str, resolve));

const steps = {
  start: async () => {
    return steps.seeCars();
  },
  seeCars: async () => {
    const seeCars = await question(
      "Would you like to scrap a web and get all its a hrefs? \n\nPlease type: \n\n--yes if you want to scrap only one url \n--no if you want to exit \n--deep if you want to scrap a web recursively, you will be later asked how deep you want to dig\n\n\n "
    );
    if (seeCars.toLowerCase().trim() === "yes") {
      return steps.showCars();
    }
    if (seeCars.toLowerCase().trim() === "no") {
      return steps.end();
    }

    if (seeCars.toLowerCase().trim() === "deep") {
      return steps.deep();
    }
    console.log("Error typing try again!");
    return steps.seeCars();
  },
  showCars: async () => {
    const url = await question("Now type the url: ");
    console.log("Looking for Urls");
    let theUrls = await functions.ask(url);
    console.log(theUrls);
    return steps.end();
  },
  deep: async () => {
    const url = await question("Now type the url: ");
    const deep = await question(
      "Now type a number to represent how deep u want to dig: "
    );
    if (url && deep) {
      if (isNaN(deep) || deep < 1) {
        console.log("type again, wrong deep number");
        return steps.deep();
      }
      console.log(
        "\n\nIt will take a while to get all data, all urls will start  showing on console\n\n"
      );
      let theUrls = await functions.manageObjects(url, deep);
      theUrls.forEach(console.log);
      return steps.end();
    } else {
      return steps.deep();
    }
  },
  end: async () => {
    console.log("\n\nOk, have a nice day");
    console.log("Bye Bye!");
    rl.close();
  },
};

steps.start();
