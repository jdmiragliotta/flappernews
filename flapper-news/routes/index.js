var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Post = mongoose.model("Post");
var Comment = mongoose.model("Comment");

//Gets all posts
router.get('/posts', function(req, res, next){
  Post.find(function(err, posts){
    if (err) throw err;

    res.json(posts);
  })
});

//Creates a new posts
router.post('/posts/', function(req, res, next){
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err) throw err;

    res.json(post);
  });
});

//finds post by ID
router.param('post', function(req, res, next, id){
  var query = Post.findById(id);
  query.exec(function(err, post){
    if(err) throw err;


    req.post = post;
    return next();
  })
});


router.get('/posts/:post', function(req, res){
  res.json(req.post);
});

//Allows upvotes
router.put('/posts/:post/upvote', function(req, res, next){
  req.post.upvote(function(err, post){
    if (err) throw err;
    res.json(post)
  });
});

router.post('/post/:post/comments', function(req, res, next){
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.save(function(err, comment){
    if (err) throw err;
    req.post.comments.push(comment);
    req.post.save(function(err, post){
      if (err) throw err;
      res.json(comment);
    });
  });
});

module.exports = router;
