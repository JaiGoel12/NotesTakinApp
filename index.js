const express= require('express');
const app = express();
const path = require('path');
const fs=require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));



app.get("/", (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            return res.status(500).send("Unable to read files");
        }
        res.render("index", { files: files });
    });
});

app.get("/files/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}` ,"utf-8", function(err, filedata){
        try {
            if(err) throw err;
            res.render("show",{filename: req.params.filename , filedata : filedata});
            
        } catch (error) {
            console.log(error);
            res.send(error)
            
        }
        
    })
})

app.get("/edit/:filename",(req,res)=>{ 
   res.render("edit",{filename: req.params.filename });
})

app.post('/edit',(req,res)=>{ 
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err){
        res.redirect("/");
    })
    
 })

app.post("/create",function(req,res){
   fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details, function(err){
res.redirect("/");
   });
})

app.listen(6001);




