angular.module("foundation").run(["$templateCache",function(t){t.put("components/actionsheet/actionsheet-button.html",'<div><a href=# class=button ng-if="title.length > 0">{{ title }}</a><div ng-transclude></div></div>'),t.put("components/actionsheet/actionsheet-content.html",'<div class="action-sheet {{ position }}" ng-class="{\'is-active\': active}"><div ng-transclude></div></div>'),t.put("components/actionsheet/actionsheet.html","<div class=action-sheet-container ng-transclude></div>"),t.put("components/accordion/accordion-item.html","<div class=accordion-item ng-class=\"{'is-active': active}\"><div class=accordion-title ng-click=activate()>{{ title }}</div><div class=accordion-content ng-transclude></div></div>"),t.put("components/accordion/accordion.html","<div class=accordion ng-transclude></div>"),t.put("components/modal/modal.html","<div class=modal-overlay ng-click=hideOverlay()><aside class=modal ng-click=$event.stopPropagation(); ng-transclude></aside></div>"),t.put("components/notification/notification-set.html",'<div class="notification-container {{position}}"><zf-notification ng-repeat="notification in notifications" title=notification.title image=notification.image notif-id=notification.id color=notification.color autoclose=notification.autoclose>{{ notification.content }}</zf-notification></div>'),t.put("components/notification/notification-static.html",'<div zf-swipe-close=swipe class="static-notification {{ color }} {{ position }}"><a href=# class=close-button ng-click="hide(); $event.preventDefault(); $event.stopPropagation()">&times;</a><div class=notification-icon ng-if=image><img ng-src="{{ image }}"></div><div class=notification-content><h1>{{ title }}</h1><p ng-transclude></p></div></div>'),t.put("components/notification/notification.html",'<div zf-swipe-close=swipe class="notification {{ color }}"><a href=# class=close-button ng-click="hide(); $event.preventDefault(); $event.stopPropagation()">&times;</a><div class=notification-icon ng-if=image><img ng-src="{{ image }}"></div><div class=notification-content><h1>{{ title }}</h1><p ng-transclude></p></div></div>'),t.put("components/offcanvas/offcanvas.html",'<div class="off-canvas {{ position }}" ng-class="{\'is-active\': active}" ng-transclude></div>'),t.put("components/panel/panel.html","<div class=panel ng-class=positionClass ng-transclude></div>"),t.put("components/popup/popup.html","<div class=popup ng-class=\"{'is-active': active }\" ng-transclude></div>"),t.put("components/tabs/tab-content.html",'<div class=tab-contents><div zf-tab-individual class=tab-content ng-class="{\'is-active\': tab.active}" ng-repeat="tab in tabs" tab=tab></div></div>'),t.put("components/tabs/tab.html","<div class=tab-item ng-class=\"{'is-active': active}\" ng-click=makeActive()>{{ title }}</div>"),t.put("components/tabs/tabs.html",'<div><div class=tabs ng-transclude></div><div zf-tab-content target="{{ id }}" ng-if=showTabContent></div></div>')}]),angular.module("foundation").run(["$templateCache",function(t){t.put("src/home/templates/hello.html","<div class=grid-container><h1>Hello World</h1><h2>Awesome!</h2></div>"),t.put("src/home/templates/home.html","<div class=grid-container><h1>Welcome to Foundation for Apps!</h1><h2>Awesome!</h2><p class=lead>This is version <strong>1.2</strong>.</p></div>")}]);var foundationRoutes=[{name:"hello",url:"/hello",path:"src/home/templates/hello.html"},{name:"home",url:"/",path:"src/home/templates/home.html"}];!function(){"use strict";function t(t,i){t.otherwise("/"),i.html5Mode({enabled:!1,requireBase:!1}),i.hashPrefix("!")}function i(){FastClick.attach(document.body)}angular.module("home",["ui.router","ngAnimate","foundation","foundation.dynamicRouting","foundation.dynamicRouting.animations"]).config(t).run(i),t.$inject=["$urlRouterProvider","$locationProvider"]}();