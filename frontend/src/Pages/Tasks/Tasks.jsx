import React from 'react'
import Layout from '../../components/Layout';
import { useState, useRef, useEffect, CSSProperties  } from 'react';
import Calendar from 'react-calendar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import TodoModalComponent from '../../components/TodoModalComponent'
import Button from 'react-bootstrap/Button';
import EventModalComponent from '../../components/EventModalComponent'
import { auth } from '../../firebase';
import { deleteTodo, getTodosByDate, getAllDates } from '../../helper/TodoApi';
import TodoEditModal from '../../components/TodoEditModal';
import { convertDateFormat } from '../../Global/global'
import {getAllTodosWithCounts} from '../../helper/TodoApi'
import moment from 'moment';
let loadingGif = require("../../asset/images/giphy.gif");
ChartJS.register(ArcElement, Tooltip, Legend);


function Tasks() {
  const [value, setvalue] = useState(new Date());
  const [todos, settodos] = useState([])
  const [dates, SetallDates] = useState([])
  const [editTodo, seteditTodo] = useState({})
  const [loading, setLoading] = useState(false);
  const [count, setcount] = useState({});
  const [selectedDate, setSelectedDate] = useState(moment(Date.now()).format("YYYY-MM-DD"));
  const doughnutRef = useRef(null);
  const [totalCount, setTotalCount] = useState(0);
  const cutoutPercentage = 45;
  const data = {
    labels: [],
    datasets: [
      {
        label: 'Tasks',
        data: [count?.counts?.completed, count?.counts?.inProgress, count?.counts?.due],
        
        backgroundColor: [
          '#4187F1',
          '#11D43C',
          '#EEB931'
        ],
        borderColor: [
          '#4187F1',
          '#11D43C',
          '#EEB931'
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    setTotalCount(count?.counts?.total);
  }, [count])

  const onChange = (e) => {
    setLoading(true);
    setSelectedDate(convertDateFormat(e));
    getTodosByDate(convertDateFormat(e))
      .then(data => {
        settodos(data);
        setLoading(false);
      })
      .catch(err => {
        settodos([]);
        setLoading(false);
        console.log(err);
      })

    setvalue(e)
  }

  const fetchAllDates = async () => {
    try {
      const data = await getAllDates();
      console.log(data);
      SetallDates(data);
    } catch (err) {
      console.log(err);
    }
  }
  const fetchAllTodoCount = async () => {
    try {
      const data = await getAllTodosWithCounts();
      console.log(data,"count");
      setcount(data);
    } catch (err) {
      console.log(err);
    }
  }
  


  // Define a function to fetch and update todos
  const fetchAndSetTodos = async () => {
    setLoading(true);
    getTodosByDate(selectedDate)
      .then(data => {
        console.log(data);
        settodos(data);
        setLoading(false);

      })
      .catch(err => {
        settodos([]);
        console.log(err);
        setLoading(false);

      })
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [showEditTodo, setshowEditTodo] = useState(false);
  const handleCloseEditTodo = () => setshowEditTodo(false);
  const handleShowEditTodo = (todo) => {
    setshowEditTodo(true)
    seteditTodo(todo)
  };
  const user = auth.currentUser;
  console.log(user)
  useEffect(() => {
    fetchAllDates()
    fetchAndSetTodos();
    fetchAllTodoCount()
  }, []);

  const handleDeleteTodo = (todo_id) => {
    setLoading(true);
    deleteTodo(todo_id)
      .then(data => {
        console.log(data)
        fetchAndSetTodos();
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log(err)
      })

  }
  return (
    <Layout>
      {show && (
        <TodoModalComponent
          show={show}
          fetchAndSetTodos={fetchAndSetTodos}
          handleClose={handleClose}
        ></TodoModalComponent>
      )}
      {showEditTodo && (
        <TodoEditModal
          showEditTodo={showEditTodo}
          fetchAndSetTodos={fetchAndSetTodos}
          editTodo={editTodo}
          handleCloseEditTodo={handleCloseEditTodo}
        ></TodoEditModal>
      )}
      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-lg-3">
            <div className="task-left-box d-flex flex-column">
              <p
                className="text-left"
                style={{ fontSize: "28px", fontWeight: "600" }}
              >
                Manage Tasks
              </p>
              <div className="calender">
                <Calendar
                  onChange={onChange}
                  value={value}
                  tileClassName={({ date, view }) => {
                    if (
                      dates.find((x) => x === moment(date).format("YYYY-MM-DD"))
                    ) {
                      return "highlight";
                    }
                  }}
                />
              </div>
              <p
                className="text-left mt-3"
                style={{ fontSize: "28px", fontWeight: "600" }}
              > 
              {/* {console.log(count)} */}
                Summary {totalCount && `(Total Tasks - ${totalCount})`}
              </p>
              <div className="container-fluid">
                <div className="row chart-box">
                  <div className="col-lg-6 d-flex justify-content-center">
                    Total Tasks
                    <Doughnut
                      data={data}
                      options={{
                        responsive: false,
                        maintainAspectRatio: false,
                        cutout: cutoutPercentage,
                      }}
                      
                      ref={doughnutRef}
                    ></Doughnut>
                  </div>
                  <div className="col-lg-6 " style={{ alignItems: "center" }}>
                    <p style={{ display: "flex" }}>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <rect
                            x="0.910632"
                            y="0.491931"
                            width="24.2482"
                            height="24.2482"
                            rx="4.30211"
                            stroke="#4187F1"
                            stroke-width="0.782201"
                          />
                          <rect
                            x="3.64844"
                            y="3.22949"
                            width="18.7728"
                            height="18.7728"
                            rx="3.12881"
                            fill="#4187F1"
                          />
                        </svg>
                      </span>
                      <span className="mx-2">{count?.counts?.completed}</span>
                      <span>Completed</span>
                    </p>
                    <p style={{ display: "flex" }}>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <rect
                            x="0.910632"
                            y="1.00707"
                            width="24.2482"
                            height="24.2482"
                            rx="4.30211"
                            stroke="#11D43C"
                            stroke-width="0.782201"
                          />
                          <rect
                            x="3.64844"
                            y="3.74463"
                            width="18.7728"
                            height="18.7728"
                            rx="3.12881"
                            fill="#11D43C"
                          />
                        </svg>
                      </span>
                      <span className="mx-2">{count?.counts?.inProgress}</span>
                      <span style={{ whiteSpace: "pre" }}>In Progress</span>
                    </p>
                    <p style={{ display: "flex" }} className="m-0">
                      <span className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                        >
                          <rect
                            x="0.910632"
                            y="0.522448"
                            width="24.2482"
                            height="24.2482"
                            rx="4.30211"
                            stroke="#EEB931"
                            stroke-width="0.782201"
                          />
                          <rect
                            x="3.64844"
                            y="3.26001"
                            width="18.7728"
                            height="18.7728"
                            rx="3.12881"
                            fill="#EEB931"
                          />
                        </svg>
                      </span>
                      <span className="mx-2">{count?.counts?.due}</span>
                      <span>Pending</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <p
              className="d-flex"
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "28px", fontWeight: "600" }}>
                  {" "}
                  {moment(selectedDate, "YYYY-MM-DD").format("DD,MMMM")}
                </span>{" "}
                <span
                  style={{ fontSize: "40px", width: "10px", color: "#604899" }}
                >
                  {" "}
                  |{" "}
                </span>{" "}
                <span style={{ fontSize: "40px", fontWeight: "600" }}>
                  {moment(selectedDate, "YYYY-MM-DD").format("dddd")}
                </span>
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#604899",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleShow();
                }}
              >
                Add New Task <img width={"24px"} src="/svg/plus.svg" alt="" />
              </span>
            </p>

            <table className="my-4" style={{ width: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #b19dde" }}>
                  <th
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#877F9B",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#877F9B",
                    }}
                  >
                    Date{" "}
                  </th>
                  <th
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#877F9B",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#877F9B",
                    }}
                  >
                    Priority
                  </th>
                  <th
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#877F9B",
                    }}
                  >
                    Edit
                  </th>
                  <th
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#877F9B",
                    }}
                  >
                    Delete
                  </th>
                  <th
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      color: "#877F9B",
                    }}
                  >
                    Project
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading && todos?.length > 0 &&
                  todos?.map((todo) => (
                    <tr style={{ borderBottom: "1px solid #b19dde" }}>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          fontSize: "18px",
                          padding: "20px",
                          whiteSpace: "pre",
                        }}
                        className="flex-column"
                      >
                        <p className="text-left m-0">{todo?.todoData?.name}</p>
                      </td>
                      <td>
                        {todo?.todoData?.end_date}
                        <br />
                      </td>
                      <td style={{ whiteSpace: "pre" }}>
                        <span
                          className="mx-2"
                          style={{ fontSize: "16px", color: "#11D43C" }}
                        >
                          {todo?.todoData?.progress == "P" && "In Progress"}
                          {todo?.todoData?.progress == "C" && "Completed"}
                          {todo?.todoData?.progress == "D" && "Due"}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "pre" }}>
                        <span
                          className="mx-2"
                          style={{
                            fontSize: "14px",
                            color:
                              todo?.todoData?.priority == "H"
                                ? "red"
                                : todo?.todoData?.priority == "L"
                                ? "#49bf49"
                                : todo?.todoData?.priority == "M"
                                ? "#baba19"
                                : "",
                          }}
                        >
                          {todo?.todoData?.priority == "H" && "High Priority"}
                          {todo?.todoData?.priority == "L" && "Low Priority"}
                          {todo?.todoData?.priority == "M" && "Medium Priority"}
                        </span>
                      </td>
                      <td>
                        <span>
                          <img
                            src="/svg/edit.svg"
                            onClick={() => handleShowEditTodo(todo)}
                            alt=""
                          />{" "}
                        </span>
                      </td>
                      <td>
                        <span>
                          <img
                            src="/svg/delete.svg"
                            onClick={() => handleDeleteTodo(todo?.id)}
                            alt=""
                          />
                        </span>
                      </td>
                      <td>
                        <button className="project-left-btn">
                          {todo?.taskData?.name ? todo?.taskData?.name :'None'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {!loading && todos.length == 0 && `No Todo Items for ${(moment(selectedDate, "YYYY-MM-DD").format("MMMM DD, YYYY"))} `}
            {loading && (
              <img style={{width:100,height:100}} src={loadingGif} alt="wait until the page loads" />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Tasks
