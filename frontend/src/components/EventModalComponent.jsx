import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';


function EventModalComponent(props) {

    return (
        <>
            <Modal show={props.showEvent}  >

                <Modal.Body style={{padding:"40px"}}>
                    <p> <span style={{ background: "#D3CBE7", color: "#604899", fontSize: "18px", fontWeight: "600", padding: "3px 20px", borderRadius: "20px" }}    >Events / Appointment</span> </p>
                    <p style={{ fontSize: "12px", fontWeight: "600" }} >Event Name</p>
                    <p style={{ fontSize: "20px", fontWeight: "600" }}> <input type="text" placeholder='Data Science Subject of First Semester' style={{border:"none" , borderBottom:"1px solid gray",width:"100%"}} /> </p>
                    <p className='d-flex m-0' style={{justifyContent:"space-between",fontSize:"12px" , fontWeight:"600"}} > <span>START DATE</span> <span>END DATE</span> </p>
                    <p className='d-flex m-0' style={{justifyContent:"space-between",color:"#604899",textDecoration:"underline"}}> <input type="date" /> <span><input type="date" /></span> </p>
                </Modal.Body>
                <div className='mx-auto my-3'>
                    <Button style={{background:"#604899"}} onClick={props.handleCloseEvent}>
                        Save
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default EventModalComponent
