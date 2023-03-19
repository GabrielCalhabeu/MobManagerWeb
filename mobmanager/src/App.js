import "./App.css";
import "./Modal.css";
import "./Signin.css";

import api from "./services/api";

import logo from "./assets/dnd-logo.png";

import { useEffect, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement(document.getElementById("root"));
function App() {
  const [enemyRequest, setEnemyRequest] = useState();

  const [enemyList, setEnemyList] = useState([]);

  const [enemyCounter, setEnemyCounter] = useState(0);

  const [selectedEnemies, setSelectedEnemies] = useState([]);

  const sortEnemyList = (enemy1, enemy2) => {
    if (enemy1.name < enemy2.name) {
      return -1;
    }
    if (enemy1.name > enemy2.enemy2) {
      return 1;
    }
    return 0;
  };

  const sendEnemyRequest = (enemyRequest) => {
    const newEnemyRequest = enemyRequest;
    const newEnemyList = [];
    let counter = enemyCounter;
    for (let i = 0; i < enemyRequest.enemyNumber; i++) {
      console.log(counter);
      const enemy = {
        name: enemyRequest.enemyName,
        hp: enemyRequest.enemyHP,
        currHP: enemyRequest.enemyHP,
        status: "No Status",
        id: counter,
      };
      counter = counter + 1;
      newEnemyList.push(enemy);
    }
    setEnemyCounter(counter);
    setEnemyList([...enemyList, ...newEnemyList].sort(sortEnemyList));

    setEnemyRequest(newEnemyRequest);
  };

  const addEnemyToList = (enemy) => {
    setEnemyList([enemy, ...enemyList]);
  };

  const handleEnemyClick = (enemy) => {
    if (selectedEnemies.includes(enemy)) {
      setSelectedEnemies(selectedEnemies.filter((e) => e !== enemy));
      console.log("removing enemy", enemy);
    } else {
      setSelectedEnemies([...selectedEnemies, enemy]);
      console.log("adding enemy", enemy);
    }
  };

  const handleAction = (action, value, dcValue, modValue, saveMode) => {
    // implementar as ações (ex. danificar, curar, salvar, editar, excluir)
    let updatedSelectedEnemies = [...selectedEnemies];

    //Funcao de dano
    if (action == "damage") {
      for (let enemy of updatedSelectedEnemies) {
        if (parseInt(enemy.currHP) - parseInt(value) > 0) {
          enemy.currHP = parseInt(enemy.currHP) - parseInt(value);
        } else {
          enemy.currHP = 0;
        }
      }
    }
    //Funcao de curar
    else if (action === "heal") {
      for (let enemy of updatedSelectedEnemies) {
        let maxHp = parseInt(enemy.hp);
        if (parseInt(value) + parseInt(enemy.currHP) < parseInt(enemy.hp)) {
          enemy.currHP = parseInt(enemy.currHP) + parseInt(value);
        } else {
          enemy.currHP = maxHp;
        }
      }
    }
    //Funcao de save
    else if (action === "save") {
      for (let enemy of updatedSelectedEnemies) {
        let saveThrow = Math.floor(Math.random() * 20) + 1;
        console.log(saveThrow, dcValue, modValue, value, saveMode);
        //FAILED SAVE, TAKES FULL DAMAGE
        if (saveThrow + parseInt(modValue) < parseInt(dcValue)) {
          console.log("fail");
          console.log(value, enemy.currHP);
          if (parseInt(enemy.currHP) - parseInt(value) > 0) {
            enemy.currHP = parseInt(enemy.currHP) - parseInt(value);
          } else {
            enemy.currHP = 0;
          }
          //SCUCESS ON SAVE, TAKES EITHER HALF OR NO DAMAGE.
        } else {
          //TAKING HALF THE DAMAGE
          if (saveMode === "half") {
            console.log("sucess half");
            if (parseInt(enemy.currHP) - Math.floor(parseInt(value) / 2) > 0) {
              enemy.currHP =
                parseInt(enemy.currHP) - Math.floor(parseInt(value) / 2);
            } else {
              enemy.currHP = 0;
            }
          }
        }
      }
    }
    //Funcao edit
    else if (action === "edit") {
      for (let enemy of updatedSelectedEnemies) {
        enemy.status = value;
      }
    }
    //Funcao delete
    else if (action === "delete") {
      let newEnemyList = enemyList;
      let toBeDeleted;
      for (let enemy of updatedSelectedEnemies) {
        enemy.id = -1;
      }
      console.log(enemyList);

      newEnemyList = enemyList.filter((enemy) => enemy.id !== -1);
      console.log(newEnemyList);
      setEnemyList(newEnemyList);
    }

    updatedSelectedEnemies = [];
    setSelectedEnemies(updatedSelectedEnemies);
    console.log(selectedEnemies);
  };

  return (
    <div className="App">
      <Signin
        enemyList={enemyList}
        setEnemyList={setEnemyList}
        addEnemyToList={addEnemyToList}
      />
      <Logo />
      <EnemyAdder sendEnemyRequest={sendEnemyRequest} />
      <LineBreak />
      <EnemyHandler
        enemyRequest={enemyRequest}
        enemyList={enemyList}
        selectedEnemies={selectedEnemies}
        handleEnemyClick={handleEnemyClick}
        handleAction={handleAction}
      />
    </div>
  );
}

function Signin({ enemyList, setEnemyList, addEnemyToList }) {
  const [isLoged, setLogged] = useState(false);
  const [login, setLogin] = useState("");
  const [logMessage, setLogMessage] = useState("Log in");
  const [signMessage, setSignMessage] = useState("Sign in");

  const [openModal, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPsswd] = useState("");

  const submitSave = async () => {
    if (login === "") {
      alert("You must be logged in to save files");
      return;
    }
    if (enemyList.length === 0) {
      alert("Saving an empty file delete your last file");
      try {
        const response = await api.delete("/files/del", {
          params: {
            user: login,
          },
        });
        console.log(response);
        alert("File successfully deleted");
      } catch (error) {
        alert("You already had no files saved");
      }
      return;
    }
    try {
      let fileName = enemyList[0].name;
      const response = await api.post("/files", {
        user: login,
        title: fileName,
        file: enemyList,
      });
      console.log(response);
      alert("File successfully saved");
    } catch (error) {
      alert(error, "If this happened im so sorry for you");
    }
  };

  const submitLoad = async () => {
    try {
      const response = await api.get("/files", {
        params: {
          user: login,
        },
      });
      console.log(response.data.file);
      setEnemyList([]);
      let tempList = [];
      for (let item of response.data.file) {
        console.log(item);
        tempList.push(item);
      }
      setEnemyList(tempList);
    } catch (error) {
      if (login == "") {
        alert("You must log in to load files");
      } else {
        alert("You have no files saved.");
      }
    }

    //setEnemyList();
    setModalOpen(false);
  };

  const Logon = (login) => {
    console.log(login);
    setLogin(login);
    setLogged(true);
    setLogMessage("Change Accounts");
    setSignMessage("Log off");
  };

  const Logoff = () => {
    setLogged(false);
    setLogMessage("Log in");
    setSignMessage("Sign in");
    setLogin("");
    setEnemyList([]);
  };
  const validadeEmail = () => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswdChange = (event) => {
    setPsswd(event.target.value);
    if (event.target.value.length < 7) {
      event.target.className = "modal-input invalid";
    } else {
      event.target.className = "modal-input";
    }
  };

  const showModal = (mode) => {
    if (mode === "Log off") {
      Logoff();
      return;
    }
    setModalOpen(true);
    setModalMode(mode);
  };

  const submitLogin = async () => {
    console.log(validadeEmail());
    if (!validadeEmail()) {
      alert("Invalid Email");
    }
    if (passwd.length < 7) {
      alert("Password must at least 7 characters");
    } else {
      if (modalMode == "Sign in") {
        console.log(email);
        console.log(passwd);
        try {
          const response = await api.post("/accounts", {
            user: email,
            password: passwd,
          });
          setModalOpen(false);
        } catch (error) {
          if (error.response.status == "401") alert("User already registered");
        }
      } else {
        try {
          console.log(email);
          console.log(passwd);
          const response = await api.post("/accounts/auth", {
            user: email,
            password: passwd,
          });
          Logon(response.data.user);
          setModalOpen(false);
        } catch (error) {
          if (error.response.status == "401")
            alert("Password or email invalid");
        }
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="container-div">
      <div className="save-load-div">
        <button className="log" onClick={submitSave}>
          Save
        </button>

        <button className="sign" onClick={submitLoad}>
          Load
        </button>
      </div>

      <div className="signin">
        <button className="log" onClick={() => showModal("log in")}>
          {logMessage}
        </button>
        <button className="sign" onClick={() => showModal(signMessage)}>
          {signMessage}
        </button>
        <Modal
          isOpen={openModal}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          className={"signin-modal"}
          overlayClassName="overlay"
        >
          <div>
            <div className="close-button-div">
              <button className="close-button " onClick={closeModal}>
                X
              </button>
            </div>

            <div className="centralized">
              <h2 className="title">{modalMode}</h2>
            </div>

            <div className="centralized">
              <input
                type="email"
                className="modal-input"
                placeholder="E-mail"
                onChange={handleEmailChange}
              />
            </div>
            <div className="centralized">
              <input
                type="password"
                className="modal-input"
                placeholder="Password"
                onChange={handlePasswdChange}
              />
            </div>

            <div className="centralized ">
              <input
                type="submit"
                className="modal-submit-button"
                value={modalMode}
                onClick={submitLogin}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function EnemyButtons({ enemies, handleAction }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalSaveThrow, setShowModalSaveThrow] = useState(false);

  const [damageValue, setDamageValue] = useState(0);
  const [dcValue, setDcValue] = useState(0);
  const [modValue, setModValue] = useState(0);
  const [inputType, setInputType] = useState("");

  const [saveMode, setSaveMode] = useState("");
  const [modalMode, setModalMode] = useState("");

  const handleDcChange = (event) => {
    setDcValue(event.target.value);
  };

  const handleModChange = (event) => {
    setModValue(event.target.value);
  };

  const handleDamageChange = (event) => {
    setDamageValue(event.target.value);
  };

  const confirmClick = (value) => {
    console.log(damageValue);
    handleAction(modalMode, damageValue, dcValue);
    setShowModal(false);
  };

  const confirmClickSaveThrow = (saveMode) => {
    console.log(damageValue);
    handleAction(modalMode, damageValue, dcValue, modValue, saveMode);

    setShowModalSaveThrow(false);
  };

  const openModal = (event) => {
    setShowModal(true);
    setModalMode(event.target.className);
    console.log(event.target.type);
    if (
      event.target.className === "damage" ||
      event.target.className === "heal"
    ) {
      setInputType("number");
    } else {
      setInputType("text");
    }
    console.log(modalMode);
  };

  const openModalSaveThrow = (event) => {
    setShowModalSaveThrow(true);
    setModalMode(event.target.className);
  };

  const closeModalSaveThrow = (event) => {
    setShowModalSaveThrow(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="actions">
      <button className="damage" onClick={openModal}>
        Damage
      </button>
      <button className="heal" onClick={openModal}>
        Heal
      </button>
      <button className="save" onClick={openModalSaveThrow}>
        Save
      </button>
      <button className="edit" onClick={openModal}>
        Edit
      </button>
      <button className="delete" onClick={() => handleAction("delete")}>
        Delete
      </button>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className={"damage-modal"}
        overlayClassName="overlay"
      >
        <div>
          <div className="close-button-div">
            <button className="close-button " onClick={closeModal}>
              X
            </button>
          </div>

          <div className="centralized">
            <input
              type={inputType}
              className="modal-input"
              placeholder=""
              onChange={handleDamageChange}
            />
          </div>

          <div className="centralized modal-submit-button">
            <input
              onClick={confirmClick}
              type="submit"
              id={modalMode}
              value={modalMode}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showModalSaveThrow}
        onRequestClose={closeModalSaveThrow}
        contentLabel="Example Modal"
        className={"savethrow-modal"}
        overlayClassName="overlay"
      >
        <div>
          <div className="close-button-div">
            <button className="close-button " onClick={closeModalSaveThrow}>
              X
            </button>
          </div>

          <div className="centralized">
            <input
              type="number"
              className="modal-input"
              placeholder="DC"
              onChange={handleDcChange}
            />
          </div>
          <div className="centralized">
            <input
              type="number"
              className="modal-input"
              placeholder="Modfier"
              onChange={handleModChange}
            />
          </div>

          <div className="centralized">
            <input
              type="number"
              className="modal-input"
              placeholder="Damage"
              onChange={handleDamageChange}
            />
          </div>

          <div className="centralized modal-submit-button">
            <input
              onClick={() => confirmClickSaveThrow("half")}
              type="submit"
              id={modalMode}
              value={"half"}
            />
            <input
              onClick={() => confirmClickSaveThrow("full")}
              type="submit"
              id={modalMode}
              value={"full"}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function EnemyHandler({
  enemyList,
  selectedEnemies,
  handleEnemyClick,
  handleAction,
}) {
  return (
    <div className="">
      {enemyList.map((enemy, ID) => (
        <Enemy
          name={enemy.name + " " + (ID + 1)}
          hp={enemy.hp}
          currHP={enemy.currHP}
          status={enemy.status}
          selected={selectedEnemies.includes(enemy)}
          key={ID}
          id={ID}
          onClick={() => handleEnemyClick(enemy)}
        />
      ))}
      <div className="centralized">
        <EnemyButtons enemies={selectedEnemies} handleAction={handleAction} />
      </div>
    </div>
  );
}

function Logo() {
  return (
    <header className="AppHeader">
      <div className="centralized">
        <img src={logo} alt="dnd-logo" className="logo"></img>
      </div>
      <div className="centralized">
        <h2 className="title">Mob Manager</h2>
      </div>
    </header>
  );
}

function EnemyAdder({ sendEnemyRequest }) {
  const [enemyRequest, setEnemy] = useState({
    enemyName: "",
    enemyHP: "",
    enemyNumber: "",
  });

  const submitList = (event) => {
    event.preventDefault();
    // const newEnemyList = [];
    // for (let i = 0; i < enemy.enemyNumber; i++) {
    //   newEnemyList.push({ ...enemy });
    // }
    sendEnemyRequest(enemyRequest);
  };

  const handleChange = (event) => {
    setEnemy({ ...enemyRequest, [event.target.id]: event.target.value });
  };

  return (
    <div className="form-div centralized">
      <form id="form">
        <input
          className="font"
          type="text"
          id="enemyName"
          placeholder="Enemy Name"
          onChange={handleChange}
        />
        <input
          type="number"
          id="enemyHP"
          placeholder="HP"
          onChange={handleChange}
        />
        <input
          type="number"
          id="enemyNumber"
          placeholder="N of mobs"
          onChange={handleChange}
        />
      </form>
      <form id="submit">
        <input
          onClick={submitList}
          type="submit"
          id="submit-button"
          value="Create Mobs"
        />
      </form>
    </div>
  );
}

function LineBreak() {
  return (
    <div className="centralized">
      <hr className="breakline"></hr>
    </div>
  );
}

function Enemy({
  name,
  status = "No Status",
  id,
  hp,
  currHP = hp,
  selected,
  onClick,
}) {
  return (
    <div className={`enemy ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="centralized" id="enemies">
        <div className="enemy">
          <div className="content">
            <input type="text" className="text" value={name} readOnly />
            <input type="text" className="text" value={status} readOnly />

            <input
              type="text"
              className="text hp"
              value={currHP + " / " + hp}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
