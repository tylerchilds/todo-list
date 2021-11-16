// tag is a tiny library for binding HTML fragments to JavaScript closures
import tag from 'https://thelanding.page/tag/tag.bundle.js'

import initialTodoList from './data/initialTodoList.js'

import renderTodoList from './views/renderTodoList.js'
import styleTodoList from './styles/styleTodoList.js'
import hearTodoList from './events/hearTodoList.js'

// create a new tag: <todo-list>
// define the initial state and shape of the data
const $ = tag('todo-list', initialTodoList)

renderTodoList($)
styleTodoList($)
hearTodoList($)
