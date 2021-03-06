import React, { Component } from 'react';
import '../../assets/styles/Header.scss'

class Header extends Component {

    onRef = nav => {
        this.nav = nav;
        M.Sidenav.init(nav);
    };

    state = {

    };

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="#/welcome" className="brand-logo">Schedule</a>
                    <a href="#" data-target="responsive-menu" className="sidenav-trigger">
                        <i className="material-icons">menu</i>
                    </a>
                    <ul ref={this.onRef} className="sidenav" id="responsive-menu">
                        <li><a href="#/schedule">Programación</a></li>
                        <li><a href="#/period">Período</a></li>
                        <li><a href="#">Teatros</a></li>
                        <li><a href="#">Películas</a></li>
                        <li><a href="#">Usuarios</a></li>
                    </ul>
                    <ul ref={this.onRef} id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="#/schedule">Programación</a></li>
                        <li><a href="#/period">Período</a></li>
                        <li><a href="#">Teatros</a></li>
                        <li><a href="#">Películas</a></li>
                        <li><a href="#">Usuarios</a></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Header;