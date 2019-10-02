angular
	.module('admin.controllers', [])
	.controller('adminController', adminController)
	.controller('adminHomeController', adminHomeController)
	.controller('adminBankController', adminBankController)
	.controller('adminMitraBayarController', adminMitraBayarController)
	.controller('MitraBayarDialogController', MitraBayarDialogController)
	.controller('adminSuratBayarController', adminSuratBayarController)
	.controller('adminAddSuratBayarController', adminAddSuratBayarController)
	.controller('adminEditSuratBayarController', adminEditSuratBayarController)
	.controller('laporanTerbayarController', laporanTerbayarController)
	.controller('adminLaporanController',adminLaporanController);

function adminController($scope, $rootScope, helperServices, $timeout, $mdSidenav, $log) {
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

function adminHomeController($scope, $state, $mdDialog) {
	$scope.showAdvanced = function(ev) {
		$mdDialog
			.show({
				controller: DialogController,
				templateUrl: '../client/apps/views/admin/admin-add-petugas.template.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
			.then(
				function(answer) {
					$scope.status = 'You said the information was "' + answer + '".';
				},
				function() {
					$scope.status = 'You cancelled the dialog.';
				}
			);
	};
}

function adminBankController($scope, $state, message, $mdDialog, BankService) {
	BankService.get().then((x) => {
		$scope.datas = x;
	});

	$scope.print = function() {
		window.print();
	};

	$scope.change = function(ev, data) {
		$mdDialog
			.show({
				locals: {
					dataToPass: data
				},
				controller: DialogController,
				templateUrl: '../client/apps/views/admin/admin-add-bank-template.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
			.then(
				function(model) {
					if (model.idBank) {
						BankService.put(model).then(
							(x) => {
								message.info('Edit Data');
							},
							(err) => {}
						);
					} else {
						BankService.post(model).then(
							(x) => {
								message.info('Edit Data');
							},
							(err) => {}
						);
					}
				},
				function() {
					$scope.status = 'You cancelled the dialog.';
				}
			);
	};

	$scope.delete = function(data) {
		BankService.remove(data).then(
			(x) => {
				message.info('Berhasil Di Hapus');
			},
			(err) => {}
		);
	};
}

function adminMitraBayarController(
	$scope,
	$rootScope,
	MitraBayarService,
	BankService,
	message,
	AuthService,
	$mdDialog
) {
	$rootScope.spinner = true;

	MitraBayarService.get().then((x) => {
		$scope.datas = x;

		$rootScope.spinner = false;
	});

	$scope.showUser = function(data) {
		if (data.users == undefined) {
			MitraBayarService.getUsers(data.idMitraBayar).then((datax) => {
				data.users = datax;
				data.users.forEach((element) => {
					if (element.status && Number.isInteger(element.status)) {
						element.status = element.status == 1 ? true : false;
					}
				});
			});
		}

		if (data.show == undefined) data.show = true;
		else data.show = !data.show;
	};

	$scope.addUser = function(ev, mitra) {
		$mdDialog
			.show({
				locals: {
					dataToPass: {
						idMitraBayar: mitra.idMitraBayar,
						idBank: mitra.idBank
					}
				},
				controller: DialogController,
				templateUrl: '../client/apps/views/admin/admin-add-user-template.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
			.then(
				function(model) {
					AuthService.registerMitraUser(model).then((x) => {
						message.info('Edit Data');
					});
				},
				function() {
					$scope.status = 'You cancelled the dialog.';
				}
			);
	};

	$scope.changeStatus = function(model) {
		setTimeout((x) => {
			AuthService.updatemitrauser(model).then((x) => {
				message.info('Status User Barhasil Diubah');
			});
		}, 500);
	};

	$scope.change = function(ev, data) {
		$mdDialog
			.show({
				locals: {
					dataToPass: data
				},
				controller: MitraBayarDialogController,
				templateUrl: '../client/apps/views/admin/admin-add-mitrabayar.template.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
			.then(
				function(model) {
					if (model.idMitraBayar) {
						MitraBayarService.put(model).then(
							(x) => {
								message.info('Edit Data');
							},
							(err) => {}
						);
					} else {
						MitraBayarService.post(model).then(
							(x) => {
								message.info('Edit Data');
							},
							(err) => {}
						);
					}
				},
				function() {
					$scope.status = 'You cancelled the dialog.';
				}
			);
	};
}

function MitraBayarDialogController($scope, $mdDialog, dataToPass, BankService) {
	BankService.get().then((z) => {
		$scope.banks = z;
	});
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

function adminSuratBayarController($scope, $rootScope, SuratBayarService, helperServices) {
	$rootScope.spinner = true;
	SuratBayarService.get().then((x) => {
		$scope.datas = x;
		$rootScope.spinner = false;
	});
	$scope.print=function(){
		setTimeout((x) => {
			window.print();
		}, 500);
	}
}

function adminAddSuratBayarController($scope, message, BankService, helperServices, SuratBayarService, $state) {
	$scope.asuransi = helperServices.asuransi;
	$scope.statusPenerimas = helperServices.statusPenerima;
	$scope.model = {};
	BankService.get().then((banks) => {
		$scope.banks = banks;
	});

	$scope.save = function(data) {
		data.status = 'aktif';
		SuratBayarService.post(data).then((res) => {
			message.dialog('Data Berhasil Disimpan, Tambah Baru ?').then(
				(res) => {
					$scope.model = {};
				},
				(rej) => {
					$state.go('admin-surat-bayar');
				}
			);
		});
	};

	$scope.getTerbilang = function(data) {
		if (data && data > 0) {
			return terbilang(data) + ' Rupiah';
		} else {
			return '';
		}
	};

	$scope.onChangeStatusPenerima = function(model) {
		if (model.penerima) {
			model.statusPenerima = 'Peserta';
			model.namaPenerima = model.nasabah.nama;
		} else {
			model.statusPenerima = 'Wali';
		}
	};
}

function adminEditSuratBayarController(
	$scope,
	$stateParams,
	$state,
	message,
	helperServices,
	$rootScope,
	SuratBayarService,
	BankService
) {
	var id = $stateParams.id;
	$rootScope.spinner = true;
	$scope.asuransi = helperServices.asuransi;
	$scope.statusPenerimas = helperServices.statusPenerima;
	BankService.get().then((banks) => {
		$scope.banks = banks;
		SuratBayarService.getById(id).then((x) => {
			x.pembayaran = null;
			$scope.model = x;
			$rootScope.spinner = false;
		});
	});

	$scope.save = function(data) {
		SuratBayarService.put(data).then((res) => {
			message.info('Data Berhasil Diubah');
		});
	};

	$scope.onChangeStatusPenerima = function(model) {
		if (model.statusPenerima === 'Peserta') {
			model.namaPenerima = model.nasabah.nama;
		} else if (model.namaPenerima == model.nasabah.nama) {
			model.namaPenerima = '';
		}
	};

	$scope.getPembayaran = function(params) {
		$scope.circleShow = true;
		SuratBayarService.getPembayaran(params.idSuratPembayaran).then((x) => {
			params.pembayaran = x;
			params.pembayaran.buktiBayar = helperServices.arrayBufferToBase64(x.buktiBayar.data);
			$scope.circleShow = false;
		});
	};

	$scope.getTerbilang = function(data) {
		if (data && data > 0) {
			return terbilang(data) + ' Rupiah';
		} else {
			return '';
		}
	};
}

function laporanTerbayarController($scope, SuratBayarService, AuthService) {
	$scope.datas = [];

	AuthService.me().then((me) => {
		$scope.me = me;
	});
	SuratBayarService.getLaporanTerbayar().then((x) => {
		$scope.datas = x;
	});

	$scope.sumGroup = function(datas) {
		var total = 0;
		datas.forEach((x) => {
			total += x.jumlah;
		});
		return total;
	};

	
	$scope.print=function(){
		setTimeout((x) => {
			window.print();
		}, 500);
	}
}


function adminLaporanController($scope, SuratBayarService){
	$scope.Datas=[];
	$scope.Init=function(param){
		SuratBayarService.get().then(res=>{
			if(res && res.length>0)
			{
				res.forEach(x=>{
					if(param=='kadaluwarsa' && x.status=='kadaluwarsa'){
						$scope.Datas.push(x);
					}
					if(param=='aktif' && x.status=='aktif'){
						$scope.Datas.push(x);
					}
				})
				
				
			}
		})
		
	}
	

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
