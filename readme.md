#dub

Record audio buffers

```javascript
var d = new Dub( source );
d.start();
setTimeout(function() {
  d.stop();
  var audioBuffer = d.getBuffer();
}, 1000);
```
