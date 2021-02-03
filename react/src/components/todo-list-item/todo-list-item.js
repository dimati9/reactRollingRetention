import React, {Component} from 'react';
import moment from 'moment'

import './todo-list-item.css';

class TodoListItem extends Component {
    state = {
        date: "",
        activity: "",
    };

    OnchangeDate = (e) => {
        e.preventDefault();
        this.setState({
            date: e.target.value,
        });
        this.props.changeDate(this.props.id,e.target.value,'date');
    };


    changeActivity = (e) => {
        e.preventDefault();
        this.setState({
            activity: e.target.value,
        })
        this.props.changeDate(this.props.id,e.target.value, 'last');
    };

    componentDidMount() {
        this.setState({
            date: this.props.register,
            activity: this.props.lastActivity,
        })
    }

    render() {
        const {onDeleted} = this.props;


        return (
            <span className="input-group mb-3 item-add-form">
        <input
            className="form-control"
            type="date"
            value={moment(this.state.date).format("YYYY-MM-DD")}
            onChange={this.OnchangeDate} />

        <input type="date"
               className="form-control"
               value={moment(this.state.activity).format("YYYY-MM-DD")}
               onChange={this.changeActivity} />

      <button type="button"
              className="btn btn-outline-danger btn-sm float-right"
              onClick={onDeleted}>
        <i className="fa fa-trash-o"/>
      </button>
    </span>
        );
    }
}


export default TodoListItem;
