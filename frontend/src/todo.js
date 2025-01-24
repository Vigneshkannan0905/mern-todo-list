import { useEffect, useState } from "react"

export default function Todo(){

    const apiUrl='http://localhost:8000'
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [todos, setTodos] = useState([])
    const [editId, setEditId] = useState(-1)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const handleSubmit = () =>{
        setError('')
        if (title!=='' && description!==''){
            fetch(apiUrl+"/todos",{
                method:"POST",
                headers :{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok){
                    setTodos([...todos,{title,description}])
                    setMessage('Item added successfully !')
                    setTimeout(()=> setMessage(''),2000)
                    setTitle('')
                    setDescription('')
                }
                else{
                    setError("Unable to create Todo item")
                    setTimeout(()=> setError(''),2000)
                }
            }).catch((err)=>{
                setError(err.message)
                setTimeout(()=> setError(''),2000)
            })
        }
        else{
            setError("Unable to create Todo item")
            setTimeout(()=>setError(''),2000)
        }
    }

    const handleEdit = (item) => {
        setEditId(item._id)
        setEditTitle(item.title)
        setEditDescription(item.description)
    }

    const handleUpdate = ()=>{
        if (editTitle!=='' && editDescription!==''){
            fetch(apiUrl+"/todos/"+editId,{
                method:"PUT",
                headers :{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({title:editTitle,description:editDescription})
            }).then((res)=>{  
                if(res.ok){
                    const updatedTodo=todos.map((item)=>{
                        if(item._id===editId){
                            item.title = editTitle
                            item.description = editDescription
                        }
                        return item
                    })
                    setTodos(updatedTodo)
                    setMessage('Item updated successfully !')
                    setTimeout(()=> setMessage(''),2000)
                }
                else{
                    setError("Unable to create Todo item")
                    setTimeout(()=> setError(''),2000)
                }
            }).then(()=> setEditId(-1))
            .catch((err)=>{
                setError(err.message)
                setTimeout(()=> setError(''),2000)
            })
        }
        else{
            setError("Unable to create Todo item")
            setTimeout(()=>setError(''),2000)
        }
    }

    const handleDelete = (id)=>{
        if(window.confirm('Are you sure ?')){
            fetch(apiUrl+"/todos/"+id,{
                method:"DELETE"
            })
            .then(()=>{  
                const updatedTodo=todos.filter((item)=> item._id!==id)
                setTodos(updatedTodo)
                setMessage('Item Deleted successfully !')
                setTimeout(()=> setMessage(''),2000)
            })
        }
    }

    const getItems = () =>{
        fetch(apiUrl+'/todos')
        .then((res) => res.json())
        .then((res)=>{
            setTodos(res)
        })
    }

   
    useEffect(()=>{
        getItems()
    },[])

    return (
        <>
        <div className="row p-3 bg-success text-light">
            <h1>Todo Project</h1>
        </div>
        <div className="mt-3 d-flex flex-column">
            <div className="d-flex flex-column" >
                <h3>Add Item</h3>
                <p className={`${message?"text-success":"text-danger"}`}>{message?message:error}</p>
            </div>
            <div className="form-group d-flex gap-2 align-items-center">
                <input placeholder="Title" name="title" onChange={(e)=>setTitle(e.target.value)} value={title} className="form-control" type="text" />
                <textarea placeholder="Description" onChange={(e)=>setDescription(e.target.value)} value={description} className="form-control" type="text" />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
        <div className="row mt-3 mb-3">
            <h1>Tasks</h1>
            <div className="d-flex flex-column-reverse col-md-6">
                    {todos.map((item)=> 
                        editId!==item._id ?
                            <li className="bg-info d-flex justify-content-between my-2 p-3 gap-3">
                                <div className="d-flex flex-column gap-2">
                                    <span className="fw-bold">{item.title}</span>
                                    <span>{item.description}</span>
                                </div>
                                <div className="d-flex align-items-start gap-2">
                                    <button className="btn btn-warning" onClick={()=>handleEdit(item)}>Edit</button>
                                    <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>
                                </div>
                            </li>
                        :
                            <li className="list-group-item bg-info my-2 p-3">
                                    <div className="d-flex flex-column gap-2">
                                        <input onChange={(e)=>setEditTitle(e.target.value)} value={editTitle} className="form-control mb-2" type="text" />
                                        <textarea onChange={(e)=>setEditDescription(e.target.value)} value={editDescription} style={{minHeight:"6rem",maxHeight:"10rem",width:"100%"}} className="form-control" type="text" />
                                    </div>
                                    <div className="d-flex gap-2 mt-3">
                                        <button className="btn btn-warning" onClick={handleUpdate}>Update</button>
                                        <button className="btn btn-danger" onClick={()=>setEditId(-1)}>Cancel</button>
                                    </div>
                            </li>
                        )
                    }
            </div>
        </div>
        </>
    )
}
