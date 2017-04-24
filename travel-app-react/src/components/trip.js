import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Modal from 'react-modal'
import { fetchTrip, updateStartDate, updateEndDate, leaveTrip, deleteTrip } from '../actions/trips'
import ConnectedActivities from './activitiesList'
import ConnectedAddActivity from './addActivity'
import ConnectedAddFriendToTrip from './addFriendToTrip'
import { customStyles } from '../stylesheets/modal'
import Dropdown from 'react-dropdown'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import '../stylesheets/button_tab.css'

class Trip extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toggle: 'planned',
      startDate: moment(props.trip.start_date),
      endDate: moment(props.trip.end_date),
      isConfirmationModalOpen: false,
      isTransferOwnershipModalOpen: false,
      newOwner: '',
      isTransferOwnershipError: false,
    }
    this.handleClickPlan = this.handleClickPlan.bind(this)
    this.handleClickAdd = this.handleClickAdd.bind(this)
    this.handleDateEnd = this.handleDateEnd.bind(this)
    this.handleDateStart = this.handleDateStart.bind(this)
    this.listFriends = this.listFriends.bind(this)
    this.renderDateFields = this.renderDateFields.bind(this)
    this.leaveTripClick = this.leaveTripClick.bind(this)
    this.ownerLeaveTripClick = this.ownerLeaveTripClick.bind(this)
    this.renderDelete = this.renderDelete.bind(this)
    this.handleRedirect = this.handleRedirect.bind(this)
    this.deleteTripClick = this.deleteTripClick.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.openTransferOwnershipModal = this.openTransferOwnershipModal.bind(this)
    this.openConfirmationModal = this.openConfirmationModal.bind(this)
    this.onOwnerSelect = this.onOwnerSelect.bind(this)
    this.renderOwnerFields = this.renderOwnerFields.bind(this)
  }

  componentWillMount() {
    let tripID = this.props.match.params.id
    this.props.fetchTrip(tripID)
  }

  handleClickPlan() {
    this.setState({
      toggle: 'planned'
    })
    this.props.fetchTrip(this.props.match.params.id)
  }

  handleClickAdd() {
    this.setState({
      toggle: 'add'
    })
    this.props.fetchTrip(this.props.match.params.id)
  }

  listFriends() {
    let friends = []
      if (this.props.trip.accounts) {
        friends = this.props.trip.accounts.filter((friend) => friend.id !== this.props.account.account_id)
      }
    if (friends.length === 0) {
      return <h4 className="sub-title">You haven't added any friends yet!</h4>
    } else {
      return friends.map((friend) => friend.username)
      }
    }


  handleDateStart(date) {
    this.setState({
      startDate: date
    })
    this.props.updateStartDate(date, this.props.trip.id, this.props.account.token)
  }

  handleDateEnd(date) {
    this.setState({
      endDate: date
    })
    this.props.updateEndDate(date, this.props.trip.id, this.props.account.token)
  }

  renderDateFields() {
    let trip = this.props.trip
    if (this.props.account.account_id === trip.creator_id) {
      return (
        <div>
          <DatePicker className="custom-input trip-edit-field" selected={this.state.startDate} onChange={this.handleDateStart}/>
          <DatePicker className="custom-input trip-edit-field" selected={this.state.endDate} onChange={this.handleDateEnd}/>
        </div>
      )} else {
        return (
          <div>
            <input className="custom-input trip-edit-field" value={trip.start_date} disabled="true"/>
            <input className="custom-input trip-edit-field" value={trip.end_date} disabled="true"/>
          </div>
        )}
  }

  renderDelete() {
    let trip = this.props.trip
    if (trip.creator_id === this.props.account.id) {
      return <button onClick={this.deleteTripClick}>Delete Trip</button>
    }
  }

  closeModal() {
    this.setState({
      isConfirmationModalOpen: false,
      isTransferOwnershipModalOpen: false,
      isTransferOwnershipError: false,
      newOwner: ''
    })
  }

  openTransferOwnershipModal() {
    this.setState({
      isTransferOwnershipModalOpen: true,
    })
  }

  openConfirmationModal() {
    this.setState({
      isConfirmationModalOpen: true,
    })
  }


  deleteTripClick() {
    this.props.deleteTrip(this.props.account.account_id, this.props.account.token, this.props.trip.id)
  }

  ownerLeaveTripClick() {
    if (this.state.newOwner !== '') {
      this.props.leaveTrip(this.props.account.account_id, this.props.account.token, this.props.trip.id, this.state.newOwner)
    } else {
      this.setState({
        isTransferOwnershipError: true
      })
    }
  }

  leaveTripClick() {
    this.props.leaveTrip(this.props.account.account_id, this.props.account.token, this.props.trip.id, this.state.newOwner)
  }

  onOwnerSelect(e) {
    this.setState({
      newOwner: e.value
    })
  }

    handleRedirect() {
      return (
        <Redirect to={'/mytrips'}/>
      )
    }

    renderOwnerFields() {
      return (
        <div>
          <input type="submit" value="Delete Trip" className="custom-input delete" onClick={this.openConfirmationModal}/>
          <input type="submit" value="Leave Trip" className="custom-input leave" onClick={this.openTransferOwnershipModal} />
        </div>
      )
    }

  render() {
    let trip = this.props.trip
    return (
      <div className="container-flex">
        {this.state.redirect ? this.handleRedirect() : null}
        <div className="col-md-4">
          <div className="row">
            <h2 className="title-field">{trip.name} to {trip.formatted_name}</h2>
            {trip.creator_id === this.props.account.account_id ?  this.renderOwnerFields() : <input type="submit" value="Leave Trip" className="custom-input leave" onClick={this.leaveTripClick} /> }
          </div>
          <div className="row add-trip-row">
            <div className="row"><h4 className="sub-title date">Start Date &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; End Date</h4></div>
            {this.renderDateFields()}
          </div>
          <div className="row add-trip-row">
            <h4 className="sub-title">Travelers</h4>
            {this.listFriends()}
          </div>
          <div className="row add-trip-row">
            <h4 className="sub-title">Add some more friends below!</h4>
          </div>
        <div className="row"><ConnectedAddFriendToTrip fetchTrip={this.fetchTrip}/></div>
      </div>
      <div className="col-md-8">
        <div className="row tabs">
          <button className="btn btn-default tab" onClick={this.handleClickPlan} disabled={this.state.toggle === 'planned'}>Planned Activities</button>
          <button className="btn btn-default tab" onClick={this.handleClickAdd} disabled={this.state.toggle === 'add'}>Add Activity</button>
        </div>
        <div className="row">
          {this.state.toggle !== 'planned' ? <ConnectedAddActivity/> : <ConnectedActivities/>}
        </div>
      </div>
      <Modal isOpen={this.state.isConfirmationModalOpen} style={customStyles} contentLabel="Confirmation Modal">
        <h2>Are You Sure?</h2>
        <input type="submit" value="Confirm" className="custom-input centered" onClick={this.deleteTripClick} />
        <input type="submit" value="Cancel" className="custom-input" onClick={this.closeModal}/>
      </Modal>
      <Modal isOpen={this.state.isTransferOwnershipModalOpen} style={customStyles} contentLabel="Transfer Ownership Modal">
        <h2>Please Pick A New Trip Owner</h2>
        <Dropdown options={this.listFriends()} onChange={this.onOwnerSelect} value={this.state.newOwner} placeholder="Select an option" />
        <br></br>
        <input type="submit" value="Confirm" className="custom-input" onClick={this.ownerLeaveTripClick} />
        <input type="submit" value="Cancel" className="custom-input" onClick={this.closeModal} />
        {this.state.isTransferOwnershipError ? <h4 className="error">Please pick a valid owner!</h4> : null}
      </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    trip: state.CurrentTrip,
    account: state.Account
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchTrip: fetchTrip,
    updateEndDate: updateEndDate,
    updateStartDate: updateStartDate,
    leaveTrip: leaveTrip,
    deleteTrip: deleteTrip
  }, dispatch)
}


const ConnectedTrip = connect(mapStateToProps, mapDispatchToProps)(Trip)

export default ConnectedTrip
