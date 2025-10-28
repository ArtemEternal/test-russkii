import {
  Route,
  Routes,
  BrowserRouter,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import "./App.css";
import inst1 from './inst10.jpg';
import inst2 from './inst15.jpg';
import inst3 from './inst20.jpg';
import inst4 from './inst4.png';

function Authorization() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailDirty, setEmailDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [emailError, setEmailError] = useState("Email is so bad.");
  const [passwordError, setPasswordError] = useState("Password is so bad.");
  const [validForm, setValidForm] = useState(false);
  const [role, setRole] = useState("student");

  useEffect(() => {
    if (passwordError || emailError) {
      setValidForm(false);
    } else {
      setValidForm(true);
    }
  }, [passwordError, emailError]);

  const emailHandler = (e) => {
    setEmail(e.target.value);
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(e.target.value).toLocaleLowerCase())) {
      setEmailError("Invalid email");
    } else {
      setEmailError("");
    }
  };

  const passwordHandler = (p) => {
    setPassword(p.target.value);
    if (p.target.value.length < 5 || p.target.value.length > 10) {
      setPasswordError("Password must include from 5 to 10 symbols");
    } else {
      setPasswordError("");
    }
  };

  const handleBlur = (e) => {
    switch (e.target.name) {
      case "email":
        setEmailDirty(true);
        break;
      case "password":
        setPasswordDirty(true);
        break;
    }
  };

  const handleRole = (r) => {
    setRole(r.target.value);
  };

  const submitRegistre = (e) => {
    e.preventDefault();
    console.log({ email, password, role });
    fetch("http://localhost:3001/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password, role: role }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success == false) {
          console.log("error");
        } else if (r.role == "student") {
          navigate("/student");
        } else if (r.role == "teacher") {
          navigate("/teacher");
        }
      });
  };

  const navigate = useNavigate();

  console.log(role);

  return (
    <>
      <div className="authorizationbox">
        <form onSubmit={submitRegistre} className="authform">
          <h1>Регистрация:</h1>
          {emailDirty && emailError && (
            <div style={{ color: "red" }}>{emailError}</div>
          )}
          <input
            onChange={(e) => emailHandler(e)}
            value={email}
            onBlur={(e) => handleBlur(e)}
            placeholder="your@email.ru"
            type="email"
            name="email"
          ></input>
          {passwordDirty && passwordError && (
            <div style={{ color: "red" }}>{passwordError}</div>
          )}
          <input
            onChange={(p) => passwordHandler(p)}
            value={password}
            onBlur={(e) => handleBlur(e)}
            placeholder="pa****rd"
            type="password"
            name="password"
          ></input>
          <button disabled={!validForm} type="submit" className="regbut">
            Registration
          </button>
          <div className="navent">
            <Link to="/enterance">Войти</Link>
          </div>
          <div className="chrole">
            <label>
              <input
                type="radio"
                value="student"
                checked={role === "student"}
                onChange={handleRole}
              />
              Ученик
            </label>
            <label>
              <input
                type="radio"
                value="teacher"
                checked={role === "teacher"}
                onChange={handleRole}
              />
              Учитель
            </label>
            {/*<label>
              <input
                type="radio"
                value="creator"
                checked={role === "creator"}
                onChange={handleRole}
              />
              Креатор
            </label>*/}
          </div>
        </form>
      </div>
    </>
  );
}

function Enterance() {
  const submitRegister = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success == false) {
          console.log("error");
        } else if (r.role == "student") {
          navigate("/student");
        } else {
          navigate("/teacher");
        }
      });
  };

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="enterancebox">
      <form onSubmit={submitRegister} className="entform">
        <h1>Вход:</h1>
        <input
          className="input"
          placeholder="login"
          onChange={emailHandler}
        ></input>
        <input
          className="input"
          placeholder="pa****rd"
          onChange={passwordHandler}
        ></input>
        <button className="entbut">Войти</button>
        <div className="navaut">
          <Link to="/authorization">Авторизация</Link>
        </div>
      </form>
    </div>
  );
}

function MovableButton() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const docWidth = document.documentElement.clientWidth;
      const docHeight = document.documentElement.clientHeight;

      let newX = e.clientX - buttonRef.current.offsetWidth / 2;
      let newY = e.clientY - buttonRef.current.offsetHeight / 2;

      newY = Math.max(
        0,
        Math.min(newY, docHeight - buttonRef.current.offsetHeight)
      );
      newX = Math.max(
        0,
        Math.min(newX, docWidth - buttonRef.current.offsetWidth)
      );

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const Logout = async () => {
    await fetch("http://localhost:3001/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then((r) => {
      if (r.success === false) {
        alert("logout error");
      } else {
        console.log("you have successfully logged out");
        navigate("/enterance");
      }
    });
  };

  const navigate = useNavigate();

  return (
    <button
      ref={buttonRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: "grab",
      }}
      onMouseDown={() => setIsDragging(true)}
      onDoubleClick={Logout}
    >
      ⭠
    </button>
  );
}

function /*desctopview*/ StudentViewApp({rooms}) {
  const [user, setUser] = useState({});
console.log(user.id,"usrer")

// рабочий фетч, но временно не нужен
 /* useEffect(() => {
    fetch("http://localhost:3001/getuser", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success == false) {
          console.log("error");
        } else {
          setUser(r);
        }
      });
  }, []);*/

  return (
    <>
      <div className="app-st-container">
        <div className="st-app-wrapper">
          <StHeader user={user} />
          <StNavbar user={user} rooms={rooms}/>
        </div>
        {/*<MovableButton />*/}
      </div>
    </>
  );
}

function /*desctopview*/ TeacherViewApp({ rooms, setRooms }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/getuser", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success == false) {
          console.log("error");
        } else {
          setUser(r);
        }
      });
  }, []);

  return (
    <>
      <div className="app-t-container">
        <div className="t-app-wrapper">
          <THeader rooms={rooms}/>

          <TNavbar user={user} rooms={rooms} setRooms={setRooms} />
        </div>
        <MovableButton />
      </div>
    </>
  );
}

function TNavbar({rooms, setRooms}) {
  //const [rooms, setRooms] = useState([]);
  const [homework, setHomework] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [alertMessage, setAlertMessage] = useState("Хочешь просто стереть комнату?");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [homeworkSelectedId, setHomeworkSelectedId] = useState(null);
  console.log("selectedhwid", homeworkSelectedId);
  console.log("riimId:", selectedRoomId)
  const [isVisibleAdd, setIsVisibleAdd] = useState(true);
  const [isVisibleChange, setIsVisibleChange] = useState(true);
  const [changeRoomName, setChangeRoomName] = useState("");
  const [isVisibleChangeSymbol, setIsVisibleChangeSymbol] = useState(true);
  const [originalRoomName, setOriginalRoomName] = useState("");
  const [isVisibleHomeWork, setIsVisibleHomeWork] = useState(false);
  const [isVisibleHomeworkCreate, setIsVisibleHomeworkCreate] = useState(true);
  const [exersize, setExersize] = useState([]);
  const [exersizeBlock, setExersizeBlock] = useState([]);
  const [IsNex, setIsNex] = useState(false);
  const [selectedRoomIdForCH, setSelectedRoomIdForCH] = useState(null);
  //const [word, setWord] = useState("");
  //const [radio, setRadio] = useState("");
  //const [text, setText] = useState("");
  const [isVis, setIsVis] = useState(true);
  const [isValidHw, setIsvalidHw] = useState(true);
  const [homeworkHeader, setHomeworkHeader] = useState("");
  const [isVisHWNonInput,  setIsVisHWNonInput] = useState(false);
  const [statusCompleted, setStatusCompleted] = useState(false);
  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [studentsInfo, setStudentsInfo] = useState([]);

  console.log("exersizeBlock:", exersizeBlock);

  const AddRoomRef = useRef(null);
  const ChangeName = useRef(null);
  const HomeworkHeaderRef = useRef(null);

  const HandleKeyDownHW = (event) => {
    if (event.key === "Enter") {
      setIsVisHWNonInput(true);
    }
  };

/*
  <script src="https://rawgit.com/WeiChiaChang/Easter-egg/master/easter-eggs-collection.js"></script>
  const handleKeyDownWW = (event) => {
    const currentValue = homeworkHeader + event.key;
    for (const keyword in collection) {
      if (currentValue.endsWith(keyword)) {
        collection[keyword]();
        setInputValue(currentValue.slice(0, -keyword.length));
        break;
      }
    }
  };*/

  useEffect(() => {
    if (!isVisibleChange && ChangeName.current) {
      ChangeName.current.focus();
    }
  }, [isVisibleChange]);

  useEffect(() => {
    if (!isVisibleAdd && AddRoomRef.current) {
      AddRoomRef.current.focus(); // Фокусируем инпут после рендеринга
    }
  }, [isVisibleAdd]);

  const HandleKeyDown = (event) => {
    if (event.key === "Enter") {
      ChangeRN();
    }
  };

  const handleBlur = () => {
    setIsVisibleChange(true);
    setIsVisibleChangeSymbol(true);
    setSelectedRoomIdForCH(null);
  };

 /* useEffect(() => {
    fetch("http://localhost:3001/getrooms", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success === false) {
          console.log("getrooms error");
        } else {
          setRooms(r.rooms);
        }
      });
  }, []);*/

  const AddRoom = () => {
    console.log("Sending request with cookie token:", document.cookie);
    fetch("http://localhost:3001/postroom", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newRoomName: newRoomName }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success === false) {
          console.log("AddRoom error");
        } else {
          setRooms(r.rooms);
        }
      });
  };

  const ChangeRN = () => {
    console.log("Функция ChangeRN вызвана");
    if (changeRoomName === originalRoomName) {
      console.log("Название не изменилось, закрываем режим редактирования");
      setIsVisibleChange(true);
      setIsVisibleChangeSymbol(true);
      return;
    }

    setIsVisibleChangeSymbol(true);
    setIsVisibleChange(true);
    setSelectedRoomIdForCH(null);

    console.log("Название изменилось, отправляем запрос на сервер");
    fetch("http://localhost:3001/changern", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        changeRoomName: changeRoomName,
        room: { id: selectedRoomId },
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        setRooms(r.rooms);
      });
  };

  const DeleteRoom = (roomId) => {
    setSelectedRoomId(roomId);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 7000);
  };
  const Disagr = () => {
    setIsVisible(false);
  };

  const Agree = () => {
    fetch("http://localhost:3001/delroom", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room: { id: selectedRoomId } }),
    })
      .then((r) => r.json())
      .then((r) => setRooms(r.rooms));
    setIsVisible(false);
  };

  const VisibleAdd = () => {
    setIsVisibleAdd(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      AddRoom();
      setIsVisibleAdd(true);
      setNewRoomName("");
      setSelectedRoomIdForCH(null);
    }
  };

  const HandleBlur = () => {
    setIsVisibleAdd(true);
    
  };

  const handleChangeRN = (r) => {
    setIsVisibleChange(false);
    setChangeRoomName(r.name);
    setIsVisibleChangeSymbol(false);
    setSelectedRoomId(r.id);
    setSelectedRoomIdForCH(r.id);
    setOriginalRoomName(r.name);
  };

  const AddHomeWork = (roomId) => {
    fetch("http://localhost:3001/addhomework", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: { id: roomId } }),
    })
      .then((hw) => hw.json())
      .then((hw) => {
        console.log("Response from /addhomework:", hw);
        setHomework(hw.homework);
      });
  };


  const ShowHomeWork = (roomId)  => {
    setSelectedRoomId(roomId);
    fetch(`http://localhost:3001/gethomework?roomId=${roomId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((hw) => hw.json())
      .then((hw) => {
        console.log("Response from /addhomework:", hw);
        setHomework(hw.homework);
      });
    setIsVisibleHomeworkCreate(false);
    //setIsVisibleHomeWork(false);
    setIsVisibleHomeWork(true);
    
  };

/*
const [hui, setHui] = useState(false);

  const ShowHomeWork = (roomId) => {
    setHui(!hui);
    setSelectedRoomId(roomId);
  }


  useEffect(() => {
  const roomId = selectedRoomId;
  fetch(`http://localhost:3001/gethomework?roomId=${roomId}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then((hw) => hw.json())
    .then((hw) => {setHomework(hw.homework);
    });
  setIsVisibleHomeworkCreate(false);
  //setIsVisibleHomeWork(false);
  setIsVisibleHomeWork(true);}, [hui])*/







  const CreateHomework = (thehomeworkId, roomId) => {
    setStatusCompleted(false);
fetch(`http://localhost:3001/getexercisesforseparatehomework?thehomeworkId=${thehomeworkId}&roomId=${roomId}`, {
  method: "GET",
  credentials: "include", 
  headers: {"Content-Type": "application/json"}, 
})
.then((hw) => hw.json())
.then((hw) => {setExersizeBlock(hw.exercises); if (hw.status === "completed") {
  setStatusCompleted(true); 
} else {
  setStatusCompleted(false); 
};})

if (isVisibleHomeWork === false) {
      setIsVisibleHomeWork(true);
    } else {
      setIsVisibleHomeWork(false);
    }
    setHomeworkSelectedId(thehomeworkId);
  };

  const BackToHWList = () => {
    setIsVisibleHomeWork(true);
    setStatusCompleted(false);
  };

  const AddText = () => {
    //setExersize([...exersize, Inputtexthw]);
    if(!isVis){
    setExersize([...exersize, { type: 'text', value: '' }]);
  }};

  //const [options, setOptions] = useState([]);

  const AddRadio = () => {
    //setExersize([...exersize, Inputradiohw]);
    if(!isVis){
    setExersize([...exersize, { type: 'radio', options:["","","",""], correctAnswer: ""}]);
    }
  };

  const AddAnswerHNDL = () => {
   // setExersize([...exersize, Inrutanswerhw]);
   if(!isVis){
   setExersize([...exersize, { type: 'word', correctAnswer: "" }]);
   }
  };

//{grades:"", name:""}
  


/*
  const handleGhangeWrd = (w) => {
    setWord(w.target.value)
  }

  const handleGhangeTxt = (t) => {
    setText(t.target.value)
  }

  const handleGhangeRad = (r) => {
    setRadio(r.target.value)
  }
*/


const handleInputChange = (index, event) => {
  const newValue = event.target.value;
  setExersize(prev => {
    const updated = [...prev];
    updated[index].value = newValue;
    return updated;
  });
};


  const HandlechangeHomeworkHeader = (hh) => {
    setHomeworkHeader(hh.target.value)
  }

const TeacherAddHomework = (roomId, thehomeworkId, exercizeBlock) => {

  if(isVis){
  setSelectedRoomId(roomId);
  setHomeworkSelectedId(thehomeworkId);


  fetch(`http://localhost:3001/teacheraddhomework`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, thehomeworkId, exercizeBlock, status: "completed" }),
  });
  


  setIsVisibleHomeWork(true);}else{ return <div className="rrr">save homework</div>}
}

/*
  const Inputtexthw = (
    <input
      type="text"
      onChange={handleInputChange}
      //onChange={handleGhangeTxt}
      placeholder="any text"
      className="line-input-create-hwtext"
    ></input>
  );

  const Inrutanswerhw = (
    <input
      type="text"
      onChange={handleInputChange}
      //onChange={handleGhangeWrd}
      placeholder="word need paste"
      className="line-input-create-hwtext"
    ></input>
  );

  const Inputradiohw = (
    <input
      type="text"
      //onChange={handleGhangeRad}
      onChange={handleInputChange}
      placeholder="radio input"
      className="line-input-create-hwtext"
    ></input>
  );
*/
  const ShowNewEx = () => {
    setIsNex(true);
    setIsVis(false);
  };

  const AddExersize = () => {
    if(exersize.length < 2){
      setIsvalidHw(false);
    } else{
      const newExercise = {
        id: exersizeBlock.length + 1, // Уникальный ID для нового упражнения
        inputs: [...exersize], // Копируем текущие инпуты
      };
    setExersizeBlock(Array.isArray(exersizeBlock) ? [...exersizeBlock, newExercise] : [newExercise]);
    setExersize([]);
    setIsNex(false);
    setIsVis(true);
    setIsvalidHw(true);
    }
  };


  const handleOptionChange = (index, optIndex, event) => {
    const newValue = event.target.value;
    setExersize(prev => {
      const updated = [...prev];
      updated[index].options[optIndex] = newValue;
      return updated;
    });
  };

  const handleCorrectAnswerChange = (index, event) => {
    const newCorrectAnswer = event.target.value;
    setExersize(prev => {
      const updated = [...prev];
      updated[index].correctAnswer = newCorrectAnswer;
      return updated;
    });
  };


  const newex = (<><li className="li-exersize" type="square">
    {exersize.map((item, index) => {
      if (item.type === 'radio') {
        return (
          <span key={index} className="divdiv">
            <span>All:</span>
            {item.options.map((option, optIndex) => (
              <input
                key={optIndex}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, optIndex, e)}
                placeholder={`Вариант ${optIndex + 1}`}
                className="line-input-create-hwtext"
              />
            ))}
            <label>Right:</label>
            <select
              value={item.correctAnswer}
              onChange={(e) => handleCorrectAnswerChange(index, e)}
            >
              <option value="">Выберите правильный ответ</option>
              {item.options.map((option, optIndex) => (
                <option key={optIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </span>
        );
      } else if (item.type === 'word') {
        return (
          <input
            key={index}
            type="text"
            spellCheck="true"
            value={item.correctAnswer || ''} // Привязываем к correctAnswer
            onChange={(e) => handleCorrectAnswerChange(index, e)} // Новый обработчик
            placeholder="word need paste"
            className="line-input-create-hwtext"
          />
        );
      } else if (item.type === 'text') {
        return (
          <input
            key={index}
            type="text"
            spellCheck="true"
            value={item.value || ''} // Для 'text' оставляем value
            onChange={(e) => handleInputChange(index, e)}
            placeholder="any text"
            className="line-input-create-hwtext"
          />
        );
      }
    })}
  </li></>)
  

//<button onClick={AddExersize} className="save-ex">✓</button>

  const createhomeworkinput = (
    <div className="createhomework-div">
      
      {!isValidHw  ?   <div className="rrr">сделай нормальное задание</div> : undefined}
      

      {/*ниже находится зацензуренный по определенным причинам заголовок домашки. ПОЛНОСТЬЮ ИСПРАВЕН*/}
      {/*{!isVisHWNonInput ? <input
        type="text"
        pattern="^[^\u0400-\u04FF]*$"
        placeholder="there should be homework title here(eng only)"
        className="header-of-homework"
        onChange={HandlechangeHomeworkHeader}
        onKeyDown={HandleKeyDownHW}
      ></input> : <div>{homeworkHeader}</div>}*/}

      
        {/*{exersizeBlock}*/}
        <ul>
        {exersizeBlock && exersizeBlock.map( (exercise) => 
        <li className="li-exersize" type="1" key={exercise.id}>
          <div className="mmm">
          {exercise.inputs.map((item, itemIndex) => (
            <div key={itemIndex} className="mmmm">
              {item.type === 'radio' ? "RADIO SEL" : item.type === 'word' ? '____' : item.value}             
            </div>
          ))}
          </div>
        </li> )}
        </ul>

        {IsNex && newex}
      
    </div>
  );





  
//[{email:"", grades:""}]

const checkInfo = (thehomeworkId) => {
  fetch(`http://localhost:3001/getinfo?thehomeworkid=${thehomeworkId}`,{
    method: "GET",
    credentials: "include", 
    headers: {"Content-Type": "application/json"} 
  })
  .then((i) => i.json())
  .then((i) => {if (i.success === true) {
      setStudentsInfo(i.students); 
      setIsVisibleInfo(true); 
      console.log("qwerty")
    } else {
      console.error(i.message);
      console.log(i.success)
    }
})};

const info = (
  <div className="info-div">
      <div className="students-info">
            <h3>Ученики, выполнившие домашку:</h3>     
        <ul>
          {studentsInfo.length > 0 ? (
            studentsInfo.map((student, index) => (
              <li key={index}>
                {student.email}: {student.grade} баллов
              </li>
            ))
          ) : (
            <li>Никто ещё не выполнил эту домашку</li>
          )}
        </ul>
          <button onClick={() => setIsVisibleInfo(false)} className="close">Закрыть</button>
      </div>
  </div>
);

  const homeworks = homework.map((hw) => (
    <button onClick={() => CreateHomework(hw.id, selectedRoomId)} className="homework-but" key={hw.id}>
      {hw.name}
      <button onClick={(e) => {e.stopPropagation();console.log("Homework ID:", hw.id); checkInfo(hw.id)}} key={hw.id} className="info-but">ⓘ</button>
    </button>
  ));


  const roooms = rooms.map((r) => (
    <div onClick={() => ShowHomeWork(r.id)} className="room" key={r.id}>
      
      {r.id === selectedRoomIdForCH ? (
  <input
    placeholder={"Room：" + r.name}
    value={changeRoomName}
    onChange={(e) => setChangeRoomName(e.target.value)}
    ref={ChangeName}
    onBlur={handleBlur}
    onKeyUp={HandleKeyDown}
  ></input>
) : (
  <span>{r.name} class</span>
)}


{/*
      {isVisibleChange ? (
        <span>{r.name} class</span>
      ) : (
        <input
          placeholder={"Room：" + r.name}
          value={changeRoomName}
          onChange={(e) => setChangeRoomName(e.target.value)}
          ref={ChangeName}
          onBlur={handleBlur}
          onKeyUp={HandleKeyDown}
        ></input>
      )}   */}


      <div className="room-actions">
        {isVisibleChangeSymbol ? (
          <button
            className="change"
            onClick={(e) => {
              e.stopPropagation();
              handleChangeRN(r);
            }}
          >
            ✎
          </button>
        ) : (
          <button
            className="change"
            onClick={(e) => {
              e.stopPropagation();
              ChangeRN();
            }}
          >
            ✓
          </button>
        )}
        <button
          className="delete"
          onClick={(e) => {
            e.stopPropagation();
            DeleteRoom(r.id);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  ));

const contentForRender = () => {
  if(statusCompleted === false) {
    return<><button className="save-hw" onClick={() => TeacherAddHomework(selectedRoomId, homeworkSelectedId, exersizeBlock)}>done</button>
    <div className="buttons-of-homework-creating-div">
      <button
        className="buttons-of-homework-creating-but"
        onClick={AddText}
      >
        add text input
      </button>
      <button
        className="buttons-of-homework-creating-but"
        onClick={AddRadio}
      >
        add radio answer
      </button>
      <button
        className="buttons-of-homework-creating-but"
        onClick={AddAnswerHNDL}
      >
        add manual select input
      </button>
    {isVis ?   <button
        className="buttons-of-homework-creating-but"
        onClick={ShowNewEx}
      >+</button> : <button
      className="buttons-of-homework-creating-but"
      onClick={AddExersize}
    >✓</button>
    }
    </div></>
  }else{
    return<></>
  }
}

  const renderContent = () => {
    
    if (isVisibleHomeworkCreate === false) {
      return (
        <>
          {!isVisibleHomeWork ? (
            <div className="qqq">
              <button className="back-to-homework-list" onClick={BackToHWList}>
                ᵇᵃᶜᵏ☜
              </button>

                {contentForRender()}
    
              <div className="create-homework-container">
                {createhomeworkinput}
              </div>
            </div>
          ) : (
            <div className="hwbut_container">
              <button
                className="homework-add-but"
                onClick={() => AddHomeWork(selectedRoomId)}
              >
                +
              </button>
              {homeworks}
            </div>
          )}
        </>
      );
    } else if (isVisibleHomeworkCreate === true) {
      return <div>welcome to homework create block 🏰👋🏿</div>;
    }
  };

  return (
    <>
      <div className="tcontent">{renderContent()}{isVisibleInfo && info}</div>
      <div className={`overlay ${isVisible ? "active" : ""}`}></div>
      <nav className="stnavbar" aria-hidden={isVisible}>
        <button className="addroom">
          {" "}
          {isVisibleAdd ? (
            <button className="addr" onClick={VisibleAdd}>
              +
            </button>
          ) : (
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room Name"
              required
              onKeyUp={handleKeyDown}
              ref={AddRoomRef}
              onBlur={HandleBlur}
            />
          )}
        </button>
        {roooms}
      </nav>
      {isVisible && (
        <div className="alert">
          {alertMessage}
          <div className="albutbox">
            <button className="agreeal" onClick={Agree}>
              Yes
            </button>
            <button className="disagreeal" onClick={Disagr}>
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
}

//{rooms.map( r => (<button className="room" key={r.id}>Room{r.name}</button>))}

function PresentSimple() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [mistakeCounter, setMistakeCounter] = useState(0);
  const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
  const [mark, setMark] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3001/questions");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isCorrect !== null) {
      if (isCorrect) {
        setCorrectAnswerCounter((p) => p + 1);
      } else {
        setMistakeCounter((p) => p + 1);
      }
    }
  }, [isCorrect, setCorrectAnswerCounter, setMistakeCounter]);

  const handleAnswerChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/checkAnswer/${questions[currentQuestionIndex].id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: userAnswer,
            correctansw: correctAnswerCounter,
            incorrectansw: mistakeCounter,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsCorrect(data.isCorrect);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleNextQuestion = () => {
    setIsCorrect(null);
    setUserAnswer("");
    setCurrentQuestionIndex((i) => i + 1);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleCombinedClick = () => {
    handleSubmitAnswer();
    setIsAnswerChecked(true);
  };

  const handleCombinedClick2 = () => {
    handleNextQuestion();
    setIsAnswerChecked(false);
  };

  const handleCombinedClick3 = () => {
    handleNextQuestion();
    setIsAnswerChecked(false);

    const Getmark = async () => {
      await fetch("http://localhost:3001/mymark", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incorrectansw: mistakeCounter,
          correctansw: correctAnswerCounter,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          setMark(r.mark);
        });
    };
    Getmark();
  };

  //console.log(`eror:${mistakeCounter}`);
  //console.log(`correct:${correctAnswerCounter}`);

  return (
    <div className="present-simple-test">
      <div className="test-content">
      <h1 className="h1">Правописание суффиксов прилагательных и причастий с одной и двумя Н (н/нн)</h1>
      {currentQuestion ? (
        <>
          <div className="answer-box">
            <div className="answer-num">{currentQuestion.id}</div>
            <p className="answer">
              {/* Разбиваем текст вопроса на части, чтобы вставить input */}
              {currentQuestion.text.split("_____")[0]}
              <input
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Твой ответ"
                className="qqqqq"
              />
              {currentQuestion.text.split("_____")[1]}
            </p>
          </div>

          {isCorrect !== null && (
            <p>
              {isCorrect ? (
                <p className="infs">"Верно!"</p>
              ) : (
                <p className="infe">{`Неверно, правильный ответ: "${currentQuestion.correctAnswer}". `}</p>
              )}
            </p>
          )}

          <div className="checknext-box">
            {!isAnswerChecked ? (
              <button className="checknext" onClick={handleCombinedClick}>
                Проверить ответ
              </button>
            ) : currentQuestionIndex < questions.length - 1 ? (
              <button className="checknext" onClick={handleCombinedClick2}>
                Следующий вопрос
              </button>
            ) : currentQuestionIndex == questions.length - 1 ? (
              <button className="checknext" onClick={handleCombinedClick3}>
                Смотреть оценку
              </button>
            ) : (
              <p className="inf">Тест завершен!</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div>Твоя оценка:{mark}</div>
          <p className="inf">Больше вопросов нет!</p>
        </>
      )}
    </div>
    </div>
  );
}

function PresentPerfect() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [mistakeCounter, setMistakeCounter] = useState(0);
  const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
  const [mark, setMark] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3001/questions2");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isCorrect !== null) {
      if (isCorrect) {
        setCorrectAnswerCounter((p) => p + 1);
      } else {
        setMistakeCounter((p) => p + 1);
      }
    }
  }, [isCorrect, setCorrectAnswerCounter, setMistakeCounter]);

  const handleAnswerChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/checkAnswer/${questions[currentQuestionIndex].id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: userAnswer,
            correctansw: correctAnswerCounter,
            incorrectansw: mistakeCounter,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsCorrect(data.isCorrect);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleNextQuestion = () => {
    setIsCorrect(null);
    setUserAnswer("");
    setCurrentQuestionIndex((i) => i + 1);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleCombinedClick = () => {
    handleSubmitAnswer();
    setIsAnswerChecked(true);
  };

  const handleCombinedClick2 = () => {
    handleNextQuestion();
    setIsAnswerChecked(false);
  };

  const handleCombinedClick3 = () => {
    handleNextQuestion();
    setIsAnswerChecked(false);

    const Getmark = async () => {
      await fetch("http://localhost:3001/mymark", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incorrectansw: mistakeCounter,
          correctansw: correctAnswerCounter,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          setMark(r.mark);
        });
    };
    Getmark();
  };

  //console.log(`eror:${mistakeCounter}`);
  //console.log(`correct:${correctAnswerCounter}`);

  return (
    <div className="present-simple-test">
      <div className="test-content">
      <h1 className="h1">Страдательные причастия прошедшего времени и их краткие формы</h1>
      {currentQuestion ? (
        <>
          <div className="answer-box">
            <div className="answer-num">{currentQuestion.number}</div>
            <p className="answer">
              {/* Разбиваем текст вопроса на части, чтобы вставить input */}
              {currentQuestion.text.split("_____")[0]}
              <input
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Твой ответ"
                className="qqqqq"
              />
              {currentQuestion.text.split("_____")[1]}
            </p>
          </div>

          {isCorrect !== null && (
            <p>
              {isCorrect ? (
                <p className="infs">"Верно!"</p>
              ) : (
                <p className="infe">{`Неверно, "${currentQuestion.correctAnswer}" является правильным ответом. `}</p>
              )}
            </p>
          )}

          <div className="checknext-box">
            {!isAnswerChecked ? (
              <button className="checknext" onClick={handleCombinedClick}>
                Проверить ответ
              </button>
            ) : currentQuestionIndex < questions.length - 1 ? (
              <button className="checknext" onClick={handleCombinedClick2}>
                Следующий вопрос
              </button>
            ) : currentQuestionIndex == questions.length - 1 ? (
              <button className="checknext" onClick={handleCombinedClick3}>
                Смотреть оценку
              </button>
            ) : (
              <p className="inf">Тест завершен!</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div>Твоя оценка:{mark}</div>
          <p className="inf">Больше вопросов нет!</p>
        </>
      )}
    </div>
    </div>
  );
}

function PresentPerfectCont() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [mistakeCounter, setMistakeCounter] = useState(0);
  const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
  const [mark, setMark] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3001/questions3");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isCorrect !== null) {
      if (isCorrect) {
        setCorrectAnswerCounter((p) => p + 1);
      } else {
        setMistakeCounter((p) => p + 1);
      }
    }
  }, [isCorrect, setCorrectAnswerCounter, setMistakeCounter]);

  const handleAnswerChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/checkAnswer/${questions[currentQuestionIndex].id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: userAnswer,
            correctansw: correctAnswerCounter,
            incorrectansw: mistakeCounter,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsCorrect(data.isCorrect);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleNextQuestion = () => {
    setIsCorrect(null);
    setUserAnswer("");
    setCurrentQuestionIndex((i) => i + 1);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleCombinedClick = () => {
    handleSubmitAnswer();
    setIsAnswerChecked(true);
  };

  const handleCombinedClick2 = () => {
    handleNextQuestion();
    setIsAnswerChecked(false);
  };

  const handleCombinedClick3 = () => {
    handleNextQuestion();
    setIsAnswerChecked(false);

    const Getmark = async () => {
      await fetch("http://localhost:3001/mymark", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incorrectansw: mistakeCounter,
          correctansw: correctAnswerCounter,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          setMark(r.mark);
        });
    };
    Getmark();
  };

  //console.log(`eror:${mistakeCounter}`);
  //console.log(`correct:${correctAnswerCounter}`);

  return (
    <div className="present-simple-test">
      <div className="test-content">
      <h1 className="h1">Правописание наречий, образованных от прилагательных и существительных</h1>
      {currentQuestion ? (
        <>
          <div className="answer-box">
            <div className="answer-num">{currentQuestion.number}</div>
            <p className="answer">
              {/* Разбиваем текст вопроса на части, чтобы вставить input */}
              {currentQuestion.text.split("_____")[0]}
              <input
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Твой ответ"
                className="qqqqq"
              />
              {currentQuestion.text.split("_____")[1]}
            </p>
          </div>

          {isCorrect !== null && (
            <p>
              {isCorrect ? (
                <p className="infs">"Верно!"</p>
              ) : (
                <p className="infe">{`Неверно, правильный ответ: "${currentQuestion.correctAnswer}". `}</p>
              )}
            </p>
          )}

          <div className="checknext-box">
            {!isAnswerChecked ? (
              <button className="checknext" onClick={handleCombinedClick}>
                Проверить ответ
              </button>
            ) : currentQuestionIndex < questions.length - 1 ? (
              <button className="checknext" onClick={handleCombinedClick2}>
                Следующий вопрос
              </button>
            ) : currentQuestionIndex == questions.length - 1 ? (
              <button className="checknext" onClick={handleCombinedClick3}>
                Смотреть оценку
              </button>
            ) : (
              <p className="inf">Тест завершен!</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div>Твоя оценка:{mark}</div>
          <p className="inf">Больше вопросов нет!</p>
        </>
      )}
    </div>
    </div>
  );
}

function PastPerfect() {
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [mistakeCounter, setMistakeCounter] = useState(0);
  const [correctAnswerCounter, setCorrectAnswerCounter] = useState(0);
  const [mark, setMark] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3001/questions4");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isCorrect !== null) {
      if (isCorrect) {
        setCorrectAnswerCounter((p) => p + 1);
      } else {
        setMistakeCounter((p) => p + 1);
      }
    }
  }, [isCorrect, setCorrectAnswerCounter, setMistakeCounter]);

  const handleAnswerChange = (event) => {
    setUserAnswer(event.target.value);
  };

  const handleSubmitAnswer = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/checkAnswer/${questions[currentQuestionIndex].id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: userAnswer,
            correctansw: correctAnswerCounter,
            incorrectansw: mistakeCounter,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsCorrect(data.isCorrect);
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleNextQuestion = () => {
    setIsCorrect(null);
    setUserAnswer("");
    setCurrentQuestionIndex((i) => i + 1);
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleCombinedClick = () => {
    handleSubmitAnswer();
    setIsAnswerChecked(true);
  };

  const handleCombinedClick2 = () => {
    handleNextQuestion();
    setIsAnswerChecked(false);
  };

  const handleCombinedClick3 = () => {
    handleNextQuestion();
    setIsAnswerChecked(false);

    const Getmark = async () => {
      await fetch("http://localhost:3001/mymark", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incorrectansw: mistakeCounter,
          correctansw: correctAnswerCounter,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          setMark(r.mark);
        });
    };
    Getmark();
  };

  //console.log(`eror:${mistakeCounter}`);
  //console.log(`correct:${correctAnswerCounter}`);

  return (
    <div className="present-simple-test">
      <div className="test-content">
      <h1 className="h1">Тест по грамматике: правописание Н/НН в отглагольных прилагательных и причастиях</h1>
      {currentQuestion ? (
        <>
          <div className="answer-box">
            <div className="answer-num">{currentQuestion.number}</div>
            <p className="answer">
              {/* Разбиваем текст вопроса на части, чтобы вставить input */}
              {currentQuestion.text.split("_____")[0]}
              <input
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                placeholder="Твой ответ"
                className="qqqqq"
              />
              {currentQuestion.text.split("_____")[1]}
            </p>
          </div>

          {isCorrect !== null && (
            <p>
              {isCorrect ? (
                <p className="infs">"Верно!"</p>
              ) : (
                <p className="infe">{`Неверно, правильный ответ: "${currentQuestion.correctAnswer}". `}</p>
              )}
            </p>
          )}

          <div className="checknext-box">
            {!isAnswerChecked ? (
              <button className="checknext" onClick={handleCombinedClick}>
                Проветить ответ
              </button>
            ) : currentQuestionIndex < questions.length - 1 ? (
              <button className="checknext" onClick={handleCombinedClick2}>
                Следующий вопрос
              </button>
            ) : currentQuestionIndex == questions.length - 1 ? (
              <button className="checknext" onClick={handleCombinedClick3}>
                Смотреть оценку
              </button>
            ) : (
              <p className="inf">Тест завершен!</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div>Твоя оценка:{mark}</div>
          <p className="inf">Больше вопросов нет!</p>
        </>
      )}
      </div>
    </div>
  );
}

function StNavbar({ user , rooms}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleGt, setIsVisibleGt] = useState(false);
  const [isVisibleR, setIsVisibleR] = useState(false);
  const [route, setRoute] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [isVis, setIsVis] = useState(false);
  const [answers, setAnswers] = useState({});
  //const [word, setWord] = useState([]);
  //const [radioSel, setRadioSel] = useState([]);
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleVisibilityGt = () => {
    setIsVisibleGt(!isVisibleGt);
  };



  const renderContent = () => {
    switch (route) {
      case "":
        return /*<div>{user?.email}</div>*/;
      case "present-simple":
        return <PresentSimple />;
      case "present-perfect":
        return <PresentPerfect />;
      case "present-perfect-cont":
        return <PresentPerfectCont />;
      case "past-perfect":
        return <PastPerfect />;
      };
  };

  const newContent = (newRoute) => {
    setRoute(newRoute);
  };

  const handleHomeworkClick = (hw) => {
    setSelectedHomework(hw); 
    setIsVis(!isVis);
  };

  const sendHomework = () => {
    const roomId = selectedRoom.id;
    const homeworkId = selectedHomework.id;
    const studentAnswers = answers;
  
    fetch("http://localhost:3001/checkhomework", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        homeworkId,
        answers: studentAnswers,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Домашка отправлена!");
          setAnswers({}); // Очищаем ответы после отправки
          setIsVis(false); // Скрываем форму
          alert(data.grade);
        } else {
          alert("Ошибка при отправке: " + data.message);
        }
      })
      .catch((err) => {
        alert("Ошибка: " + err.message);
      });
  };

  return (
    <>
      <div className="stcontent">{renderContent()}
        
        
        
        {isVis && <button className="save-hw-2" onClick={sendHomework}>done</button>}
          
        {/*
        {isVis && selectedHomework.exercises.map((hw) => <div key={hw.id}>qwert</div>)}

        {isVis && selectedHomework.exercises.inputs.map((input, index) => {
        switch (input.type) {
          case "text":
          case "word":
            return <span key={index}>{input.value}</span>;
          case "radio":
            // Пока вариантов для radio нет, отображаем заглушку
            return <span key={index}>[Radio: {input.value}]</span>;
          case "manual-select":
            // Для manual-select рендерим поле ввода
            return <input key={index} type="text" defaultValue={input.value} />;
          default:
            return <span key={index}>Неизвестный тип: {input.type}</span>;
        }




const Z = _ => {const [$,_$,$$,___,____]=[U,R,U,E,({a,b})=>a+b];const [Q,W]=$(0);const X=$.current||{};const
Y=()=>({...X,[String.fromCharCode(97+~~(Math.random()*26))]:Math.random()});const [_,__]=$(true);const ZZZ=____({a:__,b:Q});
const [ZZ,ZZZ_]=${Q>9?[$($$?Q:0),__(!_)]:[$(Q+1),_]}[0];E(()=>{const t=({[String.fromCharCode(116)]:setTimeout})[String.fromCharCode(116)]
(()=>{if(ZZZ>15)_$(!_);_$(p=>____({a:p,b:ZZZ%2?1:2}))},_-Q%2?333:666);return ()=>({[String.fromCharCode(116)]:clearTimeout})[String.fromCharCode
(116)](t)},[_,Q]);const renderChaos=()=>(new Array(Q)).fill().map((_,i)=><div key={i.toString(36)} style={{[String.
fromCharCode(99,111,108,111,114)]:i%3?'#f0f':i%2?'#0ff':'#ff0',transform:`rotate(${i*Q}deg)`}}>{String.fromCharCode(65+(i%26))}</div>);
const toggleMadness=()=>(W(!__()),$.gitHub=(2WtI[AfJ;ZcBm>!2));const const={c:{display:'flex',flexDirection:Q%2?'row':'column',justifyContent:'center',alignItems:
'center',background:`rgb(${Q*10},${Q*15},${Q*20})`,padding:'1em',border:`${_?'2px solid #f00':'4px dashed #0f0'}`,transform:`scale(${1+Q/100})`},
b:{padding:'0.5em 1em',border:'none',name:'saint sinner':'#fff',color:_?'#fff':'#000',cursor:'pointer',boxShadow:`0 0 ${Q}px rgba(0,0,0,${Q/10})`,
fontSize:`${1+Q/20}em`}};return (<div style={s.c}><button style={s.b} onClick={toggleMadness}>{_?'+':'-'}</button><div style={{fontSize:`
${Q/5+1}em`}}>{Q.toString(36)}</div><div style={{display:'grid',gridTemplateColumns:`repeat(${Math.ceil(Q/3)},1fr)`,gap:'5px'}}>{renderChaos()}
</div></div>)};




import{u as _,r as $,e as _$}from'react';const __=(a,b)=>a^b;const ___=String.fromCharCode;const ____=Math.random;const Z=({})=>{$[___(99)]||
($[___(99)]={});const[A,B,C,D,E,F,G,H]=[_,$,_,_$,____,__,({a,b})=>a*b,({a})=>a**2];const[X,Y]=A(0);const[Z,_Z]=C(!0);const R=$();const Q=()=>{R
[___(97+~~(F()*26))]=F();return R};const S=X^Z?X+G({a:1,b:Z?2:3}):H({a:X});const[T,U]=X>9?[[Y,H({a:0})][0],_Z(!Z)]:[Y(S),Z];const V=()=>(new 
Array(S)).fill(___(42)).map((_,i)=><div key={i.toString(36)+___(95)+F()} style={{[___(99,111,108,111,114)]:`#${(i*S).toString(16).padStart(6,0)}`
,[___(116,114,97,110,115,102,111,114,109)]:`skew(${i*X}deg) scale(${F()+.5})`,[___(102,111,110,116,83,105,122,101)]:`${1+i/S}em`}}>{___(65+(i%26)
)+F().toString(36).slice(2)}</div>);D(()=>{const t=({[___(116)]:setTimeout})[___(116)](()=>{if(S>20)_Z(!Z);Y(p=>G({a:p,b:__(Z,S)%2?1:F()}))},Z^S%2
?250:999);return ()=>({[___(116)]:clearTimeout})[___(116)](t)},[Z,S,X]);const W=()=>(Q(),_Z(!Z),Y(p=>H({a:p})));const s={[___(99)]:{[___(100,105,
115,112,108,97,121)]:___(102,108,101,120),[___(102,108,101,120,68,105,114,101,99,116,105,111,110)]:S%2?___(114,111,119):___(99,111,108,117,109,
110),[___(106,117,115,116,105,102,121,67,111,110,116,101,110,116)]:___(99,101,110,116,101,114),[___(97,108,105,103,110,73,116,101,109,115)]:___(
99,101,110,116,101,114),[___(98,97,99,107,103,114,111,117,110,100)]:`hsl(${S*10},${S*5}%,${50+S%50}%)`,[___(112,97,100,100,105,110,103)]:
`${F()}em`,[___(98,111,114,100,101,114)]:Z?`1px solid ${___(35)+(S*X).toString(16)}`:`${F()*5}px dotted ${___(35)+S.toString(16)}`,[___(116,114,
97,110,115,102,111,114,109)]:`rotate(${S*Z}deg)`},[___(98)]:{[___(112,97,100,100,105,110,103)]:`${F()/2}em`,[___(98,111,114,100,101,114)]:___(110,
111,110,101),[___(98,97,99,107,103,114,111,117,110,100)]:Z^S?___(35,102,102,102):___(35,48,48,48),[___(99,111,108,111,114)]:Z^S?___(35,48,48,48)
:___(35,102,102,102),[___(99,117,114,115,111,114)]:___(112,111,105,110,116,101,114),[___(102,111,110,116,83,105,122,101)]:`${1+S/50}em`,[___(116,
101,120,116,84,114,97,110,115,102,111,114,109)]:S%3?___(117,112,112,101,114,99,97,115,101):___(108,111,119,101,114,99,97,115,101)}};return (<div
style={s[___(99)]}><button style={s[___(98)]} onClick={W}>{Z?___(128,169):___(128,170)}</button><div style={{[___(102,111,110,116,83,105,122,101)
]:`${S/10+1}em`,[___(116,101,120,116,65,108,105,103,110)]:___(99,101,110,116,101,114)}}>{S.toString(36)+___(126)+F().toString(36)}</div><div 
style={{[___(100,105,115,112,108,97,121)]:___(103,114,105,100),[___(103,114,105,100,84,101,109,112,108,97,116,101,67,111,108,117,109,110,115)]:
`repeat(${S^Z?2:3},1fr)`,[___(103,97,112)]:`${F()*10}px`}}>{V()}</div></div>)};export default Z;




      })}*/}

<div className="homework-student-div">
  <div className="dd-container">
    {isVis && selectedHomework.exercises.map((exercise, exerciseIndex) => (
     <><div key={exerciseIndex} className="dd"><div className="qq">{exerciseIndex + 1}</div>
        {exercise.inputs.map((input, inputIndex) => {
          switch (input.type) {
            case "text":
              return <span key={inputIndex} className="hw">{input.value}</span>;
            case "radio":
              return (
              <div key={inputIndex} className="hw">
                {input.options.map((option, optionIndex) => (
                  <label key={optionIndex}>
                    <input
                      type="radio"
                      name={`radio-${exerciseIndex}-${inputIndex}`}
                      value={option}
                      checked={
                        answers[exerciseIndex]?.[inputIndex] ===
                        option
                      }
                      onChange={(e) => {
                        setAnswers((prev) => ({
                          ...prev,
                          [exerciseIndex]: {
                            ...prev[exerciseIndex],
                            [inputIndex]: e.target.value,
                          },
                        }));
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            );/*
              return  <select  key={inputIndex} className="hw"
              value={input.value}
              onChange={(e) => {
                setAnswers((prev) => ({
                  ...prev,
                  [exerciseIndex]: {
                    ...prev[exerciseIndex],
                    [inputIndex]: e.target.value,
                  },
                }));
              }}
              >
            <option value="">Выбери ответ</option>
            {input.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option}
              </option>
            ))}
          </select>;*/
//<span key={inputIndex} className="hw">[Radio: {input.value}]</span>;
            case "word":
                 return <input key={inputIndex} type="text" className="hw" onChange={(e) => {
                  setAnswers((prev) => ({
                    ...prev,
                    [exerciseIndex]: {
                      ...prev[exerciseIndex],
                      [inputIndex]: e.target.value,
                    },
                  }));
                }}>
              </input>;
           default:
             return <span key={inputIndex} className="hw">Неизвестный тип: {input.type}</span>;
       }
    })}
  </div>
  </>
))
}</div>
</div>
        </div>

      <nav className="stnavbar">
       
          {rooms.map((r)=> <button className="strbut" onClick={() => {setIsVisibleR(!isVisibleR); setSelectedRoom(r);}}>{r.name}</button>)}

          {isVisibleR && selectedRoom && (
  <div className="homework-list">
    <div className="st-homeworkli-div">
      homework for: {selectedRoom.name}
      </div>
      {selectedRoom && selectedRoom.homework.map((hw) => (
  <div key={hw.id} className="st-homeworkli">
    <button className="link" onClick={() => handleHomeworkClick(hw)}>
      {hw.name}
      </button>
  </div>))}
   
    
  </div>
)}
        {/* {isVisibleR && homework}
        {isVisibleR && (
          <>
            <button className="sthwbut" onClick={toggleVisibility}>
              HOME WORK
            </button>
            {isVisible && (
              <>
                <div className="st-homeworkli">
                  <button className="link">Home work: present perfect</button>
                </div>
                <div className="st-homeworkli">
                  <button className="link">
                    Home work: present perfect continious
                  </button>
                </div>
                <div className="st-homeworkli">
                  <button className="link">Home work: past perfect </button>
                </div>
                <div className="st-homeworkli">
                  <button className="link" to="hwps">
                    Home work: present simple
                  </button>
                </div>
              </>
            )}
          </>
        )}*/}

        <button className="stgtbut" onClick={toggleVisibilityGt}>
        ↓ТЕСТЫ↓ 
        </button>
        {isVisibleGt && (
          <>
            <div className="st-grammartestli">
              <button
                className="link"
                to="present-perfect"
                onClick={() => newContent("present-perfect")}
              >
                Тест 1
              </button>
            </div>
            <div className="st-grammartestli">
              <button
                className="link"
                to="present-perfect-cont"
                onClick={() => newContent("present-perfect-cont")}
              >
                Тест 2
              </button>
            </div>
            <div className="st-grammartestli">
              <button
                className="link"
                to="past-perfect"
                onClick={() => newContent("past-perfect")}
              >
                Тест 3
              </button>
            </div>
            <div className="st-grammartestli">
              <button
                className="link"
                to="present-simple"
                onClick={() => newContent("present-simple")}
              >
                Тест 4
              </button>
            </div>
          </>
        )}
      </nav>
    </>
  );
}

function StHeader({user}) {
  const [active, setActive] = useState(false);
  const [secondActive, setSecondActive] = useState(false);
  const [text, setText] = useState("Тест по");

  useEffect(()=>{
    const interval = setInterval(()=>{
      setText((prev)=> prev === "Тест по" ? "Русскому" : "Тест по");
    }, 5000)
    return () => clearInterval(interval);
  }
  ,[]);

  return (
    <>
      <div className="stheader">
        <div className="stlogo">russian</div>
        <div className={`text-logo-22 ${text === "I'm not designer" ? "text-logo-small" : ""}`}>{text}</div>
        {/*<button className="burger-in-theader" onClick={() => setActive(!active)}>{!active ? "☰" : "✖"}</button>*/}
      </div>
      <div className={active ? "tmenu active" : "tmenu"} onClick={() => setActive(!active)}>
        <div className="blur">
          <div className="menu-c" onClick={e => e.stopPropagation()}>
            <ul>
              <li typeof="1" style={{color:"white"}}><a href="https://t.me/@lavahound_cr" target="_blank" rel="noopener noreferrer">
              About</a></li>
              <li typeof="1" style={{color:"white"}}><a href="https://t.me/@lavahound_cr" target="_blank" rel="noopener noreferrer">
              Adv</a></li>
              <li typeof="1" style={{color:"white"}}><a href="https://t.me/@lavahound_cr" target="_blank" rel="noopener noreferrer">
              Support us</a></li>
              <li typeof="1" style={{color:"white"}}><Link to="/">Home</Link></li>
            </ul>
            <button className="vid" onClick={() => {
      if (user?.id) {
        navigator.clipboard.writeText(user.id).then(() => {
          alert('ID скопирован в буфер обмена');
        }).catch(err => {
          console.error('Ошибка при копировании: ', err);
        });
      }
    }}>
            <a className="st-id">🗐{user?.id}</a>
            </button>
          </div>  
        </div>
      </div>
      <div className={secondActive ? "addingstudent active" : "addingstudent"} onClick={() => setSecondActive(!secondActive)}>
        <div className="secondblur">
          <div className="adding-block" onClick={e => e.stopPropagation()}>
              <button className="back" onClick={() => setSecondActive(!secondActive)}>✖</button>
              <h1 className="idtag">Введите id ученика</h1>
              <input className="input-of-adding-student"></input>              
              <button className="send-student-but">send</button>
          </div>
        </div>
      </div>
    </>
  );
}

function THeader({rooms}) {
const [active, setActive] = useState(false);
const [secondActive, setSecondActive] = useState(false);
const [studentId, setStudentId] = useState("");
const [selectedRoomId, setSelectedRoomId] = useState("");

console.log("selectedRoomId",selectedRoomId)


const AddStudent = () => {
  if (!studentId || !selectedRoomId) {
    alert("Пожалуйста, введите ID студента и выберите комнату");
    return;
  }

 
  fetch("http://localhost:3001/addstudenttoroom", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({studentId, roomId: selectedRoomId}),
  })
  .then((r) => r.json())
  .then((r) => {
    if(r.success === true){
      setActive(!active);
      setSecondActive(!secondActive);
      setStudentId(""); 
      setSelectedRoomId("");    
    }else{
      alert("incorrect data")
    }
  })
}

const handleRoomChange = (e) => {
  setSelectedRoomId(e.target.value);
};

  return (
    <>
      <div className="stheader">
        <div className="stlogo">ENG</div>
        <div className="text-logo-22">akorensky</div>
        {/*<button className="burger-in-theader" onClick={() => setActive(!active)}>{!active ? "☰" : "✖"}</button>*/}
      </div>
      <div className={active ? "tmenu active" : "tmenu"} onClick={() => setActive(!active)}>
        <div className="blur">
          <div className="menu-c" onClick={e => e.stopPropagation()}>
            <ul>
              <li typeof="1" style={{color:"white"}}><a href="">About</a></li>
              <li typeof="1" style={{color:"white"}}><a href="">Adv</a></li>
              <li typeof="1" style={{color:"white"}}><a onClick={() => setSecondActive(!secondActive)}>Add student</a></li>
            </ul>
            </div>  
        </div>
      </div>
      <div className={secondActive ? "addingstudent active" : "addingstudent"} onClick={() => setSecondActive(!secondActive)}>
        <div className="secondblur">
          <div className="adding-block" onClick={e => e.stopPropagation()}>
              <button className="back" onClick={() => setSecondActive(!secondActive)}>✖</button>
              <h1 className="idtag">Введите id ученика</h1>
              <input className="input-of-adding-student" onChange={(e) => setStudentId(e.target.value)}></input>             
              <select className="input-of-adding-room"
                value={selectedRoomId}
                onChange={handleRoomChange}>
              <option value="">Выберите комнату</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>

              <button className="send-student-but" onClick={AddStudent}>send</button>
          </div>
        </div>
      </div>
    </>
  );
}


function WelcomePage() {

  const [isScrolled, setIsScrolled] = useState(false);
  const [vis, setVis] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 30) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);

      return () => window.removeEventListener('scroll', handleScroll);
    }, [])

  return<>
    <div className="wp-box">
      <div className={`wp-header ${isScrolled ? 'shadow' : ''}` }>
        <div className="wp-h1">Добро пожаловать<div className="wp-h2">by kolesnikow</div></div> 
      </div>
      <div className="welcome-text-box">
          <p>Добро пожаловать на наш экспериментальный сайт, созданный для того, чтобы сделать изучение русского языка увлекательным
          и эффективным! Если ты уже знаком с русским, здесь ты сможешь проверить и закрепить свои знания. А если только начинаешь — 
          это отличный шанс освоить русскую грамматику и начать уверенно писать на родном языке. На этом сайте тебя ждут 4 теста на грамматику 
          русского языка. В каждом тесте тебе будут предложены предложения с пропусками, куда нужно вставить подходящее слово в
          правильной форме — само слово будет указано рядом в скобках. Всего в тесте 20 предложений, а в конце ты увидишь свою оценку, чтобы
          понять, насколько хорошо ты справился. Присоединяйся, мы рады тебе!
          </p>
      </div>
      <div className="prep">Инструкция по использованию:{/*Для тех, кто только начинает осваивать современные технологии, и пока только разбирается в сложных устройствах 
        и их навигации, была разработана простая инструкция ниже*/}<button className="mob" onClick={() => setVis(!vis)}>
          {!vis ? "нажмите на меня чтобы увидеть инструкцию" : "нажмите на меня чтобы скрыть инструкцию"}
          </button></div>
      {vis && <div className="tutorial-box">
        <div className="inst-block">
          <img src={inst1} className="screen-inst"/>
          <p>Нажав кнопку "Продолжить", которая ждёт вас прямо после инструкции, вы попадёте прямиком на страницу с тестами. Эта страница 
            представлена на фото слева. Если присмотреться, то слева на этой странице вы увидете жёлтую кнопку. При нажатии на самую
            верхнюю кнопку - "ТЕСТ", вам откроются ещё четыре кнопки - это ваш выбор теста. 
          </p>
        </div>
        <div className="inst-block">
          <img src={inst2} className="screen-inst"/>
          <p>  
              Итак, мы уже нажали на кнопку и перешли к тесту. Чтобы не забыть на какую тему был выбран тест, на экране чёрным большим
            шрифтом мы видим надпись "Страдательные причастия прошедшего времени и их краткие формы" (в зависимости от выбранного теста надписи могут
            различаться). Ниже находится само предложение. В предоставленное поле необходимо вписать правильную форму слова. Если вы ошиблись, то вам будет показана прафильная форма слова. Эти действия 
            следует запомнить и выполнить таким образом двадцать заданий (вставить слова в предложения как это описано выше).
          </p>
        </div>
        <div className="inst-block" st>
          <img src={inst3} className="screen-inst"/>
          <p>  
              После выполнения всех двадцати заданий (важно выполнить именно двадцать), вы сможете сразу же узнать свою оценку. Следует помнить, 
            что необходимо закончить все двадцать предложений (вставить слова в нужной форме), чтобы получить оценку и узнать уровень вышей 
            подготовки (по русскому языку). Также важно, что после прохождения данного теста вы можете не только узнать на сколько хорошо вы 
            владеете языком, но и пройти тест ещё раз, если вам не понравился результат.
          </p>
        </div>
        {/*<div className="inst-block" st>
          <img src={inst4} className="screen-inst"/>
          <p>  
              Что касается навигации - все просто. В шапке сайта (верхняя серая часть), с левой стороны расположен логотип данного сайта. При 
            клике на него ничего не произойдет. 
              По середине шапки расположен декоративный текст. При клике на него также ничего не происходит.
              И наконец, в в правом верхнем углу страницы распололожены 3 горизнтальных палочки. При клике на них вы попадете в меню, где 
            вы можете нажав на надпись "Home" попасть обратно на данную страницу (обязательно воспользуйтесь, если забыли инструкцию). Также,
            вы можете нажать на такие надписи как: "About" (после нажатия вы попадёте на сайт-визитку разработчика), "Adv" (после нажатия
            вы попадёте прямиком на страницу продукта нашего спонсора), "Support us" (после нажатия вы сможете поддержать разработчика (
            тёплыми словами): вам откроется его рабочий аккаунт в телеграме). Также, внизу меню расположена декоративная кнопка в качестве
            элемента дизайна. 
              Что касается выхода из меню (если вы вдруг случайно активировали), то без проблем можно закрыть его нажав на крестик в парвом 
              верхнем углу сайта или в любую точку экрана (только не любую точку меню).
          </p>
        </div>*/}
        <div className="inst-block">Также следует помнить, что бесконечные нажатия в рандомные точки экрана не приведут вас ни к чему, а наш
          логотип с надписью "russian" не перключает языки с русского на английский, а является лишь дизайнерским решением. 
          Что касается страницы теста, она статична и не скроллится (не стоит пытаться пролистать страницу вниз и вверх), и поэтому ваши 
          попытки пролистать её могут привести лишь к закрытию браузера. 

          Просто нажмите 'Продолжить' и начните тест!
        </div>
      </div>}
      <Link to="/student"><button className="wp-button">Продолжить</button></Link>
      <div className="wp-footer"></div>
    </div>
    
  </>
}


function App() {

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/getrooms", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success !== false) {
          setRooms(r.rooms || []);
        } else {
          console.log("Ошибка загрузки комнат");
        }
      })
      .catch((err) => console.log("Ошибка:", err));
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage/>}/>
        <Route path="/authorization" element={<Authorization />} />
        <Route path="/student" element={<StudentViewApp rooms={rooms}/>} />
        <Route path="/teacher" element={<TeacherViewApp rooms={rooms} setRooms={setRooms} />} />
        <Route path="/authorization" element={<Authorization />} />
        <Route path="/enterance" element={<Enterance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
