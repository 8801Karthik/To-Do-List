import { useEffect, useState } from "react";
function ToDoList(){
    const [tasks,setTasks]=useState(()=>{
        return JSON.parse(localStorage.getItem("tasks"))||[];
    });
    const [completedTasks,setCompletedTasks]=useState(()=>{
        return JSON.parse(localStorage.getItem("completed-tasks"))||[];
    });
    const [newTask,setNewTask]=useState("");
    const [prevIndex,setPrevIndex]=useState();
    const [dragSource,setDragSource]=useState();
    
    useEffect(()=>{
        localStorage.setItem("completed-tasks",JSON.stringify(completedTasks));
        localStorage.setItem("tasks",JSON.stringify(tasks));
    },[tasks,completedTasks]);

    function handleInputChange(event){
        setNewTask(event.target.value);
    }

    function handleKeyDown(event){
        if(event.key==="Enter"){
            addTask();
        }
    }

    function addTask(){
        if(newTask.trim()===""){
            return;
        }
        setTasks(t=>[...t,newTask]);
        setNewTask("");
    }

    function deleteTask(index,setArr){
        setArr(t=>t.filter((_,i)=>i!==index));
    }

    function handleDragStart(index){
        setPrevIndex(index);
    }
    
    function handleDrop(index,arr,setArr,target){
        if(target!==dragSource){
            return;
        }
        let newTasks=[...arr];
        const draggedTask=arr[prevIndex];
        newTasks.splice(prevIndex,1);
        newTasks.splice(index,0,draggedTask);
        setArr(newTasks);
    }

    function completeTask(index){
        setCompletedTasks((ct)=>[...ct,tasks[index]]);
        deleteTask(index,setTasks);
    }

    return (
        <div className="todolist">
            <h1>To-Do-List</h1>
            <input type="text" onChange={handleInputChange} value={newTask} placeholder="Enter a Task" id="taskinput" onKeyDown={handleKeyDown} autoFocus/>
            <button onClick={addTask} className="add-btn">ADD</button>
            <ol>
                {tasks.map((task,index)=>
                <li key={index} draggable onDragStart={()=>{setDragSource("tasks");
                                                                handleDragStart(index)}} 
                                                            onDragOver={(e)=>e.preventDefault()} onDrop={()=>handleDrop(index,tasks,setTasks,"tasks")}>
                    <span>{task}</span>
                    <button onClick={()=>deleteTask(index,setTasks)} className="delete-btn">Delete</button>
                    <button onClick={()=>completeTask(index)} className="done-btn">Done</button>
                </li>
                )}
            </ol>
            <ol className="completed-tasks">
                {completedTasks.map((task,index)=>
                <li key={index} draggable onDragStart={()=>{setDragSource("completed-tasks");
                                                                handleDragStart(index)}} 
                                                            onDragOver={(e)=>e.preventDefault()} onDrop={()=>handleDrop(index,completedTasks,setCompletedTasks,"completed-tasks")}>
                    <span>✓ {task}</span>
                    <button onClick={()=>deleteTask(index,setCompletedTasks)} className="delete-btn">Delete</button>
                </li>
                )}
            </ol>
            <p className="hint">Drag and drop tasks to reorder them</p>
        </div>
    );
}
export default ToDoList;