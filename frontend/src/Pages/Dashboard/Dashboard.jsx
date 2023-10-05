import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Layout from '../../components/Layout';
import TodoModalComponent from '../../components/TodoModalComponent'
import Button from 'react-bootstrap/Button';
import { useState } from 'react'
import EventModalComponent from '../../components/EventModalComponent'
import { auth } from '../../firebase';
import { deleteTodo, getTodosByDate } from '../../helper/TodoApi';
import TodoEditModal from '../../components/TodoEditModal';
import moment from "moment";
import {Link} from "react-router-dom"
import { getEvents, deleteEvent } from '../../helper/eventApi';
import { getTasks ,deleteTask} from '../../helper/TaskApi';
import { getTodoByTaskId } from '../../helper/TodoApi';
import TaskEditModal from '../../components/TaskEditModal'
let loadingGif = require("../../asset/images/giphy.gif");

function Dashboard() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEvent, setshowEvent] = useState(false);
  const handleCloseEvent = () => setshowEvent(false);
  const handleShowEvent = () => setshowEvent(true);

  const [tasks, setTasks] = useState([]);

  const [showEditTodo, setshowEditTodo] = useState(false);
  const handleCloseEditTodo = () => setshowEditTodo(false);
  const handleShowEditTodo = (todo) => {
    setshowEditTodo(true);
    seteditTodo(todo);
  };

  // Loaders
  const [todoLoading, setTodoLoading] = useState(false);
  const [eventLoader, setEventLoader] = useState(false);
  const [taskEdit, settaskEdit] = useState({})


  const [showEditProject, setShowEditProject] = useState(false);
  const handleCloseEditProject = () => setShowEditProject(false);
  const handleShowEditProject = (task) => {
      setShowEditProject(true)
      settaskEdit(task)
  };



  const user = auth.currentUser;
  console.log(user);

  const [todos, settodos] = useState([]);
  const [editTodo, seteditTodo] = useState({});
  const [myEvents, setMyEvents] = useState([]);

  const [projectTodos, setProjectTodos] = useState([])

  const [selectedProject, setSelectedProject] = useState(null);

  // Define a function to fetch and update todos
  const fetchAndSetTodos = async () => {
    setTodoLoading(true);
    settodos([]);
    getTodosByDate(moment(Date.now()).format("YYYY-MM-DD"))
      .then((data) => {
        console.log(data);
        settodos(data);
        setTodoLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setTodoLoading(false);
      });
  };

  const fetchEvents = async (userId) => {
    setEventLoader(true);
    getEvents()
      .then((data) => {
        setEventLoader(false);
        console.log(data);
        if (data.error) {
          setMyEvents([]);
        } else {
          setMyEvents(data);
        }
      })
      .catch((err) => {
        setEventLoader(false);
        console.log(err);
      });
  };

  //

  const fetchAndSetTasks = async () => {
    try {
      const data = await getTasks(); // Replace with your task fetching function
      console.log(data);
      setTasks(data); // Replace with your task state setter
    } catch (err) {
      console.log(err);
    }
  };

  // Define a function to fetch and update tasks
  const fetchTodoByTask = async (task_id) => {
    // setLoading(true);
    getTodoByTaskId(task_id)
      .then((data) => {
        // setLoading(false);
        console.log(data);
        setProjectTodos(data);
      })
      .catch((err) => {
        // setLoading(false);

        console.log(err);
      });
  };

  useEffect(() => {
    fetchAndSetTasks();
    fetchAndSetTodos();
    fetchEvents();
  }, []);

  useEffect(() => {
    // console.log(selectedProject);
    if(selectedProject){
      fetchTodoByTask(selectedProject)
    }
  }, [selectedProject]);

  const handleDeleteTodo = (todo_id) => {
    deleteTodo(todo_id)
      .then((data) => {
        console.log(data);
        fetchAndSetTodos();
        window.location.reload()
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteEvents = (id) => {
    deleteEvent(id)
      .then((sucess) => {
        fetchEvents();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeleteTask = (task) => {
    deleteTask(task?.id) // Replace with your task deletion function
      .then((data) => {
        console.log(data);
        fetchAndSetTasks(); // Call the fetchAndSetTasks function to refresh the task list
          // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
      {showEvent && (
        <EventModalComponent
          showEvent={showEvent}
          handleCloseEvent={handleCloseEvent}
        ></EventModalComponent>
      )}
        {showEditProject && (
            <TaskEditModal
              taskEdit={taskEdit}
              showEditProject={showEditProject}
              fetchAndSetTasks={fetchAndSetTasks}
              handleCloseEditProject={handleCloseEditProject}
            ></TaskEditModal>
          )}
      <div
        className="container-fluid mt-3"
        style={{ height: "Calc(100vh - 100px)" }}
      >
        <div className="row">
          <div className="col-lg-4 d-flex flex-column p-3">
            <button
              style={{
                width: "40%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#604899",
                borderRadius: "30px",
                border: "none",
                padding: "7px 50%px",
                color: "white",
              }}
              onClick={() => {
                handleShow();
              }}
            >
              {" "}
              <img src="/svg/add.svg" alt="" />
              Add New
            </button>
            <p className="text-left mt-3" style={{ fontSize: "28px" }}>
              {moment(Date.now()).format("DD, MMMM")}|{" "}
              <span style={{ fontSize: "40px" }}>
                {moment(Date.now()).format("ddd")}
              </span>
            </p>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-11 shadow-box p-0 pt-2 pb-3 ">
                  <p className="text-center todo-top-text">To-Do-List</p>

                  {!todoLoading &&
                    todos &&
                    todos.length > 0 &&
                    todos
                      ?.filter((item, index) => index < 3)
                      ?.map((todo) => (
                        <div
                          className="d-flex  px-2"
                          style={{
                            justifyContent: "space-between ",
                            background: "#F3F0F8",
                          }}
                        >
                          <div className="left-text ">
                            {todo?.todoData?.name}
                          </div>
                          <div className="right-btn">
                            <span>
                              <img
                                src="/svg/edit.svg"
                                onClick={() => handleShowEditTodo(todo)}
                                alt=""
                              />{" "}
                            </span>
                            <span>
                              <img
                                src="/svg/delete.svg"
                                onClick={() => handleDeleteTodo(todo?.id)}
                                alt=""
                              />
                            </span>
                          </div>
                        </div>
                      ))}
                  {todoLoading && (
                    <img
                      style={{ width: 20, height: 20 }}
                      src={loadingGif}
                      alt="wait until the page loads"
                    />
                  )}
                  {!todoLoading &&
                    todos &&
                    todos.length == 0 &&
                    "No Todos For Today"}
                  <Link to="/tasks">
                    <p className="text-center todo-top-text pt-2">Show All</p>
                  </Link>
                </div>
              </div>
            </div>

            <p className="event-heading my-3">Events & Apointments</p>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-11 shadow-box">
                  <div className="event-box d-flex flex-column p-3" style={{maxHeight:"270px", overflowY:"auto"}}>
                    {!eventLoader &&
                      myEvents
                        .filter((item, index) => index < 3)
                        ?.map((myEvent) => (
                          <>
                            <div className="event-box">
                              <div
                                className="d-flex"
                                style={{ justifyContent: "space-between" }}
                              >
                                <span style={{ fontSize: "28px" }}>
                                  {moment(myEvent.start).format("DD MMMM")}{" "}
                                  <span>
                                    <img src="/svg/star.svg" alt="" />
                                  </span>
                                </span>
                                <span
                                  onClick={() => {
                                    deleteEvents(myEvent.id);
                                  }}
                                >
                                  <img src="/svg/delete.svg" alt="" />
                                </span>
                              </div>
                              <p
                                className="text-left m-0"
                                style={{ fontSize: "14px" }}
                              >
                                {`${moment(myEvent.start).format(
                                  "h:mm a"
                                )} -  ${moment(myEvent.end).format("h:mm a")}`}
                              </p>
                              <p
                                className=" text-left m-0"
                                style={{ fontSize: "20px" }}
                              >
                                {myEvent.text}
                              </p>
                            </div>
                            <div className="line mt-2"></div>
                          </>
                        ))}
                    {!eventLoader &&
                      myEvents.length == 0 &&
                      "No Events For Today"}
                    {eventLoader && (
                      <div className="d-flex justify-content-center">
                        <img
                          style={{ width: 20, height: 20 }}
                          src={loadingGif}
                          alt="wait until the page loads"
                        />
                      </div>
                    )}
                    <Link to="/events">
                      <p className="text-center todo-top-text pt-2">Show All</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 d-flex flex-column p-4">
            <div
              className="d-flex"
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "28px", fontWeight: "600" }}>
                Projects Progress
              </span>
              {/* <span>
                <span className="mx-2">Filter By</span>{" "}
                <div className="vertical-line"></div>
                <span className="mx-2 " style={{ color: "#11D43C" }}>
                  In Progress <div className="progress-circle">5</div>
                </span>
                <span className="mx-2" style={{ color: "#F5734D" }}>
                  Pending <div className="pending-circle">6</div>
                </span>
                <span className="mx-2" style={{ color: "#4187F1" }}>
                  Completed <div className="completed-circle">7</div>
                </span>
              </span> */}
            </div>
            <div style={{ height: "550px", overflow: "scroll" }}>
              <table className="my-4">
                <thead>
                  <tr style={{ borderBottom: "1px solid #b19dde" }}>
                    <th style={{ display: "flex", justifyContent: "left" }}>
                      Project name
                    </th>
                    <th style={{}}>Progress</th>
                    <th style={{}}>Due date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr style={{ borderBottom: "1px solid #b19dde" }}>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          flexDirection: "column",
                          padding: "20px",
                          whiteSpace: "normal",
                          maxWidth:"295px"
                        }}
                      >
                        <p className="text-left" style={{ fontSize: "20px" }}>
                          {task?.data?.name}
                        </p>
                        {selectedProject === task?.id && (
                          <>
                            <p className="text-left">
                              <b>Description</b>
                            </p>
                            <p className="text-left">
                              {task?.data?.description}
                            </p>
                            <p
                              className="d-flex"
                              style={{ justifyContent: "space-between" }}
                            >
                              <span>
                                <img src="/svg/edit.svg" onClick={()=>{handleShowEditProject(task)}} alt="" />
                                Edit{" "}
                              </span>{" "}
                              <span>
                                <img onClick={()=>{handleDeleteTask(task)}} src="/svg/delete.svg" alt="" />
                                Delete
                              </span>
                            </p>
                          </>
                        )}
                      </td>
                      <td style={{maxWidth:"500px"}}>
                        <p
                          className="d-flex"
                          style={{
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            <span className="mx-2" style={{ fontSize: "32px" }}>
                              {Math.round(
                                (parseInt(task.completedTodos) / parseInt(task.totalTodos) +
                                  Number.EPSILON) *
                                  100
                              )}{" "}
                              %
                            </span>
                            <span
                              className="mx-2"
                              style={{ fontSize: "16px", color: "#11D43C" }}
                            >
                              {task?.data?.progress == "P" && "In Progress"}
                              {task?.data?.progress == "C" && "Completed"}
                              {task?.data?.progress == "D" && "Due"}
                            </span>
                            <span
                              style={{
                                color:
                                  task?.data?.priority == "H"
                                    ? "red"
                                    : task?.data?.priority == "L"
                                    ? "#49bf49"
                                    : task?.data?.priority == "M"
                                    ? "#baba19"
                                    : "",
                              }}
                            >
                              {task?.data?.priority == "H" && "High Priority"}
                              {task?.data?.priority == "L" && "Low Priority"}
                              {task?.data?.priority == "M" && "Medium Priority"}
                            </span>
                          </span>
                          <span
                            onClick={() => {
                              console.log("heello");
                              console.log(task?.id);
                              // setSelectedProject(task?.id);

                              if (selectedProject == task?.id) {
                                setSelectedProject(null);
                              } else {
                                setSelectedProject(task?.id);
                              }
                            }}
                          >
                            Expand <img src="/svg/expand.svg" alt="" />
                          </span>
                        </p>
                        <p>
                          <div className="project-perc">
                            {" "}
                            <div
                              style={{
                                width: `${Math.round(
                                  (task.completedTodos / task.totalTodos +
                                    Number.EPSILON) *
                                    100
                                )}%`,
                              }}
                              className="project-fill"
                            ></div>
                          </div>
                        </p>
                        <div className="container-fluid">
                          {selectedProject === task?.id && (
                            <div className="row">
                              {selectedProject === task?.id && projectTodos.map((todo) => (
                                <p
                                  className="d-flex "
                                  style={{ alignItems: "center" }}
                                >
                                  {/* <span className="mr-2">
                                    <input
                                      type="checkbox"
                                      style={{
                                        width: "25px",
                                        height: "25px",
                                        borderRadius: "10px",
                                        border: "10px solid purple",
                                      }}
                                    />{" "}
                                  </span> */}
                                  <span className="mx-3">
                                    {todo?.todoData?.name}
                                  </span>
                                  <span
                                    className="mx-2"
                                    style={{
                                      fontSize: "16px",
                                      color: "#11D43C",
                                    }}
                                  >
                                    {todo?.todoData?.progress == "P" &&
                                      "In Progress"}
                                    {todo?.todoData?.progress == "C" &&
                                      "Completed"}
                                    {todo?.todoData?.progress == "D" && "Due"}
                                  </span>
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
                                    {todo?.todoData?.priority == "H" &&
                                      "High Priority"}
                                    {todo?.todoData?.priority == "L" &&
                                      "Low Priority"}
                                    {todo?.todoData?.priority == "M" &&
                                      "Medium Priority"}
                                  </span>
                                  <span className="mx-2">
                                    <img src="/svg/edit.svg" alt="" onClick={() => handleShowEditTodo(todo)} />
                                  </span>
                                  <span>
                                    <img src="/svg/delete.svg" alt="" onClick={() => handleDeleteTodo(todo?.id)} />
                                  </span>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {task?.data?.end_date
                          ? moment(task?.data?.end_date, "YYYY-MM-DD").format(
                              "DD/MM/YYYY"
                            )
                          : "none"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard
