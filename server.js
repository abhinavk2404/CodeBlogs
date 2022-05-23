const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const bodyParser = require('body-parser');
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const path = require('path');
const nodemailer = require('nodemailer');
const app = express()
const PORT = process.env.PORT || 5000

DB = "mongodb+srv://codeblogs:amishu@0202@cluster0.qsizg.mongodb.net/codeblog?retryWrites=true&w=majority"
mongoose.connect(DB, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true , useFindAndModify:false
}).then(()=>{
  console.log("connection successfull")
}).catch((err) => console.log(err))
// mongoose.connect('mongodb+srv://abhinavkaushik:amishu0202@cluster0.kmfqx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
//   useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
// })


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})
app.get('/about', async (req, res) => {
  res.render('articles/about')
})
app.get('/contact', async (req, res) => {
  res.render('articles/contact')
})

app.use('/articles', articleRouter)
app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'testak0224@gmail.com', // generated ethereal user
        pass: 'Qwerty@123'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: `"Nodemailer Contact" <testak0224@gmail.com>`, // sender address
      to: 'abhinavkaushik0202@gmail.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact');
  });
  });
app.listen(PORT,()=> console.log(`Running on port ${PORT}`))