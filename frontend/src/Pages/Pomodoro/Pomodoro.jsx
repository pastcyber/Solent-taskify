import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import PomodoroTimer from './PomodoroTimer'

function Pomodoro() {
    const [play, setplay] = useState(false)
    const [timer, setTimer] = useState(25 * 60); // Initial timer value in seconds
    const [isBreak, setIsBreak] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef();

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    useEffect(() => {
        if (timer === 0) {
            clearInterval(intervalRef.current);
            setIsBreak((prevIsBreak) => !prevIsBreak);
            setTimer(isBreak ? 25 * 60 : 5 * 60);
            alert("BREAK TIME! Please Enjoy!");
            setIsRunning(false);

        }
        // if(isBreak){
        // }
    }, [timer, isBreak]);

    const handleStart = () => {
        setIsRunning(true);
        setplay(true)
    };

    const handlePause = () => {
        setIsRunning(false);
        setplay(false)
    };

    const handleResume = () => {
        setIsRunning(true);
    };

    const handleReset = () => {
        clearInterval(intervalRef.current);
        setIsBreak(false);
        setTimer(25 * 60);
        setIsRunning(false);
        setplay(false);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (isBreak) {
            setIsRunning(true);
        }
    }, [isBreak])

    return (
        <Layout>
            <section style={{ minHeight: "100vh", background: "#231A37", color: "white" }}>
                <div className="container pt-4">
                    <div className="row">
                        <div className="col-lg-6">
                            <h2 style={{ fontSize: "48px" }} className='text-left'>Pomodoro Timer</h2>
                            <p style={{ textAlign: "left" }} className='my-3'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis beatae enim dolores. In praesentium laboriosam tenetur libero cumque id possimus nisi iure dignissimos a. Repudiandae cupiditate nesciunt optio fugiat tempore quae rem. Iste perspiciatis ad veniam doloremque eum excepturi impedit corrupti porro blanditiis. Voluptatem tempore, sapiente officiis magni quam suscipit libero fugit error fuga consequuntur at nesciunt velit animi non? Libero reiciendis molestias debitis doloremque! Omnis earum qui accusamus fuga esse quo expedita velit, deserunt error. Voluptatem vel, dolore iure, quas magni quae tenetur mollitia porro esse, adipisci modi soluta voluptas excepturi harum quis sit cumque accusantium doloremque enim a.</p>
                            <p className='text-left'> <img src="/svg/flower.svg" alt="" /></p>
                        </div>
                        <div className="col-lg-6 p-5">
                            <div className="timer-box p-3" style={{ border: "1px solid white ", borderRadius: "40px" }}>
                                <p className=''>Chooser a Duration - in minutes</p>
                                <div className='my-3 '>
                                    <button onClick={() => { setTimer(25 * 60); }}>25</button>
                                    <button onClick={() => { setTimer(50 * 60); }} >50</button>
                                </div>
                                <div className="circle d-flex" style={{ height: "281px", width: "281px", margin: "auto", borderRadius: "200px", border: "2px solid white", justifyContent: "center", alignItems: "center", fontSize: "64px", background: "linear-gradient(225deg, #231A37 -22.86%, #604899 149.73%)" }}>
                                    {formatTime(timer)}
                                </div>
                                <div className='my-4'>
                                    {
                                        play && <img src="/svg/pause.svg" onClick={handlePause} alt="" style={{ cursor: "pointer" }} />
                                    }
                                    {
                                        !play && <img src="/svg/play.svg" onClick={handleStart} alt="" style={{ cursor: "pointer" }} />
                                    }
                                    <img src="/svg/replay.svg" onClick={handleReset} alt="" style={{ cursor: "pointer" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Pomodoro
