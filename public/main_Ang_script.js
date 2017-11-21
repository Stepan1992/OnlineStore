app.controller('mainCtrl', function ($scope, $http, $location, $rootScope, myFactory, $timeout) {
    $scope.myFactory = myFactory;
    $scope.currentView = myFactory.current;
    $scope.showPageNumbers = true;
    $scope.pattern = /\d{1,}/;
    $scope.forUser = true;
    $scope.forAdmin = false;

//    $scope.phoneCode;
//    $scope.phoneNumber;
//
//    $scope.phone = function () {
//
//        let obj = {
//            body: $scope.phoneCode,
//            to: $scope.phoneNumber
//        };
//
//        $http.post('http://localhost:8000/testtwilio', obj)
//            .then(function successCallback(response) {
//                console.log("Success!");
//            }, function errorCallback(response) {
//                console.log("Error!!!" + response.err);
//            });
//
//
//    }








    //    $scope.nonRegistered = false;
    $scope.chooseItem = function (index, name, id) {
        $scope.array = $scope.itemsArr;
        $scope.itemId = id;
        $scope.checkingFunc = function () {
            for (var i = 0; i < $scope.array.length; i++) {
                if ($scope.array[i].id == id) {
                    $scope.chosenItem = $scope.array[i];
                    break;
                }
            }
        };

        $scope.chosenItem;
        $scope.checkingFunc();
        myFactory.current = 'currentGoods';
        $scope.currentView = myFactory.current;
        window.scrollTo(0, 300);

        $scope.currentReviewArray = [];
        $scope.reviewArrayFunc = function () {
            for (var i = 0; i < $scope.reviewsArr.length; i++) {
                if ($scope.chosenItem.id == $scope.reviewsArr[i].goodsname) {
                    $scope.currentReviewArray.push($scope.reviewsArr[i]);
                }
            }
        };
        $scope.reviewArrayFunc();
        $scope.showPageNumbers = false;


        let obj = {
            id: $scope.itemId
        };

        $http.post('http://localhost:8000/items-info', obj)
            .then(function successCallback(response) {
                console.log("Success!");
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });

        $http.get('http://localhost:8000/items-info')
            .then(function successCallback(response) {
                $scope.largeDescription = response.data;
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });

    };



    $scope.showAddWindow = function () {
        myFactory.current = 'addItemWindow';
        $scope.currentView = myFactory.current;
        $scope.showPageNumbers = false;
        window.scrollTo(0, 300);

    }

    $scope.deleteItem = function (event, id) {
        event.stopPropagation();

        let obj = {
            id: id
        };

        $http.post('http://localhost:8000/delete', obj)
            .then(function successCallback(response) {
                console.log("Success!");
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });


        $http.get('http://localhost:8000/goods')
            .then(function successCallback(response) {
                $scope.itemsArr = response.data;
                //                if ($scope.itemsArr.length % 8 == 0) {
                //                    let numbersBox = angular.element(document.getElementById('num'));
                //                    let currentDiv = numbersBox.children().eq(numbersBox.children().length - 1);
                //                    currentDiv.remove();
                //                    $scope.goodsFunc();
                //
                //                    $scope.from = $scope.from - 8;
                //                    $scope.count = $scope.count - 8;
                //                    
                //                    $scope.pageSort();
                //
                //
                //                }

            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });

        $scope.goodsFunc();

    }

    $scope.myFactory.homeFunc = function () {
        $scope.from = 0;
        $scope.count = 8;
        $scope.currentView = myFactory.current;
        $scope.search = '';
        $scope.showPageNumbers = true;
    };
    //    Функція покупки на яку тре поставити stoppropagation

    $scope.buyFunc = function (event, index) {

        //        if ($scope.userName) {
        //            alert($scope.itemsArr[index].name);
        //        } else {
        //            alert('you are not registered')
        //        }
        //        else {
        //            $scope.nonRegistered = true;
        //        }




    };


    $scope.$on('sendUserNameEvent', function (event, args) {
        $scope.userName = args.userName;
    });


    $scope.$on('sendSearchReqEvent', function (event, args) {
        myFactory.current = 'allGoods';
        $scope.currentView = myFactory.current;
        $scope.search = args.search;









    });

    $scope.goodsFunc = function () {

        $http.get('http://localhost:8000/goods')
            .then(function successCallback(response) {
                $scope.itemsArr = response.data;
                $scope.addNumberBox = function () {
                    if (($scope.itemsArr % 8) != 0) {
                        if (($scope.itemsArr.length / 8) == 1) {
                            $scope.numbersCount == 1;
                        } else {
                            $scope.numbersCount = Math.ceil($scope.itemsArr.length / 8);
                        }
                    } else {
                        $scope.numbersCount = $scope.itemsArr.length / 8;
                    }
                    let numbersBox = angular.element(document.getElementById('num'));
                    while ((numbersBox.children().length < $scope.numbersCount) && ($scope.numbersCount != 1)) {
                        let j = numbersBox.children().length + 1;
                        let newDiv = angular.element("<div>").text(j++);
                        numbersBox.append(newDiv);

                    }
                }
                $scope.addNumberBox();




            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });
    };

    $scope.goodsFunc();


    //reviewsFunc

    $scope.evenClass = 'evenClass';
    $scope.oddClass = 'oddClass';
    $scope.$on('sendUserNameEvent', function (event, args) {
        $scope.userName = args.userName;


    });
    $scope.$on('sendUserPassEvent', function (event, args) {
        $scope.userPass = args.userPass;
        if ($scope.userName == 'admin' && $scope.userPass == 9999) {
            $scope.forUser = false;
            $scope.forAdmin = true;

        }
    });
    //    
    //    
    //    $scope.sFunc = function(){
    //        alert('hello')
    //    }

    //    console.log($scope.userName)


    $scope.reviewsFunc = function () {
        $scope.date = new Date();

        var obj = {
            question: $scope.review,
            user: $scope.userName || 'anonymous',
            date: $scope.date,
            goodsname: $scope.chosenItem.id
        };


        //Запит POST надсилає об'єкт
        $http.post('http://localhost:8000/reviews', obj)
            .then(function successCallback(response) {
                console.log("Success!");
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });

        //Повторно робимо запит на всі рядки (для оновлення інформації)
        $http.get('http://localhost:8000/reviews')
            .then(function successCallback(response) {
                $scope.reviewsArr = response.data;
                $scope.currentReviewArray.push({
                    question: $scope.review,
                    user: $scope.userName || 'anonymous',
                    date: $scope.date,
                    goodsname: $scope.chosenItem
                });
                $scope.review = '';
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });


    };
    $http.get('http://localhost:8000/reviews')
        .then(function successCallback(response) {
            $scope.reviewsArr = response.data;
        }, function errorCallback(response) {
            console.log("Error!!!" + response.err);
        });

    $scope.from = 0;
    $scope.count = 8;


    $scope.limitToFunc = function (event) {


        var currentDiv = angular.element(event.target);
        var pageNumber = Number(currentDiv.text());

        $scope.pageSort = function pageSort() {
            if ((pageNumber * 8) == 8) {
                $scope.from = 0;
                $scope.count = 8;

            } else {
                $scope.from = (pageNumber * 8) - 8;
                $scope.count = 8;


            }
        };
        $scope.pageSort();
        window.scrollTo(0, 300);
    };


    $scope.addFunc = function () {

        let obj = {
            pictureSrc: $scope.imageSrc,
            name: $scope.itemName,
            price: $scope.itemPrice,
            category: $scope.itemCategory,
            description: $scope.itemDescription,
            count: $scope.itemCount,
            txt: $scope.txt
        };

        $http.post('http://localhost:8000/addItem', obj)
            .then(function successCallback(response) {
                console.log("Success!");
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });



        $http.get('http://localhost:8000/goods')
            .then(function successCallback(response) {
                $scope.itemsArr = response.data;
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });


        myFactory.current = 'allGoods';
        $scope.currentView = myFactory.current;
        $scope.showPageNumbers = true;

        $scope.goodsFunc();

    };

    $scope.showChangeWindow = function () {
        myFactory.current = 'changeGoods';
        $scope.currentView = myFactory.current;
        var elements = angular.element(document.getElementsByClassName('textareaAdmin'));
        elements.eq(0).prop('value', $scope.chosenItem.pictureSrc);
        elements.eq(1).prop('value', $scope.chosenItem.name);
        elements.eq(2).prop('value', $scope.chosenItem.price);
        elements.eq(3).prop('value', $scope.chosenItem.category);
        elements.eq(4).prop('value', $scope.chosenItem.count);
        elements.eq(5).prop('value', $scope.chosenItem.description);
        elements.eq(6).prop('value', $scope.largeDescription);

    };


    $scope.changeFunc = function () {

        let obj = {
            pictureSrc: $scope.changeWay || $scope.chosenItem.pictureSrc,
            name: $scope.changeName || $scope.chosenItem.name,
            price: $scope.changePrice || $scope.chosenItem.price,
            category: $scope.changeCategory || $scope.chosenItem.category,
            description: $scope.changeDescription || $scope.chosenItem.description,
            count: $scope.changeCount || $scope.chosenItem.count,
            txt: $scope.changeLargeDescription || $scope.largeDescription,
            currentId: $scope.chosenItem.id
        };


        $http.post('http://localhost:8000/changeItem', obj)
            .then(function successCallback(response) {
                console.log("Success!");
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });



        $http.get('http://localhost:8000/goods')
            .then(function successCallback(response) {
                $scope.itemsArr = response.data;
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });


        myFactory.current = 'allGoods';
        $scope.showPageNumbers = true;
        $scope.currentView = myFactory.current;
        window.scrollTo(0, 300);

    };

});


app.controller('headCtrl', function ($scope, myFactory, $timeout, $rootScope) {
    $scope.myFactory = myFactory;

});


app.factory('myFactory', function () {
    return {
        current: 'allGoods'
    }
});

app.directive('homeDirective', function () {
    return {
        scope: false,
        link: function (scope, element, attrs) {
            var home = element.children().eq(0);
            home.on('click', function () {

                scope.myFactory.current = 'allGoods';
                scope.$apply(function () {
                    scope.myFactory.homeFunc();
                })
            })
        }
    }
});


app.filter('skipItems', function () {
    return function (value, count) {
        if (count > value.length || count < 1) {
            return value;
        } else {
            return value.slice(count);
        }
    }
});

app.filter('page', function ($filter) {
    return function (data, from, count) {
        var array = $filter('skipItems')(data, from);
        return $filter('limitTo')(array, count)
    }
});