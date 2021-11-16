// a helper function to add an item to the items state
export function createItem(task) {
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
  this.set(item, handler)
}

// a helper function to update the items state for an item
export function updateItem(item) {
  // a helper function for merging an item with updates in the items state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items.map((item) => {
          if(item.id !== payload.id) {
            return item
          }

          return {
            ...item,
            ...payload
          }
        })
      ]
    }
  }

  // update the item in the item state
  this.set(item, handler)
}

// a helper function to remove an item from the items state
export function deleteItem(item) {
  // a helper function for filtering the current item out of the item state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items.filter((item) => {
          if(item.id !== payload.id) {
            return item
          }
        })
      ]
    }
  }

  // remove the item from the item state
  this.set(item, handler)
}

export default {
  createItem,
  updateItem,
  deleteItem
}
