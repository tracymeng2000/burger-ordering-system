import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    getFormattedElement = (elementType, type, placeholder, validation, value = '') => {
        return {
            elementType: elementType,
            elementConfig: {
                type: type,
                placeholder: placeholder
            },
            value: value,
            validation: validation,
            valid: false,
            touched: false
        }
    }

    checkValidity = (value, rules) => {
        let isValid = true;
        if(rules.required){
            isValid = isValid && value.trim() !== ''
        }

        if(rules.minLength){
            isValid = isValid && value.length >= rules.minLength && value.length <= rules.maxLength;
        }
        return isValid;
    }

    state = {
        orderForm: {
            name: this.getFormattedElement("input", "text", 'Your Name',
            {required: true}),
            street: this.getFormattedElement("input", "text", 'Street', 
            {required: true}),
            zipCode: this.getFormattedElement("input", "text", 'ZIP code',
            {required: true, minLength: 5, maxLength: 7}),
            country: this.getFormattedElement("input", 'text', 'Country',
            {required: true}),
            email: this.getFormattedElement("input", "email", "Your E-mail",
            {required: true}),
            deliveryMethod: {
                elementType: "select",
                elementConfig: {
                    options:
                        [{ value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }]
                },
                value: 'fastest',
                validation: {},
                valid: true,
                touched: false
            }
        },
        loading: false,
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const formData = {};
        for(let formElmentIdentifier in this.state.orderForm){
            formData[formElmentIdentifier] = this.state.orderForm[formElmentIdentifier].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price, //not a set up you would use in production
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false });
                this.props.history.push('/')
            })
            .catch(error => { this.setState({ loading: false }) });
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
    }

    render() {
        const formElementArray = [];
        for (let key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value} 
                        invalid={formElement.config.touched && !formElement.config.valid}
                        onChangeHandler={(event) => this.inputChangeHandler(event, formElement.id)}
                        shouldValidate={formElement.config.validation}/>
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
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