import React, { useState, useEffect, useReducer } from "react";

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
  { name: "Guitar", cost: 1, val: 1500 },
  { name: "Stereo", cost: 4, val: 3000 },
  { name: "Laptop", cost: 3, val: 2000 }
];

const init_gr = (items, capacity) => {
  const gr = [];
  for (let i = 0; i < items.length; i++) {
    gr.push([]);
    for (let j = 0; j < capacity; j++) {
      gr[i].push({ val: null, chosen: [] });
    }
  }
  return gr;
};

const init_state = {
  items: items_init,
  grid: init_gr(items_init, 4),
  messages: [],
  item_i: 0,
  weight_i: 0,
  capacity: 4
};

function reducer(state, action) {
  switch (action.type) {
    case "RESET":
      const new_grid = init_gr(items_init, 4);
      return {
        ...state,
        grid: new_grid,
        item_i: 0,
        weight_i: 0
      };
    case "STEP":
      return {
        ...state,
        item_i: action.i,
        weight_i: action.w,
        messages: action.messages,
        grid: action.grid
      };
    default:
      throw new Error();
  }
}

function Knapsack() {
  const [state, dispatch] = useReducer(reducer, init_state);
  const [didReset, setDidReset] = useState(true);

  const getMessages = (i, w) => {
    const messages = [];
    const gr_copy = JSON.parse(JSON.stringify(state.grid));
    if (state.items[i].cost > w + 1) {
      messages.push("TOO BIG");
      if (i === 0) {
        messages.push(
          "This is the first item so there are no other rows to check, val is 0"
        );
        gr_copy[i][w] = { val: 0, items: [] };
      } else {
        // Too big, get value from last row
        gr_copy[i][w] = { ...gr_copy[i - 1][w] };
      }
    } else {
      messages.push("IT FITS");
      if (state.items[i].cost === w + 1) {
        // item is size of bag
        if (i === 0 || state.items[i].val > state.grid[i - 1][w].val) {
          if (i === 0) {
            messages.push(
              `No other rows to check, value is ${state.items[i].val}`
            );
            gr_copy[i][w] = {
              val: state.items[i].val,
              items: [state.items[i].name]
            };
          } else {
            messages.push("HIGHER val");
            gr_copy[i][w] = {
              val: state.items[i].val,
              items: [state.items[i].name]
            };
          }
        }
      } else {
        // bag can fit more items
        if (i === 0) {
          // first item
          messages.push(
            "And there's room for more items, but no other items to check"
          );
          gr_copy[i][w] = {
            val: state.items[i].val,
            items: [state.items[i].name]
          };
        } else {
          // not first item
          messages.push(
            `Current item + last bag of capacity ${w + 1 - state.items[i].cost}`
          );
          gr_copy[i][w] = {
            val:
              state.items[i].val +
              state.grid[i - 1][w - state.items[i].cost].val,
            items:
              state.grid[i - 1][w - state.items[i].cost].items +
              [state.items[i].name]
          };
        }
      }
    }
    return { grid: gr_copy, messages };
  };

  const step = e => {
    e.preventDefault();
    let i_i = state.item_i;
    let w_i = state.weight_i;
    if (state.weight_i + 1 < state.capacity) {
      w_i = state.weight_i + 1;
    } else {
      i_i = state.item_i >= state.items.length - 1 ? 0 : state.item_i + 1;
      w_i = 0;
    }
    const updated = getMessages(i_i, w_i);
    dispatch({ type: "STEP", i: i_i, w: w_i, ...updated });
  };

  const reset = e => {
    e.preventDefault();
    setDidReset(true);
    dispatch({ type: "RESET" });
  };

  useEffect(() => {
    if (didReset) {
      const updated = getMessages(0, 0);
      setDidReset(false);
      dispatch({ type: "STEP", i: 0, w: 0, ...updated });
    }
  }, [didReset]);

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
      <button onClick={reset}>Reset</button>
      <div style={container}>
        <div style={items_style}>
          {state.items.map(x => (
            <>
              <h3 key={`items ${x.name}`}>{x.name}</h3>
              <p>Cost: {x.cost}</p>
              <p>Value: {x.val}</p>
            </>
          ))}
        </div>

        <div>
          {state.messages.map(x => (
            <p key={x}>{x}</p>
          ))}
        </div>

        {!!state.grid.length && (
          <div>
            <h2>{state.grid[0].map((x, cap) => cap + 1)}</h2>
            <div style={grid_style}>
              {state.grid.map((row, i) => (
                <div style={rowStyle} key={state.items[i].name}>
                  {row.map((x, j) => {
                    return (
                      <div
                        key={`${row}${j}`}
                        style={
                          i === state.item_i && j === state.weight_i
                            ? currentItemStyle
                            : itemStyle
                        }
                      >
                        {x.val === null ? "?" : x.val}
                        {x.items ? (!!x.items.length ? x.items : "None") : "?"}
                      </div>
                    );
                  })}
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
