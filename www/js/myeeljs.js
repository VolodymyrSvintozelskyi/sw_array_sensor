$("#update_relay_com_ports").on("click",function (){
    eel.getComPortList()().then((ports) => {
      select = $("#relay_com_ports_select");
      select.empty();
      ports.forEach(port => {
        select.append($.parseHTML(`<option>${port}</option>`));
      });
    }); 
  });

$("#update_smu_com_ports").on("click",function (){
    eel.getVisaPortList()().then((ports) => {
      select = $("#smu_ports_select");
      select.empty();
      ports.forEach(port => {
        select.append($.parseHTML(`<option>${port}</option>`));
      });
    }); 
  })

$("#update_smu_types").on("click",function (){
    eel.getSmuTypesList()().then((ports) => {
      select = $("#smu_types_select");
      select.empty();
      ports.forEach(port => {
        select.append($.parseHTML(`<option>${port}</option>`));
      });
    }); 
  })

$("#update_led_com_ports").on("click",function (){
    eel.getLedPortList()().then((ports) => {
      select = $("#led_ports_select");
      select.empty();
      ports.forEach(port => {
        select.append($.parseHTML(`<option>${port}</option>`));
      });
    }); 
  })

$("#update_led_types").on("click",function (){
    eel.getLedTypesList()().then((ports) => {
      select = $("#led_types_select");
      select.empty();
      ports.forEach(port => {
        select.append($.parseHTML(`<option>${port}</option>`));
      });
    }); 
  })

function send_start_run_cmd(configuration, onok = function(){}, onfail = function(){}){
    eel.start_run(configuration)().then((responce) => {
        if (responce == "ok") onok(); else onfail(responce);
      }); 
}

function send_stop_run_cmd(onok = function(){}, onfail = function(){}){
    eel.stop_run()().then((responce) => {
        if (responce == "ok") onok(); else onfail(responce);
      }); 
}

eel.expose(update_run_dashboard_eel);
function update_run_dashboard_eel(pin_ext, pin_inn, led_curr, volt, curr, timestep, pixel_no, total_pixels, pixel_time, total_time){
  if (typeof update_run_dashboard === "function")
    update_run_dashboard(pin_ext, pin_inn, led_curr, volt, curr, timestep, pixel_no, total_pixels, pixel_time, total_time);
}

function enable_dashboard_updating(){
  eel.enable_dashboard_updating();
}
function disable_dashboard_updating(){
  eel.disable_dashboard_updating();
}

eel.expose(python_stop_run);
function python_stop_run(ok, msg){
  console.log("Python run interruption")
  document.cookie = ["current_state", '=', JSON.stringify("idle"),';path=/'].join('');
  if (typeof stop_run === "function"){
    enable_editing();
    $("#run-stop-button")[0].classList.add("myhide");
    $("#run-start-button")[0].classList.remove("myhide");
    if (!ok) show_error(msg);
  }else if (!ok) alert(msg);
}

function check_run_state(){
  eel.check_run_state()().then((responce) => {
    if (read_cookie("current_state") != responce){
      if (responce == "idle"){
        enable_editing();
        $("#run-stop-button")[0].classList.add("myhide");
        $("#run-start-button")[0].classList.remove("myhide");
        bake_cookie("current_state", "idle");
      }else{
        disable_editing();
        $("#run-stop-button")[0].classList.remove("myhide");
        $("#run-start-button")[0].classList.add("myhide");
        bake_cookie("current_state", "run");
      }
    }
  }); 
}