import axios from 'axios';

const apiServer = "http://localhost:4000"

export const poiAPI = {
    get: function () {
        return axios.get(`${apiServer}/point`);
    },
    add: function (point) {
        return axios.post(`${apiServer}/point`, point);
    },
    update: function (point, token) {
        return axios.put(
            `${apiServer}/point/${point._id}`,
            point,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
    },
    delete: function (point, token) {
        return axios.delete(
          `${apiServer}/point/${point._id}`,
            point,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
    }
}



export const categoriesAPI = {
    get: function () {
      return axios.get(`${apiServer}/category`);
    },
    add: function (category, token) {
      return axios.post(
        `${apiServer}/category`,
        category,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
    },
    update: function (category, token) {
        const formData = new FormData();

        formData.append('title', category.title)
        formData.append('file', category.icon.file);

        console.log(category.icon)

        return axios.put(
            `http://localhost:4000/category/${category._id}`,
            formData, { headers: { "Authorization": `Bearer ${token}` } }
        )
    },

    updateVisibility: function (category, token) {
        return axios.put(
            `${apiServer}/category/${category._id}/visibility`,
            category,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
    },

    delete: function (category, token) {
        return axios.delete(
            `${apiServer}/category/${category._id}`,
            category,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
    }
}

export const suggestionsAPI = {
    get: function () {
      return axios.get(`${apiServer}/suggested_category`);
    },
    add: function (suggestion) {
        return axios.post(
          `${apiServer}/suggested_category`,
           suggestion
         );
    },
    delete: function (suggestion, token) {
        return axios.delete(
            `${apiServer}/suggested_category/${suggestion._id}`,
            suggestion,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
    }
}

export const userAPI = {
    authenticate: function (username, password) {
        return axios.post(
            `${apiServer}/auth/login`,
            {username: username,password: password}
        ).then(
            response => response["data"]["access_token"]
        )
    },
    register: function (username, password) {
      return axios.post(
          `${apiServer}/auth/register`,
          {username: username, password: password}
      ).then(
          response => response["data"]["succeded"]
      )
    }
}
/*

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
*/
