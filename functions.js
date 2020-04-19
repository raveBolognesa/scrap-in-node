const rp = require("request-promise");
const $ = require("cheerio"); 
var amazing = [];
 
const ask = async (s, extraData) => {
  var data = [];
  try { 
    let html = await rp(s);
    if (!!html) {
      let long = $(" a", html).length;
      let hrf;
      for (let index = 0; index <= long; index++) {
        if (index == long) { 
          return new Promise((resolve) => resolve(data));
        }
        hrf = $("a", html)[index].attribs.href;
        if (hrf && hrf.includes("http") && hrf.slice(0,4) == 'http') {
          var newdata = data;
          newdata.push(hrf);
          data = newdata; 
        }
      }
    }
  } catch (error) {
    console.log("error asking for the ulrs at: ", extraData, "", s);
    return []; 
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
      console.log("amazing");
      return amazing;
    }

    let theResults = await ask(theUrlWeAreAskingFor, o);

    if (!!theResults) {
      theResults.forEach((element, index) => {
        // console.log(`URL${o}-${index}-${element}`);
        amazing.push(`URL${o}-${index}-${element}`);

        if (currentNumber < totalIterations) {
          return fn(
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

const newFn = async (url, num, position,max) => {
  let list = [];
  let listFormatted = [];
  try {
    let firstList = await ask(url, position);
    // console.log("Round -- ", position);
    // console.log("Items -- ", firstList);

    firstList.forEach((element, index) => {
      if (index < max) { 
        list.push(element);
        listFormatted.push({
          urlRaw: element,
          urlposition: position + "-" + index,
          url: position + "-" + index + "-" + element,
        });
      }
    });
    return { list: list, listFormatted: listFormatted, num: +num + 1 };
  } catch (error) {
    return { list: [], listFormatted: [], num: +num + 1 };
  }
};
const manageObjects33 = async (url, num) => {
  let toreturn = [];
  var count = 0;
  let firstList = await newFn(url, count, "URL");
  firstList.listFormatted.forEach((y) => toreturn.push(y.url));
  count = firstList.num;
  let theRes = await Promise.all(
    firstList.listFormatted.map((e) => newFn(e.urlRaw, 0, e.urlposition))
  );
  // console.log("theUrls index");
  // console.log("theUrls  x.num ", theRes);
  theRes.forEach((x) => {
    if (x) {
      count = x.num;
      // console.log("theUrls index");
      console.log("theUrls  x.num ", x.num);

      return x.listFormatted.forEach((y) => toreturn.push(y.url));
    }
  });
  return toreturn;
};
const manageObjects = async (url, max) => {
  let toreturn = [];
  var masterAr = [];
  var count = 0;
  let firstList = await newFn(url, count, "URL",max);
  firstList.listFormatted.forEach((y) => toreturn.push(y.url));
  masterAr = firstList.listFormatted;
  console.log(masterAr,'ajskdjasko')
  count++;
  while (count < max) {
    // masterAr.forEach(async (element, index) => {
      //   let asdasda = await newFn(url, count, "URL");
      // })
      let theRes = await Promise.all(
        masterAr.map( (e) => {
          return newFn(e.urlRaw, 0, e.urlposition,max);
        })
        );
        masterAr = []
        theRes.forEach((x) => x.listFormatted.forEach(x=>{
          masterAr.push(x)
          toreturn.push(x.url)
        }));
        console.log("alallalal", count ,masterAr);
    count++;
  }
  return toreturn;
};

var spe = async (sarr) => {
  try {
    let sarr = await Promise.all(
      sarr.listFormatted.map((e) => newFn(e.urlRaw, 0, e.urlposition))
    );
    return sarr;
  } catch (error) {
    console.log("Error index");
    return [];
  }
};

// let theRes = []
// let someresult
// let firstList = await newFn(url,0)
// someresult = firstList.num
// while (+num<=someresult) {
//   firstList = await newFn(url,0)
// someresult = firstList.num
// }
// await Promise.all([who(), what(), where()]);

// if (process.argv[3]) {
//   let round = process.argv[3].split("=") || "some";
//   chainedScrap(chainedScrap, url, 1, round[1], "");
// } else {
//   ask(url).then(console.log);
// }

module.exports = { ask, chainedScrap, newFn: manageObjects, some: "hola" };
