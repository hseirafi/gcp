"use strict"; 
const express = require('express'); 
const app = express();
const path = require('path') 

app.use(express.static(path.join(__dirname)));
app.use("/scripts", express.static(__dirname + "/public"));
app.get('/', (req, res) => {    
    res.status(200).send(`<style>
    a.button {
    -webkit-appearance: button;
    -moz-appearance: button;
    appearance: button;
    padding:5px;
    border-radius:5px;

    text-decoration: none;
    color: initial;
}
.wrapper{
    margin:40px;
}
    </style><div class="wrapper" ><h1 >Last Week's weather micro service Landing Page</h1>
    <p>Get last Week's weather conditions using your browsers geo location</p>
    <a href="/weather" class="button">click here</a></div>`);
});
app.use(function(req, res){
   res.sendStatus(404);
});

app.listen(process.env.PORT);