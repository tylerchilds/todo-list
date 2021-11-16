import findItemById from '../helpers/findItemById.js'
import {
  createItem,
  updateItem,
  deleteItem
} from '../models/todoListMutations.js'

export default function hearTodoList($) {
  // adds a click event listener for when a filter is chosen
  // the filter state is the updated to contain the new filter
  $.on('click', '[data-filter]', function chooseFilter({ target }) {
    const { filter } = target.dataset
    $.set({ filter })
  })

  // adds a click event listener for when the clear completed action is performed
  // the items state is then updated to contain only incomplete items
  $.on('click', '[data-clear-completed]', function clearCompleted() {
    const { items } = $.get()
    const incompleteItems = items.filter(x => !x.completed)
    $.set({ items: incompleteItems })
  })

  // adds a click event listener for when the complete all action is performed
  // all items will be marked as completed in the items state
  $.on('click', '[data-complete-all]', function completeAll() {
    const { items } = $.get()
    const allCompleted = items.map(x => ({...x, completed: true }))
    $.set({ items: allCompleted })
  })

  // adds a submit event listener for the form
  $.on('submit', 'form', function submitForm(event) {
    // finds the namescaped input of the form
    const input = event.target['task']

    // if the input is valid, create a new item and clear the field
    if(validate(input)) {
      createItem.call($, input.value)
      input.value = ''
    }

    // don't actually submit fhe form, this is an asynchronous, persisted page
    event.preventDefault()
  })

  // a quick check to see if the value is not empty
  function validate({ value }) { return !!value }

  // add a click event listener for toggling a task's completeness
  $.on('click', '[data-toggle]', function toggleCompleteness({ target }) {
    // get the id of the toggled task and locate the corresponding item in state
    const { id } = target.dataset
    const item = findItemById.call($, id)

    // calls a helper function to update the items state for this updated item
    updateItem.call($, {
      ...item,
      completed: !item.completed
    })
  })

  // add a click event listener for removing an item from items state
  $.on('click', '[data-delete]', function remove({ target }) {
    const { id } = target.dataset
    const item = findItemById.call($, id)

    // calls a helper function to delete this item from the items state
    deleteItem.call($, item)
  })
}
