import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect ,useRef } from 'react';
import { auth } from '../firebase';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../helper/TodoApi';
import { createTask } from '../helper/TaskApi';
function ModalComponent(props) {
    const name = useRef()
    const start_date = useRef()
    const end_date = useRef()
    const priority = useRef();
    const description = useRef()
    const progress = useRef()
  
    const handleSave = () =>{

        props.handleCloseProjectModal();  
        const data = {
            "user_id":auth?.currentUser?.uid,
            "name":name.current.value,
            "start_date":start_date.current.value,
            "end_date":end_date.current.value,
            "priority":priority.current.value,
            "description":description.current.value,
            "progress":progress.current.value
        }

        createTask(data)
        .then((newTask) => {    
          console.log('Created task:', newTask);
          props.fetchAndSetTasks()
        })
        .catch((error) => {
          console.error('Error creating Task:', error);
        });

    }
    return (
        <>
            <Modal show={props.showProjectModal} onHide={props.handleCloseProjectModal}  >
                <Modal.Body style={{padding:"40px"}}>
                    <p> <span style={{ background: "#D3CBE7", color: "#604899", fontSize: "18px", fontWeight: "600", padding: "3px 20px", borderRadius: "20px" }} >Project</span> </p>
                    <p style={{ fontSize: "12px", fontWeight: "600" }} >Project Name</p>
                    <p style={{ fontSize: "20px", fontWeight: "600" }}> <input type="text" placeholder='Data Science Subject of First Semester' ref={name} style={{border:"none" , borderBottom:"1px solid gray",width:"100%"}}  /> </p>
                    <p style={{ fontSize: "12px", fontWeight: "600" }}>Add Description </p>
                    <textarea  ref={description} style={{ fontSize: "16px", fontWeight: "300",width:"100%", border:"none" , borderBottom:"1px solid gray" }} placeholder='Dive into "In The File" with Product Designers from RTL+ to understand the intricacies of designing for a wide array of platforms while maintaining impeccable structure and facilitating seamless collaboration.'>
                    </textarea>
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Set Priority</span>
                        <select name="" id="" ref={priority}>
                            <option value="H">High Priority</option>
                            <option value="L">Low Priority</option>
                            <option value="M">Medium Priority</option>
                        </select>
                    </p>
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Set Progress</span>
                        <select name="" id="" ref={progress}>
                            <option value="P">In Progress</option>
                            <option value="C">Completed</option>
                            <option value="D">Due</option>
                        </select>
                    </p>
                    <p className='d-flex m-0' style={{justifyContent:"space-between",fontSize:"12px" , fontWeight:"600"}} > <span>START DATE</span> <span>END DATE</span> </p>
                    <p className='d-flex m-0' style={{justifyContent:"space-between",color:"#604899",textDecoration:"underline"}}> <input type="date" ref={start_date} /> <span><input type="date" ref={end_date} /></span> </p>
                </Modal.Body>
                <div className='mx-auto my-3'>
                    <Button style={{background:"#604899"}} onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default ModalComponent
