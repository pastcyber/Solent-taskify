import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect , useRef} from 'react';
import { createTodo } from '../helper/TodoApi';
import { getTasks } from '../helper/TaskApi';
import { auth } from '../firebase';


function TodoModalComponent(props) {

    const [tasks,settasks] = useState([])

  const name = useRef()
  const start_date = useRef()
  const end_date = useRef()
  const priority = useRef();
  const progress = useRef();
    const task = useRef()

    useEffect( ()=>{
        fetchAndSetTasks()
    })
    const fetchAndSetTasks = async () => {
        try {
            const data = await getTasks(); // Replace with your task fetching function
            console.log(data);
            settasks(data); // Replace with your task state setter
        } catch (err) {
            console.log(err);
        }
    };  
    const handleSave = () =>{
        props.handleClose();
         
     
       
        const data = {
            "user_id":auth?.currentUser?.uid,
            "name":name.current.value,
            "start_date":start_date.current.value,
            "end_date":end_date.current.value,
            "priority":priority.current.value,
            "progress":progress.current.value,
            "task_id":task.current.value
        }

        createTodo(data)
        .then((newTodo) => {
          console.log('Created to-do:', newTodo);
          props.fetchAndSetTodos()
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error creating to-do:', error);
        });

    }

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}  >
        
                <Modal.Body style={{padding:"40px"}}   >
                    <p> <span style={{ background: "#D3CBE7", color: "#604899", fontSize: "18px", fontWeight: "600", padding: "3px 20px", borderRadius: "20px" }}    >Todo</span> </p>
                    <p style={{ fontSize: "12px", fontWeight: "600" }} >Todo</p>
                    <p style={{ fontSize: "20px", fontWeight: "600" }}> <input type="text" placeholder='Data Science Subject of First Semester' ref={name} style={{border:"none" , borderBottom:"1px solid gray",width:"100%"}} /> </p>
                   
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Set Priority</span>
                        <select name="" id="" ref={priority}>
                            <option value="H">High Priority</option>
                            <option value="L">Low Priority</option>
                            <option value="M">Medium Priority</option>
                        </select>
                    </p>
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Select Project</span>
                        <select name="" id="" ref={task}>

                            <option value="N">None</option>
                            {
                                tasks?.map((task)=>(
                                    <option value={task?.id} >{task?.data.name}</option>
                                ))
                            }
                            
                       
                        </select>
                        
                    </p>
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Set Progress</span>
                        <select name="" id="" ref={progress}>
                            <option value="P">In Progress</option>
                            <option value="C">Completed</option>
                            <option value="D">Due</option>
                        </select>
                    </p>
                    <p className='d-flex m-0'  style={{justifyContent:"space-between",fontSize:"12px" , fontWeight:"600"}} > <span>START DATE</span> <span>END DATE</span> </p>
                    <p className='d-flex m-0'  style={{justifyContent:"space-between",color:"#604899",textDecoration:"underline"}}> <input type="date" ref={start_date} /> <span><input type="date" ref={end_date} /></span> </p>
                </Modal.Body>
                <div className='mx-auto my-3'>
                    <Button style={{background:"#604899"}} onClick={handleSave}  >
                        Save
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default TodoModalComponent
