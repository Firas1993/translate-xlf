const translate = require("@vitalets/google-translate-api");
const fs = require("fs");
const parser = require("xml2json");
const util = require("util");

// Convert fs.readFile into Promise version of same
const readFile = util.promisify(fs.readFile);
async function createJsonFromXml(filePath) {
  let json;
  try {
    await fs
      .readFile(filePath, function(err, data) {
        json = parser.toJson(data);
        console.log("to json", JSON.parse(json));
      })
    console.log("to json", json);
    json = JSON.parse(json);
    return json;
  } catch (e) {
    throw new Error(e);
  }
}
function translateJsonI18(json, inputLang, outputLang) {
  const inLang = inputLang || json.xliff.file["source-language"];
  const transUnit = json.xliff.file.body["trans-unit"];
  const translatedTransUnit = transUnit.map(item => {
    item.target = translateTarget(item.source, inputLang, outputLang);
    return item;
  });
  json.xliff.file.body["trans-unit"] = translatedTransUnit;
  return json;
}
function translateTarget(word, inputLang, outputLang) {
  let translatedWord = "";
  translate(word, { from: inputLang, to: outputLang })
    .then(res => {
      translatedWord = res.text;
    })
    .catch(err => {
      console.error(err);
      throw new Error("error with translating");
    });
  return translatedWord;
}

async function main() {
  const filePath =
    "/home/kebsi/Documents/koshine/koshin/src/locale/messages.xlf";
  let json = {};
  try {
    await fs.readFile(filePath, function(err, data) {
      if (err) {
        throw new Error("cannot read file" + err);
      }
      json = JSON.parse(parser.toJson(data));
      const toTranslate = json.xliff.file.body["trans-unit"];
      return json      
    })
    .then(async (json)=>{
    const toTranslate = json.xliff.file.body["trans-unit"];
    for (let (index,item) in toTranslate){
    await translate(item.source, { from: inputLang, to: outputLang })
    .then(res => {
      toTranslate[index].target = res.text;
    })
    }
    console.log('after tranlating',toTranslate);
    json.xliff.file.body["trans-unit"]=toTranslate;

    });

    console.log("done!");
  } catch (e) {
    throw new Error(e);
  }
}
console.log("..start to execute code");
main();
// var jsonxml = require("jsontoxml");

// var xml = jsonxml({
//   node: "text content",
//   parent: [
//     { name: "taco", text: "beef taco", children: { salsa: "hot!" } },
//     {
//       name: "taco",
//       text: "fish taco",
//       attrs: { mood: "sad" },
//       children: [
//         { name: "salsa", text: "mild" },
//         "hi",
//         { name: "salsa", text: "weak", attrs: { type: 2 } },
//       ],
//     },
//     { name: "taco", attrs: 'mood="party!"' },
//   ],
//   parent2: {
//     hi: "is a nice thing to say",
//     node: "i am another not special child node",
//     date: function() {
//       return new Date() + "";
//     },
//   },
// });

// console.log(xml);
