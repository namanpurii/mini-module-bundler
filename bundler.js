//using commonJS templating cuz ESM in bundle might break the continuity of me transpiling all the other files in the src directory from ESM to CJS
const fs = require("fs") 

// defining a function that takes a path of file and extracts its dependencies
function createAsset(fileName) {
    const content = fs.readFileSync(fileName, "utf-8")
    console.log(content)
}

createAsset("./src/index.js") //testing this out with this command in the terminal window: node ./bundler.js | npx js-beautify | npx cardinal