import axios from 'axios';

const guido_API = "https://pointerest-arq.herokuapp.com"

export const guidoAPI = {
    getPoints: function () {
        return axios.get(`${guido_API}/points.json`);
    },
    getCategories: function () {
        return axios.get(`${guido_API}/categories.json`);
    }
}

/* Their format
[{"id":8,
  "name":"Nobiru",
  "description":"Comida tradicional japonesa",
  "category":{"id":4,
              "name":"Comida",
              "description":"Lugares donde conseguir comida riquísima!",
              "icon":"https://image.flaticon.com/icons/png/512/45/45332.png",
              "created_at":"2019-06-08T19:47:18.346Z",
              "updated_at":"2019-06-08T19:47:18.346Z",
              "status":"APPROVED",
              "hidden":null
            },
  "lat":-34.5565529,
  "long":-58.4500618,
  "img":"https://lh5.googleusercontent.com/p/AF1QipObawM25bqFLAQ-8CqoF0PJ0dRmdr1-yf4E_PY=w408-h306-k-no",
  "created_at":"2019-06-08T19:47:18.405Z",
  "updated_at":"2019-06-08T19:47:18.405Z",
  "source":"local",
  "url":"https://pointerest-arq.herokuapp.com/points/8.json"}
*/
const lucas_API = "http://arq-web.herokuapp.com/api"

export const lucasAPI = {
    getPoints: function () {
        return axios.get(`${lucas_API}/points?categories=&title=`);
    },
    getPointImage: function(pointId) {
      return axios.get(`${lucas_API}/points/${pointId}/image`);
    },
    getCategoryIcon: function(categoryId) {
      return axios.get(`${lucas_API}/categories/${categoryId}/image`);
    }
}

/* Their format
[{"id":1,
  "title":"McDonals",
  "description":"Local de comida rápida",
  "latitude":-34.6031035,
  "longitude":-58.3812092,
  "hidden":false,
  "category":{"id":4,
              "name":"Food",
              "hidden":false,
              "state":"APPROVED",
              "suggestedBy":{"id":2,
                             "name":"Kathy",
                             "lastName":"Brown",
                             "email":"user@user.com",
                             "status":"VERIFIED",
                             "roles":[{"id":3,
                                       "role":"SITE_USER",
                                       "desc":"This user has access to site, after login - normal user"}],
                             "admin":false
                            },
              "suggestedByName":"Kathy Brown"
            }
}]
*/
