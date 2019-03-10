var fs = require('fs');
var _ = require('lodash');
var cron = require('node-cron');
var exec = require('child_process').exec;
var dbOptions =  {//'mongodb://root:netdroidtech123@ds147044.mlab.com:47044/xona';
    user: 'root',
    pass: 'netdroidtech123',
    host: 'ds147044.mlab.com',
    port: 47044,
    database: 'xona',
    autoBackup: true, 
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: 'C:\\Database_backup\\' // i.e. /var/database-backup/
};
/* return date object */
function stringToDate (dateString) 
{
    return new Date(dateString);
}
/* return if variable is empty or not. */
function empty (mixedVar) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
        return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
return false;
        }
        return true;
    }
    return false;
};

var c1 = cron.schedule('01 0 0 * * *' , ()=>{
    console.log('database backup calling')
    dbAutoBackUp();
    console.log('database backup calling')
})

c1.start()

// Auto backup script
function dbAutoBackUp() {
// check for auto backup is enabled or disabled
console.log('database backup calling')
    if (dbOptions.autoBackup == true) {
        var date = new Date();
        var beforeDate, oldBackupDir, oldBackupPath;
        currentDate = stringToDate(date); // Current date
        var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        }
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath; // Command for mongodb dump process
        exec(cmd, function (error, stdout, stderr) {
            if (empty(error)) {
                // check for remove old backup after keeping # of days given in configuration
              if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) { });
                    }
                }
            }
        });
    }
}