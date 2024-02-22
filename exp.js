// console.log(eval(`(function(){
//     const fs = require('fs');
//     const directoryPath = __dirname;
//     const files = fs.readdirSync(directoryPath);
//     return files
// })()`))

//Alternatively:
// const Blog = {
//     content: new String(eval(`(function(){
//         const fs = require('fs');
//         const directoryPath = __dirname;
//         const files = fs.readdirSync(directoryPath);
//         return files
//     })()`))
// }
// console.log(Blog.content) //user can have this injected at your server side if the input fields arent sanitised and have it returned to him as response on the client side.. BEWARE AND ESCAPE YOUR INPUTS BEFORE HAVING THE JS IMPLEMENTED BACKEND PARSE THEMM !!

//Alternatively:
const Blog = {
    content: `${eval(`(function(){const fs = require('fs');const directoryPath = __dirname;const files = fs.readdirSync(directoryPath);return files})()`)}`
}

console.log(Blog.content)
