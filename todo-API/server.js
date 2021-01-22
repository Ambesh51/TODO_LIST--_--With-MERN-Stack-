const express = require('express');
const cors=require('cors');
const mongoose= require('mongoose');

 

const app= express();
app.use(cors({
    origin:'*'
}));

// db connection
mongoose.connect("mongodb://localhost:27017/TodoDB",{
  useNewUrlParser:true, useUnifiedTopology: true  ,
  useFindAndModify:true
})
.then(()=>{
    console.log(`Connection to database established`);
}).catch((err)=>{
    console.log(`db error ${err.message}`);
})



//Schmea Creation or models

// create new Schema for todolist


const todoSchema = new mongoose.Schema({
  name:String
});
const TodoItem = mongoose.model("Item",todoSchema)

// list we make for differt purposes 
// Ex- Market or Home
  const listSchema = new mongoose.Schema({
      name:String,
      items:[todoSchema]
  });
const listItems = mongoose.model("ListItem",listSchema)

  //Button Schema
  //ex Tomorrow Task, Market Shopping List
   const buttonSchema = new mongoose.Schema({
      button:String,
      items:[todoSchema]
    //   item:[{
    //       type : mongoose.Schema.Types.ObjectId,
    //       ref : 'Item'
    //   }]
});
const Button = new mongoose.model("Button",buttonSchema)


  //Default Items If list is Empty

const item1 = new TodoItem({
    name: "Welcome to your todolist!"
  });
  
  const item2 = new TodoItem({
    name: "Hit the + button to add a new item."
  });
  
  const item3 = new TodoItem({
    name: "<-- Hit this to delete an item."
  });


const defaultItems=[item1, item2, item3];
const defaultItem=[item1,item2];


app.get("/",(req, res)=>{
    let Taskfor= req.query.Today;
    console.log('getting', Taskfor);
    if(Taskfor=="Today"){
        TodoItem.find({}, (err, foundItems)=>{
            // NO items in DB then Default Items Assign
            
            if(foundItems.length === 0){
                TodoItem.insertMany(defaultItems, (err)=>{
                    if(err){console.log('err:',err)}
                    else{console.log("Successfully Saved default item to DB."); res.json(foundItems)}
                });
            }
            else{
                res.json(foundItems);
            }
        })
    }
    else{
    
        
        Button.findOne({name:Taskfor},(err, foundList)=>{
            console.log('list',foundList)
            if(!err){
                if(!foundList){
                    //create when list now Exist
                    var list = new Button({
                        name:Taskfor,
                        items: defaultItem
                    });
                    res.json(list);
                    console.log('list',list)
                    list.save();
                }
                else{
                    console.log('exist');
                    res.json(foundList);
                }
            }
            else{
                console.log('err', err.message);
            }
          });
        
    }
});

// todo New List-Add  ex-> work or home - 
app.get("/add/customListName", (req, res)=>{
      console.log('params->',req.query.customListName);
      const customListName= req.query.customListName;
      listItems.findOne({name:customListName},(err, foundList)=>{
        if(!err){
            if(!foundList){
                //create when list now Exist
                var list = new listItems({
                    name:customListName,
                    items: defaultItems
                });list.save();
                res.json(list);
            }
            else{
                console.log('exist');
                res.json(foundList);
            }
        }
        else{
            console.log('err', err.message);
        }
      });
});



//post Items on given lists
app.post("/item",(req, res)=>{

    let NewItem= req.query.newItem;
    let ListName= req.query.ListName;
console.log('NewList',ListName);
    const SingleItem = new TodoItem({
        name:NewItem
    });

    if(ListName == "Today"){
        res.json(SingleItem);
        SingleItem.save();
        console.log('Today. save-->');
    }else{
        listItems.findOne({name:ListName},(err, foundList)=>{
            // if(foundList=="Today"){
            //     console.log('foundlist',foundList)
            // }

            // console.log('founderList-->',foundList)
                foundList.items.push(SingleItem);
                res.json(foundList);
                foundList.save();
          
            
            
        })
    }

})








app.post('/delete',(req, res)=>{
 
    const DeleteItemId= req.query.DeleteItemId;
    var ListName= req.query.ListName;
    console.log('deleteItemId', DeleteItemId)

    if("Today"==ListName){
        TodoItem.findByIdAndDelete(DeleteItemId,(err)=>{
                if(!err){
                    console.log("Successfully deleted item");
                    res.status(200).send('OK');
                }else{console.log('Today Item Not Deleted', err)}
        })
    }
    else{

        listItems.findOne({name: ListName},(err, result)=>{

            var res1= result.items.filter(result=>{
                  console.log('id',result);
                    if((result._id)!=DeleteItemId){
                       return result;
                       
                    }
               });
               //this is a good way???????????????????????????????
               //????????????????????????????????????????
            //    result=res;
            //    console.log('new id',result);
               res.json(res1);
            //    result.save();
              
            //    result.save();
        })
     
      }
    
});


app.post('/edit',(req, res)=>{

    const EditItemID = req.query.EditItemID;
    const EditItem =  req.query.EditItem;
    const ListName = req.query.ListName;
console.log(`edit itme ${EditItem} and id ${EditItemID} list ${ListName}`)
   
if(ListName=="Today"){
        console.log('Today');
        TodoItem.findByIdAndUpdate(EditItemID, {name:EditItem},(err, docs)=>{
            if(!err){
                console.log('Edit Successfully List Of Today');
            }else{console.log('Today not successfully edit---> ', docs)}            
        })
    }
    else{

        listItems.findOne({name:ListName},(err, result)=>{

        for(var i in result.items){
         //   console.log(result.items[i]._id);
             if((result.items[i]._id)==EditItemID){
                result.items[i].name=EditItem
                
             }
        }
        result.save();
        res.json(result);
        

         
    });
}
});

app.post('/addButton',(req, res)=>{
    var buttonName= req.query.buttonName;
    console.log('button name->',buttonName);
   
    const Buttonadd = new Button({  
        button:buttonName,   
     })
    Buttonadd.save();
     res.json(Buttonadd);
    console.log('push done', Buttonadd);
})

app.get('/AllButton',(req, res)=>{

    Button.find({}, (err, foundlist)=>{
        res.json(foundlist);
        // console.log('found->', foundlist);
    })
})


// app.get('/todo-list',(req, res)=>{
//     let assignedTo=req.query.assigned;
//     console.log(assignedTo);
//     let filter=todoitems.filter(item => {
//         if(item.assigned===assignedTo)
//         {
//              return item
//         }
//     } ) 
//     console.log('filter contain:', filter);     
//           res.json(filter);
// // res.status(200).send();
//  console.log('filter:', filter)
// });



// app.get('/add-item',(req, res)=>{
//     let getItem={
//     assigned: req.query.SingleItem
//     }
//     console.log('Item Fetch:---->',getItem);
//     todoitems.push(getItem)
//     console.log('--------->', todoitems)
//     res.json(todoitems);

// });

app.listen(8080,()=>{
    console.log('server listening port 8080');
})