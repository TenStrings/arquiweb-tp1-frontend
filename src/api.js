import axios from 'axios';

const apiServer = process.env.REACT_APP_HEROKU ?
    "https://jugo-maps-api.herokuapp.com" : "http://localhost:4000"

export const poiAPI = {
    get: function () {
        return axios.get(`${apiServer}/point`);
    },
    add: function (point) {
        const formData = new FormData();
        formData.append('name', point.name)
        formData.append('position', point.position)
        formData.append('description', point.description)
        let has_file = point.image.file? true: false;
        formData.append('has_file', has_file );
        if (has_file)formData.append('file', point.image.file);
        formData.append('categoryId', point.categoryId)
        formData.append('categoryName', point.categoryName)

        return axios.post(
            `${apiServer}/point/`,
            formData
        )
    },
    update: function (point, token) {
        const formData = new FormData();
        formData.append('name', point.name)
        formData.append('position', point.position)
        formData.append('description', point.description)
        let has_file = point.image.file? true: false;
        formData.append('has_file', has_file );
        if (has_file)formData.append('file', point.image.file);
        formData.append('categoryId', point.categoryId)
        formData.append('categoryName', point.categoryName)

        return axios.put(
            `${apiServer}/point/${point._id}`,
            formData,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
    },
    updateVisibility: function (point, token) {
        return axios.put(
            `${apiServer}/point/${point._id}/visibility`,
            {'visible':point.visible},
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
    add: function (category, token) {  //the file was uploaded in the suggestion and we only add categories that were a suggestion
        return axios.post(
            `${apiServer}/category`,
            category,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
    },
    update: function (category, token) {
        const formData = new FormData();
        formData.append('title', category.title)
        formData.append('icon', category.icon)
        console.log(category.icon)
        console.log("api.js")
        let has_file = category.icon_file && category.icon_file.file ? true:false
        formData.append('has_file', has_file );
        if(has_file) formData.append('file', category.icon_file.file);

        return axios.put(
            `${apiServer}/category/${category._id}`,
            formData, { headers: { "Authorization": `Bearer ${token}` } }
        )
    },

    updateVisibility: function (category, token) {
        return axios.put(
            `${apiServer}/category/${category._id}/visibility`,
            {'visible':category.visible},
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
      const formData = new FormData();
      formData.append('title', suggestion.title)
      let has_file = suggestion.icon && suggestion.icon.file ? true:false
      formData.append('has_file', has_file );
      if(has_file) formData.append('file', suggestion.icon.file);

      return axios.post(
          `${apiServer}/suggested_category`,
          formData
      )
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
            { username: username, password: password }
        ).then(
            response => response["data"]["access_token"]
        )
    },
    register: function (username, password) {
        return axios.post(
            `${apiServer}/auth/register`,
            { username: username, password: password }
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
