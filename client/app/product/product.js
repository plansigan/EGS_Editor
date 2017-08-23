var app = angular.module('product',['ngSanitize','ngFlash']);

app.controller('productController',($scope,$http,$sce,Flash)=>{
  //modal initialization
  $('.inputInfo').popup({
    on: 'focus'
  });
  $('.buttonInfo').popup({
    hoverable: true
  });
  $scope.masterUpdate = {};
  $scope.sortType = 'name';
  $scope.sortReverse = false;
  $scope.searchProduct = '';
  $scope.closeModal = ()=>{
    $('#viewPage').modal('hide')
  }
  $scope.success = function() {
   var message = '<strong>Saved!</strong> The product has been saved successfully.';
   Flash.create('success', message);
 };
  //open modal on click list
  $scope.openViewModal = (newCode)=>{
    $http.get('/products/' + newCode + '/json/view').then((response)=>{
      $scope.dataView = response.data.Datatable;
      $scope.code = response.data.Datatable[0][0].Code
      $('#viewPage').modal('show')
    })
  };
//edit modal
  $scope.editProduct = (newCode)=>{
    $http.get('/products/' + newCode + '/json/edit').then((response)=>{
      $scope.dataEdit = response.data.Datatable;
      $scope.product = response.data.Datatable[0][0]
      $('#editPage').modal('show')
    })
  }
//save modal
  $scope.saveProduct = ()=>{
    $http.post('/products/'+ $scope.code,$scope.dataEdit).then((response)=>{
      $scope.success()
    }).catch((err)=>{
      console.log(err)
    })
  }

  //search product
  $scope.search = ()=>{
    $http.get('/products/5000/1/filter/'+$scope.searchName).then((response)=>{
      $scope.data = response.data.Datatable[0];
    })
  }
  //get all
  $http.get('/products/500/1/filter/all').then((response)=>{
    $scope.data = response.data.Datatable[0];
  })
});


(function() {
    'use strict';
    var app = angular.module('flash', []);

    app.run(function($rootScope) {
        // initialize variables
        $rootScope.flash = {};
        $rootScope.flash.text = '';
        $rootScope.flash.type = '';
        $rootScope.flash.timeout = 5000;
        $rootScope.hasFlash = false;
    });

    // Directive for compiling dynamic html
    app.directive('dynamic', function($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    });

    // Directive for closing the flash message
    app.directive('closeFlash', function($compile, Flash) {
        return {
            link: function(scope, ele) {
                ele.on('click', function() {
                    Flash.dismiss();
                });
            }
        };
    });

    // Create flashMessage directive
    app.directive('flashMessage', function($compile, $rootScope) {
        return {
            restrict: 'A',
            template: '<div style="float:left" role="alert" ng-show="hasFlash" class="alert {{flash.addClass}} alert-{{flash.type}} alert-dismissible ng-hide alertIn alertOut "> <span dynamic="flash.text"></span> <button type="button" class="close" close-flash><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> </div>',
            link: function(scope, ele, attrs) {
                // get timeout value from directive attribute and set to flash timeout
                $rootScope.flash.timeout = parseInt(attrs.flashMessage, 10);
            }
        };
    });

    app.factory('Flash', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {

            var dataFactory = {},
                timeOut;

            // Create flash message
            dataFactory.create = function(type, text, addClass) {
                var $this = this;
                $timeout.cancel(timeOut);
                $rootScope.flash.type = type;
                $rootScope.flash.text = text;
                $rootScope.flash.addClass = addClass;
                $timeout(function() {
                    $rootScope.hasFlash = true;
                }, 100);
                timeOut = $timeout(function() {
                    $this.dismiss();
                }, $rootScope.flash.timeout);
            };

            // Cancel flashmessage timeout function
            dataFactory.pause = function() {
                $timeout.cancel(timeOut);
            };

            // Dismiss flash message
            dataFactory.dismiss = function() {
                $timeout.cancel(timeOut);
                $timeout(function() {
                    $rootScope.hasFlash = false;
                });
            };
            return dataFactory;
        }
    ]);
}());
