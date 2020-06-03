const translate = require("@vitalets/google-translate-api");
const parser = require("xml2json");
const util = require("util");
const fs = require("fs").promises;

const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const resJson = JSON.parse(parser.toJson(data));
    console.log("parsed");
    console.log(resJson);
    return resJson;
    // console.log(data);
    // return data;
  } catch (error) {
    console.log(error);
  }
};
async function translateJsonI18(json, inputLang, outputLang) {
  const inLang = inputLang || json.xliff.file["source-language"];
  const transUnit = json.xliff.file.body["trans-unit"];
  const translatedArray = [];
  // for (let item in transUnit) {
  item = transUnit[0];
  item.target = await translateTarget(item.source, inputLang, outputLang);
  console.log(`translating ${item.source}      to   ${item.target}`);
  translatedArray.push(item);
  // }
  json.xliff.file.body["trans-unit"] = translatedArray;
  return json;
}
async function translateTarget(word, inputLang, outputLang) {
  try {
    return await translate(word, { from: inputLang, to: outputLang });
  } catch (err) {
    throw new Error("error with translating");
  }
}

async function main() {
  const filePath = "./locale/messages.xlf";
  const json = await readFile(filePath);
  // json = createJsonFromXml(filePath);
  const translated = await translateJsonI18(json, "en", "fr");
  console.log(translated);
  console.log("we are waiting for the json");
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
