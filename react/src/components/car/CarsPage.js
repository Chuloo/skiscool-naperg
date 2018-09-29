import React, {Component} from 'react'
import {withRouter} from 'react-router'
import CarsPageList from './CarsPageList'
import Button from '../../reactLIB/Button'
import Card from '../../reactLIB/Card'
import ArrowOrderBy from './ArrowOrderBy'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '../../reactLIB/Input'
import Icon from '../../reactLIB/Icon'
import NotAuth from '../nav/error/NotAuth'
import { AUTH_TOKEN } from '../../constants/constants'

class CarsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      orderBy: 'name_ASC'
    }
  }

  elemClicked(elem) {
    this.props.history.push('/car/' + elem.id)
  }

  render() {
    const clearQuery = () => {
      this.setState({
        query : ''
      })
    }
    const authToken = localStorage.getItem(AUTH_TOKEN)
    if(!authToken) {
      return (<NotAuth/>)
    }
    return (
      <React.Fragment>
      <div className='paperOut'>
        <Card className='paperIn'>
          <Input
            onChange={e => this.setState({query: e.target.value})}
            value={this.state.query}
            type='text'
            label='Search'
            endAdornment={
              <InputAdornment position='end'>
              {this.state.query ? (
                <Icon onClick={clearQuery}>clear</Icon>
              ) : (
                <Icon className='white'>sentiment_satisfied</Icon>
              )}
              <ArrowOrderBy
                orderBy={this.state.orderBy}
                onOrderBy={(orderBy) => this.setState({ orderBy: orderBy })}
              />
              </InputAdornment>
            }
            />
          {' '}
          <Button onClick={() => this.props.history.push('/car/create')} variant='raised' color='primary'>
            + Create Car
          </Button>

        <CarsPageList
          showWhenQueryEmpty={true}
          query={this.state.query}
          showTitle={true}
          showMore={true}
          elemClicked={this.elemClicked.bind(this)}
          orderBy={this.state.orderBy}/>
        </Card>
      </div>
    </React.Fragment>
  )
  }
}

export default withRouter(CarsPage)
