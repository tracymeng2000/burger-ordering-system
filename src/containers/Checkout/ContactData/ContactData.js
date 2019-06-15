import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component{
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) =>{
        event.preventDefault();
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ings,
            price: this.props.price, //not a set up you would use in production
            customer: {
                name: 'Tracy',
                address: {
                    street: 'Teststreet',
                    zipCode: '123'
                },
                email: 'tracy@gmail.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false});
                this.props.history.push('/')})
            .catch(error => {this.setState({loading: false})});
    }

    render () {
        let form = (
            <form>
                    <input className={classes.Input} type="text" name ="name" placeholder="your name"/>
                    <input className={classes.Input} type="email" name ="email" placeholder="your email"/>
                    <input className={classes.Input} type="text" name ="street" placeholder="Street"/>
                    <input className={classes.Input} type="text" name ="postal" placeholder="Postal Code"/>
                    <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
                </form>
        );
        if(this.state.loading){
            form= <Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);