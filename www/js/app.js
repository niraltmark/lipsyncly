// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards'])


.config(function($stateProvider, $urlRouterProvider) {

})

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.controller('CardsCtrl', function($scope, $http, TDCardDelegate) {
    console.log('CARDS CTRL');
    
    $scope.something = {};
    
    $http
        .get("/places/get")
        .success(function (response) {
        
            $scope.cards = Array.prototype.slice.call(response, 0);
        
            $scope.cardDestroyed = function(index) {
                $scope.cards.splice(index, 1);
            };

            $scope.addCard = function() {
                var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
                newCard.id = Math.random();
                $scope.cards.push(angular.extend({}, newCard));
            };
        
         
            $scope.cardSwipedLeft = function(index) {
                var card = $scope.cards[index];
                
                $http
                    .post("/places/choose", {
                        place_name: card.name,
                        place_id: card.id,
                        username: $scope.data.username,
                        choice: "dislike"
                    })
                    .success(function (response) {});
                
                console.log('LEFT SWIPE ' + $scope.username);
            };
        
            $scope.cardSwipedRight = function(index) {
               
                var card = $scope.cards[index];

                $http
                    .post("/places/choose", {
                        place_name: card.name,
                        place_id: card._id,
                        username: $scope.data.username,
                        choice: "like"
                    })
                    .success(function (response) {});
                
                console.log('RIGHT SWIPE ' + $scope.username);
            };
        });
    
  }
)


.controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {

 // Triggered on a button click, or some other target
 $scope.showPopup = function() {
   $scope.data = {}

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<input type="text" ng-model="data.username">',
     title: 'Enter your name',
     subTitle: "''It ain't what they call you, <br />it's what you answer to...''",
     scope: $scope,
     buttons: [
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.username) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             return $scope.data.username;
           }
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
  };
  
})