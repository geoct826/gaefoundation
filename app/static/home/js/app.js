angular.module("foundation").run(["$templateCache", function($templateCache) {$templateCache.put("components/accordion/accordion-item.html","<div class=accordion-item ng-class=\"{\'is-active\': active}\"><div class=accordion-title ng-click=activate()>{{ title }}</div><div class=accordion-content ng-transclude></div></div>");
$templateCache.put("components/accordion/accordion.html","<div class=accordion ng-transclude></div>");
$templateCache.put("components/actionsheet/actionsheet-button.html","<div><a href=# class=button ng-if=\"title.length > 0\">{{ title }}</a><div ng-transclude></div></div>");
$templateCache.put("components/actionsheet/actionsheet-content.html","<div class=\"action-sheet {{ position }}\" ng-class=\"{\'is-active\': active}\"><div ng-transclude></div></div>");
$templateCache.put("components/actionsheet/actionsheet.html","<div class=action-sheet-container ng-transclude></div>");
$templateCache.put("components/modal/modal.html","<div class=modal-overlay ng-click=hideOverlay()><aside class=modal ng-click=$event.stopPropagation(); ng-transclude></aside></div>");
$templateCache.put("components/notification/notification-set.html","<div class=\"notification-container {{position}}\"><zf-notification ng-repeat=\"notification in notifications\" title=notification.title image=notification.image notif-id=notification.id color=notification.color autoclose=notification.autoclose>{{ notification.content }}</zf-notification></div>");
$templateCache.put("components/notification/notification-static.html","<div zf-swipe-close=swipe class=\"static-notification {{ color }} {{ position }}\"><a href=# class=close-button ng-click=\"hide(); $event.preventDefault(); $event.stopPropagation()\">&times;</a><div class=notification-icon ng-if=image><img ng-src=\"{{ image }}\"></div><div class=notification-content><h1>{{ title }}</h1><p ng-transclude></p></div></div>");
$templateCache.put("components/notification/notification.html","<div zf-swipe-close=swipe class=\"notification {{ color }}\"><a href=# class=close-button ng-click=\"hide(); $event.preventDefault(); $event.stopPropagation()\">&times;</a><div class=notification-icon ng-if=image><img ng-src=\"{{ image }}\"></div><div class=notification-content><h1>{{ title }}</h1><p ng-transclude></p></div></div>");
$templateCache.put("components/offcanvas/offcanvas.html","<div class=\"off-canvas {{ position }}\" ng-class=\"{\'is-active\': active}\" ng-transclude></div>");
$templateCache.put("components/panel/panel.html","<div class=panel ng-class=positionClass ng-transclude></div>");
$templateCache.put("components/popup/popup.html","<div class=popup ng-class=\"{\'is-active\': active }\" ng-transclude></div>");
$templateCache.put("components/tabs/tab-content.html","<div class=tab-contents><div zf-tab-individual class=tab-content ng-class=\"{\'is-active\': tab.active}\" ng-repeat=\"tab in tabs\" tab=tab></div></div>");
$templateCache.put("components/tabs/tab.html","<div class=tab-item ng-class=\"{\'is-active\': active}\" ng-click=makeActive()>{{ title }}</div>");
$templateCache.put("components/tabs/tabs.html","<div><div class=tabs ng-transclude></div><div zf-tab-content target=\"{{ id }}\" ng-if=showTabContent></div></div>");}]);
angular.module("foundation").run(["$templateCache", function($templateCache) {$templateCache.put("home.html","<div class=grid-container><h1>Welcome to Foundation for Apps!</h1><h2>Awesome!</h2><p class=lead>This is version <strong>1.2</strong>.</p></div>");}]);
var foundationRoutes = [{"name":"home","url":"/","path":"home.html"}]; 

(function() {
  'use strict';

  angular.module('home', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

})();