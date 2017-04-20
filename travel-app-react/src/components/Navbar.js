import { NavLink, Redirect } from 'react-router-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { clearAccount } from '../actions/account'

class Navbar extends Component  {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        {this.props.token ? <NavLink to="/mytrips">My Trips</NavLink> : <NavLink to="/login">Login</NavLink> }
        {this.props.token ? <NavLink to="/addtrip">Add Trip</NavLink> : <NavLink to="/register">Register</NavLink> }
        {this.props.token ? <NavLink to="/logout">Log Out</NavLink> : null }
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  token: state.Account.token
})


const ConnectedNavbar = connect(mapStateToProps, null)(Navbar)

export default ConnectedNavbar