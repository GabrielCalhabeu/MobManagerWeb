import "./App.css";
import logo from "./dnd-logo.png";
import { useEffect, useState } from "react";

function App() {
  const [enemyRequest, setEnemyRequest] = useState();

  const [enemyList, setEnemyList] = useState([]);

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
    for (let i = 0; i < enemyRequest.enemyNumber; i++) {
      const enemy = {
        name: enemyRequest.enemyName,
        hp: enemyRequest.enemyHP,
        status: "",
      };
      newEnemyList.push(enemy);
    }
    setEnemyList([...enemyList, ...newEnemyList].sort(sortEnemyList));

    setEnemyRequest(newEnemyRequest);
  };

  const addEnemyToList = (enemy) => {
    setEnemyList([...enemyList, enemy]);
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

  const handleAction = (action) => {
    // implementar as ações (ex. danificar, curar, salvar, editar, excluir)
    let updatedSelectedEnemies = [...selectedEnemies];
    for (let enemy of updatedSelectedEnemies) {
      enemy.hp = 0;
    }
    updatedSelectedEnemies = [];
    setSelectedEnemies(updatedSelectedEnemies);
    console.log(selectedEnemies);
  };

  return (
    <div className="App">
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

function EnemyButtons({ enemies, handleAction }) {
  return (
    <div className="actions">
      <button className="damage" onClick={() => handleAction("damage")}>
        Damage
      </button>
      <button className="heal">Heal</button>
      <button className="save">Save</button>
      <button className="edit">Edit</button>
      <button className="delete">Delete</button>
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

function Enemy({ name, status = "No Status", id, hp, selected, onClick }) {
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
              value={hp + " / " + hp}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
