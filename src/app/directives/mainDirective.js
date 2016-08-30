angular.module('pgconfig.directives', [])
    .directive('debug', function ($compile) {
        return {
            terminal: true,
            priority: 1000000,
            link: function (scope, element) {
                var clone = element.clone();
                element.attr("style", "color: red");

                clone.removeAttr("debug");
                var clonedElement = $compile(clone)(scope);
                element.after(clonedElement);
            }
        };
    })
    .directive('tuningGrid', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/app/templates/tuning-doc/grid.html'
        };
    })
    .directive('tuningParameter', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/app/templates/tuning-doc/parameter.html',
            controller: 'ParameterDirectiveController'
        };
    }).directive('ddTextCollapse', ['$compile', function ($compile) {

        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {

                // start collapsed
                scope.collapsed = false;

                // create the function to toggle the collapse
                scope.toggle = function () {
                    scope.collapsed = !scope.collapsed;
                };

                // wait for changes on the text
                attrs.$observe('ddTextCollapseText', function (text) {

                    // get the length from the attributes
                    var maxLength = scope.$eval(attrs.ddTextCollapseMaxLength);
                    
                    // get the doc URL
                    // var docURL = scope.$eval(attrs.docURL);

                    if (text.length > maxLength) {
                        // split the text in two parts, the first always showing
                        var firstPart = String(text).substring(0, maxLength);
                        var secondPart = String(text).substring(maxLength, text.length);
                        var urlLink = $compile('<a ng-if="collapsed" href="{{ param.documentation.url }}" target="_blank" class="md-raised md-secudary">More details</a>.')(scope);

                        // create some new html elements to hold the separate info
                        var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                        var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
                        secondSpan.append(urlLink);
                        var moreIndicatorSpan = $compile('<span ng-if="!collapsed">... </span>')(scope);
                        var lineBreak = $compile('<br ng-if="collapsed">')(scope);
                        
                        
                        var toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "less" : "see more"}}</span>')(scope);

                        // remove the current contents of the element
                        // and add the new ones we created
                        element.empty();
                        element.append(firstSpan);
                        element.append(secondSpan);
                        element.append(urlLink);
                        element.append(moreIndicatorSpan);
                        element.append(lineBreak);
                        element.append(toggleButton);
                    }
                    else {
                        element.empty();
                        element.append(text);
                        element.append(urlLink);
                    }
                });
            }
        };
    }]).filter('toString', function () {
        return function (input) {
            return input.join('\n');
        }
    });
