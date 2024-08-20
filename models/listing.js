let mongoose =require('mongoose')

let listSchema = new mongoose.Schema(
    {
        title: {
            type:String,
            
        },
        description: {
            type:String
        },
        image: {
            filename: {
                type: String,
            },
            url: {
                type: String,
                default: 'https://images.unsplash.com/photo-1641158085789-662322a9202c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            },
        },
        price:{
            type:Number
        },
        location:{
            type:String
        },
        country:{
            type:String
        },
        createdAt:{
            type:Date,
            default: Date.now()
        }
    }
)

let List = mongoose.model('List', listSchema)

module.exports = List;