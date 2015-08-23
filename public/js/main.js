(function(angular){
    console.log('Angular Loaded');
    
    window.no_image = function(image){
        image.onerror = "";
        image.src = 'img/no_image.png';
        return true;
    };
    
    var cardapp = angular.module('CardApp', ['ngRoute']);
        
    cardapp.value('cardDetailUrl', 'http://ec2-52-27-92-14.us-west-2.compute.amazonaws.com:8888/');
    
    cardapp.service('CardService', ['$q', '$http', '$log', function ($q, $http, $log){
        var self = this;
        //$log.info('URL - ' + cardDetailUrl);
        
        this.fetch = function (current_card_number) {
            $log.info('Current card number under service ' + current_card_number);
            return $http.get('getcard/' + current_card_number)
                .then(function (result) {
                    //$log.info('Received Data' + result);
                    return result.data;
                });
        }
    }]);
    
    cardapp.config(function($routeProvider){
        $routeProvider.when('/', {
            controller:'CardAppController',
            controllerAs: 'card',
            templateUrl:'templates/card.html',
            resolve: {
                card: function (CardService) {
                    return CardService.fetch('0').then(function(result){
                        var card = {};
                        
                        card.card_title = result.data.title;
                        card.card_description = result.data.short_desc;
                        card.card_image_url = result.data.url;
                        
                        //console.log('Under - resolve ' + card);
                        
                        return card;
                    });
                }
            }
        })
        .otherwise({
            redirectTo:'/'
        });  
    });
    
    cardapp.controller('CardAppController', ['$interval', '$log', 'CardService', 'cardDetailUrl', function($interval, $log, CardService, cardDetailUrl) {
        $log.info('Controller loaded.');
        
        var card = this;
        
        card.animation_class = '';
        card.play_btn_class = 'fa-play';
        card.current_card_number = 0;
        card.isLoading = true;
        
        CardService.fetch(card.current_card_number).then(function(result) {
            $log.info('Initial fetched card data');
            
            card.card_image_url = cardDetailUrl + result.data.url;
            card.card_title = result.data.title;
            card.card_description = result.data.short_desc;
            card.isLoading = false;
        });
            
        var stop;
        
        card.play = function() {
            $log.info('Play clicked');
            var blnPlay = false;
            
            if (card.play_btn_class === 'fa-play') {
                card.play_btn_class = 'fa-pause';
                blnPlay = true;
                card.isLoading = true;
            } else {
                card.play_btn_class = 'fa-play';
                card.isLoading = false;
            }
            
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
            
            if (blnPlay) {
                card.current_card_number = 0;
                
                stop = $interval(function() {
                    if (card.current_card_number >= 0 && card.current_card_number < 500) {
                        card.current_card_number = card.current_card_number + 1;
                    } else {
                        card.current_card_number = 0;
                    }
            
                    card.isLoading = true;
                    
                    CardService.fetch(card.current_card_number).then(function(result) {
                        $log.info('Auto play card data fetching.');
                        
                        card.card_image_url = cardDetailUrl + result.data.url;
                        card.card_title = result.data.title;
                        card.card_description = result.data.short_desc;
                        card.isLoading = false;
                    });
                }, 4000);
            }
        };
        
        card.fetchCard = function(opt) {
            var errorFlag = false;
            card.isLoading = true;
            card.play_btn_class = 'fa-play';
            
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
            
            if (opt === 'prev') {
                card.current_card_number = card.current_card_number - 1;
                card.animation_class = 'animated slideOutRight';
            } else if (opt === 'next') {
                card.current_card_number = card.current_card_number + 1;
                card.animation_class = 'animated slideOutLeft';
            } else {
                errorFlag = true;
                card.animation_class = '';
            }
            
            if (card.current_card_number < 0 || card.current_card_number > 499) {
                errorFlag = true;
            }
            
            if (!errorFlag) {
                CardService.fetch(card.current_card_number).then(function(result) {
                    $log.info('Fetched card data for Card-' + card.current_card_number);
                    card.card_image_url = cardDetailUrl + result.data.url;
                    card.card_title = result.data.title;
                    card.card_description = result.data.short_desc;
                    card.isLoading = false;
                    
                    if (opt === 'prev') {
                        card.animation_class = 'animated fadeInLeft';
                    } else if (opt === 'next') {
                        card.animation_class = 'animated fadeInRight';
                    } else {
                        card.animation_class = '';
                    }
                });
            } else {
                card.current_card_number = 1;
                card.isLoading = false;
                card.animation_class = '';
            }
        };
    }]);
}(angular))