angular
	.module('mitra.controllers', [])
	.controller('mitraController', mitraController)
	.controller('mitraHomeController', mitraHomeController)
	.controller('mitraSuratBayarController', mitraSuratBayarController)
	.controller('mitraCariController', mitraCariController)
	.controller('mitraSPController', mitraSPController)
	.controller('createPembayaranController', createPembayaranController)
	.controller('mitraLaporanTerbayarkan',mitraLaporanTerbayarkan);

function mitraController($scope, $rootScope, AuthService, helperServices, $timeout, $mdSidenav, $log) {
	AuthService.me().then((x) => {
		$scope.me = x;
	});

	$rootScope.spinner = helperServices.spinner;
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
}

function mitraHomeController($scope, $state) {}

function mitraSuratBayarController($scope, $rootScope, SuratBayarService) {
	$rootScope.spinner = true;
	SuratBayarService.get().then((x) => {
		$scope.datas = x;
		$rootScope.spinner = false;
	});
}

function mitraCariController($scope, $state, SuratBayarService) {
	$scope.Cari = function(nomor, sbb) {
		if (sbb) {
			SuratBayarService.getByNomorSP(nomor).then(
				(x) => {
					$state.go('mitra-sp', { id: x.idSuratPembayaran });
				},
				(err) => {
					$scope.error = true;
				}
			);
		} else {
			SuratBayarService.getByKodeBayar(nomor).then(
				(x) => {
					$state.go('mitra-sp', { id: x.idSuratPembayaran });
				},
				(err) => {
					$scope.error = true;
				}
			);
		}
	};
}

function mitraSPController(
	$scope,
	helperServices,
	SuratBayarService,
	$stateParams,
	AuthService,
	message,
	BankService,
	$mdDialog
) {
	var id = $stateParams.id;
	$scope.btn = {};
	$scope.model = {};
	$scope.model.pembayaran = null;
	BankService.get().then((x) => {
		$scope.banks = x;
		SuratBayarService.getById(id).then((res) => {
			res.pembayaran = null;
			$scope.model = res;
			$scope.btn.disabled = res.status !== 'aktif' ? true : false;
			$scope.btn.title =
				res.status == 'aktif'
					? 'Buat Pembayaran'
					: res.status == 'terbayar' ? 'Sudah Terbayarkan' : 'Surat Pembayaran Kadaluwarsa';

			AuthService.me().then((me) => {
				$scope.me = me;
				if (me.idBank !== res.idBank) {
					$scope.btn.disabled = true;
					$scope.btn.title = 'Pembayaran Tidak Dilakukan di Bank Ini';
				}
			});
		});
	});
	$scope.getTerbilang = function(model) {
		if (model && model.jumlah && model.jumlah > 0) {
			return terbilang(model.jumlah) + ' Rupiah';
		} else {
			return '';
		}
	};

	$scope.createPembayaran = function(ev, model) {
		$mdDialog
			.show({
				locals: {
					dataToPass: { model: model, user: $scope.me }
				},
				controller: createPembayaranController,
				templateUrl: '../client/apps/views/mitra/mitra-add-pembayaran.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
			.then(
				(model) => {
					SuratBayarService.createPembayaran(model).then((response) => {
						$scope.model.pembayaran = model;
						$scope.model.pembayaran.status = 'terbayar';
						$scope.btn.disabled = true;
						$scope.btn.title = 'Sudah Terbayarkan';
						message.info('Pembayaran Tersimpan...');
					});
				},
				(err) => {
					message.error('lengkapi Data');
				}
			);
	};

	$scope.getPembayaran = function(params) {
		$scope.circleShow = true;
		SuratBayarService.getPembayaran(params.idSuratPembayaran).then((x) => {
			params.pembayaran = x;
			params.pembayaran.buktiBayar = helperServices.arrayBufferToBase64(x.buktiBayar.data);
			$scope.circleShow = false;
		});
	};
}

function createPembayaranController($scope, $mdDialog, dataToPass) {
	if (dataToPass) {
		$scope.param = angular.copy(dataToPass);
		$scope.model = {
			idSuratPembayaran: $scope.param.model.idSuratPembayaran,
			idMitraBayar: $scope.param.user.idMitraBayar,
			buktiBayar: null,
			tanggalBayar: new Date(),
			idUserMitraBayar: $scope.param.user.idUserMitraBayar
		};
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

function mitraLaporanTerbayarkan($scope,AuthService,SuratBayarService) {
	AuthService.me().then((me) => {
		$scope.me = me;
		SuratBayarService.getLaporanTerbayar().then((x) => {
			$scope.datas = x;
		});
	});
	$scope.print=function(){
		setTimeout((x) => {
			window.print();
		}, 500);
	}
	$scope.sumGroup = function(datas) {
		var total = 0;
		datas.forEach((x) => {
			total += x.jumlah;
		});
		return total;
	};
	
}
