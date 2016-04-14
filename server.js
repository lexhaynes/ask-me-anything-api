var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');
var Question = require('./models/question');
var Profile = require('./models/profile');
var User = require('./models/user');
var config = require('./config/credentials')
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var db = require('./config/database');
var jwt = require('jsonwebtoken');

var app = express();

app.set('secret', config.secret); // secret variable

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
 

mongoose.connect(db.remote);

//API ROUTES
var apiRoutes = express.Router();


//authentication routes
apiRoutes.route('/authenticate')
    .post(function(req, res) {  
      User.findOne({
        username: req.body.username
      }, function(err, user) {
        console.log('USER', user)
        if (err) throw err;
        if (!user) {
          res.json({
            success: false,
            message: 'Authentication failed. User not found.'
          })
        } else if (user) {
            // test a matching password
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (err) throw err;
                if (!isMatch) {
                   res.json({
                    success: false,
                    message: 'Authentication failed. Incorrect password.'
                  })
                } else {
                  var token = jwt.sign(user, app.get('secret'), {
                    expiresInMinutes: 1036800 //1 month
                  });

                  res.json({
                    success: true,
                    message: "Token created",
                    token: token
                  })
              }
            });
      }
    })
  })

//protective middleware

apiRoutes.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('secret'), function(err, decoded) {
      if (err) {
        return res.json({success: false, message: 'Failed to authenticate token.'})
      } else {
        req.decoded = decoded;
        next()
      }
    })
  } else {
    return res.status(403).send({success: false, message: 'No token provided.'})
  }
});
    

//question routes
apiRoutes.route('/questions')
    .get(function(req, res) {
        Question.find({}, function(err, questions) {
          if (err) throw err;
          res.json(questions);
        });
      })

    .post(function(req, res) {
      var question = Question({
          title: req.body.title,
          submitter: req.body.submitter,
          approvalStatus: req.body.approvalStatus
      })
       question.save(function(err, question) {
        if (err) throw err;
        res.json({
          message: 'question created!',
          body: question
        });
      });
    });

apiRoutes.route('/question/:question_id')
  .get(function(req, res) {
          Question.findById(req.params.question_id, function(err, question) {
              if (err)
                  res.send(err);
              res.json(question);
          });
      })

  .put(function(req, res) {
    var updateField = {[req.body.key]: req.body.value};
    Question.findByIdAndUpdate(req.params.question_id, updateField , function(err, question) {
      if (err) 
        res.send(err)
      res.json({message: 'question updated!'});
    })
  })

  .delete(function(req, res) {
        Question.remove({
            _id: req.params.question_id
        }, function(err, question) {
          if (err) throw err;
          res.json({message: 'question deleted!'});
        });
      })


//profile routes
apiRoutes.route('/profiles')
    .get(function(req, res) {
        Profile.find({}, function(err, profiles) {
          if (err) throw err;
          res.json(profiles);
        });
      })

    .post(function(req, res) {
      var profile = Profile({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          type: req.body.type,
          description: req.body.description,
          picture: req.body.picture,
      })
       profile.save(function(err, profile) {
        if (err) throw err;
        res.json({
          message: 'profile created!',
          body: profile
        });
      });
    });

apiRoutes.route('/profile/:profile_id')
  .get(function(req, res) {
          Profile.findById(req.params.profile_id, function(err, profile) {
              if (err)
                  res.send(err);
              res.json(profile);
          });
      })

  .put(function(req, res) {
    var updateField = {[req.body.key]: req.body.value};
    Profile.findByIdAndUpdate(req.params.profile_id, updateField , function(err, profile) {
      if (err) 
        res.send(err)
      res.json({message: 'profile updated!'});
    })
  })


//user routes
apiRoutes.route('/users')
    .get(function(req, res) {
        User.find({}, function(err, users) {
          if (err) throw err;
          res.json(users);
        });
      })

    .post(function(req, res) {
      var user = User({
          username: req.body.username,
          password: req.body.password,
      })
       user.save(function(err, user) {
        if (err) throw err;
        res.json({
          message: 'user created!',
          username: user.username
        });
      });
    });


app.use('/api', apiRoutes);

var port = process.env.PORT || 3030;

app.listen(port, function(error) {
  if (error) throw error;
  console.log("question API listening on port", port);
});



