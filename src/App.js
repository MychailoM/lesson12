import React, { Component } from "react";
import styled from "styled-components";




const AppContainer = styled.div`
  
  background-color: #121212;
  color: #e0e0e0;
  min-height: 100vh;
  padding: 32px;
`;

const TimerValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  background-color: #1e1e1e;
  border: 2px solid #00bcd4;
  color: #00bcd4;
  border-radius: 12px;
  padding: 12px 24px;
  text-align: center;
  width: fit-content;
  margin: 0 auto 16px;
  transition: all 0.3s ease-in-out;
`;

const Button = styled.button`
  background-color: transparent;
  color: #00bcd4;
  border: 2px solid #00bcd4;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00bcd4;
    color: #121212;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalBox = styled.div`
  background-color: #1e1e1e;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.3);
  position: relative;
  width: 90%;
  max-width: 400px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  color: #ff5252;
  border: none;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #1a1a1a;
  color: #e0e0e0;
  width: 70%;
  margin-right: 8px;
`;

const AddTaskBtn = styled(Button)`
  padding: 10px 16px;
`;

const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 16px;
`;

const TaskItem = styled.li`
  background-color: #232323;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteBtn = styled.button`
  background-color: #ff5252;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e53935;
  }
`;

const StartStopBtn = styled(Button)`
  margin-top: 12px;
  margin-left: 50%;
  transform: translateX(-50%);
  margin-bottom: 12px;
`;



//3 задача(таймер)

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
    };
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState((prevState) => ({
        time: prevState.time + 1,
      }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <TimerValue>{this.state.time}</TimerValue>;
  }
}

//1 задача(модалка)

class Modal extends Component {
  componentDidMount() {
    document.addEventListener("keydown", this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKey);
  }

  handleKey = (e) => {
    if (e.key === "Escape") {
      this.props.onClose();
    }
  };

  render() {
    const { onClose, children, isOpen } = this.props;
    if (!isOpen) return null;

    return (
      <ModalBackdrop onClick={onClose}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={onClose}>×</CloseBtn>
          {children}
        </ModalBox>
      </ModalBackdrop>
    );
  }
}

//3 задача(TO DO LIST)

class ToDo extends Component {
  state = {
    tasks: [],
    newTask: "",
  };

  componentDidMount() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      this.setState({ tasks: JSON.parse(saved) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tasks !== this.state.tasks) {
      localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
    }
  }

  add = () => {
    const { newTask, tasks } = this.state;
    if (newTask.trim() === "") return;

    this.setState({
      tasks: [...tasks, newTask],
      newTask: "",
    });
  };

  delete = (index) => {
    const updatedTasks = [...this.state.tasks];
    updatedTasks.splice(index, 1);
    this.setState({ tasks: updatedTasks });
  };

  render() {
    return (
      <>
        <div>
          <Input
            placeholder="Enter task..."
            value={this.state.newTask}
            onChange={(e) => this.setState({ newTask: e.target.value })}
          />
          <AddTaskBtn onClick={this.add}>Add</AddTaskBtn>
        </div>

        <TaskList>
          {this.state.tasks.map((task, index) => (
            <TaskItem key={index}>
              {task}
              <DeleteBtn onClick={() => this.delete(index)}>Delete</DeleteBtn>
            </TaskItem>
          ))}
        </TaskList>
      </>
    );
  }
}

//App

class App extends Component {
  state = {
    timerShow: true,
    show: false,
  };

  toggle = () => {
    this.setState((prevState) => ({
      timerShow: !prevState.timerShow,
    }));
  };

  openModal = () => {
    this.setState({ show: true });
  };

  closeModal = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <AppContainer>
        <StartStopBtn onClick={this.openModal}>Open Modal</StartStopBtn>
        <Modal isOpen={this.state.show} onClose={this.closeModal}>
          <StartStopBtn onClick={this.toggle}>
            {this.state.timerShow ? "Stop" : "Start"}
          </StartStopBtn>
          {this.state.timerShow && <Timer />}
        </Modal>

        <h2>ToDo List</h2>
        <ToDo />
      </AppContainer>
    );
  }
}

export default App;
