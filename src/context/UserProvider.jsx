import React, { Component } from 'react';
import UserContext from './UserContext';
import {message} from 'antd';
import decode from 'jwt-decode';
import { userAPI } from "../api";

class UserProvider extends Component {
    constructor(props) {
        super(props)
        const token = localStorage.getItem("token")
        const user = token ? decode(token)["user_claims"] : null
        this.state = {
            user: user,
            token: token,
            login: this.login,
            logout: this.logout,
            register: this.register,
        }
    }

    login = async (username, password) => {
        try {
            let token = await userAPI.authenticate(username, password)
            localStorage.setItem("token", token)
            this.setState({
                user: decode(token)["user_claims"]
            })
        } catch (err) {
            message.error("Usuario no existe o credenciales inválidas");
        }
    }

    register = async (username, password) => {
        try {
          let succeded = await userAPI.register(username, password)
          if(succeded) {
            message.success("Usuario registrado correctamente.")
          }
        } catch (err) {
            message.error("No se pudo registrar al usuario")
        }
    }

    logout = () => {
        localStorage.removeItem("token")
        this.setState( { user: null} )
    }

    render() {
        return (
            <UserContext.Provider value={{
                ...this.state
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default UserProvider;
