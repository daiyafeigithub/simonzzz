const bcrypt = require('bcrypt');

const password = 'admin123'; // 这是你要设置的密码
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Generated hash:', hash);
    console.log('Copy this hash to your _config.yml file');
}); 