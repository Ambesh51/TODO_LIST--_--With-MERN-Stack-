
import React, {useState} from "react";

const TodoItem=(props)=>{
    const [Edit, SetEdit]=useState(false)
    const [Checkbox, SetCheckbox]= useState(false);
    const [EditText, SetEditText]=useState()


    return(
        <div className="Home-Items">
           {
               Edit
               ?console.log("Not showing Checkbox on true condition")
               : <div>
                <input type="button" value="Delete" onClick={(e)=>{
                    console.log('checkValue : ', e.target.checked) ;
                  
                    props.deleteItem(props.id)
                }}/>
            </div>
           }
       {
           Edit  ?
                <input type="text" defaultValue={props.name} onChange={(e)=>{
                   SetEditText(e.target.value);
                 }} />
                :<h2>{props.name}</h2>
       }
         
          <div>
        {
           Edit  ?
                <button style={{margin:"15px"}}
                  onClick={()=>{
                     props.editItem(EditText,props.id);
                     SetEdit(false);
                    }} 
                    >✅</button>

                :<button style={{margin:"15px"}}
                   onClick={()=>{
                       SetEdit(true);
                       }}
                    >✏️</button>
        }
            </div>        
        </div>
)
}

export default TodoItem;