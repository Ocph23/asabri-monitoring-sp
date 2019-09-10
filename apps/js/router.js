angular
  .module("app.router", ["ui.router"])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
      .state("account", {
        url: "/account",
        templateUrl: "../apps/views/accounts/account.html"
      })
      .state("login", {
        url: "/login",
        parent: "account",
        controller: "LoginController",
        templateUrl: "../apps/views/accounts/login.html"
      })
      .state("register", {
        url: "/register",
        parent: "account",
        templateUrl: "../apps/views/accounts/register.html"
      })
      .state("home", {
        url: "/home",
        controller: "homeController",
        templateUrl: "../apps/views/home.html"
      })
      .state("about", {
        // we'll get to this in a bit
      })

      ///admin

      .state("admin", {
        url: "/admin",
        controller: "adminController",
        templateUrl: "../apps/views/admin/admin.html"
      })

      .state("admin-home", {
        url: "/home",
        parent: "admin",
        controller: "adminHomeController",
        templateUrl: "../apps/views/admin/admin-home.html"
      })

      .state("admin-mitra-bayar", {
        url: "/mitrabayar",
        parent: "admin",
        controller: "adminMitraBayarController",
        templateUrl: "../apps/views/admin/admin-mitrabayar.html"
      })
      .state("admin-bank", {
        url: "/bank",
        parent: "admin",
        controller: "adminBankController",
        templateUrl: "../apps/views/admin/admin-bank.html"
      })

      .state("admin-surat-bayar", {
        url: "/suratbayar",
        parent: "admin",
        controller: "adminSuratBayarController",
        templateUrl: "../apps/views/admin/admin-suratbayar.html"
      })


      .state("admin-add-surat-bayar", {
        url: "/addsuratbayar",
        parent: "admin",
        controller: "adminAddSuratBayarController",
        templateUrl: "../apps/views/admin/admin-add-suratbayar.html"
      })




      ///mitra

      .state("mitra", {
        url: "/mitra",
        controller: "homeController",
        templateUrl: "../apps/views/mitra/mitra.html"
      })

      .state("mitra-home", {
        url: "/home",
        parent: "mitra",
        controller: "mitraHomeController",
        templateUrl: "../apps/views/mitra/mitra-home.html"
      });
  });
