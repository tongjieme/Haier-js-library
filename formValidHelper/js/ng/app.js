var app = angular.module('app', []);
app.directive('codex', function($timeout){
    return {
        restrict: 'A',
        scope: {
            content: '='
        },
        transclude: true,
        replace: true,
        template: '<div></div>',
        compile: function(tElement, tAttrs, transclude){
            return function(scope, element, attrs, ctrl, transclude){
                var content;
                var hl = function(content){
                    $(element).html($('<pre class="'+(attrs.codex || '')+'"><code></code></pre>'));
                    $(element).find('pre code').text(content);
                    hljs.highlightBlock($(element).find('pre')[0], {
                        languages: ['javascript']
                    });
                }
                transclude(scope.$new(), function(el){
                    content = el[0].innerText;
                    scope.content = content;
                });
                scope.$watch('content',
                    function(newValue, oldValue) {
                        hl(newValue);
                    }
                );
            }
        }
    };
})