const Queries = require('../../common/Queries.js');
import React, { Component } from 'react';
import Helpers from '../../common/Helpers.js';
import Storage from '../../common/Storage.js';
import ScheduleRoom from '../partials/ScheduleRoom.jsx';
import ModalScheduleAddMovie from '../modals/ModalScheduleAddMovie.jsx';
import ModalScheduleConfigMovie from '../modals/ModalScheduleConfigMovie.jsx';
import '../../assets/styles/Schedule.scss';


export default class Schedule extends Component {

    state = {
        theaters: [],
        periods: [],
        schedule: [],
        rooms: [],
        selectedRoom: {},
        selectedMovies: [],
        viewModalScheduleAddMovies: false,
        viewModalScheduleConfigMovies: false
    }

    constructor(props) {
        super(props);
    }

    getAllTheater = async () => {
        try {
            let method = 'getAllTheater';
            let token = Storage.tokenSession;
            let query = Queries.getQuery(method, { token });
            let result = await Helpers.post(query);
            if (!result.status) {
                Helpers.showAlertError(result.message)
            } else if (!result.data[method].status) {
                Helpers.showAlertError(result.message)
            } else {
                this.setState({
                    theaters: result.data[method].data.reverse()
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getAllPeriod = async () => {
        try {
            let method = 'getAllPeriod';
            let token = Storage.tokenSession;
            let query = Queries.getQuery(method, { token });
            let result = await Helpers.post(query);
            if (!result.status) {
                Helpers.showAlertError(result.message)
            } else if (!result.data[method].status) {
                Helpers.showAlertError(result.message)
            } else {
                this.setState({
                    periods: result.data[method].data.reverse()
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    getAllRoom = async () => {
        try {
            let method = 'getAllRoom';
            let token = Storage.tokenSession;
            let query = Queries.getQuery(method, { token });
            let result = await Helpers.post(query);
            if (!result.status) {
                Helpers.showAlertError(result.message)
            } else if (!result.data[method].status) {
                Helpers.showAlertError(result.message)
            } else {
                return result.data[method].data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    getOneSchedule = async () => {
        try {
            let fields = ['ddlTheater', 'ddlPeriod'];
            if (!Helpers.validateFields(fields)) {
                return;
            }

            let idTheater = Helpers.getValue('ddlTheater');
            let idPeriod = Helpers.getValue('ddlPeriod');

            if (idTheater === '0' || idPeriod === '0')
                return;

            let method = 'getOneSchedule';
            let token = Storage.tokenSession;
            let query = Queries.getQuery(method, { token, idTheater, idPeriod });
            let result = await Helpers.post(query);
            if (!result.status) {
                Helpers.showAlertError(result.message)
            } else if (!result.data[method].status) {
                Helpers.showAlertError(result.message)
            } else if (Helpers.isNullOrEmpty(result.data[method].data)) {
                this.setState({
                    schedule: [],
                    rooms: []
                });
            } else {
                let data = this.processScheduleResult(result.data[method].data);
                this.setState({
                    schedule: data,
                    rooms: data.rooms
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    processScheduleResult = (data) => {
        data.rooms.map(r => {
            return r.movies.sort(Helpers.sortObject('startAt'));
        });
        return {
            ...data,
            rooms: data.rooms.map(r => {
                return {
                    ...r,
                    movies: r.movies.map(m => {
                        return {
                            ...m,
                            startAt: Helpers.convertDate(m.startAt, true),
                            endAt: Helpers.convertDate(m.endAt, true)
                        }
                    })
                }
            })
        }
    }

    componentDidMount = async () => {
        try {
            await this.getAllPeriod();
            await this.getAllTheater();
            this.getOneSchedule();
        } catch (error) {
            console.log(error);
        }
    }

    showModalScheduleAddMovies = (room) => {
        this.setState({
            viewModalScheduleAddMovies: true,
            selectedRoom: room
        });
    }

    hideModalScheduleAddMovies = () => {
        this.setState({
            viewModalScheduleAddMovies: false
        });
    }

    showModalScheduleConfigMovies = (room, movies) => {
        if (movies.length === 0) {
            Helpers.showAlertError('Please select one or more movies.');
            return;
        }
        this.setState({
            viewModalScheduleAddMovies: false,
            viewModalScheduleConfigMovies: true,
            selectedRoom: room,
            selectedMovies: movies
        });
    }

    hideModalScheduleConfigMovies = () => {
        this.setState({
            viewModalScheduleConfigMovies: false
        });
    }

    addMovies = (selectedRoom, selectedMovies) => {
        //this.hideModalScheduleConfigMovies();
        // console.log(selectedRoom);
        // console.log(selectedMovies);
        // console.log(this.state.schedule);


        if (Helpers.isNullOrEmpty(selectedMovies)
            || Helpers.isNullOrEmpty(selectedMovies[0])) {
            this.setState({
                viewModalScheduleConfigMovies: false,
            });
            return;
        }

        let newRooms = this.state.schedule.rooms.map(r => {
            if (r.idRoom === selectedRoom.idRoom) {
                return {
                    ...r,
                    movies: r.movies.concat(selectedMovies)
                }
            }
            return r;
        });
        debugger
        newRooms.map(r => {
            return r.movies.sort((a, b) => a.startAt - b.startAt);
        });
        this.setState({
            viewModalScheduleConfigMovies: false,
            schedule: {
                ...this.state.schedule,
                rooms: newRooms
            }
        });
    }

    render() {
        let ddStyle = {
            display: 'block'
        }
        return (
            <div>
                {
                    this.state.viewModalScheduleAddMovies ?
                        <ModalScheduleAddMovie
                            hideModal={this.hideModalScheduleAddMovies}
                            selectedRoom={this.state.selectedRoom}
                            showModalScheduleConfigMovies={this.showModalScheduleConfigMovies}
                        />
                        : null
                }
                {
                    this.state.viewModalScheduleConfigMovies ?
                        <ModalScheduleConfigMovie
                            hideModal={this.hideModalScheduleConfigMovies}
                            selectedRoom={this.state.selectedRoom}
                            selectedMovies={this.state.selectedMovies}
                            addMovies={this.addMovies}
                        />
                        : null
                }

                <div className="divTitle">
                    Programación
                </div>
                <div className="row">
                    <div className="col s12 l5">
                        <label>Teatro</label>
                        <select id="ddlTheater" name="Teatro" style={ddStyle} onChange={this.getOneSchedule}>
                            <option value="0">--- Seleccione un Teatro ---</option>
                            {
                                this.state.theaters.map((theater, index) => {
                                    return (
                                        <option key={index} value={theater._id}>{theater.nombre}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="col s12 l5">
                        <label>Período</label>
                        <select id="ddlPeriod" name="Periodo" style={ddStyle} onChange={this.getOneSchedule}>
                            {
                                this.state.periods.map((period, index) => {
                                    return (
                                        <option key={index} value={period._id}>{`${Helpers.convertDate(period.dateFrom)} - ${Helpers.convertDate(period.dateUp)} (${period.flag})`}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="col s12 l2 right-align">
                        <a className="waves-effect waves-light btn-small">Guardar</a>
                    </div>
                </div>
                <div className="divDivider"></div>
                <div className="divScheduleRoomMain">
                    {
                        (this.state.rooms.length > 0) ?
                            this.state.schedule.rooms.map((room, index) => {
                                return (
                                    <ScheduleRoom
                                        key={index}
                                        room={room}
                                        showModalScheduleAddMovies={this.showModalScheduleAddMovies}
                                        showModalScheduleConfigMovies={this.showModalScheduleConfigMovies}
                                    />
                                );
                            })
                            : null
                    }
                </div>
            </div>
        );
    }
}
