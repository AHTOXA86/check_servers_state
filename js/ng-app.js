/**
 * Created by anton on 14.10.14.
 */
angular.module('check_state', [])
    .controller('main', ['$scope', '$interval', function ($scope, $interval) {
        $scope.servers = [
            {name: 'appserver.ambivo.com', url: 'http://appserver.ambivo.com/user/register', state: 'checking', lastCheck: null, cors: true},
            {name: 'oAuth.ambivo.com', url: 'http://appserver.ambivo.com:8100/authorize?client_id=SbRdfgN584hy85heG345kj&response_type=code&redirect_uri=http://localhost:8100/callback&login_hint=attecuss@mail.ru&device_id=1112223334444555&os=ios&os_version=7', state: 'checking', lastCheck: null, cors: false},
            {name: 'connect.ambivo.com', url: 'https://connect.ambivo.com', state: 'checking', lastCheck: null, cors: false},
            {name: 'www.ambivo.com', url: 'http://www.ambivo.com', state: 'checking', lastCheck: null, cors: false}
        ];

        update = function () {
            $scope.servers.forEach(function (server) {
                if (server.cors) {
                    $.ajax({url: server.url, crossDomain: true})
                        .done(function () {
                            server.state = 'online';
                            server.lastCheck = new Date().toLocaleTimeString()
                        })
                        .fail(function () {
                            server.state = 'offline';
                        });
                }
                else {
                    var iframe = document.createElement("iframe");
                    $('#hidden_div').append(iframe);
                    iframe.onload = function () {
                        server.state = 'online';
                        server.lastCheck = new Date().toLocaleTimeString()
                        iframe.parentNode.removeChild(iframe);
                    };
                    iframe.onerror = function () {
                        server.state = 'offline';
                        iframe.parentNode.removeChild(iframe);
                    };
                    iframe.src = server.url;
                }

            });
        };

        $scope.removeIframes = function () {
            var iframes = document.getElementsByTagName('iframe');
            for (var i = 0; i < iframes.length; i++) {
                iframes[i].parentNode.removeChild(iframes[i]);
            }
        }
        update();
        $interval(update, 10000);
    }]);