(function($) {
    'use strict';
    $(function() {
        if ($("#my-current-connection-chart").length) {
            
            const footer = (tooltipItems) => {
                let sum = 0;

                if (tooltipItems[0]["xLabel"] == 0){
                    return "O"+(8-tooltipItems[0]["yLabel"])
                }
                if (tooltipItems[0]["xLabel"] == 9){
                    return "G"+(tooltipItems[0]["yLabel"] - 1)
                }
                if (tooltipItems[0]["yLabel"] == 0){
                    return "R"+(tooltipItems[0]["xLabel"] - 1)
                }
                if (tooltipItems[0]["yLabel"] == 9){
                    return "B"+(8 - tooltipItems[0]["xLabel"])
                }
                return "";
            };
            
            var areaOptions = {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    filler: {
                        propagate: false
                    }
                },
                scales: {
                    xAxes: [{
                        display: true,
                        ticks: {
                            display: false,
                            padding: 10,
                            min: -1,
                            max: 10,
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false,
                            color: 'transparent',
                            zeroLineColor: '#eeeeee'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            display: false,
                            min: -1,
                            max: 10,
                        },
                        gridLines: {
                            display: false,
                            color:"#f2f2f2",
                            drawBorder: false
                        }
                    }]
                },
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true,
                    callbacks: {
                        footer: footer,
                    }
                },
            }

            var orange_data = [];
            var red_data = [];
            var blue_data = [];
            var green_data = [];
            var radius = 10;
            for (var i = 0; i < 8; i++) {
                orange_data.push({x: 0, y:1+i, r:radius});
                red_data.push({x: 1+i, y:0, r:radius});
                blue_data.push({x: 1+i, y:9, r:radius});
                green_data.push({x: 9, y:1+i, r:radius});
            }

            const data = {
                datasets: [{
                    label: 'Red',
                    data: red_data,
                    backgroundColor: 'rgba(255, 71, 71, 0.2)'
                },
                {
                    label: 'Green',
                    data: green_data,
                    backgroundColor: 'rgba(87, 182, 87, 0.2)'
                },
                {
                    label: 'Blue',
                    data: blue_data,
                    backgroundColor: 'rgba(36, 138, 253, 0.2)'
                },
                {
                    label: 'Orange',
                    data: orange_data,
                    backgroundColor: 'rgba(255, 193, 0, 0.2)'
                },
                {
                    label: 'Inner BNC',
                    data: [{x:3,y:0, r: radius}],
                    backgroundColor: "#FF4747"
                },
                {
                    label: 'External BNC r',
                    data: [{x:0,y:5, r: radius}],
                    backgroundColor: "#248AFD"
                }]
              };
            
            var revenueChartCanvas = $("#my-current-connection-chart").get(0).getContext("2d");
            var revenueChart = new Chart(revenueChartCanvas, {
                type: 'bubble',
                data: data,
                options: areaOptions
            });
        }  

        if ($("#my-current-pixel-responce").length) {
            var areaData = {
                labels: ["10","","","20","","","30","","","40","","", "50","","", "60","","","70"],
                datasets: [
                    {
                        data: [200, 480, 700, 600, 620, 350, 380, 350, 850, "600", "650", "350", "590", "350", "620", "500", "990", "780", "650"],
                        borderColor: [
                            '#4747A1'
                        ],
                        borderWidth: 2,
                        fill: false,
                        label: "Orders"
                    },
                    {
                        data: [400, 450, 410, 500, 480, 600, 450, 550, 460, "560", "450", "700", "450", "640", "550", "650", "400", "850", "800"],
                        borderColor: [
                            '#F09397'
                        ],
                        borderWidth: 2,
                        fill: false,
                        label: "Downloads"
                    }
                ]
            };
            var areaOptions = {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    filler: {
                        propagate: false
                    }
                },
                scales: {
                    xAxes: [{
                        display: true,
                        ticks: {
                            display: true,
                            padding: 10,
                            fontColor:"#6C7383"
                        },
                        gridLines: {
                            display: false,
                            drawBorder: false,
                            color: 'transparent',
                            zeroLineColor: '#eeeeee'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            display: true,
                            autoSkip: false,
                            maxRotation: 0,
                            stepSize: 200,
                            min: 200,
                            max: 1200,
                            padding: 18,
                            fontColor:"#6C7383"
                        },
                        gridLines: {
                            display: true,
                            color:"#f2f2f2",
                            drawBorder: false
                        }
                    }]
                },
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true
                },
                elements: {
                    line: {
                        tension: .35
                    },
                    point: {
                        radius: 0
                    }
                }
            }
            var revenueChartCanvas = $("#my-current-pixel-responce").get(0).getContext("2d");
            var revenueChart = new Chart(revenueChartCanvas, {
                type: 'line',
                data: areaData,
                options: areaOptions
            });
        }  
    });
})(jQuery);