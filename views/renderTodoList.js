// html is a render function; if a string is returned, it is rendered
// whenever state changes, the render function will be called on each target
export default function renderTodoList($) {
  $.html((target) => {
    return `
      <header>
        <h1>Todo List</h1>
        ${status($)}
      </header>
      <hr/>
      <main>
        ${form($)}
        <hr/>
        <nav>${filters($)}</nav>
        <hr/>
        <ul>${list($)}</ul>
        <hr/>
        ${actions($)}
      </main>
    `
  })
}

// a render helper for returning buttons for filtering
function filters($) {
  // get the filter state
  const { filter } = $.get()

  // a render helper to generate a button from a key
  const render = (key) => `
    <button data-filter="${key}"${filter === key ? 'class="active"' : ''}>
      ${key}
    </button>
  `

  // loop over filter options and return a string of buttons
  return ['ALL', 'TODO', 'DONE'].map(render).join('')
}

// a render helper for returning a create task form
function form($) {
  return `
    <form>
      <input name="task" placeholder="Add a task..." type="text" />
      <button type="submit">Add</button>
    </form>
  `
}

// a render helper for returning the number of tasks remaining
function status($) {
  const { items } = $.get()
  const incomplete = items.filter(x => !x.completed)
  return `${incomplete.length} remaining`
}

// returns the list of items corresponding to the current filter
function list($) {
  // grab the filter and items state
  const { filter, items } = $.get()

  // a callback function that determines if an item matches the current filter
  const filterItems = (item) => {
    // create a dictionary of true/false from the item based on filter
    const lookup = {
      'ALL': true,
      'TODO': !item.completed,
      'DONE': item.completed
    }
    // use the current filter to know if the item is shown/hidden
    return lookup[filter]
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

// a helper function for rendering the clear and complete actions
function actions($) {
  // grab the items state
  const { items } = $.get()

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
