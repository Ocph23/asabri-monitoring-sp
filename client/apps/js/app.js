angular
	.module('app', [
		'app.router',
		'ngRoute',
		'datatables',
		'swangular',
		'message.service',
		'ngMaterial',
		'ngMessages',
		'ngAnimate',

		'auth.service',
		'storage.services',
		'helper.service',
		'bank.service',
		'mitraBayar.service',
		'sp.service',
    'angular.filter',
		'app.conponent',

		'auth.controllers',
		'admin.controllers',
		'mitra.controllers'
	])
	.config(function($mdThemingProvider) {
		$mdThemingProvider.definePalette('amazingPaletteName', {
			'50': 'ffebee',
			'100': 'ffcdd2',
			'200': 'ef9a9a',
			'300': 'e57373',
			'400': 'ef5350',
			'500': 'f44336',
			'600': 'e53935',
			'700': 'd32f2f',
			'800': 'c62828',
			'900': 'b71c1c',
			A100: 'ff8a80',
			A200: 'ff5252',
			A400: 'ff1744',
			A700: 'd50000',
			contrastDefaultColor: 'light', // whether, by default, text (contrast)
			// on this palette should be dark or light

			contrastDarkColors: [
				'50',
				'100', //hues which contrast should be 'dark' by default
				'200',
				'300',
				'400',
				'A100'
			],
			contrastLightColors: undefined // could also specify this if default was 'dark'
		});

		$mdThemingProvider.theme('default').primaryPalette('amazingPaletteName');
	})

	.filter('bytetobase', function() {
		return function(buffer) {
			var binary = '';
			var bytes = new Uint8Array(buffer);
			var len = bytes.byteLength;
			for (var i = 0; i < len; i++) {
				binary += String.fromCharCode(bytes[i]);
			}
			return window.btoa(binary);
		};
	})
	.directive('chooseFile', function() {
		return {
			link: function(scope, elem, attrs) {
				var button = elem.find('button');
				var input = angular.element(elem[0].querySelector('input#fileInput'));
				button.bind('click', function() {
					input[0].click();
				});
				input.bind('change', function(e) {
					scope.$apply(function() {
						var files = e.target.files;
						if (files[0]) {
							var f = files[0];
							scope.model.fileName = f.name;
							r = new FileReader();
							r.onload = (function(theFile) {
								return function(e) {
									var binaryData = e.target.result;
									//Converting Binary Data to base 64
									var base64String = window.btoa(binaryData);
									//showing file converted to base64
									scope.model.buktiBayar = base64String;
								};
							})(f);
							r.readAsBinaryString(f);
						} else {
							scope.model.buktiBayar = null;
						}
					});
				});
			}
		};
	})
	.controller('homeController', function($scope, $timeout, $mdSidenav, $log) {
		$scope.toggleLeft = buildDelayedToggler('left');
		$scope.toggleRight = buildToggler('right');
		$scope.isOpenRight = function() {
			return $mdSidenav('right').isOpen();
		};

		/**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
		function debounce(func, wait, context) {
			var timer;

			return function debounced() {
				var context = $scope,
					args = Array.prototype.slice.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function() {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}

		/**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
		function buildDelayedToggler(navID) {
			return debounce(function() {
				// Component lookup should always be available since we are not using `ng-if`
				$mdSidenav(navID).toggle().then(function() {
					$log.debug('toggle ' + navID + ' is done');
				});
			}, 200);
		}

		function buildToggler(navID) {
			return function() {
				// Component lookup should always be available since we are not using `ng-if`
				$mdSidenav(navID).toggle().then(function() {
					$log.debug('toggle ' + navID + ' is done');
				});
			};
		}
	})
	.controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
		$scope.close = function() {
			// Component lookup should always be available since we are not using `ng-if`
			$mdSidenav('left').close().then(function() {
				$log.debug('close LEFT is done');
			});
		};
	})
	.controller('RightCtrl', function($scope, $timeout, $mdSidenav, $log) {
		$scope.close = function() {
			// Component lookup should always be available since we are not using `ng-if`
			$mdSidenav('right').close().then(function() {
				$log.debug('close RIGHT is done');
			});
		};
	})
	.controller('DialogController', DialogController);

function DialogController($scope, $mdDialog, dataToPass) {
	if (dataToPass) {
		$scope.model = angular.copy(dataToPass);
	}
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(model) {
		$mdDialog.hide(model);
	};
}
