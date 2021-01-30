import React, { Component } from 'react'
import Modal from 'react-modal'
import { uid } from 'react-uid'
import { getUserById } from '../../actions/actions'
import { Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { ChevronLeft, FileCopy, Print, Email } from '@material-ui/icons'
import convert from 'convert-units'
import './styles.css'

export class ShoppingModal extends Component {
  state = {
    need: {}
  }

  getData = () => {
    getUserById(this.props.uid).then(user => {
      if (!user || user.meals.length === 0) {
        this.setState({
          need: { None: {
            kg: 0
          }}
        })
        return
      }
      const need = {}
      user.meals.forEach(meal => {
        if (Date.now() < new Date(meal.date).getTime() || (new Date()).toDateString() === new Date(meal.date).toDateString()) {
          meal.ingredients.forEach(ingredient => {
            let [qty, units] = this.convertUnits(ingredient.qty, ingredient.units)
            if (!need[ingredient.name]) {
              need[ingredient.name] = {}
            }
            if (!need[ingredient.name][units]) {
              need[ingredient.name][units] = qty
            } else {
              need[ingredient.name][units] += qty
            }
          })
        }
      })
      user.ingredients.forEach(ingredient => {
        let [qty, units] = this.convertUnits(ingredient.qty, ingredient.units)
        if (need[ingredient.name] && need[ingredient.name][units]) {
          need[ingredient.name][units] -= qty
        }
      })
      this.setState({
        need: need
      })
    })
  }

  convertUnits = (qty, units) => {
    if (['ml', 'l', 'tsp', 'Tbs', 'cup', 'pnt'].includes(units)) {
      return [convert(qty).from(units).to('ml'), 'ml']
    } else if (['kg', 'g', 'oz', 'lb'].includes(units)) {
      return [convert(qty).from(units).to('kg'), 'kg']
    } else {
      console.log('Error converting')
      return [qty, units]
    }
  }

  handleReturn = () => {
    this.props.exit()
  }

  getText = () => {
    const text = Object.keys(this.state.need).reduce((acc, name) => {
      let kgtext = null
      let mltext = null
      if (this.state.need[name]['kg']) {
        let qty = this.state.need[name]['kg']
        kgtext = (qty > 0 ? `${name}: ${qty} kg${qty > 1 ? 's' : ''}\n` : null)
      }
      if (this.state.need[name]['ml']) {
        let qty = this.state.need[name]['ml']
        mltext = (qty > 0 ? `${name}: ${qty} mL${qty > 1 ? 's' : ''}\n` : null)
      }
      let totalText = (kgtext ? kgtext : '') + (mltext ? mltext : '')
      return acc + totalText
    }, '')
    return text
  }

  handleCopy = () => {
    window.navigator.clipboard.writeText(this.getText())
  }

  handleEmail = () => {
    window.open(`mailto:?subject=Groceries&body=${this.getText()}`, '_blank')
  }

  getListElements = name => {
    let kgtext = null
    let mltext = null
    if (this.state.need[name]['kg']) {
      let qty = this.state.need[name]['kg']
      kgtext = (qty > 0 ? `${name}: ${qty} kg${qty > 1 ? 's' : ''}` : null)
    }
    if (this.state.need[name]['ml']) {
      let qty = this.state.need[name]['ml']
      mltext = (qty > 0 ? `${name}: ${qty} ml${qty > 1 ? 's' : ''}` : null)
    }
    if (kgtext && mltext) {
      return(
        <div>
          <li key={uid(name + 'kg')}>{kgtext}</li>
          <li key={uid(name + 'ml')}>{mltext}</li>
        </div>
      )
    } else if (kgtext) {
      return(
        <div>
          <li key={uid(name + 'kg')}>{kgtext}</li>
        </div>
      )
    } else if (mltext) {
      return(
        <div>
          <li key={uid(name + 'ml')}>{mltext}</li>
        </div>
      )
    } else {
      return(<div></div>)
    }
  }

  render() {
    Modal.setAppElement('#root')
    return (
      <Modal
        id='shoppingModal'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.exit}
        onAfterOpen={this.getData}
        contentLabel="Shopping List Modal"
      >
        <div className='modalHeader'>
          <Typography variant='h4'>My Shopping List:</Typography>
          <Button onClick={this.handleReturn} variant='contained' startIcon={<ChevronLeft />}>Return</Button>
        </div>
        <div id='tablediv'>
          <TableContainer component='paper'>
            <Table aria-label='Ingredient Table'>
              <TableHead className='primaryBack'>
                <TableRow>
                  <TableCell><Typography variant='h6' color='secondary'>Ingredient</Typography></TableCell>
                  <TableCell><Typography variant='h6' color='secondary'>Quantity</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Object.keys(this.state.need).map(name => {
                    return(
                      <TableRow key={name} className='row'>
                        <TableCell><Typography color='textPrimary'>{name}</Typography></TableCell>
                        {
                          Object.keys(this.state.need[name]).map(units => {
                            return(
                              <TableCell component="th" scope="row"><Typography>{this.state.need[name][units]} {units}</Typography></TableCell>
                              )
                            })
                          }
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Typography variant='h5' align='center'>Export List:</Typography>
        <div id="exportContainer">
          <Button variant='contained' onClick={this.handleCopy} startIcon={<FileCopy />}>Copy to Clipboard</Button>
          <Button variant='contained' onClick={() => window.print()} startIcon={<Print />}>Print</Button>
          <Button variant='contained' onClick={this.handleEmail} startIcon={<Email />}>Share by Email</Button>
        </div>
      </Modal>
    )
  }
}

export default ShoppingModal
