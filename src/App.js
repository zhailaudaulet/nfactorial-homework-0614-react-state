import { logDOM } from "@testing-library/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";



const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

// const toDoItems = [
//   {
//     key: uuidv4(),
//     label: "Have fun",
//   },
//   {
//     key: uuidv4(),
//     label: "Spread Empathy",
//   },
//   {
//     key: uuidv4(),
//     label: "Generate Value",
//   },
// ];

function App() {
  // localStorage.setItem('key',JSON.stringify(toDoItems))

  const deleteItems = ({key})=>{
    const itemIndex = items.findIndex((item)=>item.key===key);

    const leftSide = items.slice(0,itemIndex)
    const rightSide = items.slice(itemIndex+1,items.length)
    setItems([...leftSide, ...rightSide]);
    // writeInStorage()

// Put the object into storage

    

    // console.log(leftSide)
    // console.log(rightSide);
    // console.log(itemToDelete);
  }
  

  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('key')) || []);

  const [filterType, setFilterType] = useState("all");

  const [filterLabel, setFilterLabel] = useState("");

  const writeInStorage = () => {
    localStorage.clear()
    localStorage.setItem('key', JSON.stringify(items))
  }

  const handleFilterItemsByLabel = (event)=>{
    setFilterLabel(event.target.value)
  };

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  useEffect(() => {
    writeInStorage();
  }, [items])

  const handleAddItem = () => {
    if (itemToAdd.trim()===""){
      alert("Caution! It's empty!")
    }else{
      setItems((prevItems) => [
        { label: itemToAdd, key: uuidv4(), done:false, important:false },
        ...prevItems,
      ]);
    }

    // console.log(items)
    // const oldStorage = JSON.parse(localStorage.getItem('key'))
    // console.log(oldStorage);
    // writeInStorage();
    // const newStorage = [ items, ...oldStorage]
    // console.log(newStorage);
    // localStorage.setItem('key',JSON.stringify(items))
    setItemToAdd("");
  };

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
    // writeInStorage()
  };

  const handleItemImportant = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      })
    );
    // writeInStorage()
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;


  const filteredItems =
    /* !filterType ||*/
    filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

  const filterAgain = 
    !filterLabel?filteredItems
    :filteredItems.filter((item)=>item.label.toLowerCase().includes(filterLabel.toLowerCase()))


  const handleKeyPress = (e)=>{
    if(e.keyCode===13){
      handleAddItem()
    }
  }

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
        value={filterLabel}
        onChange={handleFilterItemsByLabel}
          type="text"
          className="form-control search-input"
          placeholder="type to search"
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filterAgain.length > 0 &&
          filterAgain.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item ${item.done ? " done" : ""} ${item.important?"important":""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  key={item.key}
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={()=>handleItemImportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  key={uuidv4()}
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={()=>deleteItems(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
          onKeyUp={handleKeyPress}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem} >
          Add item
        </button>
      </div>
    </div>
  
  );
}

export default App;