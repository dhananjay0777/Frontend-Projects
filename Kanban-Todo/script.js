let tasksData = {};




const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo,progress,done];
let dragElement = null;

function addTask(title,desc,column){
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable","true");
    div.innerHTML =`
                <h2>${title}</h2>
                <p>${desc}</p>
                <button>Delete</button>
                `
    column.appendChild(div);
    div.addEventListener("drag",(e)=>{
        dragElement = div;
    })
    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-description-input").value = "";

    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click",()=>{
        div.remove();
        updateTaskCount();
    })
    return div;
}

function updateTaskCount(){
    columns.forEach(col=>{
        const tasks = col.querySelectorAll('.task');
        const count = col.querySelector('.right'); 
        tasksData[col.id] = Array.from(tasks).map(t =>{
            return {
                title: t.querySelector('h2').innerHTML,
                desc : t.querySelector('p').innerText
            }
        })
        localStorage.setItem("tasks",JSON.stringify(tasksData));
        count.innerText = tasks.length;
    })
}


if(localStorage.getItem("tasks")){
    const data = JSON.parse(localStorage.getItem("tasks"));
    console.log(data);
    for(const col in data){
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task=>{
           addTask(task.title,task.desc,column);
        })
    }
    updateTaskCount();
}

const tasks = document.querySelectorAll('.task');

tasks.forEach(task=>{
    task.addEventListener('drag', (e)=>{
        console.log('dragging', e);
        dragElement = task;
    })
})


function addDragEventsOnColumns(column){
    column.addEventListener('dragenter', (e)=>{
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener('dragleave', (e)=>{
        e.preventDefault();
        column.classList.remove("hover-over");
    })
    // Drag---
    column.addEventListener('dragover', (e)=>{
        e.preventDefault();
    
        column.addEventListener("drop", (e)=>{
            e.preventDefault();
        })

        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        updateTaskCount();
    })
}

addDragEventsOnColumns(progress);
addDragEventsOnColumns(todo);
addDragEventsOnColumns(done);

// Modal - Start

const toggelModalButton = document.querySelector('#toggle-modal');
const modalbg = document.querySelector('.modal .bg');
const modal = document.querySelector('.modal');
const addTaskButton = document.querySelector('#add-new-task')


toggelModalButton.addEventListener('click', (e)=>{
    modal.classList.add("active");
})
modalbg.addEventListener('click',(e)=>{
    modal.classList.remove('active');
})
addTaskButton.addEventListener('click', ()=>{
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDescription = document.querySelector("#task-description-input").value;

    addTask(taskTitle,taskDescription,todo)

    updateTaskCount();

    
    modal.classList.remove('active');
})

// Modal - End