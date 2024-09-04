const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const asyncWrap = require('./Utils/wrapAsync.js')
const ExpressError = require('./Utils/ExpressError')
const   ejsMate = require('ejs-mate')
const {listingSchema} =require('./schema')
// Define the port
const port = 3000;
const app = express()

// Middleware to parse JSON requests


app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Middleware to override with POST having ?_method=PATCH

app.use(methodOverride("_method"));

// set the Views Path

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate);

// set the Static Path

app.use(express.static(path.join(__dirname , '/public')))


// Database Connection
const db = require('./mongoose/config')
const List = require('./models/listing')
// routes

app.get('/', (req, res) => {
    res.render('home.ejs')
})

//! <-------Index Route------->
app.get('/lists' ,asyncWrap(async (req,res)=>{
    let Lists= await List.find({})
    // console.log(Lists)

    res.render('listing/index.ejs',{Lists})   
       
}))

//! <-------New Route------->

app.get('/lists/new',(req,res)=>{
    res.render('listing/new.ejs')
})

//! <-------Show Route------->
app.get("/lists/:id",asyncWrap( async (req, res) => {
    let { id } = req.params;
    const listing= await List.findById(id); 
    
if (!listing) {
    console.log(`Listing not found with ID: ${id}`);
} else {
    console.log(`Listing found: ${listing}`);
}

     
if (!listing) {
    return res.status(404).render("listing/notfound.ejs"); // or any other error handling mechanism
}

res.render("listing/show.ejs", { listing });

  }));
  
//! <-------Create Route------->
app.post('/lists',asyncWrap(async(req,res)=>{
    let result = listingSchema.validate(req.body)
    // console.log(result)
    if(result.error){
        throw new ExpressError(400, result.listing)
    }
    let{ title, description, price , country , location } = req.body
    let newList = new List({title,description, price, country, location})
    // newList.save().then(res=> console.log("New List was saved ", res)).catch(err=>console.log(err))
   await newList.save()
    res.redirect('/lists')
}))

//! <-------Edit Route------->

app.get('/lists/:id/edit', asyncWrap(async (req,res)=>{
    let { id } = req.params;
    let listing = await List.findById(id)
    res.render('listing/edit.ejs',{listing})
}))

//! <-------Update Route------->
app.put('/lists/:id', asyncWrap(async (req, res) => {
   
        let { id } = req.params;
        let { title, description, price, country, location } = req.body; // Fixed typo here
        // console.log(req.body);
        // console.log(req.method)
        await List.findByIdAndUpdate(id, { title:title, description:description, price:price, country:country, location:location });
        
        res.redirect(`/lists/${id}`);
   
}));


//! <-------Delete Route------->

app.delete('/lists/:id',asyncWrap(async(req,res, next)=>{
    let {id} = req.params
   await List.findByIdAndDelete(id)
    res.redirect('/lists')
 
}))
//! <----------Error Handling------>
app.all('*',(req,res,next)=>{
    next(new ExpressError( 404,'<h1>Page Not Found</h1>'))
})
app.use((err,req,res,next)=>{
    // res.send('<h1>Some thing went wrong.</h1>')
    // res.render('Listing/notfound.ejs')
    let {statusCode = 500 ,message} =err
    res.status(statusCode ).render('error.ejs',{message})
    // res.status(statusCode ).render('error.ejs',{err})
})

//! <-------Listing server------->
app.listen(port,(req, res) => {
    console.log(`Server is running on port ${port}`)
})