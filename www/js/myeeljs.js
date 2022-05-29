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