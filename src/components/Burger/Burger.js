import React from 'react';
import { withRouter } from 'react-router-dom';

import classes from './Burger.css'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'


const burger = (props) => {
    let ingredientsList = Object.keys(props.ingredients).map(
        igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            });
        })
        .flat();

    if(ingredientsList.length === 0){
        ingredientsList = <p>Please start adding ingredients!</p> 
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {ingredientsList}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default withRouter(burger);