import React, { Component } from 'react'
import Modal from 'react-modal'
import { getUserById } from '../../actions/actions'
import './styles.css'

export class ListModal extends Component {
  state = {
    meals: [],
    uid: null,
    date: null
  }

  componentDidUpdate() {
    if (this.state.uid !== this.props.uid || this.state.date !== this.props.date) {
      this.getMealsToday()
      this.setState({
        date: this.props.date,
        uid: this.props.uid
      })
    }
  }

  getMealsToday = () => {
    if (!this.props.uid) {
      console.log(this.props.uid, 'no uid')
      return
    }
    getUserById(this.props.uid).then(res => {
      const mealsToday = res.meals.filter(element => {
        const mealDate = new Date(element.date)
        return (mealDate.toDateString() === this.props.date.toDateString())
      })
      this.setState({
        meals: mealsToday
      })
    }).catch(error => console.log(error))
  }
  
  showMealModal = () => {
    this.props.showMealModal()
    this.props.exit()
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
      isOpen={this.props.isOpen}
      onAfterOpen={this.afterModalOpen}
      onRequestClose={this.props.exit}
      contentLabel="List Modal"
      >
        <h4>Meals for {this.props.date.toDateString()}:</h4>
          
        {this.state.meals.map(meal => {
          return(<details>
            <summary>{meal.name}</summary>
            <h6>Ingredients: </h6>
            {/* <ul>{meal.ingredients}</ul> */}
            <h6>Description:</h6>
            <ul>{meal.description}</ul>
          </details>)
        })}

        <button onClick={this.showMealModal} className="btn waves-effect waves-light teal darken-2 right"><i className='material-icons left'>add</i>New Meal</button>
        <button onClick={this.props.exit} className="btn waves-effect waves-light red darken-2 right"><i className="material-icons left">close</i>Close</button>
      </Modal>
    )
    }
}

export default ListModal
