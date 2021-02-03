import React, {Component} from 'react';

import TodoListItem from '../todo-list-item';
import './todo-list.css';

class TodoList extends Component {

  onChange = (id, value, type) => {
    // maybe === ?
    if(type == 'date') {
      this.props.changeDate(id,value);
    } else {
        this.props.changeLast(id,value);
    }
  };

  render() {
    const { todos, onDeleted} = this.props;
    const elements = todos.map((item) => {
      const { id, ...items } = item;


      return (
          <li key={id} className="list-group-item">
            <TodoListItem
                {...items }
                onDeleted={() => onDeleted(id)}
                changeDate={this.onChange}
                id={id}
            />
          </li>
      );
    });

    return (
        <ul className="list-group list" >
          <h3>Date Registration / Date Last Activity</h3>
          { elements }
        </ul>
    );
  }
}


export default TodoList;
