'use strict';

const express = require('express');
const { authenticateUser } = require('./middleware/auth-user');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const router = express.Router();

router.get('/users', authenticateUser, (req, res) => {
    // route that will return all properties and values for the currently authenticated User along with a 200 HTTP status code.
    const user = req.currentUser;
    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
    })
});

router.post('/users', asyncHandler(async(req, res) => {
    // route that will create a new user, set the Location header to "/", and return a 201 HTTP status code and no content.
    try {
        await User.create(req.body);
        res.status(201).location('/').end();
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
            console.log(error)
          throw error;
        }
      }
}));

router.get('/courses', asyncHandler(async(req, res) => {
    // route that will return all courses including the User associated with each course and a 200 HTTP status code.
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                as: 'Owner',
                attributes:{
                    exclude:[
                        'password',
                        'createdAt',
                        'updatedAt'
                    ]
                }
            }
        ],
        attributes:{
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        }
    })
    res.status(200).json({courses});
}));

router.get('/courses/:id', asyncHandler(async(req, res) => {
    // route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                as: 'Owner',
                attributes:{
                    exclude:[
                        'password',
                        'createdAt',
                        'updatedAt'
                    ]
                }
            }
        ],
        attributes:{
            exclude: [
                'createdAt',
                'updatedAt'
            ]
        }
    });
    res.status(200).json({course});
}));

router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    // route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/api/courses/${course.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));

router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    // route that will update the corresponding course and return a 204 HTTP status code and no content.
    
    try {
        const course = await Course.findByPk(req.params.id);
        const currentUser = req.currentUser;

        if (course.userId === currentUser.id) {
            await course.update(req.body, {
                where: {
                    id: req.params.id
                }
            });
            res.status(204).json({
                "message": "Course successfully created!"
            });
        } else {
            let error = new Error("Course does not belong to user");
            error.status = 403;
            throw error;
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
    
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    // route that will delete the corresponding course and return a 204 HTTP status code and no content.
    const course = await Course.findByPk(req.params.id);
    const currentUser = req.currentUser;

    if (course.userId === currentUser.id) {
        await course.destroy();
        res.status(204).json({});
    } else {
        let error = new Error("Course does not belong to user");
        error.status = 403;
        throw error;
    }
}));

module.exports = router;