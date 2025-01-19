//Building a simple Quora Web page
const express=require("express");
const app=express();
const port=8080;

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});

//ejs setup
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));//views folder contains all the EJS files.


//to serve static files
app.use(express.static(path.join(__dirname,"public")));//public folder contains all the static(css,javascript) files

//To handle post requested data
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Creating Ids
const {v4:uuidv4}=require("uuid");

app.get("/",(req,res)=>{
    res.send("Server working well!");
});

let posts=[
    {
        id:uuidv4(),
        username:"apnacollege",
        content:"I love coding!"
    },
    {
        id:uuidv4(),
        username:"shradhakhapra",
        content:"Hord work is important to achieve success"
    },
    {
        id:uuidv4(),
        username:"sanketshinde",
        content:"You have the right to work only,not to it's fruit"
    }

];

//all posts
app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts});
});

//create new post
app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
});
app.post("/posts",(req,res)=>{
    let {username,content}=req.body;
    let id=uuidv4();
    posts.push({id,username,content});
    res.redirect("/posts");//it redirects to the /posts route page.
});

//get specific post 
app.get("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id==p.id);//it will return a whole post(obj) with matching id
    res.render("show.ejs",{post});
});

//Update specific post
app.get("/posts/:id/edit",(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id==p.id);
    res.render("edit.ejs",{post});
});

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

app.patch("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let newContent=req.body.content;
    let post=posts.find((p)=>id==p.id);
    post.content=newContent;
    res.redirect("/posts");
});

//Delete post
app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params;
    posts=posts.filter((p)=>id!==p.id);
    res.redirect("/posts");
});
