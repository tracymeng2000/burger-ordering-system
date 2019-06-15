import React from 'react';

import classes from './Toolbar.css';
import Logo from '../../../components/Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import ToggleButton from '../SideDrawer/ToggleButton/ToggleButton';

const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <ToggleButton clicked={props.btnClicked}/>
        <div className={classes.Logo}><Logo /></div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems />
        </nav>
    </header>
);

export default toolbar;