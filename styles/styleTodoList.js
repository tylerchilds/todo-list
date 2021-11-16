export default function styleTodoList($) {
  // Cascading Style Sheets in JavaScript!!!!!!!1
  $.css(`
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
}
