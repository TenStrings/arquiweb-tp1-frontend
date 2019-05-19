import axios from 'axios';

const categoriesMock = [
    { title: "Food", icon: "idk1" },
    { title: "Night Life", icon: "idk2" },
    { title: "Sports", icon: "idk3" },
]

const pointsMock = [
    {
        position: { lat: -34.583192397850446, lng: -58.44321326835347 },
        name: "RamenHutt",
        description: "Descripcion prueba 1",
        categoryName: "Food",
        visible: true,
    },
    {
        position: { lat: -34.57301606452501, lng: -58.454889807030376 },
        description: "Descripcion prueba 2",
        name: "FutureBar",
        categoryName: "Night Life",
        visible: true,
    }
]

//return Promise.resolve(categoriesMock)
const apiServer = "http://localhost:4000"
export const categoriesAPI = {
    all: function () {
        return Promise.resolve(categoriesMock)
    },
    update: function (category, token) {
        return axios.put(
            `http://localhost:4000/category/${category._id}`,
            category, { headers: { "Authorization": `Bearer ${token}` } }
        )
    },
}

export const poiAPI = {
    all: function () {
        return Promise.resolve(pointsMock)
    },
    show: function (pointId, token) {
        return new Promise(resolve => setTimeout(resolve, 1000))
    },
    hide: function (pointId, token) {
        return new Promise(resolve => setTimeout(resolve, 1000))
    },
    add: function (point) {
        return axios.post(`${apiServer}/point`, point);
    },
    update: function (point, token) {
        return axios.put('http://localhost:4000/point/' + point._id,
            point,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
    }
}

export const userAPI = {
    authenticate: function (username, password) {
        return axios.post(`http://localhost:4000/auth/login`, {
            username: username,
            password: password
        }).then(
            response => response["data"]["access_token"]
        )
    },
}

const fakeUsers = [
    {
        username: "TomiPasto",
        password: "1234",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRvbWlQYXN0byIsImFkbWluIjpmYWxzZX0.NO3LWNaf7BIi4bgYT3QpC2tSd7LJ9FxxHIwOIyx-smg"
    },
    {
        username: "admin",
        password: "admin",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWV9.2c7fRwMbZW_sJZxeggp-fBWbxYQNVzZxEvHrZwD-mKk"
    }
];
