var fs = require('fs');
function getUserHome() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}
var serverConfigPath = getUserHome() + '/busfareportal-config.json';
var projectConfigPath = __dirname + '/busfareportal-config.json';

if (process.env.NODE_ENV === 'test') {
  projectConfigPath = __dirname + '/test_config.json';
}

var selectedConfigPath;
if (fs.existsSync(serverConfigPath)) {
  selectedConfigPath = serverConfigPath;
  console.log('config is taken from ' + selectedConfigPath);
} else if (fs.existsSync(projectConfigPath)) {
  selectedConfigPath = projectConfigPath;
  console.log('config is taken from ' + selectedConfigPath);
} else {
  console.log('CONFIG FILE DOESNT EXIST @ ' + selectedConfigPath);
  process.exit();
}

var finalJSONConfig = JSON.parse(fs.readFileSync(selectedConfigPath));
finalJSONConfig.jwtSecret = 'mybus';

module.exports = finalJSONConfig;
