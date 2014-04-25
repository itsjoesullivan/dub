var _ = require('underscore');

var Dub = module.exports = function( source ) {

  this.context = source.context;

  var sourceChannelCount = source.buffer.numberOfChannels;

  // Where the audio data is stored
  this.channelBuffers = [];

  while (sourceChannelCount > this.channelBuffers.length) {
    this.channelBuffers.push( new Float32Array(0) );
  }

  // Our processing node.
  this.node = this.context.createScriptProcessor(4096, 
    sourceChannelCount,
    sourceChannelCount);

  this.node.onaudioprocess = this.onaudioprocess.bind(this);

  this.node.connect( context.destination );
  
  source.connect(this.node);

};

Dub.prototype.start = function() {
  this.recording = true;
};
Dub.prototype.record = function() {
  this.start.apply(this,arguments);
};

Dub.prototype.stop = function() {
  this.recording = false;
};

Dub.prototype.onaudioprocess = function(e) {
  if (!this.recording) return;
  this.concat([
    e.inputBuffer.getChannelData(0),
    e.inputBuffer.getChannelData(1)
  ]);
};

Dub.prototype.concat = function(bufferArray) {
  _(bufferArray).each(function(arr, i) {
    var buff = this.channelBuffers[i];
    this.channelBuffers[i] = new Float32Array(buff.length + arr.length);
    this.channelBuffers[i].set( buff );
    this.channelBuffers[i].set( arr, buff.length );
  }.bind(this));
};

Dub.prototype.getBuffer = function() {
  var buffer = this.context.createBuffer( this.channelBuffers.length,
    this.channelBuffers[0].length,
    44100);
  _(this.channelBuffers).each(function(channelBuffer, i) {
    buffer.getChannelData(i).set(channelBuffer);
  });
  return buffer;
};
