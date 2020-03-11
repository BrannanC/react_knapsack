import React, { useState, useEffect, useReducer } from "react";

const knap_page = {
  margin: "40px auto 90px"
};

const container = {
  background: "black",
  width: "900px",
  padding: "0 20px",
  minHeight: "60vh",
  margin: "10px auto",
  borderRadius: "10px",
  display: "flex"
};

const top_container = {
  ...container,
  flexDirection: "column",
  minHeight: 0
};

const blurb_container = {
  margin: "20px",
  padding: "3px",
  background: "#f5f2ed",
  borderRadius: "10px"
};

const blurb_style = {
  width: "70%",
  margin: "0 auto",
  padding: "10px"
};

const column_style = {
  width: "20%",
  margin: "20px 10px",
  padding: "3px",
  background: "#f5f2ed",
  borderRadius: "10px"
};

const items_style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  margin: "61px 0 20px"
};

const single_item = {
  margin: "5px 0"
};

const grey_item_style = {
  ...single_item,
  color: "#546773"
};

const items_grid_container = {
  display: "flex"
};

const messages_style = {
  ...column_style,
  flexGrow: 1,
  padding: "15px"
};

const grid_box_style = {
  ...column_style,
  flexGrow: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const grid_header_style = {
  width: "100%",
  margin: "15px 0 0 0",
  padding: 0,
  fontWeight: "bold"
};

const capacity_style = {
  display: "flex",
  justifyContent: "space-around",
  fontWeight: "bold"
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
  minHeight: "64px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid black",
  padding: "3px",
  margin: "10px"
};

const highlighted_style = {
  ...grid_item_style,
  color: "red",
  opacity: 0.7,
  border: "2px solid black",
  fontWeight: "bold"
};

const current_grid_item_style = {
  ...grid_item_style,
  background: "red",
  color: "black",
  border: "2px solid black",
  fontWeight: "bold"
};

const small_p = {
  fontSize: "12px",
  margin: "0"
};

const big_p = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: "4px 0"
};

const button_style = {
  fontSize: "16px",
  fontWeight: "bold",
  padding: "10px",
  margin: "15px",
  borderRadius: "3px"
};

const possible_items = [
  { name: "Ukulele", cost: 1, val: 1500 },
  { name: "Stereo", cost: 4, val: 3000 },
  { name: "Laptop", cost: 3, val: 2000 },
  { name: "Garbage", cost: 3, val: 500 },
  { name: "Diamond", cost: 1, val: 4000 },
  { name: "Sandwich", cost: 1, val: 750 },
  { name: "Leaf Blower", cost: 4, val: 2000 },
  { name: "Iggy the Iguana", cost: 2, val: 5000 }
];

const items_init = [possible_items[0], possible_items[1], possible_items[2]];

const shuffleArr = arr => {
  const newArr = [...arr];
  for (let i = 0; i < newArr.length; i++) {
    let placeholder = newArr[i];
    let newIndex = Math.floor(Math.random() * newArr.length);
    newArr[i] = newArr[newIndex];
    newArr[newIndex] = placeholder;
  }
  return newArr;
};

const shuffleItems = arr => {
  const newArr = [...arr];
  const possibleCopy = shuffleArr(possible_items);
  for (let i = 0; i < newArr.length; i++) {
    newArr[i] = possibleCopy[i];
  }
  return newArr;
};

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
        weight_i: 0,
        items: items_init
      };
    case "STEP":
      return {
        ...state,
        item_i: action.i,
        weight_i: action.w,
        messages: action.messages,
        grid: action.grid
      };
    case "SHUFFLE":
      const shuffled_grid = init_gr(action.items, 4);
      return {
        ...state,
        grid: shuffled_grid,
        item_i: 0,
        weight_i: 0,
        items: action.items
      };
    default:
      throw new Error();
  }
}

function Knapsack() {
  const [state, dispatch] = useReducer(reducer, init_state);
  const [didReset, setDidReset] = useState(true);
  const [foundSolution, setFoundSolution] = useState(false);
  const [prevOptimal, setPrevOptimal] = useState(null);
  const [lastSmallKnap, setLastSmallKnap] = useState(null);

  const getGridData = (i, w) => {
    const messages = [];
    const cur_item = state.items[i];
    const prev_knapsack = i === 0 ? null : state.grid[i - 1][w];
    const prev_knapsack_indexes = i === 0 ? null : { i: i - 1, w: w };
    let smallKnapSack = null;
    setPrevOptimal(prev_knapsack_indexes);
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
          smallKnapSack = { i: i - 1, w: w - cur_item.cost };
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
    setLastSmallKnap(smallKnapSack);
    return { grid: gr_copy, messages };
  };

  const step = e => {
    e.preventDefault();
    let i_i = state.item_i;
    let w_i = state.weight_i;
    if (state.weight_i + 1 < state.capacity) {
      w_i = state.weight_i + 1;
      if (
        // Reached end
        state.weight_i + 1 === state.capacity - 1 &&
        i_i === state.items.length - 1
      ) {
        setFoundSolution(true);
      }
    } else {
      if (i_i === state.items.length - 1) {
        // Moving past end (auto shuffle)
        shuffle(e);
        return;
      }
      i_i = state.item_i >= state.items.length - 1 ? 0 : state.item_i + 1;
      w_i = 0;
    }
    // setDidStep(true);
    const updated = getGridData(i_i, w_i);
    dispatch({ type: "STEP", i: i_i, w: w_i, ...updated });
  };

  const reset = e => {
    e.preventDefault();
    setDidReset(true);
    setFoundSolution(false);
    dispatch({ type: "RESET" });
  };

  const shuffle = e => {
    e.preventDefault();
    const newItems = shuffleItems(state.items);
    setDidReset(true);
    setLastSmallKnap(null);
    setPrevOptimal(null);
    setFoundSolution(false);
    dispatch({ type: "SHUFFLE", items: newItems });
  };

  useEffect(() => {
    if (didReset) {
      const updated = getGridData(0, 0);
      setDidReset(false);
      setLastSmallKnap(null);
      setPrevOptimal(null);
      dispatch({ type: "STEP", i: 0, w: 0, ...updated });
    }
  }, [didReset]);

  return (
    <div className="Knapsack" style={knap_page}>
      <div style={top_container}>
        <div style={blurb_container}>
          <h3>Dynamic Programming Solution for The Knapsack</h3>
          <p style={blurb_style}>
            Given a set of items, each with a value and weight, and a knapsack
            with a given capacity, find the maximum value that will fit in the
            knapsack.
          </p>
          <p style={blurb_style}>
            This solution divides the capacity of the knapsack into smaller
            knapsacks and adds one item at a time checking for the most valuable
            combination of items for each knapsack. I like to think of it as we
            have a pile of available items and a row of knapsacks on the floor
            from 1lb - (capacity)lbs. Then we pull items from our available pile
            one by one and check for the highest value, with only our checked
            items, at each size. For each new item we check we know the previous
            row holds the highest possible value for each size knapsack. First,
            initialize a 2d array of size (number of items * capacity).
          </p>
        </div>
      </div>

      <div style={container}>
        <div style={messages_style}>
          {state.messages.map((x, i) =>
            i === 0 ? <h3 key={i}>{x}</h3> : <p key={i}>{x}</p>
          )}
        </div>

        {!!state.grid.length && (
          <div style={grid_box_style}>
            <p style={grid_header_style}>CAPACITY</p>
            <div style={items_grid_container}>
              <div style={items_style}>
                {state.items.map((x, i) => (
                  <div
                    style={i > state.item_i ? grey_item_style : single_item}
                    key={`items ${i}`}
                  >
                    <p style={big_p}>{x.name}</p>
                    <p style={small_p}>Weight: {x.cost}lb</p>
                    <p style={small_p}>Value: {x.val}</p>
                  </div>
                ))}
              </div>
              <div style={grid_style}>
                <p style={capacity_style}>
                  {state.grid[0].map((x, cap) => (
                    <span key={cap}>{cap + 1}lb</span>
                  ))}
                </p>
                {state.grid.map((row, i) => (
                  <div style={rowStyle} key={`${state.items[i].name} ${i}`}>
                    {row.map((x, j) => {
                      return (
                        <div
                          key={`${row}${j}`}
                          style={
                            (lastSmallKnap &&
                              lastSmallKnap.i === i &&
                              lastSmallKnap.w === j) ||
                            (i === state.item_i && j === state.weight_i)
                              ? current_grid_item_style
                              : prevOptimal &&
                                prevOptimal.i === i &&
                                prevOptimal.w === j
                              ? highlighted_style
                              : grid_item_style
                          }
                        >
                          <span>{x.val === null ? "?" : x.val}</span>
                          {x.items
                            ? !!x.items.length
                              ? x.items.map(item => (
                                  <span key={`items${row}${x.name}${item}`}>
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
            </div>
            <div>
              <button style={button_style} onClick={step}>
                Step
              </button>
              <button style={button_style} onClick={reset}>
                Reset
              </button>
              <button style={button_style} onClick={shuffle}>
                Shuffle
              </button>
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
