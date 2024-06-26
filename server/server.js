const { json } = require('body-parser');
const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const cors = require('cors')
const bodyparser = require('body-parser')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const app = express()
const PORT = process.env.PORT
const nodemailer = require('nodemailer')

// middlewares
app.use(cors())
app.use(bodyparser.json())

// create a transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: 'gamil',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMPT_PASSWORD
    }
})

// send mail Function
function sendWelcomeMail(email,username){
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: 'User Created !',
        text: `Hello ${username},\n\nThank you for signing up! We are excited to have you on board.\n\nBest regards,\nYour Team`
    }

    transporter.sendMail(mailOptions, (error,info)=>{
        //console.log('INFO : '+info.response)
        if(error){
            console.error('Error sending mail ',error)
        }else{
            console.log('Mail send: ',info.response)
        }
    })
}


// middleware for authentication of Token
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    });
}  


// DB connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});

db.connect((err)=>{
    if (err) throw err;
    console.log("DB connected successful.")
})

// 

// SignUp route
app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length > 0) {
            return res.status(400).send('Username already exists');
        }

        try {
            const hashPassword = await bcrypt.hash(password, 10);

            db.query('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', [email, username, hashPassword], (err, result) => {
                if (err) {
                    console.error("Error inserting into database:", err);
                    return res.status(500).send('Internal Server Error');
                }

                // SMTP
                sendWelcomeMail(email,username)
                res.status(201).send('User created successfully');
            });
        } catch (hashError) {
            console.error("Error hashing password:", hashError);
            res.status(500).send('Internal Server Error');
        }
    });
});

// Login route
app.post('/login', (req,res)=>{

    const { username, password } = req.body
    db.query('SELECT * FROM users WHERE username = (?)',[username],async (err,result)=>{
        if(err) throw err
        if(result.length === 0){
            return res.status(401).json({message: 'Invalid Username.'});
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({message: 'Invalid Password'})
        }

        const token  = jwt.sign({userID: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '1hr'})

        res.status(200).json({token});

    });
});


// logout
app.post('/logout',authenticateToken, (req,res)=>{
    authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1]

    if(token){
        tokenBlacklist.push(token)
    }
    res.status(200).json({ message: "Logout Successfully."})
    
})

// User Details
app.get('/my-account', authenticateToken, (req,res)=>{
    const userID = req.user.userID
    db.query('SELECT * from users WHERE id = (?)',[userID], async (err,result)=>{
        if (err) return res.status(500).json({ error: err})
        if(result.length===0) return res.status(401).json({message:"User Not Found."})

        res.status(200).json(result[0])
    });
});  

// Update Password
app.post('/update-password', authenticateToken, async (req,res)=>{
    const userID = req.user.userID;
    const { password } = req.body;

    const hashPassword = await bcrypt.hash(password,10)
    db.query('UPDATE users SET password=? WHERE id =?',[hashPassword, userID],(err,result)=>{
        if(err) return res.status(501).json({ Error: err})
        
        res.status(200).json({ message : 'Password Updated Successfully.'})
    })
})


// server connection
app.listen(PORT,()=>{
    console.log("server is running on "+PORT)
})

