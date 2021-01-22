import React, { useState, useEffect } from "react";
import TodoItem from "./Todoitems";

const TodoHome = (props) => {

  const [SingleItem, SetSingleItem] = useState("");
  const [Items, SetItems] = useState([]);


  const getItems = async () => {
   
    const temp = await (await fetch("http://localhost:8080/?Today=" + props.name)).json();
    console.log('temp : ', temp);
  
    SetItems(temp);
    // console.log('setItems--->',SetItems);
    console.log('ItemsSet---->',Items)
  }
  
  useEffect(async () => {
    getItems();

  }, [props.name] ,);


  const itemAdd = (async () => {

    let value = SingleItem;
    let url = "http://localhost:8080/item?newItem=" + value + "&ListName=Today";
    let fetchData = await (await fetch(url, {
      method: "POST"
    })).json();
    console.log('k', fetchData);
    SetSingleItem("");
    getItems();
  })


  const editItem = (async (EditText, id) => {
    console.log('edit text', EditText);
    console.log('id', id);

    let url = "http://localhost:8080/edit?EditItemID=" + id + "&EditItem=" + EditText + "&ListName=Today";
    let fetchData = await (await fetch(url, {
      method: "POST"
    })).json();
    console.log('fetchdata', fetchData);
    getItems();


  })

  const deleteItem = async (id) => {

    let url = "http://localhost:8080/delete?DeleteItemId=" + id + "&ListName=Today";

    fetch(url, {
      method: "POST"
    })
      .then(Response => {
        console.log('response->', Response);
      }).catch(err => {
        console.log('err', err.message);
      })
    console.log('I am here');
    // console.log('Done-->',fetchData)
    getItems();
  }

  return (

    <div className="Collections-Home">

      <h1 style={{ color: "indigo" }}>
        {props.name} <span style={{ color: "green" }}>-_-</span> Task
          </h1>

          {

Items.map(item => {

  return (
  <TodoItem
    key={item._id} 
    id={item._id}
    name={item.name}
     editItem={editItem}
    deleteItem={deleteItem} 
  />
  )
})
}


       <p>{SingleItem}</p>

       <input placeholder="Create Todo-Item" type="text"
         style={{ margin: "0px 10px 0px 50px " }}
           onChange={(e) => {
          SetSingleItem(e.target.value);
        }} value={SingleItem}
      />

        <button onClick={() => { 
          itemAdd();
            }}
           style={{ padding: "8px" }}>+</button>


    </div>
  );

}
export default TodoHome;


