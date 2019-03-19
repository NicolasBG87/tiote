import React from 'react';

const Header = ({auth}) => {
    return (
        <div className="Header">
            <div className="Header__logo"><img src={require('../../assets/icons/logo.svg')} alt="Logo"/></div>
            <div className="Header__greeting">Welcome, {auth.user.name} <img src={auth.user.avatar || require('../../assets/icons/avatar-placeholder.svg')} alt="Avatar"/></div>
            <div className="Header__actions" onClick={auth.logout}>Logout <img src={require('../../assets/icons/logout.svg')} alt="Logout"/></div>
        </div>
    );
};

export default Header;