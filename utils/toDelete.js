const fs = require('fs')
const path = require('path')
const appDir = path.dirname(require.main.filename)

module.exports = (filePath) => {
    if (filePath) {
        fs.unlink(appDir + '/../public/images/' + filePath, (err) => {
            if (err) {
                console.log('Ошибка при удалении файла - ', err);
            }
        })
    }
}