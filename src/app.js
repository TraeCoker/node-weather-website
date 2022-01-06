const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000 

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather', 
        name: 'Trae Coker'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me', 
        name: 'Trae Coker'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: ['1. Type location', ' 2. click send', ' 3. get weather', ' 4. smile'],
        title: 'Help', 
        name: 'Trae Coker'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
    

        if (error){
            return res.send({error})
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({error})
            }
            
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
            
          })
    })

})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Help article not found.',
        name: 'Trae Coker'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Page not found.',
        name: 'Trae Coker'
    })
})

app.listen(port, () => {
    console.log('Server started on port' + port)
})

