var iconv = require('iconv-lite');
var xmlContent = "建筑名称";
var message = iconv.encode(xmlContent, 'GB2312');
const aa = Buffer.from('BDA8D6FEC3FBB3C6')
const bb = iconv.decode(aa, 'GB2312');
console.log(message.toString('GB2312'));
console.log(message);
console.log(typeof(message));
console.log(Buffer.isBuffer(message))