const express = require('express')
const path = require('path')
const methodOverride = require('method-override')


const   ejsMate = require('ejs-mate')

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
app.get('/lists' ,async (req,res)=>{
    let Lists= await List.find({})
    // console.log(Lists)

    res.render('listing/index.ejs',{Lists})   
       
})

//! <-------New Route------->

app.get('/lists/new',(req,res)=>{
    res.render('listing/new.ejs')
})

//! <-------Show Route------->
app.get("/lists/:id", async (req, res) => {
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

  });
  
//! <-------Create Route------->
app.post('/lists',(req,res)=>{
    let{ title, description, price , country , location } = req.body
    let newList = new List({title,description, price, country, location})
    newList.save().then(res=> console.log("New List was saved ", res)).catch(err=>console.log(err))
    res.redirect('/lists')
})

//! <-------Edit Route------->

app.get('/lists/:id/edit', async (req,res)=>{
    let { id } = req.params;
    let listing = await List.findById(id)
    res.render('listing/edit.ejs',{listing})
})

//! <-------Update Route------->
app.put('/lists/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let { title, description, price, country, location } = req.body; // Fixed typo here
        // console.log(req.body);
        // console.log(req.method)
        await List.findByIdAndUpdate(id, { title:title, description:description, price:price, country:country, location:location });
        
        res.redirect(`/lists/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).send("Internal Server Error");
    }
});


//! <-------Delete Route------->

app.delete('/lists/:id',(req,res)=>{
    let {id} = req.params
    List.findByIdAndDelete(id).then(res=> console.log("List was deleted successfully", res)).catch(err=>console.log(err))
    res.redirect('/lists')
 
})


//! <-------Listing server------->
app.listen(port,(req, res) => {
    console.log(`Server is running on port ${port}`)
})