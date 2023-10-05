import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout';
import TodoModalComponent from '../../components/TodoModalComponent'
import ModalComponent from '../../components/ModalComponent';
import { deleteTask, getTasks } from '../../helper/TaskApi';
import TaskEditModal from '../../components/TaskEditModal';
import { getTodoByTaskId } from '../../helper/TodoApi';
import Button from 'react-bootstrap/Button';
import EventModalComponent from '../../components/EventModalComponent'
import { auth } from '../../firebase';
import { deleteTodo, getTodos } from '../../helper/TodoApi';
import TodoEditModal from '../../components/TodoEditModal';
let loadingGif = require("../../asset/images/giphy.gif");

function Projects() {

    const [showProjectModal, setshowProjectModal] = useState(false);
    const handleCloseProjectModal = () => setshowProjectModal(false);
    const handleShowProjectModal = () => setshowProjectModal(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showEditTodo, setshowEditTodo] = useState(false);
    const handleCloseEditTodo = () => setshowEditTodo(false);
    const handleShowEditTodo = (todo) => {
        console.log(todo,"efx")
      setshowEditTodo(true) 
      seteditTodo(todo)
    };

    const [showEditProject, setShowEditProject] = useState(false);
    const handleCloseEditProject = () => setShowEditProject(false);
    const handleShowEditProject = (task) => {
        setShowEditProject(true)
        settaskEdit(task)
    };

    const user = auth.currentUser;
    console.log(user)

    const [tasks, settasks] = useState([])
    const [todos, settodos] = useState([])
    const [taskEdit, settaskEdit] = useState({})
    const [editTodo, seteditTodo] = useState({})

    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projectLoader, setProjectLoader] = useState(false)

    // Define a function to fetch and update tasks
    const fetchAndSetTasks = async () => {
        setProjectLoader(true);
        getTasks()
            .then((data) => {
            console.log(data);
            settasks(data);
            setProjectLoader(false);
            })
            .catch((err) => {
                setProjectLoader(false)
            console.log(err);
            });
    };

    // Define a function to fetch and update tasks
    const fetchTodoByTask = async (task_id) => {
      setLoading(true);
      getTodoByTaskId(task_id)
        .then((data) => {
          setLoading(false);
          console.log(data);
          settodos(data);
        })
        .catch((err) => {
          setLoading(false);

          console.log(err);
        });
    };

    useEffect(() => {
        // Call the function on component mount and whenever you want to trigger a re-fetch
        fetchAndSetTasks();
    }, []);

    const handleDeleteTask = (task) => {
      deleteTask(task?.id) // Replace with your task deletion function
        .then((data) => {
          console.log(data);
          fetchAndSetTasks(); // Call the fetchAndSetTasks function to refresh the task list
            window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    // Define a function to fetch and update todos
    const fetchAndSetTodos = async () => {
      try {
        const data = await getTodos();
        console.log(data);
        settodos(data);
      } catch (err) {
        console.log(err);
      }
    };
    const handleDeleteTodo = (todo_id) => {
      deleteTodo(todo_id)
        .then((data) => {
          console.log(data);
          fetchAndSetTodos();
        })
        .catch((err) => {
          console.log(err);
        });
    };
    

    useEffect(() => {
        console.log(selectedProject);
    }, [selectedProject])
    return (
      <>
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

          {showProjectModal && (
            <ModalComponent
              showProjectModal={showProjectModal}
              fetchAndSetTasks={fetchAndSetTasks}
              handleCloseProjectModal={handleCloseProjectModal}
            ></ModalComponent>
          )}

          {showEditProject && (
            <TaskEditModal
              taskEdit={taskEdit}
              showEditProject={showEditProject}
              fetchAndSetTasks={fetchAndSetTasks}
              handleCloseEditProject={handleCloseEditProject}
            ></TaskEditModal>
          )}

          <div className="container-fluid my-3" style={{height: "calc(100vh - 180px)"}}>
            <div className="row">
              <div className="col-lg-3">
                <p style={{ fontSize: "28px", fontWeight: "600" }}>Projects</p>
                <div style={{height:"68vh" ,overflowY:"auto"}}>
                  {!projectLoader && tasks && tasks.length > 0 && tasks?.map((task) => (
                    <div
                      className="project-left-box d-flex flex-column"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        fetchTodoByTask(task?.id);
                        if(selectedProject == task?.id){
                            setSelectedProject(null);
                        }else{
                            setSelectedProject(task?.id);
                        }
                      }}
                    >
                      <p
                        className="d-flex"
                        style={{ justifyContent: "space-between" }}
                      >
                        <span style={{ fontSize: "20px", textAlign: "left" }}>
                          {task?.data?.name}
                        </span>{" "}
                        <span>
                          <img src="/svg/expand.svg" alt="" />
                        </span>
                      </p>
                      <div style={{display:task.id === selectedProject ? "block" : "none"}}>
                      <p
                        className="d-flex"
                        style={{ justifyContent: "space-between" }}
                      >
                        <span>
                          <button className="project-left-btn">
                            {`${task.completedTodos}/${task.totalTodos} Task Done`}
                          </button>
                        </span>{" "}
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
                      </p>
                      
                        <p className="text-left">
                          <b>Description</b>
                        </p>
                        <p className="text-left">{task?.data?.description}</p>
                        <p
                          className="d-flex"
                          style={{ justifyContent: "space-between" }}
                        >
                          <span onClick={() => handleShowEditProject(task)}>
                            <img src="/svg/edit.svg" alt="" />
                            Edit{" "}
                          </span>{" "}
                          <span
                            onClick={() => {
                              handleDeleteTask(task);
                            }}
                          >
                            <img src="/svg/delete.svg" alt="" />
                            Delete
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                  {!projectLoader && tasks?.length == 0 && "You have not added Any Projects"}
                  {projectLoader &&  <img
                    style={{ width: 100, height: 100 }}
                    src={loadingGif}
                    alt="wait until the page loads"
                  />}
                </div>
              </div>
              <div className="col-lg-9">
                <p
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
            
                  <span className="project-right-box-btn" style={{visibility:selectedProject ? "visible" : "hidden"}}>
                    TOTAL TASKS - {todos? todos.length : "0"}
                  </span>
                  <span
                    onClick={handleShowProjectModal}
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#604899",
                      cursor: "pointer",
                    }}
                  >
                    Add New Project{" "}
                    <img width={"24px"} src="/svg/plus.svg" alt="" />
                  </span>
                </p>
                {!loading && selectedProject && (
                  <table className="my-4" style={{ width: "100%" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #b19dde" }}>
                        <th style={{ display: "flex", justifyContent: "left" }}>
                          Name
                        </th>
                        <th style={{}}>Status</th>
                        <th style={{}}>Priority</th>
                        <th style={{}}>Edit</th>
                        <th style={{}}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todos?.map((todo) => (
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
                            <p className="text-left m-0">
                              {todo?.todoData?.name}
                            </p>
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#877F9B",
                                margin: "0px",
                              }}
                              className="text-left"
                            >
                              {" "}
                              {todo?.todoData?.end_date}
                            </p>
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
                                  todo?.todoData?.progress == "H"
                                    ? "red"
                                    : todo?.todoData?.progress == "L"
                                    ? "#49bf49"
                                    : todo?.todoData?.progress == "M"
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
                          </td>
                          <td>
                            <img
                              src="/svg/edit.svg"
                              onClick={() => handleShowEditTodo(todo)}
                              alt=""
                            />
                          </td>
                          <td>
                            <img
                              src="/svg/delete.svg"
                              alt=""
                              onClick={() => handleDeleteTodo(todo?.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {!loading && !selectedProject && "Please Select A Project"}
                {loading && (
                  <img
                    style={{ width: 100, height: 100 }}
                    src={loadingGif}
                    alt="wait until the page loads"
                  />
                )}
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
}

export default Projects
