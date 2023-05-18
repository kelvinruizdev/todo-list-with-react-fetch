import { array } from "prop-types";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faX
  } from '@fortawesome/free-solid-svg-icons';
import '../../styles/index.css' 

//URL general
const URLBASE = "https://assets.breatheco.de/apis/fake/todos/user/kelvin"

function Home() {
    //Guardar todas las tareas
    const [allTasks, setAllTasks] = useState([])

    //Tarea actual
    const [task, setTask] = useState({})

    //Borro usuario?
    const [isDeletedUser, setIsDeletedUser] = useState(false)

    //FUNCTIONS

    //Get all tasks
    async function getAllTasks ()  {
        try {
            let response = await fetch(`${URLBASE}`)
            let data = await response.json()

            if(response.status == 404){ 
                createUser()
            }else{
                setAllTasks(data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    //Create user
    async function createUser(){
        try {
            let response = await fetch(`${URLBASE}`,
                {
                    method:"POST",
                    headers:{
                        "Content-type":"application/json"
                    },
                    body: JSON.stringify([])
                })
            
            if(response.ok){
                getAllTasks()
                setIsDeletedUser(false)
            }else{
                console.log("User not create")
            }
            
        } catch (err) {
            console.log(err)
        }
    }

    //Delete user
    async function deleteUser(){
        try {
            let response = await fetch(`${URLBASE}`,{
                    method:"DELETE"
                }
            )
            setIsDeletedUser(true)
        } catch (err) {
            console.log(err)
        }
    }

    //Add Task
    async function addTask(){
        try {
            let response = await fetch(`${URLBASE}`,{
                    method:"PUT",
                    headers:{
                        "Content-type":"application/json"
                    },
                    body:JSON.stringify(allTasks)                   
                }
            )
            
        } catch (err) {
            console.log(err)
        }
    }

    //Delete a task
    async function deleteTask(oneLessTask) {
        try {
            let response = await fetch(`${URLBASE}`,{
                    method:"PUT",
                    headers:{
                        "Content-type":"application/json"
                    },
                    body:JSON.stringify(oneLessTask)                   
                }
            )
            
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=>{
        getAllTasks()
    },[])

    //HANDLERS

    function handleChange({ target }) {
        setTask({
            ...task,
            [target.name]: target.value,
            done: false
        })
        console.log(target.name, target.value, task)
        
    }

    //guarda la tarea en la lista de tareas
    function handleSubmit(event) {
        event.preventDefault()

        if (task.label.trim() != "") {
            
            setAllTasks([
                ...allTasks,
                task
            ]) //debe mantener la estructura array de objeto
            setTask({ label: "" , done: null})
            addTask()
        }
    }

    function handleDeleteTask(index) {
        const oneLessTask = allTasks.filter(task => task.label != allTasks[index].label)
        deleteTask(oneLessTask)
        setAllTasks(oneLessTask)
    }

    return (
        <>
            <div className="container-flex bg-light">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6">

                        <p className="title">todos</p>

                        <div className="  lead box-shadow">
                            {/*Formulario*/}
                            <form onSubmit={handleSubmit} className=" p-3 mt-3" >

                                <div className="form-group lead">
                                    <input className=""
                                        placeholder="What needs to be done?"
                                        id="label"
                                        type="text"
                                        onChange={handleChange}
                                        name="label"
                                        value={task.label}
                                    />
                                </div>
                            </form>

                            {      
                                isDeletedUser?
                                    <div className="task-container text-center">
                                        <p>User not found, please press create user!</p>
                                    </div>
                                    :                          
                                    allTasks.map((item, index) => {
                                        return (
                                            <div key={index} className="task-container border-top border-ligth">    
                                                <div className="task-container--delete ">
                                                    <p className="">{item.label}</p>
                                                    <div className="delete-task btn"
                                                        onClick={()=>{handleDeleteTask(index)}}
                                                    >
                                                        <FontAwesomeIcon icon={faX} style={{color: "#000000"}}/>
                                                    </div> 
                                                </div>                                  
                                            </div>
                                        )
                                    })   
                                
                                
                            }
                            {
                                allTasks.length == 0 ? (
                                            <div className="border-top border-secondary text-secondary lead">
                                                <p className="ms-3 ">No tasks, add a task</p>
                                            </div>  
                                        ):(
                                            <div className="border-top border-secondary text-secondary lead">
                                                <p className="ms-3">{allTasks.length} items left</p>
                                            </div>
                                        )
                            }
                            
                        </div>

                        <div className="d-flex justify-content-center"
                            onClick={addTask}
                        > 
                            <button className="">
                                DELETE USER
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;