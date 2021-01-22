import React from 'react';
import TodoCollection from "./components/TodoCollection";
import UserContext from "./context/UserContext";

 function App() {


  return (
    <UserContext.Provider value='Ashu'>
    <div className="App">
    <TodoCollection/>
    </div>
    </UserContext.Provider>
  );
}
 
export default App;
