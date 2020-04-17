const rp = require("request-promise");
const $ = require("cheerio");

const url = process.argv[2];

let exit = 0;

// 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';
const ask = async (s, extraData) => {
  var data = [];
  try {
    // console.log("round");
    // console.log(s);
    let html = await rp(s);
    if (!!html) {
      let long = $(" a", html).length;
      let hrf;
      for (let index = 0; index <= long; index++) {
        if (index == long) {
          // console.log("\n\n  raaafa  end  ", data, index, long);
          return new Promise((resolve) => resolve(data));
        }
        hrf = $("a", html)[index].attribs.href;
        if (hrf && hrf.includes("http")) {
          var newdata = data;
          newdata.push(hrf);
          data = newdata;
          // console.log("\n\n  yas  end  ", data, index, long);
        }
      }
    }
  } catch (error) {
    console.log("error asking for the ulrs at: ",'URL'+ extraData,"", s);
    // console.log(error);
  }
};
 

let calNum = (n1, n2) => {
  if (n1 == 0) {
    return "1";
  }
  if (n1 > 0) {
    let st = [1];
    for (let index = 1; index < n1; index++) {
      st.push(index + 1);
    }
    return st.join("-");
  }
};

const chainedScrap = async (
  fn,
  theUrlWeAreAskingFor,
  currentNumber,
  totalIterations,
  o
) => {
  try {
    if (currentNumber >= totalIterations + 1) {
      return;
    }

    let theResults = await ask(theUrlWeAreAskingFor, o);

    if (!!theResults) {
      theResults.forEach((element, index) => {
        console.log(`URL${o}-${index}-${element}`);

        if (currentNumber < totalIterations) {
          fn(
            fn,
            element,
            currentNumber + 1,
            totalIterations,
            `${o + "-" + index}`
          );
        }
      });
    }
  } catch (error) {
    console.log("error in chained scrap");
    console.log(error);
  }
};

if (process.argv[3]) {
  let round = process.argv[3].split("=") || "some";
  chainedScrap(chainedScrap, url, 1, round[1], "");
} else {
  ask(url).then(console.log);
}
