import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react';
import {updateTodo} from '../helper/TodoApi';
import { auth } from '../firebase';
import { getTasks } from '../helper/TaskApi';

function TodoEditModal(props) {

    const [tasks,settasks] = useState([])
    const name = useRef()
    const start_date = useRef()
    const end_date = useRef()
    const priority = useRef();
    const progress = useRef();

    const task = useRef()

    useEffect(() => {
      fetchAndSetTasks();
    }, []);

    const fetchAndSetTasks = async () => {
      try {
        const data = await getTasks(); // Replace with your task fetching function
        console.log(data);
        settasks(data); // Replace with your task state setter
      } catch (err) {
        console.log(err);
      }
    };  
    const handleSave = () => {
        props.handleCloseEditTodo();
        const data = {
            "user_id":auth?.currentUser?.uid,
            "name":name.current.value,
            "start_date":start_date.current.value,
            "end_date":end_date.current.value,
            "priority":priority.current.value,
            "progress":progress.current.value,
            "task_id":task.current.value
        }

        console.log(data);
        updateTodo(props?.editTodo?.id,data)
            .then((newTodo) => {
                console.log('Updated to-do:', newTodo);
                window.location.reload()
                props.fetchAndSetTodos()
            })
            .catch((error) => {
                console.error('Error creating to-do:', error);
            });

    }
console.log(props?.editTodo?.todoData?.name)
    return (
        <>
            <Modal show={props.showEditTodo} onHide={props.handleCloseEditTodo}  >

                <Modal.Body style={{ padding: "40px" }}   >
                    <p> <span style={{ background: "#D3CBE7", color: "#604899", fontSize: "18px", fontWeight: "600", padding: "3px 20px", borderRadius: "20px" }}    >Edit Todo</span> </p>
                    <p style={{ fontSize: "12px", fontWeight: "600" }} >Edit Todo</p>
                    <p style={{ fontSize: "20px", fontWeight: "600" }}> <input type="text" placeholder='Data Science Subject of First Semester' ref={name} defaultValue={props?.editTodo?.todoData?.name} style={{ border: "none", borderBottom: "1px solid gray", width: "100%" }} /> </p>

                    <p style={{ fontSize: "12px", fontWeight: "600" }} className='my-3'> <span className='mr-4'>Set Priority</span>
                        <select name="" id="" ref={priority}  >
                            <option value="H"  selected={props?.editTodo?.todoData?.priority === 'H'}>High Priority</option>
                            <option value="L" selected={props?.editTodo?.todoData?.priority === 'L'}>Low Priority</option>
                            <option value="M" selected={props?.editTodo?.todoData?.priority === 'M'}>Medium Priority</option>
                        </select>
                    </p>
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Select Project</span>
                        <select name="" id="" ref={task}>

                            <option value="N" selected={props?.editTodo?.todoData?.task_id === 'N'} >None</option>
                            {
                                tasks?.map((task)=>(
                                    <option selected={props?.editTodo?.todoData?.task_id === task?.id} value={task?.id} >{task?.data.name}</option>
                                ))
                            }
                            
                       
                        </select>
                    </p>
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Set Progress</span>
                        <select name="" id="" ref={progress}>
                            <option value="P" selected={props?.editTodo?.todoData?.progress === 'P'}>In Progress</option>
                            <option value="C" selected={props?.editTodo?.todoData?.progress === 'C'}>Completed</option>
                            <option value="D" selected={props?.editTodo?.todoData?.progress === 'D'}>Due</option>
                        </select>
                    </p>
                    <p className='d-flex m-0' style={{ justifyContent: "space-between", fontSize: "12px", fontWeight: "600" }}  > <span>START DATE</span> <span>END DATE</span> </p>
                    <p className='d-flex m-0' style={{ justifyContent: "space-between", color: "#604899", textDecoration: "underline" }}> <input type="date"  defaultValue={props?.editTodo?.todoData?.start_date} ref={start_date} /> <span><input type="date" defaultValue={props?.editTodo?.todoData?.end_date} ref={end_date} /></span> </p>
                </Modal.Body>
                <div className='mx-auto my-3'>
                    <Button style={{ background: "#604899" }} onClick={handleSave}  >
                        Save
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default TodoEditModal
