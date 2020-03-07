import React, { useState, useEffect } from "react";
import { findByLabelText } from "@testing-library/react";

const container = {
  background: "red",
  width: "900px",
  height: "80vh",
  margin: "0 auto",
  display: "flex"
};

const items_style = {};

const grid_style = {
  display: "flex",
  flexDirection: "column"
};

const rowStyle = {
  display: "flex"
};

const currentItemStyle = {
  color: "white",
  border: "1px solid black"
};

const blurStyle = {
  width: "60%",
  margin: "0 auto"
};

const itemStyle = {
  border: "1px solid black"
};

const items_init = [
  { name: "Stereo", cost: 4, value: 3000 },
  { name: "Guitar", cost: 1, value: 1500 },
  { name: "Laptop", cost: 3, value: 2000 }
];

function Knapsack() {
  const [grid, setGrid] = useState([]);
  const [items, setItems] = useState(items_init);
  const [capacity, setCapacity] = useState(4);
  const [messages, setMessages] = useState(["oh hi there"]);
  const [item_i, setItem_i] = useState(0);
  const [weight_i, setWeight_i] = useState(0);
  const [didStep, setDidStep] = useState(true);

  useEffect(() => {
    const gr = [];
    for (let i = 0; i < items.length; i++) {
      gr.push([]);
      for (let j = 0; j < capacity; j++) {
        gr[i].push({ value: null, chosen: [] });
      }
    }
    setGrid(gr);
  }, [items]);

  const getMessages = (i, w) => {
    const messages = [];
    if (items[i].cost > w + 1) {
      messages.push("TOO BIG");
      if (i === 0) {
        messages.push(
          "This is the first item so there are no other rows to check, value is 0"
        );
        const gr_copy = JSON.parse(JSON.stringify(grid));
        console.log(gr_copy);
        gr_copy[i][w] = { ...gr_copy[i][w], value: 0 };
        setGrid(gr_copy);
      }
    } else {
      messages.push("IT FITS");
    }
    setDidStep(false);
    setMessages(messages);
  };
  useEffect(() => {
    if (!!grid.length && didStep) {
      getMessages(item_i, weight_i);
    }
  }, [item_i, weight_i, grid]);

  const step = e => {
    e.preventDefault();
    let i_i = item_i;
    let w_i = weight_i;
    if (weight_i + 1 < capacity) {
      w_i = weight_i + 1;
      setWeight_i(w_i);
    } else {
      i_i = item_i >= items.length - 1 ? 0 : item_i + 1;
      w_i = 0;
      setItem_i(i_i);
      setWeight_i(w_i);
    }
    setDidStep(true);
  };

  return (
    <div className="Knapsack">
      <h3>Dynamic Programming Solution for The Knapsack</h3>
      <p style={blurStyle}>
        This solution divides the capacity of the knapsack into smaller
        knapsacks and adds one item at a time checking for the most valuable
        combination of items for each knapsack. First, initialize a 2d array of
        size (number of items * capacity).
      </p>
      <button onClick={step}>Step</button>
      <div style={container}>
        <div style={items_style}>
          {items.map(x => (
            <p>{x.name}</p>
          ))}
        </div>

        <div>
          {messages.map(x => (
            <p>{x}</p>
          ))}
        </div>

        {!!grid.length && (
          <div>
            <h2>{grid[0].map((x, cap) => cap + 1)}</h2>
            <div style={grid_style}>
              {grid.map((row, i) => (
                <div style={rowStyle}>
                  {row.map((x, j) => (
                    <div
                      style={
                        i === item_i && j === weight_i
                          ? currentItemStyle
                          : itemStyle
                      }
                    >
                      {x.value === null ? "?" : x.value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Knapsack;
