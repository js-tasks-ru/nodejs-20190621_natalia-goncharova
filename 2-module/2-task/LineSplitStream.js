const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lastLineData ='';
  }

  _transform(chunk, encoding, callback) {
    const data = this.lastLineData + chunk.toString();
    const lines = data.split(os.EOL);
    const lastLine = lines.pop();
    this.lastLineData ='';
    for (const line of lines) {
      this.push(line);
    }
    if (lastLine.endsWith(os.EOL)) {
      this.push(lastLine);
    } else {
      this.lastLineData = lastLine;
    }
    callback();
  }

  _flush(callback) {
    if (this.lastLineData) {
      this.push(this.lastLineData);
    }
    callback();
  }
}

module.exports = LineSplitStream;
