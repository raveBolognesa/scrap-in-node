const functions = require("./functions");

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (str) => new Promise((resolve) => rl.question(str, resolve));

const questions = {
  start: async () => {
    return questions.firstQuestion();
  },
  firstQuestion: async () => {
    const mode = await question(
      "Would you like to scrap a web and get all its urls? \n\nPlease type: \n\n--yes if you want to scrap only one url \n--no if you want to exit \n--deep if you want to scrap a web recursively, you will be later asked how deep you want to dig\n\n\n "
    );
    if (mode.toLowerCase().trim() === "yes") {
      return questions.askUrls();
    }
    if (mode.toLowerCase().trim() === "no") {
      return questions.end();
    } 
    if (mode.toLowerCase().trim() === "deep") {
      return questions.deep();
    }
    console.log("\n\nError typing try again!\n\n");
    return questions.firstQuestion();
  },
  askUrls: async () => {
    const url = await question("\n\nNow type the url:\n");
    console.log("\n\nLooking for Urls\n\n");
    let theUrls = await functions.ask(url);
    console.log("\n\nHere you have it!\n\n");
    theUrls.forEach((x) => console.log(x));
    return questions.end();
  },
  deep: async () => {
    const url = await question("Now type the url: ");
    const deep = await question(
      "Now type a number to represent how deep u want to dig: "
    );
    if (url && deep) {
      if (isNaN(deep) || deep < 1) {
        console.log("type again, wrong deep number");
        return questions.deep();
      }
      console.log(
        "\n\nIt will take a while to get all data, all urls will start  showing on console\n\n"
      );
      let theUrls = await functions.manageObjects(url, deep);
      console.log("\n\nHere you have it!\n\n");
      theUrls.forEach((x) => console.log(x));
      return questions.end();
    } else {
      return questions.deep();
    }
  },
  end: async () => {
    console.log("Bye Bye!");
    rl.close();
  },
};

questions.start();
