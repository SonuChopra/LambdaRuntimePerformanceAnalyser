# Lambda Runtime Performance Analyser

While developing node.js based API's I wanted a better way to visualize when my functions were being called and how long they lasted. This was mostly to increase efficiency since I was calling many functions asynchronously. Note this tool is not a final product.

In order to use this simple webpage based application you will need to `console.log` the starting and ending of each function like so:

```
exports.createUser = (username, password) => {
    console.log("[createUser] started") //<--- like this
    ... more code here ...
    console.log("[createUser] ended") //<--- and this
};
```

The webpage is pretty simple to use. First you take all the console text and paste it into the text box. Then you click start. Each console line becomes a button. You first click the start of each function and then the end of each function. You dont have to match up every console line. If you accidently click a console line, you can click it again to unselect it. Feel free to watch to demo video below to get a better understanding.

Demo Video: https://drive.google.com/file/d/1jQW_xl1tnsNdhpJ6OF6T3_6wluioBSMj/view?usp=sharing
