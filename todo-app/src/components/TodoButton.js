import React from "react";

const TodoButton=(props)=>{
    // console.log('name : ', props) ;
   return(
       <div className="list">
       <input type="button" id="itemlist" value={props.name}
       onClick={()=>{
           props.getTaskByButton(props.id,props.name);
       }}
       />
       </div>
//    <button >{props.name}</button>  ;
)
}

export default TodoButton;