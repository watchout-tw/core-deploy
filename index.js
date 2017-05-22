const shell = require('shelljs');
const config = require('./config');
const slack = require('./slack');
const rp = require('request-promise');
var log = [];

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}
let res = '';
shell.cd(config.core_path);
res = shell.ls();


/*  STEP 1 / 3
 *  git pull
 */
res = shell.exec('git pull').stdout;
if(res.indexOf('Updating') > -1 || res.indexOf('Already up-to-date') > -1) {
  log.push('[STEP 1/3][SUCCESSED] Git Pull',res);


  /*  STEP 2 / 3
  *  core server restart
  */
  res = shell.exec('pm2 restart '+ config.core_pm2ID).stdout;
  log.push('[STEP 2/3] PM2 restart ' + config.core_pm2ID);

  /*  STEP 3 / 3
 *  core server restart
 */
  var options = {
    uri: config.test_url,
    qs: {
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then(function (res) {
      log.push('[STEP 3/3][SUCCESSED] Poke Server',res);
      slack.send(log,true);
    })
    .catch(function (res) {
      log.push('[STEP 3/3][FAILED] Poke Server',res.error);
      slack.send(log,false);
    });


}
else{
  log.push('[STEP 1/3][FAILED] Git Pull',res);
  slack.send(log,false);
}





