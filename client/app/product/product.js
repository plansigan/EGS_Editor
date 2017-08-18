var app = angular.module('product',['ngSanitize']);

app.controller('productController',($scope,$http,$sce)=>{
  //modal initialization
  $('.inputInfo').popup({
    on: 'focus'
  });
  $('.buttonInfo').popup({
    hoverable: true
  });

  $scope.sortType = 'name';
  $scope.sortReverse = false;
  $scope.searchProduct = '';
  $scope.closeModal = ()=>{
    $('#viewPage').modal('hide')
  }
  //open modal on click list
  $scope.openViewModal = (newCode)=>{
    $http.get('/products/' + newCode + '/json/view').then((response)=>{
      $scope.dataView = response.data.Datatable;
      $('#viewPage').modal('show')
    })
  };

  $scope.editProduct = (newCode)=>{
    $http.get('/products/' + newCode + '/json/edit').then((response)=>{
      $scope.dataEdit = response.data.Datatable;
      var actionURL = "/products/"+$scope.dataEdit[0][0].Code+"?_method=PUT";
      $scope.formAction = $sce.trustAsResourceUrl(actionURL);
      $('#editPage').modal('show')
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
