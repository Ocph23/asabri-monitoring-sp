angular
  .module("app.router", ["ui.router"])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
      .state("account", {
        url: "/account",
        templateUrl: "../client/apps/views/accounts/account.html"
      })
      .state("login", {
        url: "/login",
        parent: "account",
        controller: "LoginController",
        templateUrl: "../client/apps/views/accounts/login.html"
      })
      .state("register", {
        url: "/register",
        parent: "account",
        templateUrl: "../client/apps/views/accounts/register.html"
      })
      .state("home", {
        url: "/home",
        controller: "homeController",
        templateUrl: "../client/apps/views/home.html"
      })
    
      .state("about", {
        // we'll get to this in a bit
      })

      ///admin

      .state("admin", {
        url: "/admin",
        controller: "adminController",
        templateUrl: "../client/apps/views/admin/admin.html"
      })

      .state("admin-asuransi", {
        url: "/asuransi",
        parent: "admin",
        controller: "adminAsuransiController",
        templateUrl: "../client/apps/views/admin/admin-asuransi.html"
      })

      .state("admin-home", {
        url: "/home",
        parent: "admin",
        controller: "adminHomeController",
        templateUrl: "../client/apps/views/admin/admin-home.html"
      })

      .state("admin-mitra-bayar", {
        url: "/mitrabayar",
        parent: "admin",
        controller: "adminMitraBayarController",
        templateUrl: "../client/apps/views/admin/admin-mitrabayar.html"
      })
      .state("admin-bank", {
        url: "/bank",
        parent: "admin",
        controller: "adminBankController",
        templateUrl: "../client/apps/views/admin/admin-bank.html"
      })

      .state("admin-surat-bayar", {
        url: "/suratbayar",
        parent: "admin",
        controller: "adminSuratBayarController",
        templateUrl: "../client/apps/views/admin/admin-suratbayar.html"
      })


      .state("admin-add-surat-bayar", {
        url: "/addsuratbayar",
        parent: "admin",
        controller: "adminAddSuratBayarController",
        templateUrl: "../client/apps/views/admin/admin-add-suratbayar.html"
      })


      .state("admin-edit-surat-bayar", {
        url: "/editsuratbayar/:id",
        parent: "admin",
        controller: "adminEditSuratBayarController",
        templateUrl: "../client/apps/views/admin/admin-add-suratbayar.html"
      })

        ///laporan-admin

        .state("laporan-aktif", {
          url: "/laporan-aktif",
          parent: "admin",
          controller: "adminLaporanController",
          templateUrl: "../client/apps/views/laporan/admin-aktif.html"
        })

        .state("laporan-kadaluwarsa", {
          url: "/laporan-kadaluwarsa",
          parent: "admin",
          controller: "adminLaporanController",
          templateUrl: "../client/apps/views/laporan/admin-kadaluwarsa.html"
        })

        .state("laporan-terbayarkan", {
          url: "/laporan-terbayarkan",
          parent: "admin",
          controller: "laporanTerbayarController",
          templateUrl: "../client/apps/views/laporan/admin-terbayarkan.html"
        })

        .state("mitra-laporan-terbayarkan", {
          url: "/mitra-laporan-terbayarkan",
          parent: "mitra",
          controller: "mitraLaporanTerbayarkan",
          templateUrl: "../client/apps/views/laporan/mitra-terbayarkan.html"
        })


      ///mitra

      .state("mitra", {
        url: "/mitra",
        controller: "mitraController",
        templateUrl: "../client/apps/views/mitra/mitra.html"
      })

      .state("mitra-home", {
        url: "/home",
        parent: "mitra",
        controller: "mitraHomeController",
        templateUrl: "../client/apps/views/mitra/mitra-home.html"
      })

      .state("mitra-suratbayar", {
        url: "/suratbayar",
        parent: "mitra",
        controller: "mitraSuratBayarController",
        templateUrl: "../client/apps/views/mitra/mitra-suratbayar.html"
      })


      .state("mitra-cari", {
        url: "/cari",
        parent: "mitra",
        controller: "mitraCariController",
        templateUrl: "../client/apps/views/mitra/mitra-cari.html"
      })
      
      
      .state("mitra-sp", {
        url: "/mitra-sp/:id",
        parent: "mitra",
        controller: "mitraSPController",
        templateUrl: "../client/apps/views/mitra/mitra-sp.html"
      })
      
    
      
      ;
  });
