let enemyList = [];
console.log(enemyList);
window.addEventListener('load', ()=> {
    const form = document.querySelector('#form');
    const submitForm = document.querySelector('#submit');
    const name_element = document.querySelector("#name");
    const HP_element = document.querySelector("#enemy-hp");
    const numOfEnemies_element = document.querySelector("#number-of-enemies");
    const list_el = document.querySelector('#enemies');

    console.log(form);

    submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enemyName = name_element.value;
        const enemyHP = HP_element.value;
        const numberOfEnemis = numOfEnemies_element.value;
        if(!enemyName || !enemyHP || !numberOfEnemis){
            alert("Please inform all the information of the enemies");
            return;
        }
    })
}) 