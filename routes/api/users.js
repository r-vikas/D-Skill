const express = require("express");
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator/check');



router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'include Valid email').isEmail(),
    check('password', 'enter a longer password').isLength({
        min: 6
    })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    console.log(req.body);
    res.send("user page post")
})

module.exports = router;