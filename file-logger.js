const Logger = require('./logger'); // наследующий Logger
const fs = require('fs');

class FileLogger extends Logger{

    // Конструктор с параметрами file, prefix, defaultLevel, dateFormat с вызовом родительского конструктора.
    // В качестве file пользователь может передать как строку, так и поток.
    // В случае если передана строка - открываем поток на запись.
    constructor(file="myFile.txt", prefix='PR', level="LOG", dateFormat="dddd, mmmm dS, YYYY, h:MM:ss tt"){
        super(prefix, level, dateFormat);
        this.file = file;
    }

    // Метод log(message, level)
    // - выводит в файл отформатированное сообщение (методом format)
    // - вовзращает промис, который выполнится после завершения записи
    // - в случае отстутствия level используем defaultLevel
    log(message, level = "LOG"){
        return new Promise((resolve, reject)=> {
            this.fileType(typeof this.file, message);
        });
    }

    fileType(type, message){
        type = type.toString();
        if(type==="string"){this.writeFile(message);}
        else{this.writeStream(message)}
    }

    writeFile(message){
        fs.access(this.file, fs.constants.F_OK, (err) => {
            fs.appendFile(this.file, this.format(message, this.level), (err) => {
                if (err){console.log('Error in writing file'); return false;}
                return true;
            });
        });
    };

    writeStream(message){
        this.file.write(this.format(message, this.level), (err) => {
            if (err) {console.error(err); return false;}
            return true;
        });
    };

    //  Метод close() закрывающий поток записи
    close(){
        this.file.close();
    }
}

module.exports = FileLogger;