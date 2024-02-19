//using commonJS templating cuz ESM in bundle might break the continuity of me transpiling all the other files in the src directory from ESM to CJS
const fs = require("fs") 
const babylon = require("babylon") // to generate AST
const traverse = require("@babel/traverse").default // to traverse, update and query nodes in an AST

let file_ID = 0;

// defining a function that takes a path of file and extracts its dependencies
function createAsset(fileName) {
    let content = fs.readFileSync(fileName, "utf8")
    const ast = babylon.parse(content, { sourceType: "module" }) 
    // console.log(ast)

    const dependencies = [] //array to store dependencies
    traverse(ast, {
        ImportDeclaration: ({node})=>{// going over/traversing all the nodes of type 'ImportDeclaration' in the AST, i want to fetch the dependencies/imports for the file(represented by 'fileName') and store them in a dependencies[] array
            // console.log(node)
            dependencies.push(node.source.value) 
        }
    })
    // console.log(dependencies)
    const id = file_ID++; //each 'fileName'(i.e. argument to the fn createAsset) will get a unique id
    
    return { //returning dependencies[] with other relevant information
        id, 
        fileName, 
        dependencies,
    }
}

const mainAsset = createAsset("./src/index.js") //testing this out with this command in the terminal window: node ./bundler.js | npx js-beautify | npx cardinal
// console.log(mainAsset)
//once we have the dependencies of the source/entry file(i.e. mainAsset), we'd want to extract the dependencies of its dependencies[]