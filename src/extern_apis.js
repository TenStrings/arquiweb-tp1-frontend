import axios from 'axios';

const cors_proxy = "https://cors-by-nice-subject.herokuapp.com/" //deployed our private instance of proxy

const guido_API = "https://pointerest-arq.herokuapp.com"
const guido_API_cors = cors_proxy + guido_API
const guido_hostname = "pointerest-arq.herokuapp.com"

export const guidoAPI = {
    getPoints: function () {
        return axios.get(`${guido_API_cors}/points.json`);
    },
    getCategories: function () {
        return axios.get(`${guido_API_cors}/categories.json`);
    }
}

const lucas_API = "http://arq-web.herokuapp.com"
const lucas_API_cors = cors_proxy + lucas_API
const lucas_hostname = "arq-web.herokuapp.com"

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
          source: guido_API,
          hostname: guido_hostname
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
          source: lucas_API,
          hostname: lucas_hostname,
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
              source: guido_API,
              hostname: lucas_hostname,
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
              source: lucas_API,
              hostname: lucas_hostname,
          }
          extern_categories.push(extern_category)
      }
  })
  return ({
          'categories': extern_categories,
          'points': extern_points
  })
}
