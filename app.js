require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const User = require('./models/User');

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a nossa API" });
});

function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        return res.status(400).json({ msg: "Token inválido" });
    }
}

app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório" });
    }

    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória" });
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: "As senhas não conferem" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(422).json({ msg: "E-mail já cadastrado, por favor use outro" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();
        res.status(201).json({ msg: 'Usuário criado com sucesso!', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocorreu um erro no servidor, tente novamente mais tarde' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado, por favor tente outro e-mail" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida, por favor tente novamente" });
    }

    try {
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id }, secret);
        res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocorreu um erro no servidor, tente novamente mais tarde' });
    }
});

app.get("/user/:id", checkToken, async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id, '-password');

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.status(200).json({ user });
});

app.put('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    const { name, email, password, confirmpassword } = req.body;

    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório" });
    }

    if (!email) {
        return res.status(422).json({ msg: "O e-mail é obrigatório" });
    }

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória" });
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: "As senhas não conferem" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password: passwordHash }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        res.status(200).json({ msg: 'Usuário atualizado com sucesso!', updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocorreu um erro no servidor, tente novamente mais tarde' });
    }
});

app.delete('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        res.status(200).json({ msg: 'Usuário deletado com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocorreu um erro no servidor, tente novamente mais tarde' });
    }
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@mern-food-ordering-app.cljl3ik.mongodb.net/node-jwt-crud?retryWrites=true&w=majority&appName=mern-food-ordering-app`)
    .then(() => {
        app.listen(3000);
        console.log("Conectado ao banco!");
    })
    .catch((err) => console.log(err));
