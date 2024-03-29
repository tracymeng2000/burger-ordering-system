import React from 'react';

import classes from './Input.css';

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.inputElement];
    inputClasses.push(classes.InputElement);
    if(props.invalid && props.shouldValidate){
        inputClasses.push(classes.Invalid);
    }
    switch (props.elementType){
        case('input'):
            inputElement = <input 
                onChange={props.onChangeHandler}
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                defaultValue={props.value}/>;
            break;
        case('textarea'):
            inputElement = <textarea 
                onChange={props.onChangeHandler}
                className={classes.InputElement}
                {...props.elementConfig}
                defaultValue={props.value}/>;
            break;
        case('select'):
            inputElement = (
                <select
                    onChange={props.onChangeHandler}
                    className={classes.InputElement}
                    defaultValue={props.value}>
                        {props.elementConfig.options.map(option => (
                            <option value={option.value} key={option.value}>{option.displayValue}</option>
                        ))}
                    
                </select>

            )
            break;

        default:
            inputElement = <input 
                onChange={props.onChangeHandler}
                className={classes.InputElement}
                {...props.elementConfig}
                value={props.value}/>
    }
    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );
    
}

export default input;