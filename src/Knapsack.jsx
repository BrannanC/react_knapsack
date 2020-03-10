import React, { useState, useEffect, useReducer } from "react";

const container = {
  background: "red",
  width: "900px",
  padding: "0 20px",
  height: "60vh",
  margin: "10px auto",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between"
};

const column_style = {
  width: "20%",
  margin: "20px 10px",
  padding: "3px",
  background: "#f5f2ed",
  borderRadius: "10px"
};

const items_style = {
  ...column_style,
  lineHeight: "12px"
};

const item_style = {
  marginBottom: "40px"
};

const messages_style = {
  ...column_style
};

const grid_box_style = {
  ...column_style,
  width: "45%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const grid_style = {
  display: "flex",
  flexDirection: "column"
};

const rowStyle = {
  display: "flex"
};

const grid_item_style = {
  width: "70px",
  height: "64px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  padding: "3px",
  margin: "0 10px"
};

const current_grid_item_style = {
  ...grid_item_style,
  color: "red",
  fontWeight: "bold"
};

const blurStyle = {
  width: "60%",
  margin: "0 auto"
};

const button_style = {
  fontSize: "16px",
  fontWeight: "bold",
  padding: "10px",
  margin: "15px",
  borderRadius: "3px"
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
  const [foundSolution, setFoundSolution] = useState(false);

  const getMessages = (i, w) => {
    const messages = [];
    const cur_item = state.items[i];
    const prev_knapsack = i === 0 ? null : state.grid[i - 1][w];
    const gr_copy = JSON.parse(JSON.stringify(state.grid));
    // Makes a deep copy of the 2D grid array
    if (cur_item.cost > w + 1) {
      // Too big for knapsack
      messages.push(
        `${cur_item.name} weighs ${cur_item.cost}lbs and doesn't fit into ${w +
          1}lb knapsack.`
      );
      if (i === 0) {
        // Too big & first item
        messages.push(
          `This is the first item we're checking and it doesn't fit into a ${w +
            1}lb knapsack. The value for this knapsack is 0 and items is None.`
        );
        gr_copy[i][w] = { val: 0, items: [] };
      } else {
        // Too big, get value from last row
        messages.push(
          `${cur_item.name} doesn't fit - copy the ${w +
            1}lb knapsack from the previous row.`
        );
        gr_copy[i][w] = { ...gr_copy[i - 1][w] };
      }
    } else {
      // The item fits knapsack
      messages.push(
        `${cur_item.name} weighs ${cur_item.cost}lb and fits into ${w +
          1}lb knapsack.`
      );
      if (cur_item.cost === w + 1) {
        // Item is exact capacity of snackpack
        if (i === 0) {
          // Exact fit & first item
          messages.push(
            `This is the first item we are checking and it fits perfectly into the knapsack!`
          );
          messages.push(
            `This knapsack is worth ${cur_item.val} and holds only the ${cur_item.name}.`
          );
          gr_copy[i][w] = {
            val: cur_item.val,
            items: [cur_item.name]
          };
        } else if (cur_item.val > prev_knapsack.val) {
          // Exact fit & not first item & higher value than previous knapsack
          messages.push(
            `${cur_item.name} fits perfectly - but is the value HIGHER or LOWER than the previous knapsack for this capacity?`
          );
          messages.push(`${cur_item.name} is more valuable!`);
          gr_copy[i][w] = {
            val: cur_item.val,
            items: [cur_item.name]
          };
        } else {
          messages.push(
            `${cur_item.name} fits perfectly - but is the value HIGHER or LOWER than the previous knapsack for this capacity?`
          );
          messages.push(
            `${cur_item.name} is less valuable (or same value based on this implementation).`
          );
          gr_copy[i][w] = {
            val: prev_knapsack.val,
            items: prev_knapsack.items
          };
        }
      } else {
        // Bag can fit more items
        if (i === 0) {
          // Can fit more & first item
          messages.push(`There's room for more items!`);
          messages.push(
            `But this is the first item we're checking so only the ${cur_item.name} will go in this knapsack.`
          );
          gr_copy[i][w] = {
            val: cur_item.val,
            items: [cur_item.name]
          };
        } else {
          // Can fit more & not first item
          if (
            cur_item.val + state.grid[i - 1][w - cur_item.cost].val >
            prev_knapsack.val
          ) {
            // Item + extra bag is greater than last
            messages.push(
              `There's ${w +
                1 -
                cur_item.cost}lb of space left in our knapsack.`
            );
            messages.push(
              `${cur_item.name} + previous ${w +
                1 -
                cur_item.cost}lb knapsack is more valuable than the last rows ${w +
                1}lb knapsack.`
            );
            gr_copy[i][w] = {
              val: cur_item.val + state.grid[i - 1][w - cur_item.cost].val,
              items: [
                ...state.grid[i - 1][w - cur_item.cost].items,
                cur_item.name
              ]
            };
          } else {
            // Item + extra bag is less than last
            messages.push(
              `There's ${w +
                1 -
                cur_item.cost}lb of space left in our knapsack.`
            );
            messages.push(
              `${cur_item.name} + previous ${w +
                1 -
                cur_item.cost}lb knapsack is less valuable than the last rows ${w +
                1}lb knapsack.`
            );
            gr_copy[i][w] = {
              val: prev_knapsack.val,
              items: [...prev_knapsack.items]
            };
          }
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
      if (
        state.weight_i + 1 === state.capacity - 1 &&
        i_i === state.items.length - 1
      ) {
        setFoundSolution(true);
      }
    } else {
      if (i_i === state.items.length - 1) {
        reset(e);
        return;
      }
      i_i = state.item_i >= state.items.length - 1 ? 0 : state.item_i + 1;
      w_i = 0;
    }

    const updated = getMessages(i_i, w_i);
    dispatch({ type: "STEP", i: i_i, w: w_i, ...updated });
  };

  const reset = e => {
    e.preventDefault();
    setDidReset(true);
    setFoundSolution(false);
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
      <button style={button_style} onClick={step}>
        Step
      </button>
      <button style={button_style} onClick={reset}>
        Reset
      </button>
      <div style={container}>
        <div style={items_style}>
          {state.items.map(x => (
            <div style={item_style} key={`items ${x.name}`}>
              <h3>{x.name}</h3>
              <p>Cost: {x.cost}</p>
              <p>Value: {x.val}</p>
            </div>
          ))}
        </div>

        <div style={messages_style}>
          {state.messages.map((x, i) =>
            i === 0 ? <h3 key={i}>{x}</h3> : <p key={i}>{x}</p>
          )}
        </div>

        {!!state.grid.length && (
          <div style={grid_box_style}>
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
                            ? current_grid_item_style
                            : grid_item_style
                        }
                      >
                        <span>{x.val === null ? "?" : x.val}</span>
                        {x.items
                          ? !!x.items.length
                            ? x.items.map(item => (
                                <span key={`items${row}${x}${item}`}>
                                  {item}
                                </span>
                              ))
                            : "None"
                          : "?"}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {foundSolution && (
              <p>
                Solution: The highest total value that will also fit in a{" "}
                {state.capacity}lb knapsack is{" "}
                {state.grid[state.items.length - 1][state.capacity - 1].val}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Knapsack;
