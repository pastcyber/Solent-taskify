import logo from './logo.svg';
import './App.css';
import {BrowserRouter ,Routes, Route} from 'react-router-dom'
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Dashboard from './Pages/Dashboard/Dashboard';
import Pomodoro from './Pages/Pomodoro/Pomodoro';
import Projects from './Pages/Projects/Projects';
import Tasks from './Pages/Tasks/Tasks';
import Events from './Pages/Events/Events';


function App() {
  return (
    <div className="App" >
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/dashboard' element={<Dashboard/>}></Route>
        <Route path='/timer' element={<Pomodoro/>}></Route>
        <Route path='/projects' element={<Projects/>}></Route>
        <Route path='/tasks' element={<Tasks/>}></Route>
        <Route path='/events' element={<Events/>}></Route>
      </Routes> 
     </BrowserRouter>
    </div>
  );
}

export default App;
