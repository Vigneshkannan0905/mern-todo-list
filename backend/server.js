const express=require("express")
const mongoose = require("mongoose")
const cors = require('cors')

const app=express()
const PORT = 8000

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log("DB connected")
})
.catch((err)=>{
    console.log(err.message)
})

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String
})

const todoModel = mongoose.model("Todo",todoSchema)

app.get('/todos',async (req,res)=>{
    try{
        const todos = await todoModel.find()
        res.json(todos)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
})

app.post('/todos',async (req,res)=>{
    const {title,description}=req.body
    try{
        const newTodo = new todoModel({title,description})
        await newTodo.save()
        res.status(201).json(newTodo)
    }catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
})



app.put('/todos/:id', async (req,res)=>{
    try{
        const {title,description}=req.body
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new: true}
        )
        if(!updatedTodo){
            return res.status(404).json({message:"Todo not found"})
        }
        else{
            return res.status(200).json(updatedTodo)
    }

    }catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
    
})

app.delete('/todos/:id',async (req,res)=>{
    try{
        const id = req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})


app.listen(PORT,()=>{
    console.log("Server is running")
})