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
      custom_smu_pars_update();
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
        console.log("responce for Stop request: "  + responce)
        if (responce == "ok") onok(); else onfail(responce);
      }); 
}

eel.expose(update_run_dashboard_eel);
function update_run_dashboard_eel(pin_ext, pin_inn, led_curr, volt, curr, timestep, pixel_no, total_pixels, pixel_time, total_time, newpixel_flag){
  if (typeof update_run_dashboard === "function")
    update_run_dashboard(pin_ext, pin_inn, led_curr, volt, curr, timestep, pixel_no, total_pixels, pixel_time, total_time, newpixel_flag);
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
  // document.cookie = ["last_error", '=', JSON.stringify(msg),';path=/'].join('');
  if (typeof stop_run === "function"){
    enable_editing();
    $("#run-stop-button")[0].classList.add("myhide");
    $("#run-start-button")[0].classList.remove("myhide");
    if (!ok) show_error(msg);
  }else if (!ok) {
    $('#run_exception_descr')[0].innerHTML = msg;
    $('.run_exception').css('display','flex');
    $('#run_exception_title')[0].innerHTML = 'Error';
    $('#run_exception_card')[0].classList.add('card-light-danger');
    $('#run_exception_card')[0].classList.remove('card-light-success');

    // alert()
  } else{
    $('#run_exception_descr')[0].innerHTML = "Completed!";
    $('#run_exception_title')[0].innerHTML = '';
    $('#run_exception_card')[0].classList.remove('card-light-danger');
    $('#run_exception_card')[0].classList.add('card-light-success');
    $('.run_exception').css('display','flex');
  };
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

function custom_smu_pars_update(callback = function(){}){
  eel.getSmuCustomParsList($('#smu_types_select')[0].value)().then((responce) => {
    $("#custom_smu_pars_container").empty();
    
    if (typeof responce === 'string' || responce instanceof String){
      show_error(responce);
    }else{
    
      for (const [key, value] of Object.entries(responce)) {
        let parname = key;
        let partype = value['type'];
        let onepar = `
        <div class="form-group row">
          <label class="col-sm-4 col-form-label">${parname}<div class="badge badge-danger my_icon_popup myerror_popup myhide" id="myerror_popup_smu_custom_${parname}"><i class="ti-alert"></i></div></label>
          <div class="col-sm-8">
            <input class="form-control smu_custom_parameters" type="${partype}" placeholder="" id="smu_custom_${parname}" onchange="$('#myerror_popup_smu_custom_${parname}')[0].classList.add('myhide')">
          </div>
        </div>
        `
        $("#custom_smu_pars_container").append($.parseHTML(onepar));
      }
      callback();
    }
  });
  

}