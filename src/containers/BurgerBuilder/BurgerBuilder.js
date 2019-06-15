import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {
    state = {
        totalPrice: 1,
        purchasing: false,
        loading: false,
        error: false
    }

    updatePurchasableState(newIngredients) {
        const ingredients = {
            ...newIngredients
        };
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => (sum + el), 0)

        return(sum > 0);
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
    }

    clearIngredientHandler = () => {
        this.setState({
            ingredients: {
                'salad': 0,
                'bacon': 0,
                'meat': 0,
                'cheese': 0
            },
            totalPrice: 1
        })
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    componentDidMount() {
        // axios.get('https://burger-builder-1003.firebaseio.com/.json')
        //     .then(response => {
        //         this.setState({
        //             ingredients: response.data.ingredients
        //         })
        //     })
        //     .catch(error => { this.setState({ error: true }) });
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = (disabledInfo[key] <= 0);
        }
        //disabledInfo will be in the form of:
        //{Salad: true, Meat: false,...}
        let orderSummary = null;
        let burger = this.state.error ?
            <p>Ingredients can't be loaded</p> : <Spinner />;
        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        price={this.props.price}
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        resetBurger={this.clearIngredientHandler}
                        isDisabled={disabledInfo}
                        purchasable={this.updatePurchasableState(this.props.ings)}
                        ordered={this.purchaseHandler} />
                </Aux>);
            orderSummary = (
                <OrderSummary
                    ingredients={this.props.ings}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    totalPrice={this.props.price} />);
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}
const mapStateToProps = state => {
    return{
        ings: state.ingredients,
        price: state.totalPrice
    };
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));