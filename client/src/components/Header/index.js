import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.css';

class Header extends Component {
    state={
        userName:''
    }
    componentDidCatch(){
        this.getUserName();
    }
    getUserName=async ()=>{
     const username=localStorage.getItem('username')
     
     console.log(username)
     this.setState({userName:username})
    }
    render() {
        const { userName } = this.state;

        return (
            <nav className="dashboard-navbar shadow-lg">
                <h1 className="dashboard-navbar-heading">Welcome, {userName}</h1>
                <div className="dashboard-navbar-links-container">
                    <Link to="/" className="dashboard-navbar-link">Home</Link>
                    <Link to="/donate" className="dashboard-navbar-link">Donate</Link>
                    <Link to="/donors" className="dashboard-navbar-link">Donors</Link>
                    <Link to="/about" className="dashboard-navbar-link">About Us</Link>
                    <Link to="/logout" className="dashboard-navbar-link">
                        <button className="dashboard-logout-button">Logout</button>
                    </Link>
                </div>
            </nav>
        );
    }
}

export default Header;
