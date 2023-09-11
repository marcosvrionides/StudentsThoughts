var express = require('express');
var firebase = require('../firebase')
const multer = require("multer");

var router = express.Router();
var app = express();
var admin = firebase.admin;
var database = firebase.database;
var bucket = firebase.bucket;
const upload = multer();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Handle set new profile picture */
router.post('/setProfilePicture', upload.array("profilePicture"), (req, res) => {
  const profilePicture = req.files[0];
  const uid = req.body.uid;

  const file = bucket.file(uid);
  const stream = file.createWriteStream({
    metadata: {
      contentType: profilePicture.mimetype
    }
  })

  stream.on('error', (err) => {
    console.error(err);
    return res.sendStatus(500);
  });

  stream.on('finish', () => {
    file.makePublic().then(() => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uid}`;
      const userRef = database.ref(`/users/${uid}`);
      userRef.update({ profilePicture: publicUrl })
        .then(() => res.sendStatus(200))
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });
    });
  });

  stream.end(profilePicture.buffer);
})

/* Handle new posts */
router.post('/newPost', upload.array("uploadedFile"), (req, res) => {
  try {
    const uploadedFile = req.files[0];
    var fileNameToSave = 'no file'
    if (uploadedFile) {
      fileNameToSave = uploadedFile.originalname;
    }
    const data = JSON.parse(req.body.content);

    const newPost = database.ref("/posts/" + data.uid).push(
      {
        content: data.content,
        likes: 0,
        email: data.email,
        displayName: data.displayName,
        community: data.community,
        file: fileNameToSave,
        timestamp: admin.database.ServerValue.TIMESTAMP,
        uid: data.uid
      }
    )

    const postID = newPost.key;

    if (!uploadedFile) {
      return res.sendStatus(200);
    }

    const file = bucket.file(postID)
    const stream = file.createWriteStream({
      metadata: {
        contentType: uploadedFile.mimetype
      }
    });

    stream.on('error', (err) => {
      console.error(err);
      return res.sendStatus(500);
    });

    stream.on('finish', () => {
      file.makePublic().then(() => {
        res.sendStatus(200);
      });
    });

    stream.end(uploadedFile.buffer);

  } catch (err) {
    console.log("/newPost: " + err.message)
  }
});

/* Get post's file */
router.post('/getFile', async (req, res) => {
  try {
    file = bucket.file(req.body.key)
    file.createReadStream().on('error', (err) => {
      console.error('Error reading file:', err.message);
      res.status(500).send({ error: 'Error reading file' });
    }).pipe(res);
  } catch (error) {
    console.log(error.message)
  }
})

/* Handle new messages */
router.post('/sendMessage', async function (req, res) {
  const uids = [req.body.fromUid, req.body.to].sort()
  const conversationRef = '/messages/'.concat(uids[0]).concat(uids[1]);
  database.ref(conversationRef).push(
    {
      fromUid: req.body.fromUid,
      fromDisplayName: req.body.fromDisplayName,
      to: req.body.to,
      message: req.body.message,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      read: 'sent'
    }
  );
  res.sendStatus(200);
});

/* Handle new group messages */
router.post('/sendGroupMessage', async function (req, res) {
  const conversationRef = '/groupChats/'.concat(req.body.groupID).concat("/messages");
  database.ref(conversationRef).push(
    {
      fromUid: req.body.fromUid,
      fromDisplayName: req.body.fromDisplayName,
      message: req.body.message,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      read: 'sent'
    }
  );
  res.sendStatus(200);
});

/* Set like */
router.post('/setLike', (req, res) => {
  const likesRef = database.ref('/likes/'.concat(req.body.postID).concat("/").concat(req.body.userID));
  likesRef.set({
    like: req.body.like
  });

  const postRef = database.ref('/posts/' + req.body.userID + '/' + req.body.postID + "/likes");
  postRef.transaction((currentLikes) => {
    if (req.body.like) {
      return currentLikes + 1;
    } else {
      if (currentLikes > 0) {
        return currentLikes - 1;
      } else {
        likesRef.remove();
        return currentLikes;
      }
    }
  }, (error, committed, snapshot) => {
    if (!error) {
      const updatedLikes = snapshot.val();
      res.status(200).send({ likes: updatedLikes });
    }
  });
});



/* Set comment */
router.post('/sendComment', (req, res) => {
  const commetnsRef = database.ref('/comments/'.concat(req.body.postID));
  commetnsRef.push({
    commenter: req.body.displayName,
    comment: req.body.comment,
    date: req.body.date
  });
  res.sendStatus(200);
})

/* Set new user */
router.post('/setUser', (req, res) => {
  const email = req.body.user.email;
  const uid = req.body.user.uid;
  const displayName = req.body.user.displayName;
  const profilePicture = req.body.user.photoURL || '';
  const usersRef = database.ref('/users');
  usersRef.once('value', snapshot => {
    const users = snapshot.val();
    if (users && Object.values(users).some(user => user.email === email)) {
      return res.status(200).send({ error: 'Email already exists' });
    }
    usersRef.child(uid).set({ email, displayName, profilePicture });
    res.sendStatus(200);
  });
});

/* Handle new community */
router.post('/createCommuntiy', async function (req, res) {
  database.ref("/communities").push(
    {
      name: req.body.name,
      description: req.body.description,
      creator: req.body.creator
    }
  );
  res.sendStatus(200);
});

/* Handle new community */
router.post('/createGroup', async function (req, res) {
  database.ref("/groupChats").push(
    {
      name: req.body.name,
      creator: req.body.creator,
      users: req.body.users
    }
  );
  res.sendStatus(200);
});

/* Handle post deletion */
router.post('/deletePost', (req, res) => {
  const postRef = database.ref('/posts/' + req.body.postID);
  postRef.remove();
  res.sendStatus(200);
})

/* Return a list of all users who match the search input */
router.post('/searchUsers', (req, res) => {
  const searchInput = req.body.searchInput.toLowerCase();
  admin.auth().listUsers()
    .then((listUsersResult) => {
      const users = [];
      listUsersResult.users.forEach((userRecord) => {
        if (userRecord.emailVerified === true) {
          if (userRecord.email.toLowerCase().includes(searchInput) ||
            userRecord.displayName.toLowerCase().includes(searchInput) ||
            userRecord.uid.toLowerCase().includes(searchInput)) {
            users.push(userRecord);
          }
        }
      });
      res.send(users);
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
      res.sendStatus('404')
    });
});

/* Handle save about */
router.post('/saveAbout', async function (req, res) {
  const uid = req.body.uid;
  const about = req.body.about;
  const aboutRef = database.ref(`/users/${uid}/about`);
  await aboutRef.set(about);
  res.sendStatus(200);
});


module.exports = router;