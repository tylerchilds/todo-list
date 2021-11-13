// tag is a tiny library for binding HTML fragments to JavaScript closures
import tag from 'https://thelanding.page/tag/tag.bundle.js'

// create a new tag: <todo-list>
// pluck out helper functions
// define the initial state and shape of the data
const { html, css, get, on, set, restore } = tag('todo-list', {
  filter: 'ALL',
  items: [
    {
      id: 'dishes',
      completed: false,
      task: 'Dishes'
    },
    {
      id: 'groceries',
      completed: true,
      task: 'Groceries'
    },
    {
      id: 'bills',
      completed: false,
      task: 'Bills'
    }
  ]
})

// a helper function to locate an item by an id
function find(id) {
  const { items } = get()
  return items.find(x => x.id === id)
}

// html is a render function; if a string is returned, it is rendered
// whenever state changes, the render function will be called on each target
html((target) => {
  return `
    <header>
      <h1>Todo List</h1>
      ${status()}
    </header>
    <hr/>
    <main>
      ${form()}
      <hr/>
      <nav>${filters()}</nav>
      <hr/>
      <ul>${list()}</ul>
      <hr/>
      ${actions()}
    </main>
  `
})

// adds a click event listener for when a filter is chosen
// the filter state is the updated to contain the new filter
on('click', '[data-filter]', function chooseFilter({ target }) {
  const { filter } = target.dataset
  set({ filter })
})

// adds a click event listener for when the clear completed action is performed
// the items state is then updated to contain only incomplete items
on('click', '[data-clear-completed]', function clearCompleted() {
  const { items } = get()
  const incompleteItems = items.filter(x => !x.completed)
  set({ items: incompleteItems })
})

// adds a click event listener for when the complete all action is performed
// all items will be marked as completed in the items state
on('click', '[data-complete-all]', function completeAll() {
  const { items } = get()
  const allCompleted = items.map(x => ({...x, completed: true }))
  set({ items: allCompleted })
})

// a render helper for returning buttons for filtering
function filters() {
  // get the filter state
  const { filter } = get()

  // a render helper to generate a button from a key
  const render = (key) => `
    <button data-filter="${key}"${filter === key ? 'class="active"' : ''}>
      ${key}
    </button>
  `

  // loop over filter options and return a string of buttons
  return ['ALL', 'TODO', 'DONE'].map(render).join('')
}

// adds a submit event listener for the form
on('submit', 'form', function submitForm(event) {
  // finds the namescaped input of the form
  const input = event.target['task']

  // if the input is valid, create a new item and clear the field
  if(validate(input)) {
    createItem(input.value);
    input.value = ''
  }

  // don't actually submit fhe form, this is an asynchronous, persisted page
  event.preventDefault()
})

// a quick check to see if the value is not empty
function validate({ value }) { return !!value }

// a render helper for returning a create task form
function form() {
  return `
    <form>
      <input name="task" placeholder="Add a task..." type="text" />
      <button type="submit">Add</button>
    </form>
  `
}

// a render helper for returning the number of tasks remaining
function status() {
  const { items } = get()
  const incomplete = items.filter(x => !x.completed)
  return `${incomplete.length} remaining`
}

// add a click event listener for toggling a task's completeness
on('click', '[data-toggle]', function toggleCompleteness({ target }) {
  // get the id of the toggled task and locate the corresponding item in state
  const { id } = target.dataset;
  const item = find(id)

  // calls a helper function to update the items state for this updated item
  updateItem({
    ...item,
    completed: !item.completed
  })
})

// add a click event listener for removing an item from items state
on('click', '[data-delete]', function remove({ target }) {
  const { id } = target.dataset;
  const item = find(id)

  // calls a helper function to delete this item from the items state
  deleteItem(item)
})

// returns the list of items corresponding to the current filter
function list() {
  // grab the filter and items state
  const { filter, items } = get();

  // a callback function that determines if an item matches the current filter
  const filterItems = (item) => {
    // create a dictionary of true/false from the item based on filter
    const lookup = {
      'ALL': true,
      'TODO': !item.completed,
      'DONE': item.completed
    }
    // use the current filter to know if the item is shown/hidden
    return lookup[filter];
  }

  return items
    .filter(filterItems)
    .map(item => {
      // if the item is completed, mark it as done for styling
      const classList = item.completed ? 'class="done"' : ''

      // for all visible items return a toggle button and a delete button
      return `
        <li>
          <button data-toggle ${classList} data-id="${item.id}">
            ${item.task}
          </button>
          <button data-delete data-id="${item.id}">
            X
          </button>
        </li>
      `
    }).join('') // convert this array to a string
}

// a helper function to add an item to the items state
function createItem(task) {
  // build a new item, with a random id for collision-free duplicates
  const item = {
    task,
    completed: false,
    id: task +  Math.floor((Math.random() * 100) + 1)
  }

  // a helper function for appending an item into the item state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items,
        payload
      ]
    }
  }

  // add the new item to the items state
  set(item, handler);
}

// a helper function to update the items state for an item
function updateItem(item) {
  // a helper function for merging an item with updates in the items state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items.map((item) => {
          if(item.id !== payload.id) {
            return item;
          }

          return {
            ...item,
            ...payload
          }
        })
      ]
    };
  };

  // update the item in the item state
  set(item, handler);
}

// a helper function to remove an item from the items state
function deleteItem(item) {
  // a helper function for filtering the current item out of the item state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items.filter((item) => {
          if(item.id !== payload.id) {
            return item;
          }
        })
      ]
    };
  };

  // remove the item from the item state
  set(item, handler);
}

// a helper function for rendering the clear and complete actions
function actions() {
  // grab the items state
  const { items } = get()

  // create a dictionary of actions to their corresponding markup
  const actions = {
    complete: `<button data-complete-all>complete all</button>`,
    clear: `<button data-clear-completed>clear completed</button>`
  }

  // true, if there are are INCOMPLETED items
  const hasIncompleteItems = items.some(x => !x.completed)
  // true, if there are are COMPLETED items
  const hasCompleteItems = items.some(x => x.completed)

  // conditionally display actions, center aligned on the page
  return `
    <center>
      ${hasIncompleteItems ? actions.complete : ''}
      ${hasCompleteItems ? actions.clear : ''}
    </center>
  `
}

// Cascading Style Sheets in JavaScript!!!!!!!1
css(`
  & form {
    display: grid;
    grid-template-columns: auto auto;
    margin: 1rem 0;
  }

  & button {
    background: #fff;
    border: 2px solid #aaa;
    border-right-color: #777;
    border-bottom-color: #777;
    border-radius: 100%;
    cursor: pointer;
    padding: .6rem 1rem;
  }
  & button:hover,
  & button:focus {
    background: #ddd;
  }
  & button:active {
    background: #999;
    border-top-color: #777;
    border-left-color: #777;
    border-right-color: #aaa;
    border-bottom-color: #aaa;
  }
  & ul {
    margin: 1rem 0;
    padding-left: 0;
  }
  & ul:empty::before {
    content: 'No items for filter';
    display: block;
    font-style: italic;
    text-align: center;
  }
  & li {
    list-style-type: none;
    margin-bottom: .5rem;
    text-align: left;
  }
  & [type="text"] {
    box-sizing: border-box;
    font-size: 1.2rem;
    padding: .25rem 1rem;
    width: 100%;
  }
  & .active {
    background: black;
    color: white;
  }
  & .done {
    color: gray;
    font-style: italic;
    text-decoration: line-through;
  }
  & [data-delete] {
    float: right;
  }
`)
