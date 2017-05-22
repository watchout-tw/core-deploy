const rp = require('request-promise');
const config = require('./config');
const dateTime = require('node-datetime');

module.exports = {
  send: function(msgPack,res){

    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    console.log(formatted);

    let msg = '';
    for (let index in msgPack){
      msg += msgPack[index] + '\n'
    }
    let color = '#7CD197'
    let title = 'SUCCESSED!'
    if (!res)
    {
      color = 'd50200';
      title = 'FAILED!'
    }

    let options = {
      method: 'POST',
      uri: config.slack_url,
      body: {
        "attachments": [
            {
                "fallback": "[core] Auto daily build "+ title,
                "pretext": "[core] Auto daily build "+ title,
                "title": "build time :" + formatted,
                "title_link": "",
                "text": msg,
                "color": color
            }
        ]
      },
      json: true // Automatically stringifies the body to JSON
    };

    rp(options)
      .then(function (res) {
        console.log('Done! Sent to Slack')
      })
      .catch(function (res) {
        console.log('Error! Sent to Slack faild',res)
      });
    
  }
};