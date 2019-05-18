import React, { Component } from 'react';
import UserContext from './UserContext'

export function withUserContext(WrappedComponent) {
    return class WithAuth extends Component {
        displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

        render() {
            return (
                <UserContext.Consumer>
                    {
                        userContext => (
                            <WrappedComponent {...this.props} userContext={userContext}/>
                        )
                    }
                </UserContext.Consumer>
            );
        }
    }
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
