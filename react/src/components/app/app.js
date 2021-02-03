import React, {Component} from 'react';

import TodoList from '../todo-list';
import ItemAddForm from '../item-add-form';
import './app.css';
import moment from "moment";

class App extends Component {
    maxId = 5;
    state = {
        todoData: [
            this.createTodoItem('2020-02-11', '2020-05-18'),
            this.createTodoItem('2020-12-01', '2021-01-06'),
        ],
        saving: false,
        savingError: false,
        message: "",
        calculate: "",
        days: 7,
    };

    createTodoItem(register, lastActivity) {
        return {
            register: register,
            lastActivity: lastActivity,
            id: this.maxId++,
        }
    }

    deleteItem = (id) => {
        this.setState(( {todoData} ) => {
            const arr =  todoData.filter(item => item.id !== id);
            return {
                todoData: arr,
            }
        });
    };

    Calculate = () => {
        const needDays = this.state.days;
        const data = this.state.todoData;
        let returns = 0;
        let instance = 0;
        Object.keys(data).map(function(objectKey, index) {
            var value = data[objectKey];
            let days = moment(value.lastActivity).diff(moment(value.register), 'days');
            console.log(days);
            console.log(needDays);
            if(days >= needDays) {
                returns++;
            }

            let instances = moment().diff(moment(value.register), 'days');
            if(instances >= needDays) {
                instance++;
            }

        });
        console.log("returns: ",returns);
        console.log("instance: ", instance);
        let RRD = returns / instance * 100;
        if(RRD === Infinity || RRD === NaN) { RRD = 0 }
        this.setState(() => {
            return {
                calculate: `Rolling Retention ${needDays} day: ${RRD}%`,
            }
        });
    };

    addItem = (date, activity) => {
        date = moment(date).format('YYYY-MM-DD');
        activity = moment(activity).format('YYYY-MM-DD');
        this.setState(( {todoData} ) => {
            const newArr =  [...todoData, this.createTodoItem(date, activity)];
            return {
                todoData: newArr,
            }
        });
    };

    saveData = async (e) => {
        this.setState(( {saving} ) => {
            return {
                saving: true,
            }
        });

        const url = 'https://app-test-best.herokuapp.com/';
        const data = {data: this.state.todoData};

        try {
            const response = await fetch(url, {
                method: 'POST', // или 'PUT'
                body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = await response.json();
            console.log('Успех:', JSON.stringify(json));

            this.setState(( ) => {
                return {
                    message: "Загрузка...",
                }
            });

            if(json.ok == 1) {
                this.setState(( ) => {
                    return {
                        saving: false,
                        message: json.message,
                    }
                });
            }   else {
                this.setState(( ) => {
                    return {
                        saving: false,
                        savingError: true,
                        message: json.message,
                    }
                });
            }
            setTimeout(function () {
                this.setState(( ) => {
                    return {
                        message: "",
                    }
                });
            } .bind(this), 1500);
        } catch (error) {
            console.error('Ошибка:', error);
            this.setState(( ) => {
                return {
                    saving: false,
                    savingError: true,
                    message: "Ошибка: "+error,
                }
            });
        }
    };

    toggleProperty(arr, id ,propName, value) {
        const idx = arr.findIndex((el) => el.id === id);
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: value};
        return [...arr.slice(0, idx), newItem, ...arr.slice(idx +1)];
    }

    OnChangeDate = (id, value) => {
        console.log(id, value);
        this.setState(( {todoData} ) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'register', value),
            }
        });
    };

    OnChangeLast = (id, value) => {
        console.log(id, value);
        this.setState(( {todoData} ) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'lastActivity', value),
            }
        });
    };




    render() {
        const { todoData } = this.state;
        console.log(this.state.todoData);

        return (
            <div className="ab-app">

                <TodoList todos={todoData}
                          onDeleted={ this.deleteItem }
                          changeDate = {this.OnChangeDate}
                          changeLast = {this.OnChangeLast}
                />
                {!this.state.saving &&
                <button
                    onClick={this.saveData}
                    className="mt-3 btn btn-success text-center"
                >Save to DB</button>
                }
                <button
                    onClick={this.Calculate }
                    className="mt-3 btn btn-warning text-center"
                >Calculate</button>

                {this.state.message.length > 0 && this.state.savingError &&
                <div className="mt-1 alert alert-error" role="alert">
                    {this.state.message}
                </div>
                }
                {this.state.message.length > 0 && !this.state.savingError &&
                <div className="mt-1 alert alert-success" role="alert">
                    {this.state.message}
                </div>
                }

                {this.state.calculate.length > 0 &&
                <div className="mt-1 alert alert-success" role="alert">
                    {this.state.calculate}
                </div>
                }

                <h3 className="mt-5 text-center">Add new:</h3>
                <ItemAddForm onAdd={this.addItem} />
            </div>
        );
    }

};

export default App;

