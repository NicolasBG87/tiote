import React from 'react';

const Navigation = () => {
    return (
        <aside className="Navigation">
            <div className="Navigation__tab active">
                <img src={require('../../assets/icons/overview.svg')} alt="NavTab"/>
                <span>Overview</span>
            </div>
            <div className="Navigation__tab">
                <img src={require('../../assets/icons/analytics.svg')} alt="NavTab"/>
                <span>Analytics</span>
            </div>
            <div className="Navigation__tab">
                <img src={require('../../assets/icons/session.svg')} alt="NavTab"/>
                <span>Session</span>
            </div>
            <div className="Navigation__tab">
                <img src={require('../../assets/icons/profile.svg')} alt="NavTab"/>
                <span>Profile</span>
            </div>
            <div className="Navigation__tab">
                <img src={require('../../assets/icons/admin.svg')} alt="NavTab"/>
                <span>Admin</span>
            </div>
        </aside>
    );
};

export default Navigation;