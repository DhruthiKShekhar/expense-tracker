import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState(() =>
    JSON.parse(localStorage.getItem("expenses")) || []
  );
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!amount || !category) return;
    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString(),
    };
    setExpenses([...expenses, newExpense]);
    setAmount("");
    setCategory("");
    setDescription("");
  };

  const filtered = filter
    ? expenses.filter((e) => e.category === filter)
    : expenses;

  const exportCSV = () => {
    const csv = Papa.unparse(
      filtered.map((e) => ({
        Amount: e.amount,
        Category: e.category,
        Description: e.description,
        Date: e.date,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expenses.csv");
  };

  const uniqueCategories = [...new Set(expenses.map((e) => e.category))];

  return (
    <div className="App">
      <h2>💸 Expense Tracker</h2>
      <div className="form">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          list="categories"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <datalist id="categories">
          {uniqueCategories.map((cat, i) => (
            <option key={i} value={cat} />
          ))}
        </datalist>
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addExpense}>Add</button>
      </div>

      <div className="filters">
        <span>Filter:</span>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="">All</option>
          {uniqueCategories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      <ul className="expense-list">
        {filtered.map((e) => (
          <li key={e.id}>
            ₹{e.amount} - {e.category} <small>{e.description}</small>
            <br />
            <small>{new Date(e.date).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
