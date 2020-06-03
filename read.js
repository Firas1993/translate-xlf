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
    console.log('after translating',toTranslate);
    json.xliff.file.body["trans-unit"]=toTranslate;

    });

    console.log("done!");
  } catch (e) {
    throw new Error(e);
  }