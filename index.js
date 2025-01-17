const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: '123456',
  });

  let createRandomUser = ()=> {
    return [
        faker.string.uuid(),
        faker.internet.username(), // before version 9.1.0, use userName()
        faker.internet.email(),
        faker.internet.password(),
    ];
  };
  

app.get("/", (req,res)=>{
    let q = "select count(*) from user";
    try{
        connection.query(q, (err, result)=>{
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs" , {count});
          });
    } catch (err){
        res.send("Error aa gya");
    }

    app.get("/user" , (req,res)=>{
        // res.send("success");
        let q = `SELECT * FROM user`;
        try{
            connection.query(q, (err, users)=>{
                if (err) throw err;
                // console.log(result);
                res.render("user.ejs" , {users});
              });
        } catch (err){
            res.send("Error aa gya");
        }
    });

    app.get("/user/:id/edit", (req, res)=>{
        let {id} = req.params;
        let q = `SELECT * FROM user WHERE id = '${id}'`;
        try{
            connection.query(q, (err, result)=>{
                if (err) throw err;
                let user = result[0];
                res.render("edit.ejs" , { user});
              });
        } catch (err){
            res.send("Error aa gya");
        }
    });

    app.patch("/user/:id", (req,res) => {
        let {id} = req.params;
        let q = `SELECT * FROM user WHERE id = '${id}'`;
        let {password: formPass , username: newUsername} = req.body;
        try{
            connection.query(q, (err, result)=>{
                if (err) throw err;
                let user = result[0];
                if(formPass != user.password){
                    res.send("Wrong password");
                } else {
                    let updateQ = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
                    connection.query(updateQ, (err, result)=>{
                        if (err) throw err;
                        res.redirect("/user");
                    });
                }
              });
        } catch (err){
            res.send("Error aa gya");
        }
    })

    
})


  app.listen(8080, ()=>{
    console.log("Server is running on port 8080");  // Server is listening on port 8080 
  });




// connection.end();