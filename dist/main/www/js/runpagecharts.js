var pin_chart_radius = 10;


function draw_pin_chart(ext_conn, inn_conn){
    if ($("#my-current-connection-chart").length) {
        const pin_chart_footer = (tooltipItems) => {
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
                    footer: pin_chart_footer,
                }
            },
        }
        
        var orange_data = [];
        var red_data = [];
        var blue_data = [];
        var green_data = [];
        var radius = pin_chart_radius;
        for (var i = 0; i < 8; i++) {
            orange_data.push({x: 0, y:1+i, r:radius});
            red_data.push({x: 1+i, y:0, r:radius});
            blue_data.push({x: 1+i, y:9, r:radius});
            green_data.push({x: 9, y:1+i, r:radius});
        }
        
        const data = {
            datasets: [{
                'label': 'Red',
                'data': red_data,
                'backgroundColor': 'rgba(255, 71, 71, 0.2)'
            },
            {
                'label': 'Green',
                'data': green_data,
                'backgroundColor': 'rgba(87, 182, 87, 0.2)'
            },
            {
                'label': 'Blue',
                'data': blue_data,
                'backgroundColor': 'rgba(36, 138, 253, 0.2)'
            },
            {
                'label': 'Orange',
                'data': orange_data,
                'backgroundColor': 'rgba(255, 193, 0, 0.2)'
            }]
        };
        var pinChartCanvas = $("#my-current-connection-chart").get(0).getContext("2d");
        var pinChart = new Chart(pinChartCanvas, {
            type: 'bubble',
            data: data,
            options: areaOptions
        });
        return pinChart
    }  
}

function draw_signal_chart(){
    if ($("#my-current-pixel-responce").length) {
        
        let data = {
            datasets: [
                {
                    label: 'V',
                    data: [],
                    backgroundColor: '#F09397',
                    borderColor: '#F09397',
                    fill: false,
                    showLine: true,
                    yAxisID: 'y1',
                    order: 1
                },
                {
                    label: 'I',
                    data: [],
                    backgroundColor: '#4747A1',
                    borderColor: '#4747A1',
                    fill: false,
                    showLine: true,
                    yAxisID: 'y2',
                }
            ],
        };
        
        const config = {
            'type': 'scatter',
            'data': data,
            options: {
                elements: {
                    point:{radius:5},
                    line: {tension: .35}
                },
                scales: {
                    xAxes: [{
                        display: true,
                        ticks: {
                            display: true,
                            autoSkip: false,
                            maxRotation: 0,
                            // stepSize: 200,
                            padding: 18,
                            fontColor:"#6C7383"
                        },
                        gridLines: {
                            display: true,
                            color:"#f2f2f2",
                            drawBorder: false
                        }
                    }],
                    yAxes: [
                        {
                            id: "y1",
                            display: true,
                            ticks: {
                                display: true,
                                autoSkip: false,
                                maxRotation: 0,
                                padding: 18,
                                fontColor:"#F09397"
                            },
                            gridLines: {
                                display: false
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Sensor V'
                            }
                        },
                        {
                            id: "y2",
                            display: true,
                            position: 'right',
                            ticks: {
                                display: true,
                                autoSkip: false,
                                maxRotation: 0,
                                padding: 18,
                                fontColor:"#4747A1"
                            },
                            gridLines: {
                                display: false
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Sensor I'
                            }
                        }
                    ]
                },
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    filler: {
                        propagate: false
                    },
                    
                },
                legend: {
                    display: true,
                    position: "bottom",
                    align: "end"
                },
            }
        };
        var signalChartCanvas = $("#my-current-pixel-responce").get(0).getContext("2d");
        var signalChart = new Chart(signalChartCanvas, config);
        return signalChart
    }  
}

var pin_chart = draw_pin_chart();
var signal_chart = draw_signal_chart();
console.log(signal_chart.data)

function update_pin_chart(ext_conn, inn_conn){
    if ($("#chart_ext_label")[0].innerHTML == ext_conn && $("#chart_inn_label")[0].innerHTML == inn_conn)
        return
    function descrToCoords(descr){
        let pin = parseInt(descr[1]);
        switch (descr[0]){
            case 'R': return [1+pin, 0];
            case 'G': return [9, 1+pin];
            case 'B': return [8-pin, 9];
            case 'O': return [0, 8-pin];
        }
    }
    if (pin_chart.data.datasets.length != 6){
        pin_chart.data.datasets.length = 4;
        if (ext_conn){
            let [x,y] = descrToCoords(ext_conn);
            let newdataset = {
                'label': 'External BNC',
                'data': [{x:x,y:y, r: pin_chart_radius}],
                backgroundColor: "#248AFD"
            }
            pin_chart.data.datasets.push(newdataset)
        }
        if (inn_conn){
            let [x,y] = descrToCoords(inn_conn);
            let newdataset = {
                'label': 'Inner BNC',
                'data': [{x:x,y:y, r: pin_chart_radius}],
                backgroundColor: "#FF4747"
            }
            pin_chart.data.datasets.push(newdataset)
        }
    }else{
        let [x,y] = descrToCoords(ext_conn);
        pin_chart.data.datasets[4].data[0].x = x;
        pin_chart.data.datasets[4].data[0].y = y;
        [x,y] = descrToCoords(inn_conn);
        pin_chart.data.datasets[5].data[0].x = x;
        pin_chart.data.datasets[5].data[0].y = y;
    }
    pin_chart.update();
    $("#chart_ext_label")[0].innerHTML = ext_conn;
    $("#chart_inn_label")[0].innerHTML = inn_conn;
}

function update_signal_chart(ledcurr, volt, curr, timestep){
    if (volt && curr && ledcurr){
        $("#chart_ledcurr_label")[0].innerHTML = d3.format("~s")(ledcurr)+"A";
        $("#chart_curr_label")[0].innerHTML = d3.format("~s")(curr)+"A";
        $("#chart_volt_label")[0].innerHTML = d3.format("~s")(volt)+"V";
        let nextime = 0;
        if (signal_chart.data.datasets[0].data.length != 0)
            nextime = signal_chart.data.datasets[0].data[signal_chart.data.datasets[0].data.length - 1].x + timestep;
        signal_chart.data.datasets[0].data.push({x: nextime, y: volt});
        signal_chart.data.datasets[1].data.push({x: nextime, y: curr});
    }else{
        signal_chart.data.datasets[0].data.length = 0;
        signal_chart.data.datasets[1].data.length = 0;
        $("#chart_ledcurr_label")[0].innerHTML = "";
        $("#chart_curr_label")[0].innerHTML = "";
        $("#chart_volt_label")[0].innerHTML = "";
    }
    signal_chart.update();
}

function update_run_dashboard(pin_ext, pin_inn, led_curr, volt, curr, timestep, pixel_no, total_pixels, pixel_time, total_time){
    update_pin_chart(pin_ext, pin_inn);
    update_signal_chart(led_curr, volt, curr, timestep);
    $("#run_progress_percent")[0].innerHTML = Math.round((1+pixel_no)/total_pixels*100) + "%";
    $("#run_progress_pixel")[0].innerHTML = (1+pixel_no) + "/"+total_pixels;
    $("#run_total_time_left")[0].innerHTML = total_time;
    $("#run_pixel_time_left")[0].innerHTML = pixel_time;
}

enable_dashboard_updating();