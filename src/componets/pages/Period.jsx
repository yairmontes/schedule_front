const Queries = require('../../common/Queries.js');
import React, { Component } from 'react';
import Helpers from '../../common/Helpers.js';
import Loading from '../partials/Loading.jsx';
import Storage from '../../common/Storage.js';


class Period extends Component {

    state = {
        showLoading: false,
        periods: []
    };

    constructor(props) {
        super(props);
    }

    save = async () => {
        try {
            this.handleLoading();
            let fields = ['txtPeriodFlag', 'datePeriodStart', 'datePeriodEnd'];
            if (!Helpers.validateFields(fields)) {
                this.closeLoading();
                return;
            }
            let method = 'addPeriod';
            let token = Storage.tokenSession;
            let flag = Helpers.getValue('txtPeriodFlag');
            let dateFrom = Helpers.getValue('datePeriodStart');
            let dateUp = Helpers.getValue('datePeriodEnd');
            let query = Queries.getQuery(method, { token, flag, dateFrom, dateUp });
            let result = await Helpers.post(query);
            if (!result.status) {
                this.closeLoading();
                Helpers.showAlertError(result.message);
            } else if (!result.data[method].status) {
                this.closeLoading();
                Helpers.showAlertError(result.data[method].message);
            } else {
                this.getPeriods();
                this.closeLoading();
                Helpers.showAlertAdd();
            }
        } catch (error) {
            console.log(error);
        }
    }

    getPeriods = async () => {
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

    deletePeriod = (_id) => {
        Helpers.showAlertConfirm('¿Confirma que desea eliminar este período?', async () => {
            try {
                this.handleLoading();
                let method = 'deletePeriod';
                let token = Storage.tokenSession;
                let query = Queries.getQuery(method, { token, _id });
                let result = await Helpers.post(query);
                if (!result.status) {
                    this.closeLoading();
                    Helpers.showAlertError(result.message)
                } else if (!result.data[method].status) {
                    this.closeLoading();
                    Helpers.showAlertError(result.message)
                } else {
                    this.getPeriods();
                    this.closeLoading();
                    Helpers.showAlertDelete();
                }
            } catch (error) {
                console.log(error);
            }
        });
    }

    componentDidMount = () => {
        this.getPeriods();
    }

    handleLoading = () => {
        this.setState({
            showLoading: true
        });
    }

    closeLoading = () => {
        this.setState({
            showLoading: false
        });
    }

    render() {
        return (
            <div>
                <Loading visible={this.state.showLoading} />
                <div className="divTitle">
                    Período
                </div>
                <div className="row">
                    <div className="col s12 l4">
                        <label>Nombre</label>
                        <input type="text" id="txtPeriodFlag" name="Nombre de período" />
                    </div>
                    <div className="col s12 l3">
                        <label>Fecha Desde</label>
                        <input type="date" id="datePeriodStart" name="Fecha inicial" />
                    </div>
                    <div className="col s12 l3">
                        <label>Fecha Hasta</label>
                        <input type="date" id="datePeriodEnd" name="Fecha final" />
                    </div>
                    <div className="col s12 l2 right-align">
                        <a className="waves-effect waves-light btn-small" onClick={this.save}>Guardar</a>
                    </div>
                </div>
                <div className="divDivider"></div>
                <div className="row">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre Período</th>
                                <th>Fecha Desde</th>
                                <th>Fecha Hasta</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.periods.map((period, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{period.flag}</td>
                                            <td>{Helpers.convertDate(period.dateFrom)}</td>
                                            <td>{Helpers.convertDate(period.dateUp)}</td>
                                            <td>
                                                <a className="waves-effect waves-light btn-small" onClick={() => this.deletePeriod(period._id)}>Eliminar</a>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Period;