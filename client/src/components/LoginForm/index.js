import React, { Component } from "react";
import axios from 'axios'
import "./index.css";

class LoginForm extends Component {
  state={
    email:'',
    password:''
  }
  onUpdateValues = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onHandleLogin=async (event)=>{
   event.preventDefault();
   const {email,password}=this.state
   try{
   const response=await axios.post('http://localhost:5000/login/',{
    email:email,
    password:password
   })
   if(response.status === 200){
    localStorage.setItem('username',response.data.split('@')[0])
    const {navigate}=this.props;
    navigate('/')
   }
   }catch(err){
    alert('Invalid E-Mail/Password')
   
   }

  }
  render() {
    return (
      <div className="login-container d-flex justify-content-center align-items-center vh-100">
        <div className="log-in-container shadow p-5 rounded bg-light">
          <form onSubmit={this.onHandleLogin}>
            <h1 className="login-head text-center mb-4">Login</h1>
            <div className="form-group mb-3">
              <input type="email" name='email' className="form-control" placeholder="Email" onChange={this.onUpdateValues} required />
            </div>
            <div className="form-group mb-3">
              <input type="password" className="form-control" name='password' placeholder="Password"  onChange={this.onUpdateValues}  required />
            </div>
            <button type="submit" className="btn btn-danger btn-block">
              Sign In
            </button>
          </form>
          <p className="login-para mt-3 text-center">
            Don't have an account? <a href="/createAccount">Create Account</a>
          </p>
        </div>
      </div>
    );
  }
}

export default LoginForm;
