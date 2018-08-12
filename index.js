var fs = require('fs');
var cheerio = require('cheerio');
var charset = require('superagent-charset');
var superagent = charset(require('superagent'));

const baseUrl = 'https://cloud.tencent.com/act/campus/group/detail?group=';
let num = 23388;

setInterval(function name(params) {
  getUsersLength(`${baseUrl}${num}`);
  num--;
}, 1000);

function getUsersLength(url) {
  superagent
    .get(url)
    // .charset('gb2312') //用charset方法达到解码效果。
    .end(function(err, result) {
      if (err) {
        console.log(err);
      } else {
        var $ = cheerio.load(result.text);
        const str = $('script')[0].children[0].data;
        const itStr = str.split('__INITIAL_STATE__ = ')[1];
        const __INITIAL_STATE__ = JSON.parse(itStr);
        const groupId = __INITIAL_STATE__.actData.groupId;
        const creator = __INITIAL_STATE__.actData.creator;
        const usersLength = __INITIAL_STATE__.actData.users.length;
        const groupInfo = `${groupId} ${creator} ${usersLength} \n`;
        console.log(groupInfo);
        saveData('./saves/save.html', groupInfo);
      }
    });
}

function saveData(dest, data) {
  if (!fs.existsSync('./saves')) {
    fs.mkdirSync('./saves');
  }
  fs.writeFile(dest, data, { flag: 'a' }, function(err) {
    if (err) throw err;
    console.log('保存成功', dest);
  });
}
