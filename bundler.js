//using commonJS templating cuz ESM in bundle might break the continuity of me transpiling all the other files in the src directory from ESM to CJS
const fs = require("fs") 
const path = require("path") //to resolve relative paths
const babylon = require("babylon") // to generate AST
const traverse = require("@babel/traverse").default // to traverse, update and query nodes in an AST
const babel = require("@babel/core")

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
    
    const {code} = babel.transformFromAst(ast)

    return { //returning dependencies[] with other relevant information
        id, 
        fileName, 
        dependencies,
        code,
    }
}

function createGraph(entryFile) { 
    const mainAsset = createAsset(entryFile) //once we have the dependencies of the source/entry file(i.e. mainAsset), we'd want to extract the dependencies of its dependencies[] and so on..
    const queue = [mainAsset] 
    for(const asset of queue) {
        asset.mapping = {} //imitating adjacency list through this attribute, for each node(i.e. asset) in the dependency graph
        const dirname = path.dirname(asset.fileName);
        asset.dependencies.forEach((dependency)=>{
            const child = createAsset(path.join(dirname, dependency))
            asset.mapping[dependency] = child.id
            queue.push(child)
        }) 
    }
    return queue;
}

function bundle(graph) {
    let modules = ""
    graph.forEach((dep)=>{
        modules+=`${dep.id}: [
            function(require, module, exports) {
                ${dep.code}
            },
            ${JSON.stringify(dep.mapping)},
        ],`
    })
    const res = `(function(modules) {
        function require(id) {
            const mod = modules[id]
            const [fn, mapping] = mod

            function localRequire(relPath) {return require(mapping[relPath])}

            const module = { exports: {} }
            fn(localRequire, module, module.exports);

            return module.exports
        }

        require(0)
    })({${modules}})`
    return res
}

const graph = createGraph("./src/index.js")
const res = bundle(graph)
console.log(res);