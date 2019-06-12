import axios from 'axios';

const cors_proxy = "https://cors-by-nice-subject.herokuapp.com/" //deployed our private instance of proxy
const guido_API = "https://pointerest-arq.herokuapp.com"
const guido_API_cors = cors_proxy + guido_API

export const guidoAPI = {
    getPoints: function () {
        return axios.get(`${guido_API_cors}/points.json`);
    },
    getCategories: function () {
        return axios.get(`${guido_API_cors}/categories.json`);
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
const lucas_API = "http://arq-web.herokuapp.com"
const lucas_API_cors = cors_proxy + lucas_API

export const lucasAPI = {
    getPoints: function () {
        return axios.get(`${lucas_API_cors}/api/points?categories=&title=`);
    },
    getCategories: function() {
        return axios.get(`${lucas_API_cors}/api/categories?hidden=false&state=APPROVED`)
    },
    getPointImage: function(pointId) {
      return axios.get(`${lucas_API_cors}/api/points/${pointId}/image`);
    },
    getCategoryIcon: function(categoryId) {
      return axios.get(`${lucas_API_cors}/api/categories/${categoryId}/image`);
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

export async function adaptExternData() {
  let extern_points = []
  let extern_categories = []

  let guido_points = await guidoAPI.getPoints()
  guido_points.data.forEach(p => {
      let extern_point = {
          _id: p.id,
          position: {'lat':p.lat,'lng':p.long},
          name: p.name,
          description: p.description,
          image: p.img,
          categoryId:p.category.id,
          categoryName:p.category.name,
          visible: true,
          extern: true,
          source: guido_API
      }
      extern_points.push(extern_point)
  })

  let lucas_points = await lucasAPI.getPoints()
  lucas_points.data.forEach(p => {
      let extern_point = {
          _id: p.id,
          position: {'lat':p.latitude,'lng':p.longitude},
          name: p.title,
          description: p.description,
          image: lucas_API + p.imageUrl,
          categoryId: p.category.id,
          categoryName:p.category.name,
          visible: true,
          extern: true,
          source: lucas_API
      }
      extern_points.push(extern_point)
  })

  let guido_categories = await guidoAPI.getCategories()
  guido_categories.data.forEach(c => {
      if (c.status === "APPROVED"){
          let extern_category = {
              _id: c.id,
              title: c.name,
              icon: c.icon,
              visible: true,
              extern: true,
              source: guido_API
          }
          extern_categories.push(extern_category)
      }
  })

  let lucas_categories = await lucasAPI.getCategories()
  lucas_categories.data.forEach(c => {
      if (c.state === "APPROVED"){
          let extern_category = {
              _id: c.id,
              title: c.name,
              icon: lucas_API + c.logoUrl,
              visible: true,
              extern: true,
              source: lucas_API
          }
          extern_categories.push(extern_category)
      }
  })
  return ({
          'categories': extern_categories,
          'points': extern_points
  })
}
