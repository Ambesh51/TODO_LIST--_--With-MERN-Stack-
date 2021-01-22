import React, { useState, useEffect } from "react";
import TodoHome from "./TodoHome";
import TodoButton from "./TodoButton";


const Collection=()=>{

    const [Item,SetItem]= useState()
    const [ButtonList, SetButtonList]= useState([]);
    const [ShowContent,SetShowContent]= useState(false);
    const [ShowList, SetShowList]= useState();
  

        const fetchAllButtons=async()=>{
            let url="http://localhost:8080/AllButton"
            let fetchData = await (await fetch(url)).json();
            // console.log('getting all button',fetchData);
            SetButtonList(fetchData);

        }

        const addNewButton=async()=>{

            let url="http://localhost:8080/addButton?buttonName="+Item
            let fetchData= await (await fetch(url,{
                method:"POST"
            })).json();
            console.log('fetchData',fetchData);
            fetchAllButtons()

        }

        const getTaskByButton=(Id,Name)=>{
            let butonObj={
                name:Name,
                id:Id
            }
        //   const temp = await (await fetch("http://localhost:8080/?Today=Today")).json();
        console.log('oje-->',butonObj)    
        SetShowList(butonObj.name);
        SetShowContent(true)

            
        }
    
    useEffect(async () => {
    fetchAllButtons();
       }, []);

    return(

      <div className="HomePage">
           <h1>Collection of Lists</h1>

           <div className="HomeInputBox">
               <h2>Add new List</h2>
                <input placeholder="Create Todo-list" type="text" 
               onChange={(e)=>{
                SetItem(e.target.value);
             }} 
             />

           <button onClick={()=>{   
               addNewButton()
                }}
                >+ </button>
        
       <div>
             <button className="binary-button"
                onClick={()=>{

                }}
                >List of others-Task
                </button>
        </div>
      
        <div style={{
            display : "flex",
            flexDirection : "column"
        }}>
           {
         
             ButtonList.map(item=>{
                //  console.log('item : ', item)
                return <TodoButton key={item._id} id={item._id} name={item.button} getTaskByButton={getTaskByButton}/>   
               })
          }
    `   </div>

    

        </div>
        {
            ShowContent?<TodoHome name={ShowList}/>
            : <TodoHome name="Today"/>
        }

        {/* {
            ShowContent?:
        } */}
            
          
          
          </div>
    )

}
export default Collection;



  

    
    
    

    
    

    
        