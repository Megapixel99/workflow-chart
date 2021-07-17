# WFC
###### (Work Flow Chart)
WFC is a CLI application written in NodeJS for creating flowcharts from within the source code. Work Flow Chart analyses your source code on execution and looks for keywords in your code to build the documentation.

[Documentation](https://github.com/Megapixel99/workflow-chart/blob/master/DOCUMENTATION.md)

[Example Output](https://github.com/Megapixel99/workflow-chart/blob/master/example/exampleFlow.png)

## Installation
```bash
$ npm install -g workflow-chart
```

**Note**: If you receive an error while installing this project due to `node-gyp` or `node-pre-gyp` please refer to the documentation on [canvas](https://github.com/Automattic/node-canvas) and/or the documentation on [node-gyp](https://github.com/nodejs/node-gyp). This project uses [canvas](https://github.com/Automattic/node-canvas) which relies on [Cario](https://www.cairographics.org/) and uses `node-gyp` to build the executable for your operating system (which can cause issues during installation).

## Usage

Add some WFC comments anywhere in your source code:

```java
/*
 * @flowType start
 * @flowTitle Beginning
*/
/*
 * @flowType step
 * @flowId step1
 * @flowPrevious start
 * @flowTitle call api
*/
```

Now generate the documentation from your `src/` folder into your pre-existing `doc/` folder.

```bash
$ workflow-chart -i src/ -o doc/
```
or, require the package in your source code and build the documentation yourself.

```javascript
const workflowChart = require('workflow-chart');

workflowChart({
  "input": ".",
  "output": ".",
  "filename": "flow.png",
});
```

WFC also supports multiple src folders if you separate each location with a comma
```bash
$ workflow-chart -i ./example/example1,./example/example2 -o doc/
```

## Contributing
Please see [`CONTRIBUTING.md`](https://github.com/Megapixel99/workflow-chart/blob/master/CONTRIBUTING.md)

## License (MIT)

Copyright © 2021 Seth Wheeler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
