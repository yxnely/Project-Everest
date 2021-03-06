choral.config(['$stateProvider', '$urlRouterProvider', 'authProvider', '$httpProvider', 'jwtInterceptorProvider', '$mdThemingProvider', '$mdIconProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, authProvider, $httpProvider, jwtInterceptorProvider, $mdThemingProvider, $mdIconProvider, $locationProvider) {
  $mdIconProvider
    .iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
    .iconSet("social", 'img/icons/sets/social-icons.svg', 24);

  // Initial configurations for my google authentication
  authProvider.init({
    domain: 'yeramirez.auth0.com',
    clientID: 'Cc17tiuA3SGvx4NR3OHztSuXXKKZlRmU',
    loginState: 'home'
  });

  // What to do in the case of a success
  authProvider.on('loginSuccess', function ($location, profilePromise, idToken, store) {
    profilePromise.then(function(profile) {
      store.set('profile', profile);
      store.set('token', idToken);
    });
    $location.path('/dashboard');
  });

  // What to do in the case of a failure
  authProvider.on('loginFailure', function($location) {
    console.log("Login Failed.");
    alert("I'm sorry. We could not identify you. Please try again.");
    $location.path('/home');
  });

  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue', {
      'default': 'A400'
    })
    .accentPalette('pink', {
      'default': '400'
    });

  // Configuring the jwtInterceptor to always send the JWT
  jwtInterceptorProvider.tokenGetter = ['store', function(store) {
    // Return the saved token
    return store.get('token');
  }];

  $httpProvider.interceptors.push('jwtInterceptor');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'components/home/home.tpl.html',
      controller: 'LoginCtrl'
    })

    .state('cards', {
      url: '/cards/:id',
      templateUrl: 'components/card/card.tpl.html',
      controller: 'CardCtrl',
      resolve: {
        card: ['$stateParams', 'CardSvc', function ($stateParams, CardSvc) {
          return CardSvc.get($stateParams.id);
        }]
      }
    })

    .state('create', {
      url: '/create',
      templateUrl: 'components/create/create.tpl.html',
      controller: 'CreateCtrl',
      data: {
        requiresLogin: true
      }
    })

    .state('profile', {
      url: '/profile/:nickname',
      templateUrl: 'components/profile/profile.tpl.html',
      controller: 'ProfileCtrl',
      resolve: {
        user: ['$stateParams', 'CardSvc', function ($stateParams, CardSvc) {
          return CardSvc.getUser($stateParams.nickname);
        }]
      },
      data: {
        requiresLogin: true
      }
    })

  $urlRouterProvider.otherwise('dashboard');

}]);

choral.run(function(auth) {
  // This hooks al auth events to check everything as soon as the app starts
  auth.hookEvents();
});
