/* GET home page. */
const index = function(req, res, next) {
    res.render('index', { title: 'Express' });
};
module.exports = {
    index
};