import React, {Component} from 'react';
import './item-add-form.css';
import moment from "moment";

class ItemAddForm extends Component {
    state = {
        date: "",
        activity: "",
    };
    changeDate = (e) => {
        e.preventDefault();
        this.setState({
            date: e.target.value,
        })
    };

    changeActivity = (e) => {
        e.preventDefault();
        this.setState({
            activity: e.target.value,
        })
    };
    onSubmit = (e) => {
        e.preventDefault();
        if(this.state.date.length > 0 && this.state.activity.length > 0) {
            this.props.onAdd(this.state.date,this.state.activity);
            this.setState({
                date: "",
                activity: "",
            });
        }

    };
  render() {
      return (
          <form className="input-group mb-3 item-add-form"
                onSubmit={this.onSubmit} >
              <input type="date"
                     className="form-control"
                     placeholder="Date Registration"
                     value={this.state.date}
                     onChange={this.changeDate} />

               <input type="date"
                     className="form-control"
                     placeholder="Date Last Activity"
                     value={this.state.activity}
                     onChange={this.changeActivity} />
                  <div className="input-group-append">
                      <button
                          className="btn btn-success"
                      >Add item</button>
                  </div>
          </form>
      );
  }
};

export default ItemAddForm;
