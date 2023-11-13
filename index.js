import express from 'express'
import joi from 'joi'
import fs from 'fs'
import dotenv from 'dotenv'
import morgan from 'morgan'

import handleClientError from './helper/clientError.js'
import handleServerError from './helper/serverError.js'
import handleResponseSuccess from './helper/responseSuccess.js'
dotenv.config()
const app = express()

const PORT = process.env.PORT
const database = './database/db.json'
const data = JSON.parse(fs.readFileSync(database))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const NODE_ENV = process.env.NODE_ENV
if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// get all product from company
app.get('/api/gajets/:company', (req, res) => {
  try {
    const { company } = req.params
    const { type, pageNumber, pageSize } = req.query
    const listCompany = ['aple', 'samsung']
    if (!listCompany.includes(company)) {
      return handleClientError(res, 404, 'Not Found', 'URL Not Found')
    }
    if (
      (type && pageSize && !pageNumber) ||
      (type && !pageSize && pageNumber)
    ) {
      return handleClientError(
        res,
        400,
        'Bad Request',
        'Page Size or Page Number notfound'
      )
    }
    let results
    if (type && pageNumber && pageSize) {
      if (!data[company][type]) {
        return handleClientError(res, 404, 'Not Found', 'Type not found')
      }
      const totalData = data[company][type].length
      const skip = (Number(pageNumber) - 1) * Number(pageSize)
      const slicedData = data[company][type].slice(
        skip,
        skip + Number(pageSize)
      )

      results = {
        products: slicedData,
        totalData,
        pages: Math.ceil(totalData / Number(pageSize)),
        pageNumber: Number(pageNumber),
      }
    } else if (type && !pageNumber && !pageSize) {
      if (!data[company][type]) {
        return handleClientError(res, 404, 'Not Found', 'Type not found')
      }
      const totalData = data[company][type]?.length
      results = { products: data[company][type], totalData }
    } else {
      results = data[company]
    }

    return handleResponseSuccess(res, 200, 'Ok', results)
  } catch (error) {
    return handleServerError(res)
  }
})

// get all by company
app.get('/api/gajets/:company', (req, res) => {
  try {
    const { company } = req.params
    const listCompany = ['aple', 'samsung']
    if (!listCompany.includes(company)) {
      return handleClientError(res, 404, 'Not Found', 'URL Not Found')
    }

    return handleResponseSuccess(res, 200, 'Ok', data[company])
  } catch (error) {
    return handleServerError(res)
  }
})

// get all product by type from company
app.get('/api/gajets/:company', (req, res) => {
  try {
    const { company } = req.params
    const listCompany = ['aple', 'samsung']
    if (!listCompany.includes(company)) {
      return handleClientError(res, 404, 'Not Found', 'URL Not Found')
    }

    return handleResponseSuccess(res, 200, 'Ok', data[company])
  } catch (error) {
    return handleServerError(res)
  }
})

// get single data
app.get('/api/gajet/:company/:type/:slug', (req, res) => {
  try {
    const { company, type, slug } = req.params
    const listCompany = ['aple', 'samsung']
    if (
      !listCompany.includes(company) ||
      !data[company][type].find(
        el => el.slug.toLowerCase() === slug.toLowerCase()
      )
    ) {
      return handleClientError(res, 404, 'Not Found', 'Data Not Found')
    }
    const selectedName = data[company][type].filter(
      el => el.slug.toLowerCase() === slug.toLowerCase()
    )
    return handleResponseSuccess(res, 200, 'Ok', selectedName[0])
  } catch (error) {
    return handleServerError(res)
  }
})

// create new gajet
app.post('/api/gajet/:company/:type', (req, res) => {
  try {
    const { company, type } = req.params
    const newData = req.body

    const scheme = joi.object({
      name: joi.string().min(3).required(),
      tahun: joi.string().required(),
      description: joi.string().required(),
    })

    const { error } = scheme.validate(newData)
    if (error) {
      return handleClientError(
        res,
        400,
        'Validation Failed',
        error.details[0].message
      )
    }

    if (
      data[company][type].find(
        el => el.name.toLowerCase() === newData.name.toLowerCase()
      )
    ) {
      return handleClientError(res, 400, 'Bad Request', 'Data Already Existed')
    }

    data[company][type].push({
      slug: `${newData.name.toLowerCase().split(' ').join('-')}-${
        newData.tahun
      }`,
      ...newData,
    })

    fs.writeFileSync(database, JSON.stringify(data))

    return handleResponseSuccess(res, 201, 'Created', data[company][type])
  } catch (error) {
    return handleServerError(res)
  }
})

// update gajet
app.put('/api/gajet/:company/:type/:slug', (req, res) => {
  try {
    const { company, type, slug } = req.params
    const newData = req.body

    const scheme = joi.object({
      name: joi.string().min(3).required(),
      tahun: joi.string().required(),
      description: joi.string().required(),
    })

    const { error } = scheme.validate(newData)
    if (error) {
      return handleClientError(
        res,
        400,
        'Validation Failed',
        error.details[0].message
      )
    }

    if (
      !data[company][type].find(
        el => el.slug.toLowerCase() === slug.toLowerCase()
      )
    ) {
      return handleClientError(res, 404, 'Not Found', 'Data Not Found')
    }

    const filtered = data[company][type].filter(
      el => el.slug.toLowerCase() !== slug.toLowerCase()
    )
    filtered.push({
      slug: `${newData.name.toLowerCase().split(' ').join('-')}-${
        newData.tahun
      }`,
      ...newData,
    })

    data[company][type] = filtered

    fs.writeFileSync(database, JSON.stringify(data))

    return handleResponseSuccess(res, 200, 'Updated', data[company][type])
  } catch (error) {
    return handleServerError(res)
  }
})

// delete by slug
app.delete('/api/gajet/:company/:type/:slug', (req, res) => {
  try {
    const { company, type, slug } = req.params

    if (
      !data[company][type].find(
        el => el.slug.toLowerCase() === slug.toLowerCase()
      )
    ) {
      return handleClientError(res, 404, 'Not Found', 'Data Not Found')
    }

    const filtered = data[company][type].filter(
      el => el.slug.toLowerCase() !== slug.toLowerCase()
    )
    data[company][type] = filtered
    fs.writeFileSync(database, JSON.stringify(data))

    return handleResponseSuccess(res, 200, 'Deleted', data[company][type])
  } catch (error) {
    return handleServerError(res)
  }
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})
