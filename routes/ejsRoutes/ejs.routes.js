const express = require('express');
const isLoggedIn = require('../../middlewares/isLoggedIn');
const News = require('../../models/News.js');
const Prayer = require('../../models/Prayer.js');
const Awareness = require('../../models/Awareness.js');
const router = express.Router();


router.get('/news', isLoggedIn ,(req, res) => {
    res.render('news');
});


router.get('/news/:id', isLoggedIn ,(req, res) => {
    res.render('getNews');
});

router.get('/', (req, res) => {
    res.redirect('/home');
});

router.get('/home' , isLoggedIn ,(req, res) => {
    res.render('home');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/add-news', isLoggedIn ,(req, res) => {
    res.render('addNews', { message: '' });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

router.get('/add-admin', isLoggedIn ,(req, res)=>{
    res.render('addAdmin')
})

router.get('/prayers', isLoggedIn ,(req, res) => {
    res.render('allPrayers');
});

router.get('/add-prayer', isLoggedIn ,(req, res) => {
    res.render('addPrayer');
});

router.get('/prayers/:id', isLoggedIn ,(req, res) => {
    res.render('getPrayer');
});

router.get('/news/:id/edit', isLoggedIn, async(req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if(!news){
            res.redirect('/not-found');
        }
        res.render('editNews', { news });
    } catch (error) {
        console.error('Error getting news:', error);
    }
});

router.get('/prayers/:id/edit', isLoggedIn ,async(req, res) => {
    try {
        const prayerId = req.params.id;
        const prayer = await Prayer.findById(prayerId);
        res.render('editPrayer', { prayer });
    } catch (error) {
        console.error('Error getting prayer:', error);
    }
});

router.get('/Awar', isLoggedIn ,(req, res) => {
    res.render('Awar');
});
router.get('/addAwar', isLoggedIn ,(req, res) => {
    res.render('addAwar', { message: '' });
});
router.get('/awar/:id/edit', isLoggedIn ,async(req, res) => {
    try {
        const awarId = req.params.id;
        const awar = await Awareness.findById(awarId);
        res.render('editAwar', { awar });
    } catch (error) {
        console.error('Error getting awar:', error);
    }
});

router.get('/add-notification', isLoggedIn ,(req, res) => {
    res.render('sendNotification');
});

router.get('/notifications', isLoggedIn ,(req, res) => {
    res.render('allNotifications');
});


module.exports = router;





