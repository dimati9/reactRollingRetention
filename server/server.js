const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

var corsOptions = {
    origin: "*"
};

let insert = 0;


// TODO Настройки подключения, тестовый сервер, можно и на нём.
const connection = mysql.createConnection({
    host: "sql7.freemysqlhosting.net",
    user: "sql7390312",
    database: "sql7390312",
    password: "5XUpsjtaeg",
    port: "3306",
});

connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// // simple route
// app.get("/", (req, res) => {
//     res.json({ message: "We can get /all ." });
// });

app.get("/", function(request, response){
    connection.query("SELECT * FROM test",
        function(err, results, fields) {
            console.log(err);
            console.log(results); // собственно данные
            console.log(fields); // мета-данные полей
            var data = results;
            response.json({ data: JSON.stringify(data)});
        });
});

app.post("/", function(req, res, next) {

    const data = req.body.data;
    if(data.length >= 1) {
        Object.keys(data).map(function(objectKey, index) {
            var value = data[objectKey];
            const user = [value.register, value.lastActivity, value.userId == null ? "" : value.userId];
            const sql = "INSERT INTO test(register, lastActivity) VALUES(?, ?)";

            connection.query(sql, user, function(err, results) {
                if(err)   res.json({ ok: 0, message: err });
                else insert++;
            });
        });
        if(insert > 0) {
            res.json({ ok: 1, message: "Успешно сохранено", counts: insert });
        }   else {

        }

    }   else {
        res.json({ ok: 0, message: "Пустой запрос." });
    }
    console.log(data);
});

// set port, listen for requests
const PORT = process.env.PORT || 3100;
// Start the server
const server = app.listen(PORT, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});