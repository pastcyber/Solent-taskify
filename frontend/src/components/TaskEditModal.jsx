import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect ,useRef } from 'react';
import { auth } from '../firebase';
import { updateTask } from '../helper/TaskApi';
function TaskEditModal(props) {
    const name = useRef()
    const start_date = useRef()
    const end_date = useRef()
    const priority = useRef();
    const description = useRef()
    const progress = useRef()
  
    const handleSave = () =>{

        props.handleCloseEditProject()
        const data = {
            "user_id":auth?.currentUser?.uid,
            "name":name.current.value,
            "start_date":start_date.current.value,
            "end_date":end_date.current.value,
            "priority":priority.current.value,
            "description":description.current.value,
            "progress":progress.current.value
        }

        updateTask( props?.taskEdit?.id,data)
        .then((newTask) => {    
          console.log('Updated task:', newTask);
          props.fetchAndSetTasks();
          window.location.reload();

        })
        .catch((error) => {
          console.error('Error Updating Task:', error);
        });

    }
    return (
        <>
            <Modal show={props.showEditProject} onHide={props.handleCloseEditProject}  >

                <Modal.Body style={{padding:"40px"}}>
                    <p> <span style={{ background: "#D3CBE7", color: "#604899", fontSize: "18px", fontWeight: "600", padding: "3px 20px", borderRadius: "20px" }} >Project</span> </p>
                    <p style={{ fontSize: "12px", fontWeight: "600" }} >Project Name</p>
                    <p style={{ fontSize: "20px", fontWeight: "600" }}> <input type="text" placeholder='Data Science Subject of First Semester' defaultValue={props?.taskEdit?.data?.name} ref={name} style={{border:"none" , borderBottom:"1px solid gray",width:"100%"}}  /> </p>
                    <p style={{ fontSize: "12px", fontWeight: "600" }}>Add Description </p>
                    <textarea  ref={description} style={{ fontSize: "16px", fontWeight: "300",width:"100%", border:"none" , borderBottom:"1px solid gray" }} defaultValue={props?.taskEdit?.data?.description} placeholder='Dive into "In The File" with Product Designers from RTL+ to understand the intricacies of designing for a wide array of platforms while maintaining impeccable structure and facilitating seamless collaboration.'>
                    </textarea>
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Set Priority</span>
                        <select name="" id=""  ref={priority}>
                            <option value="H" selected={props?.taskEdit?.data?.priority === 'H'} >High Priority</option>
                            <option value="L" selected={props?.taskEdit?.data?.priority === 'L'} >Low Priority</option>
                            <option value="M" selected={props?.taskEdit?.data?.priority === 'M'}>Medium Priority</option>
                        </select>
                    </p>
                    <p style={{fontSize:"12px" , fontWeight:"600"}} className='my-3'> <span className='mr-4'>Set Progress</span>
                        <select name="" id="" ref={progress}>
                            <option value="P" selected={props?.taskEdit?.data?.progress === 'P'}>In Progress</option>
                            <option value="C" selected={props?.taskEdit?.data?.progress === 'C'}>Completed</option>
                            <option value="D" selected={props?.taskEdit?.data?.progress === 'D'}>Due</option>
                        </select>
                    </p>
                    <p className='d-flex m-0' style={{justifyContent:"space-between",fontSize:"12px" , fontWeight:"600"}} > <span>START DATE</span> <span>END DATE</span> </p>
                    <p className='d-flex m-0' style={{justifyContent:"space-between",color:"#604899",textDecoration:"underline"}}> <input type="date" ref={start_date} defaultValue={props?.taskEdit?.data?.start_date}/> <span><input type="date" defaultValue={props?.taskEdit?.data?.end_date} ref={end_date} /></span> </p>
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

export default TaskEditModal
