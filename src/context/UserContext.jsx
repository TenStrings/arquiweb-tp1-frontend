import React from 'react';

// Signed-in user context
const UserContext = React.createContext({
    user: {
        name: 'Guest'
    },
    login: (username, password) => null,
    logout: () => null,
});

export default UserContext;