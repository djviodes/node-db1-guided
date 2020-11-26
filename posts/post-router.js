const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    // SELECT * FROM posts
    const posts = await db.select("*").from("posts");

    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // SELECT * FROM posts WHERE id = req.params.id LIMIT 1
    const [post] = await db
      .select("*")
      .from("posts")
      .where("id", req.params.id)
      .limit(1);

    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      contents: req.body.contents,
    };
    if (!payload.title || !payload.contents) {
      return res.status(400).json({
        message: "Need a title and contents",
      });
    }

    // INSERT INTO messages (title, contents) VALUES (?, ?);
    const [id] = await db.insert(payload).into("posts");
    const post = await db
        .first("*") // A shortcut for destructuring the array and limit 1
        .from("posts")
        .where("id", id);

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const payload = {
        title: req.body.title,
        contents: req.body.contents,
      };

      if (!payload.title || !payload.contents) {
        return res.status(400).json({
          message: "Need a title and contents",
        });
      }

      // UPDATE posts SET title = ? AND contents = ? WHERE id = ?
      await db('posts').where("id", req.params.id).update(payload)

      const post = await db
        .first("*") // A shortcut for destructuring the array and limit 1
        .from("posts")
        .where("id", req.params.id);

      res.json(post)
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    // DELETE FROM posts WHERE id = ?
    await db('posts').where('id', req.params.id).del()

    res.status(204).end()
  } catch (err) {
    next(err);
  }
});

module.exports = router;
