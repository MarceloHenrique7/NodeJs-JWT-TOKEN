/* imports */
require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express();

app.use(express.json())


// Models
const User = require('./models/User')

app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo a nossa api"})
})

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id
    // check if user exists
    const user = await User.findById(id, '-password') // -password passado como segundo parametro para que se ele achar esse id ele nao retorne para const user a senha do usuario

    if (!user) {
        return res.status(404).json({msg: "user not found"})
    }

    res.status(200).json({ user })
})

function checkToken (req, res, next) {

    const authHeader = req.headers['authorization'] // atuhorization e o nosso token que estamos pegando do header
    const token = authHeader && authHeader.split(" ")[1] // aqui o token vem em um formato "bearer ..token" - precisamos apenas do token então damos um split para tirar os espaços, e o split tranforma em um array, pegamos [1] posição no caso seria o token apenas

    if (!token) {
        return res.status(401).json({msg: "acesso negado"})
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)
        
        next()
    } catch (error) {
        return res.status(400).json({msg: "token invalido"})
    }

}


// Register User

app.post('/auth/register', async (req, res) => {

    const {name, email, password, confirmpassword} = req.body;

    // validations

    if(!name) {
        return res.status(422).json({msg: "The name is required"})
    }

    if(!email) {
        return res.status(422).json({msg: "The email is required"})
    }

    if(!password) {
        return res.status(422).json({msg: "The password is required"})
    }

    if(password !== confirmpassword) {
        return res.status(422).json({msg: "Passwords must be the same"})
    }

    //check if user exists

    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({msg: "User Exists, please try again with other email"})
    }

    // create password

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create user

    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {

        await user.save()

        res.status(201).json({msg: 'User created with success!'})


    } catch (error) {
        console.log(error)
        res.status(500).json({msg : 'happen error in the server, try again later'})
    }
})

// login User 

app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;
    if(!email) {
        return res.status(422).json({msg: "The email is required"})
    }
    if(!password) {
        return res.status(422).json({msg: "The password is required"})
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        return res.status(404).json({msg: "User not Found, please try again with other email"})
    }
    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return res.status(422).json({msg: "Password invalid, please try again with other password"})
    }

    try {
        
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        }, secret,
        )

        res.status(200).json({ msg: "auth realized with success", token })

    } catch (error) {
        console.log(error)
        res.status(500).json({msg : 'happen error in the server, try again later'})
    }

})


// Credencials

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS


mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@mern-food-ordering-app.cljl3ik.mongodb.net/?retryWrites=true&w=majority&appName=mern-food-ordering-app`).then(() => {
    app.listen(3000);
    console.log("conectou ao banco!")
}).catch((err) => console.log(err))

