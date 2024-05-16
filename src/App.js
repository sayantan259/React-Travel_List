import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  function handleItems(item) {
    setItems((i) => [...i, item]);
  }

  function handleDelete(id) {
    setItems((items) => items.filter((item) => id !== item.id));
  }

  function handleClear() {
    const confirm = window.confirm("Do you Want to clear");
    if (confirm) setItems([]);
  }

  function handlePack(id) {
    setItems((items) =>
      items.map((item) =>
        id === item.id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  return (
    <div className="app">
      <Logo />
      <Form onAdd={handleItems} />
      <PackingList
        items={items}
        onDelete={handleDelete}
        onPack={handlePack}
        onClear={handleClear}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}

function Form({ onAdd }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAdd(newItem);

    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip ?</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onDelete, onPack, onClear }) {
  const [sortBy, setSortBy] = useState("input");

  let sorted;

  if (sortBy === "input") sorted = items;
  else if (sortBy === "description")
    sorted = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  else
    sorted = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sorted.map((item) => (
          <Item
            item={item}
            onDelete={onDelete}
            setPack={onPack}
            key={item.id}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort alphabetically</option>
          <option value="packed">Sort by packing status</option>
        </select>
        <button onClick={onClear}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onDelete, setPack }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onClick={() => setPack(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDelete(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <footer className="stats">
        <em>Add some items to your list 🚀!!</em>
      </footer>
    );

  const numItems = items.length;
  const numPacked = items.filter((i) => i.packed === true).length;
  const percent = parseInt((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percent === 100
          ? "You are good to go ✈️!!"
          : `💼 You have ${numItems} items on your list, and you already packed
        ${numPacked}(${numPacked && percent}%)`}
      </em>
    </footer>
  );
}
