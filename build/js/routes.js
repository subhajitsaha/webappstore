/* Home Page of Universal WebApps Store */
exports.home = function (req, res) {
    res.render('home', {
       'page_title': 'Universal WebApps Store'
    });
};

exports.card = function (req, res) {
    res.render('card', {
        'locals': {
           'page_title': 'Card | Universal WebApps Store'
        },
        'partials': {
            'github_fork_ribbon': 'github_ribbon'    
        }
    });
};