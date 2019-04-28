const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const mongoose = require('mongoose');
const User = require('../models/users');
const Project = require('../models/projects');
const Waste = require('../models/waste');
const Roaster = require('../models/roasters');
const Photo = require('../models/photos');
const passport = require('passport');
const bodyParser = require('body-parser');
const axios = require('axios');
const multer = require('multer');
const akid = process.env.AWSAccessKeyId
const asak = process.env.AWSSecretKey
const path = require('path');
const fs = require('file-system')
const AWS = require('aws-sdk');
// const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const multerS3 = require('multer-s3')
let newPhoto;
const s3Bucket = 'chaffmap'




const makeNewPhoto = (name, url, category, userID, username) => {
  console.log(url + ' / ' + category)
  const newPhoto = new Photo({
    'name': name,
    'category': category,
    'url': url,
    'userID': userID,
    'username': username
  })
  console.log('made a photo')
  console.log(newPhoto)
  newPhoto.save()
}

exports.postAvatar = (req, res) => {

  const name = req.body.key.toString()
  const url = req.body.location.toString()
  const category = 'avatar'
  const userID = req.user.id
  const username = req.user.username

  console.log(url + ' / ' + category)

  makeNewPhoto(name, url, category, userID, username)
  res.render('user/profile/:username', {
    title: 'Cool new avatar',
    currentUser: req.user,
  });
}


exports.addProjectPost =
  (req, res) => {
    const photoName = req.body.photo.key.toString()
    const photoUrl = req.body.photo.location.toString()
    const category = 'project'
    const userID = req.user.id
    const username = req.user.username
    const name = req.body.text.name
    const materials = req.body.text.materials
    const location = req.body.text.location

    const newProject = new Project({
      'userID': userID,
      'username': username,
      'title': name,
      'materials': materials,
      'location': location,
      'photo': {
        'bucket': category,
        'key': photoName,
        'url': photoUrl
      }
    })

    newProject.save()

    res.render('user/profile/:username', {
      title: 'Welcome Back',
      currentUser: req.user
    })
  }

exports.addWastePost =
  async (req, res) => {
    // console.log(req.body)
    const photoName = req.body.photo.key.toString()
    const photoUrl = req.body.photo.location.toString()
    const category = 'waste'
    const userID = req.user.id
    const username = req.user.username
    const frequency = req.body.text.frequency
    const location = req.body.text.location
    const name = req.body.text.name
    const material = req.body.text.material
    const amount = req.body.text.amount

    const newWaste = new Waste({
      'userID': userID,
      'username': username,
      'title': name,
      'material': material,
      'frequency': frequency,
      'amount': amount,
      'location': location,
      'photo': {
        'bucket': category,
        'key': photoName,
        'url': photoUrl
      }
    })
    // console.log('newWaste', newWaste)

    await newWaste.save(function (err, waste) {
      console.log('new waste', waste)
      console.log('err', err)

      // if (err) {
      //   (err) => {
      //     console.log('err', err)
      //     return handleError(err);
      //   }
      // }
      res.render('user/profile/:user/waste/:wasteId', {
        title: 'Welcome Back',
        currentUser: req.user,
        wasteOwner: username,
        waste: waste
      })
    })

    // return (next)

    // res.render('user/profile/:user', {
    //   title: 'Welcome Back',
    //   currentUser: req.user
    // })

  }

exports.avatarJSON =
  (req, res, next) => {
    const user = req.params.user

    console.log('in avatarJSON', user)
    Photo.findOne({ username: user }).exec((err, photo) => {
      if (err) return next(err);
      if (photo) {
        const photoparsed = JSON.stringify(photo)
        // console.log('photo found' + photoparsed)
        res.json(photoparsed)
      }
    })
  }

exports.projectJSON =
  (req, res, next) => {
    const user = req.params.user
    console.log(user)

    Project.find({ username: user }).exec((err, projects) => {
      if (err) return next(err);
      if (projects) {
        // console.log('projects found: ' + projects)
        res.json({ projects })
      }
    })
  }

exports.userJSON =
  async (req, res, next) => {
    const user = req.params.user
    console.log('IN USER JSON:', user)
    let avatar, projects, waste

    await Photo.findOne({ username: user }).exec((err, photo) => {
      if (err) return next(err);
      if (photo) {
        const photoparsed = JSON.stringify(photo)
        const av = JSON.parse(photoparsed)
        // res.json(photoparsed)
        avatar = av;
      }
    })

    await Project.find({ username: user }).exec((err, projs) => {
      if (err) return next(err);
      if (projs) {
        // console.log('projects found: ' + projects)
        // res.json({ projects })
        projects = projs
      }
    })

    await Waste.find({ username: user }).exec((err, wastes) => {
      if (err) return next(err);
      if (wastes) {
        // const wasteparsed = JSON.stringify(waste)
        // console.log('photo found' + photoparsed)
        // res.json({
        //   waste: waste,
        //   currentUser: req.user
        // })
        waste = wastes
      }
    })

    User.findOne({ username: user }).exec((err, user) => {
      if (err) return next(err);
      if (user) {
        console.log('user found ' + user)
        res.json({
          'user': user,
          'avatar': avatar,
          'projects': projects,
          'waste': waste,
          'currentUser': req.user
        })
      }
    })

  }


exports.wasteJSON =
  (req, res, next) => {
    // const id = req.user.id
    const user = req.params.user

    // console.log('in wasteJSON')
    // console.log(id)
    Waste.find({ username: user }).exec((err, waste) => {
      if (err) return next(err);
      if (waste) {
        // const wasteparsed = JSON.stringify(waste)
        // console.log('photo found' + photoparsed)
        res.json({
          waste: waste,
          currentUser: req.user
        })
      }
    })
  }

exports.singleProjectJSON =
  (req, res) => {
    const projectId = req.params.projectId
    Project.findById(projectId, (err, project) => {
      if (err) {
        console.log('project not found in view project')
        res.render(`:user`, { title: 'Error, try again' })
      } else {
        console.log('project found', project)
        res.json({
          project: project,
          currentUser: req.user
        })
      }
    })
  }


exports.singleWasteJSON =
  (req, res) => {
    const wasteId = req.params.waste
    console.log(wasteId)

    Waste.findById(wasteId, (err, waste) => {
      if (err) {
        console.log('waste not found in view waste')
        res.render(`:user`, { title: 'Error, try again' })
      } else {
        console.log('waste found in singleWasteJSON', waste)
        res.json({
          waste: waste,
          currentUser: req.user
        })
      }
    })
  }





exports.viewWaste =
  (req, res) => {

    const username = req.params.user
    console.log('username', username)

    const wasteId = req.params.waste
    console.log('Waste Id', wasteId)

    Waste.findById(wasteId, (err, waste) => {
      if (err) {
        console.log('waste not found in view waste')
        res.render(`:user`, { title: 'Error, try again' })
      } else {
        console.log('waste found view waste', waste)
        // res.render(`user/profile/${user.username}/${wasteId}`, {
        res.render(`user/profile/user/waste/:wasteId`, {
          title: 'Waste',
          wasteOwner: username,
          waste: waste,
          currentUser: req.user
        })
      }
    })

  }


exports.profileGet =
  async (req, res) => {
    const user = req.params.user
    console.log('user', user)
    User.findOne({ username: user }, (err, user) => {
      if (err) {
        console.log('user not found')
        res.render('login', { title: 'Error, try again' })
      } else {
        console.log('user found in profile get')
        res.render(`user/profile/:user`, {
          title: 'Profile:',
          user: user,
          currentUser: req.user
        })
      }
    })
  }


exports.viewProject = (req, res) => {

  const projectId = req.params.project
  console.log('Waste ID', projectId)
  // const username = req.params.user
  res.render(`user/profile/user/:projectId`, {
    title: 'project',
    // projectOwner: username,
    // project: project,
    currentUser: req.user
  })
}

exports.deleteUser = (req, res) => {

  const user = req.params.user
  console.log('deleting user Id:', user)

  User.deleteOne({ username: user }, function (err) {
    if (err) console.log(err);

    res.render(`../../`, {
      currentUser: req.user
    })
  })

}

exports.deleteProject = (req, res) => {

  const project = req.params.project
  console.log('deleting project Id:', project)

  Project.deleteOne({ _id: project }, function (err) {
    if (err) console.log(err);

    res.render(`user/profile/:user`, {
      currentUser: req.user
    })
  })

}
exports.deleteWaste = (req, res) => {

  const waste = req.params.waste
  console.log('deleting project Id:', waste)

  Waste.deleteOne({ _id: waste }, function (err) {
    if (err) console.log(err);

    res.render(`user/profile/:user`, {
      currentUser: req.user
    })
  })

}

exports.updateUser =
  async (req, res) => {

    let user, data, photoName, photoURL, name, materials, location, description
    user = req.params.user
    data = req.body
    console.log('in update user', user, data)
    await getData(data)
  
    function getData(data) {
      if (data.photo) {
        photoName = data.photo.key.toString()
        photoURL = data.photo.location.toString()
        const photo = {
          'key': photoName,
          'url': photoURL
        }
        updateUser('photo', photo)
      }
      if (data.text.name) {
        name = data.text.name
        updateUser('name', name)
      }
      if (data.text.email) {
        email = data.text.email
        updateUser('email', email)
      }
      if (data.text.phone) {
        phone = data.text.phone
        updateUser('phone', phone)
      }
      if (data.text.location) {
        address = data.text.location.address
        updateUser('location', address)
      }
      if (data.text.description) {
        description = data.text.description
        updateUser('description', description)
      }
    }
  

    function updateUser(property, data) {
      switch (property) {
        case 'photo':
          Photo.findOneAndUpdate({ _id: user }, {
            photo: data
          }, (err, user) => {
            if (err) { console.log(err) }
            console.log('updating user', user)
          })
          break;
        case 'name':
        User.findOneAndUpdate({ _id: user }, {
            name: data
          }, (err, user) => {
            if (err) { console.log(err) }
            console.log('updating user', user)
          })
          break;
        case 'email':
        User.findOneAndUpdate({ _id: user }, {
            email: data
          }, (err, user) => {
            if (err) { console.log(err) }
            console.log('updating user', user)
          })
          break;
        case 'phone':
        User.findOneAndUpdate({ _id: user }, {
            phone: data
          }, (err, user) => {
            if (err) { console.log(err) }
            console.log('updating user', user)
          })
          break;  
        case 'location':
        User.findOneAndUpdate({ _id: user }, { 
            location: {address: data}
          }, (err, user) => {
            if (err) { console.log(err) }
            console.log('updating user', user)
          })
          break;
        case 'description':
        User.findOneAndUpdate({ _id: user }, {
            description : data
          }, (err, user) => {
            if (err) { console.log(err) }
            console.log('updating user', user)
          })
          break;
      }
    }
    res.redirect(req.get('referer'));

  }


exports.updateProject = async (req, res) => {
  let project, data, photoName, photoURL, name, materials, location, description
  project = req.params.project
  data = req.body
  console.log('in update project', project, data)
  await getData(data)

  function getData(data) {
    if (data.photo) {
      photoName = data.photo.key.toString()
      photoURL = data.photo.location.toString()
      const photo = {
        'key': photoName,
        'url': photoURL
      }
      updateProject('photo', photo)
    }
    if (data.text.name) {
      name = data.text.name
      updateProject('name', name)
    }
    if (data.text.materials) {
      materials = data.text.materials
      updateProject('materials', materials)
    }
    if (data.text.location) {
      location = data.text.location
      updateProject('location', location)
    }
    if (data.text.description) {
      description = data.text.description
      updateProject('description', description)
    }
  }

  function updateProject(property, data) {
    switch (property) {
      case 'photo':
        Project.findOneAndUpdate({ _id: project }, {
          'photo': data
        }, (err, project) => {
          if (err) { console.log(err) }
          console.log('updating project', project)
        })
        break;
      case 'name':
        Project.findOneAndUpdate({ _id: project }, {
          'name': data
        }, (err, project) => {
          if (err) { console.log(err) }
          console.log('updating project', project)
        })
        break;
      case 'materials':
        Project.findOneAndUpdate({ _id: project }, {
          'materials': data
        }, (err, project) => {
          if (err) { console.log(err) }
          console.log('updating project', project)
        })
        break;
      case 'location':
        Project.findOneAndUpdate({ _id: project }, {
          'location': data
        }, (err, project) => {
          if (err) { console.log(err) }
          console.log('updating project', project)
        })
        break;
      case 'description':
        Project.findOneAndUpdate({ _id: project }, {
          'description': data
        }, (err, project) => {
          if (err) { console.log(err) }
          console.log('updating project', project)
        })
        break;
    }
  }
  res.redirect(req.get('referer'));

}



exports.updateWaste = async (req, res) => {
  let waste, data, photoName, photoURL, title, material, location, description
  waste = req.params.waste
  data = req.body
  console.log('in update waste, waste:', waste, 'data:', data)
  await getData(data)

  function getData(data) {
    if (data.photo) {
      photoName = data.photo.key.toString()
      photoURL = data.photo.location.toString()
      const photo = {
        'key': photoName,
        'url': photoURL
      }
      updateWaste('photo', photo)
    }
    if (data.text.title) {
      title = data.text.title
      console.log('updating title', title)
      updateWaste('title', title)
    }
    if (data.text.material) {
      material = data.text.material
      console.log('updating material', material)
      updateWaste('material', material)
    }
    if (data.text.frequency) {
      frequency = data.text.frequency
      console.log('updating frequency', frequency)
      updateWaste('frequency', frequency)
    }
    if (data.text.location) {
      location = data.text.location
      updateWaste('location', location)
    }
    if (data.text.description) {
      description = data.text.description
      updateWaste('description', description)
    }
  }

  function updateWaste(property, data) {
    switch (property) {
      case 'photo':
        Waste.findOneAndUpdate({ _id: waste }, {
          'photo': data
        }, (err, waste) => {
          if (err) { console.log(err) }
          console.log('updating waste', waste)
        })
        break;
      case 'title':
        Waste.findOneAndUpdate({ _id: waste }, {
          'title': data
        }, (err, waste) => {
          if (err) { console.log(err) }
          console.log('updating waste', waste, 'in title with', data)
        })
        break;
      case 'frequency':
        Waste.findOneAndUpdate({ _id: waste }, {
          'frequency': data
        }, (err, waste) => {
          if (err) { console.log(err) }
          console.log('updating waste', waste, 'in frequency with', data)
        })
        break;
      case 'material':
        Waste.findOneAndUpdate({ _id: waste }, {
          'material': data
        }, (err, waste) => {
          if (err) { console.log(err) }
          console.log('updating waste', waste, 'in material with', data)
        })
        break;
      case 'location':
        Waste.findOneAndUpdate({ _id: waste }, {
          'location': data
        }, (err, waste) => {
          if (err) { console.log(err) }
          console.log('updating waste', waste)
        })
        break;
      case 'description':
        Waste.findOneAndUpdate({ _id: waste }, {
          'description': data
        }, (err, waste) => {
          if (err) { console.log(err) }
          console.log('updating waste', waste)
        })
        break;
    }
  }

  res.redirect(req.get('referer'));

}

exports.addProjectGet = (req, res) => {
  const user = req.params.user

  res.render('user/profile/user/addProject', {
    title: 'Add a Project',
    user: user,
    currentUser: req.user
  })
}

exports.addWasteGet = (req, res) => {
  const user = req.params.user
  res.render('user/profile/user/addWaste', {
    title: 'Add Waste',
    currentUser: req.user,
    user: user
  })
}


exports.loginGet = (req, res) => {
  res.render('login', { title: 'Login' })
}

exports.loginPost = (req, res) => {
  user = req.body
  User.findOne({ username: user.username }, (err, user) => {
    if (err) {
      res.render('login', { title: 'Error, try again' })
    } else {
      console.log('found user in login post')
      res.render('user/profile/:user', {
        currentUser: req.user,
        user: user
      })
    }
  })
}

exports.registerGet = (req, res) => {
  // console.log(req.body)
  res.render('register', {
    title: 'Sign Up',
    currentUser: req.user
  })
}

exports.registerPost = (req, res) => {

  console.log(req.body)

  if (req.body.email && req.body.username &&
    req.body.password) {
    const newUser = new User(
      {
        'email': req.body.email,
        'username': req.body.username,
        'password': req.body.password,
        // avatar: req.body.avatar
      })
    console.log('new user: ' + newUser)
    newUser.save(function (err) {
      console.log('new user save callback', err)
      if (err) {
        res.render('register', { title: 'Error, try again' })
      } else {
        res.redirect('/')
      }
    })
  }
}



exports.logout = (req, res) => {
  req.logout();
  res.redirect('/catalog');
};
