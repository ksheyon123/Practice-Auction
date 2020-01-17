var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/room/:id', async (req, res) => {
    try {
        console.log('hi')
        console.log(req.params.id);
        console.log(req.body)
        res.status(200).send(req.body)
    } catch (err) {

    }
});

router.get('/room/:id', async (req, res) => {
    try {
        console.log('get')
    } catch (err) {

    }
});

module.exports = router;