import React, { Component } from 'react';

class PomodoroTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: 25,
      seconds: 0,
      isRunning: false,
    };
    this.timer = null;
  }

  componentWillUnmount() {
    this.resetTimer();
  }

  startTimer = () => {
    this.setState({ isRunning: true });
    this.timer = setInterval(this.tick, 1000);
  };

  pauseTimer = () => {
    this.setState({ isRunning: false });
    clearInterval(this.timer);
  };

  resetTimer = () => {
    this.pauseTimer();
    this.setState({ minutes: 25, seconds: 0 });
  };

  lapTimer = () => {
    const { minutes, seconds } = this.state;
    alert(`Lap: ${25 - minutes} minutes ${60 - seconds} seconds`);
  };

  tick = () => {
    const { minutes, seconds } = this.state;
    if (minutes === 0 && seconds === 0) {
      this.alertTimeOut();
      this.resetTimer();
    } else {
      if (seconds === 0) {
        this.setState({ minutes: minutes - 1, seconds: 59 });
      } else {
        this.setState({ seconds: seconds - 1 });
      }
    }
  };

  alertTimeOut = () => {
    alert('Time is up! Take a break.');
  };

  render() {
    const { minutes, seconds, isRunning } = this.state;

    return (
      <div>
        <div>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <button onClick={this.startTimer} disabled={isRunning}>
          Start
        </button>
        <button onClick={this.pauseTimer} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={this.resetTimer} disabled={isRunning}>
          Reset
        </button>
        <button onClick={this.lapTimer} disabled={!isRunning}>
          Lap
        </button>
      </div>
    );
  }
}

export default PomodoroTimer;
