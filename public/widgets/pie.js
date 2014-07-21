// Initialise pies/* * */var defaultColors = ['#46BFBD', '#F7464A', '#FDB45C', '#949FB1', '#4D5360'];$(function(){    $('.widget[data-type=2]').each(function(){        var $container = $(this).find('.cf-pie');        var pId = $container.prop('id');        var config = $(this).data('config');        /*        // Set options per chart        customOptions = {};        customOptions.animation = false;        cf_rPs[pId].options = customOptions;        */        (function initial(){            // Store chart information            cf_rPs[pId] = {};            config.dataInfos = config.dataInfos || [];            var promises = config.dataInfos.map(function(dataInfo){                return $.get(                        '/api/data_sources/' + dataInfo.id                ).then(function (dataSource) {                        return $.get(                                '/api/data_sources/' + dataInfo.id + '/records?limit=1'                        ).then(function (resp) {                                if (resp.length === 0) {                                    return [dataSource.name, 0];                                }                                return [dataSource.name, resp[0].value];                            }                        );                });            });            $.when.apply(null, promises).done(function () {                var data = Array.prototype.slice.apply(arguments);                $container.highcharts({                    chart: {                        plotBackgroundColor: null,                        plotBorderWidth: null,                        plotShadow: false,                        backgroundColor: 'rgba(0,0,0,0)',                        events: {                            load: function(){                                var chart = this;                                function reload(){                                    var promises = config.dataInfos.map(function(dataInfo){                                        return $.get(                                            '/api/data_sources/' + dataInfo.id                                        ).then(function(dataSource){                                                return $.get(                                                    '/api/data_sources/' + dataInfo.id + '/records?limit=1'                                                ).then(function(resp) {                                                        if (resp.length === 0) {                                                            return [dataSource.name, 0];                                                        }                                                        return [dataSource.name, resp[0].value];                                                    }                                                );                                        });                                    });                                    $.when.apply(null, promises).done(function () {                                        var data = Array.prototype.slice.call(arguments);                                        chart.series[0].setData(data);                                    });                                }                                setInterval(reload, config.reloadInterval);                            }                        }                    },                    title:{                        text: config.name,                        style: {                            color: 'lightgreen'                        }                    },                    tooptip: {                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'                    },                    plotOptions: {                        pie: {                            allowPointSelect: true,                            cursor: 'pointer',                            colors: defaultColors,                            dataLabels: {                                enabled: true,                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',                                color: 'lightgray',                                style: {                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',                                    fontSize: '14px'                                }                            }                        }                    },                    series: [{                        type: 'pie',                        name: config.name,                        data: data                    }]                });            });        })();    });});