// This file is the setup for dotenv. when the setup command is run this will output to .env file where the creds can be updated and used

'use strict';
var fs = require('fs');
fs.createReadStream('.sample-env')
  .pipe(fs.createWriteStream('.env'));
