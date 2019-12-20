exports.createPostValidator = (req, res, next) => {
    //title check
    req.check('title', 'Title is required').notEmpty();
    req.check('title', 'Title must be between 4 to 100 characters').isLength({
        min: 4,
        max: 100
    });
    //body check
    req.check('body', 'Body is required').notEmpty();
    req.check('body', 'Body must be between 4 to 20000 characters').isLength({
        min: 4,
        max: 20000
    });
    //error check
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }
    //proceed
    next()
};

exports.userSignupValidator = (req, res, next) => {
    //name check
    req.check('name', 'Name is required').notEmpty();
    //email check
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 2000
        });
    //password check
    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({
            min: 6
        })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')

    //error check
    const errors = req.validationErrors();
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }
    //proceed
    next()
};

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty();
    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 chars long")
        .matches(/\d/)
        .withMessage("must contain a number")
        .withMessage("Password must contain a number");

    // check for errors
    const errors = req.validationErrors();
    // if error show the first one as they happen
    if (errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware or ...
    next();
};