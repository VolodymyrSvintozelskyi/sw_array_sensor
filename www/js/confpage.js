var drake =  window.dragula();
var led_current_array = [];
var voltage_profile_array = [];
var voltage_profile_array_rec = [];

updatedragula = (function() {
  if (drake){
    drake.destroy();
  }
  drake = dragula([].slice.apply(document.querySelectorAll('.myloop_nested')));
});

function updatemaxheight_verification(){
  let newvalue = parseInt($("#mycommutator_card").css("height")) - parseInt($("#mysmu_card").css("height")) - parseInt($("#mysmu_card").css("margin-bottom"))  - parseInt($("#myled_card").css("height")) - parseInt($("#myled_card").css("margin-bottom"));
  if (newvalue > 0)
  $("#myverification_card").css("max-height", newvalue);
  else
  $("#myverification_card").css("max-height", $("#myverification_card").css("min-height"));
}

new ResizeObserver(updatemaxheight_verification).observe($("#mycommutator_card")[0]);

updatedragula();

function addFileHandler(label, button, file){
  openDialog = function () {
    document.getElementById(file).click();
  }
  fileselected = function(){
    document.getElementById(label).value = document.getElementById(file).files[0].name;
  }
  
  document.getElementById(button).addEventListener('click', openDialog);
  document.getElementById(file).addEventListener('change', fileselected);
}

addFileHandler('voltage_profile_text_path', 'voltage_profile_text_button', 'voltage_profile_text_input');
addFileHandler('voltage_profile_text_path_rec', 'voltage_profile_text_button_rec', 'voltage_profile_text_input_rec');
addFileHandler('current_profile_text_path', 'current_profile_text_button', 'current_profile_text_input');

$("#current_profile_text_input").on("change", function(){
  let fr=new FileReader();
  fr.onload=function(){
    led_current_array = fr.result.split("\n").map(x => parseFloat(x));
    led_current_array = led_current_array.filter(function (value) {
      return !Number.isNaN(value);
    });
    update_verification_table();
  }
  fr.readAsText(this.files[0]);
});

$("#voltage_profile_text_input").on("change", function(){
  let fr=new FileReader();
  fr.onload=function(){
    voltage_profile_array = fr.result.split("\n").map(x => parseFloat(x));
    voltage_profile_array = voltage_profile_array.filter(function (value) {
      return !Number.isNaN(value);
    })
  }
  fr.readAsText(this.files[0]);
  $('#myerror_popup_smu_v_profile')[0].classList.add('myhide');
});

$("#voltage_profile_text_input_rec").on("change", function(){
  let fr=new FileReader();
  fr.onload=function(){
    voltage_profile_array_rec = fr.result.split("\n").map(x => parseFloat(x));
    voltage_profile_array_rec = voltage_profile_array_rec.filter(function (value) {
      return !Number.isNaN(value);
    })
  }
  fr.readAsText(this.files[0]);
  $('#myerror_popup_smu_v_profile_rec')[0].classList.add('myhide');
});

function myloop_del_node(but){
  but.closest(".myloop_node").remove();
  updatedragula();
  update_verification_table()
}

function myloop_gen_loop(type, from="", to="", step=""){
  if (type=="external"){
    shorttype = "ext";
    title = "External";
  }else{
    shorttype = "inn";
    title = "Inner";
  }
  var html_loop = `
  <div class="myloop_item myloop_node myloop_type_${shorttype}" onmouseup="update_verification_table()">
  <div class="form-group row col-sm-12">
  <div class="row  col-sm-12">
  <h6 class="col-sm-11 col-form-label">${title} BNC pin loop</h6>
  </div>
  <div class="row col-sm-12">
  <div class="input-group col-sm-4">
  <div class="input-group-prepend">
  <span class="input-group-text">From:</span>
  </div>
  <input type="number" class="form-control dis-arrows myloop_bus_from" min="0" max="7" onfocusout="update_verification_table()" value="${from}">
  </div>
  <div class="input-group col-sm-3">
  <div class="input-group-prepend">
  <span class="input-group-text">To:</span>
  </div>
  <input type="number" class="form-control dis-arrows myloop_bus_to" min="0" max="7" onfocusout="update_verification_table()" value="${to}">
  </div>
  <div class="input-group col-sm-4">
  <div class="input-group-prepend">
  <span class="input-group-text">Step:</span>
  </div>
  <input type="number" class="form-control dis-arrows myloop_bus_step" min="-7" max="7" onfocusout="update_verification_table()" value="${step}">
  </div>
  <button type="button" class="btn btn-outline-danger btn-icon col-sm-1 myloop_del_node" onclick="myloop_del_node(this);">
  <i class="ti-trash"></i>
  </button>
  </div>
  </div>
  <div class="myloop_nested">
  </div>
  </div>
  `;
  return html_loop;
}
function myloop_add_loop(type){
  html_loop = myloop_gen_loop(type);
  container = $(".myloop_container_nested")[0];
  $(container).append($.parseHTML(html_loop));
  updatedragula();
  update_verification_table();
}

function myloop_gen_bus(ext="",inn=""){
  var html_bus = `
  <div class="myloop_item myloop_node myloop_type_bus" onmouseup="update_verification_table()">                                  
  <div class="row col-sm-12">
  <div class="row col-sm-12">
  <h6 class="col-sm-11 col-form-label">Bus connection</h6>
  </div>
  <div class="form-group row col-sm-12">
  <div class="input-group col-sm-5">
  <div class="input-group-prepend">
  <span class="input-group-text bg-primary text-white">External:</span>
  </div>
  <select class="form-control myloop_buscoon_ext">
  <option value="B" ${ext=="B" ? "selected" : ""}>Blue</option>
  <option value="G" ${ext=="G" ? "selected" : ""}>Green</option>
  <option value="R" ${ext=="R" ? "selected" : ""}>Red</option>
  <option value="O" ${ext=="O" ? "selected" : ""}>Orange</option>
  </select>
  </div>
  <div class="input-group col-sm-5">
  <div class="input-group-prepend">
  <span class="input-group-text bg-danger text-white">Inner:</span>
  </div>
  <select class="form-control myloop_buscoon_inn">
  <option value="B" ${inn=="B" ? "selected" : ""}>Blue</option>
  <option value="G" ${inn=="G" ? "selected" : ""}>Green</option>
  <option value="R" ${inn=="R" ? "selected" : ""}>Red</option>
  <option value="O" ${inn=="O" ? "selected" : ""}>Orange</option>
  </select>
  </div>
  <button type="button" class="btn btn-outline-danger btn-icon col-sm-1"  onclick="myloop_del_node(this);">
  <i class="ti-trash"></i>
  </button>
  </div>
  </div>
  </div>
  `;
  return html_bus;
}
function myloop_add_bus(){
  html_bus = myloop_gen_bus();
  container = $(".myloop_container_nested")[0];
  $(container).append($.parseHTML(html_bus));
  updatedragula();
  update_verification_table();
}

function generate_pixel_loop(){
  let tree = gen_loop_tree();
  if (! tree) return {"err": true, "err_msg": "Failed to create a loop tree"};
  let pixel_id = 0;
  let global_status = false;
  let err_msg = "";
  let pixel_loop=[];
  for (let root_i = 0; root_i < tree.length; root_i++){
    let rootnode = tree[root_i];
    let firstlooptype = rootnode.type;
    for (let second_i = 0; second_i < rootnode.children.length; second_i++){
      let secondnode = rootnode.children[second_i];
      for (let first_loop_i = rootnode.from; (rootnode.step > 0 ? first_loop_i <= rootnode.to : first_loop_i >= rootnode.to); first_loop_i += rootnode.step ){
        for (let second_loop_i = secondnode.from; (secondnode.step > 0 ? second_loop_i <= secondnode.to : second_loop_i >= secondnode.to); second_loop_i += secondnode.step ){
          for (let third_i = 0; third_i < secondnode.children.length; third_i++){
            let thirdnode = secondnode.children[third_i];
            let externalpin = thirdnode.ext + (firstlooptype == "myloop_type_ext" ? first_loop_i : second_loop_i);
            let innerpin = thirdnode.inn + (firstlooptype == "myloop_type_inn" ? first_loop_i : second_loop_i);
            
            let current = "?";
            if (pixel_id < led_current_array.length)
            current = led_current_array[pixel_id];
            else{
              global_status = true;
              err_msg = "no LED current";
            }
            pixel_id++;
            
            pixel_loop.push({"ext": externalpin, "inn": innerpin, "curr": current});
          }
        }
      }
    }
  }
  return {"loop": pixel_loop, "err": global_status, "err_msg":err_msg};
}

function update_verification_table(){
  function getPinColor(short){
    switch (short){
      case "R": return "danger"; 
      case "G": return "success"; 
      case "B": return "info"; 
      case "O": return "warning"; 
    }
  }
  let pixel_loop = generate_pixel_loop();
  if (pixel_loop.err_msg == "Failed to create a loop tree") return pixel_loop; 
  let tabl_body = $("#myverification_tabl_body");
  tabl_body.empty();
  
  for (let pixel_id = 0; pixel_id < pixel_loop.loop.length; pixel_id ++){
    let status = "Ok";
    let err_msg = "";
    let innerpin = pixel_loop.loop[pixel_id].inn;
    let externalpin = pixel_loop.loop[pixel_id].ext;
    let current = pixel_loop.loop[pixel_id].curr;
    if (current == "?"){
      status = "Error";
      err_msg = "no LED current";
    }
    
    let html_status = `<div class="badge badge-success">Ok</div>`;
    if (status != "Ok") html_status = `<div class="badge badge-danger">${err_msg}</div>`;
    let html_line = `<tr>
    <!-- <td>${externalpin}</td> -->
    <td><div class="badge badge-${getPinColor(externalpin[0])}">${externalpin}</div></td>
    <td><div class="badge badge-${getPinColor(innerpin[0])}">${innerpin}</div></td>
    <td>${current}</td>
    <td class="font-weight-medium">${html_status}</td>
    </tr>`;
    $(tabl_body).append($.parseHTML(html_line));
  }
  
  if (! pixel_loop.err){
    $("#myverification_status")[0].classList.add("myhide");
    hide_error();
  }else{
    $("#myverification_status")[0].classList.remove("myhide");
    show_error("See verification table");
  }
  $("#myverification_counter")[0].innerHTML = pixel_loop.loop.length;
  return pixel_loop;
}

function find_nested_loop_entries(container){
  var elements = [];
  container.each(function (_,element){
    var elclas = element.classList[2];
    var elem = {"type":elclas}
    if (elclas == "myloop_type_ext" || elclas == "myloop_type_inn"){
      elem["from"] = $(element).children('.form-group').children('.row').children('.input-group').children(".myloop_bus_from")[0].value;
      elem["to"] = $(element).children('.form-group').children('.row').children('.input-group').children(".myloop_bus_to")[0].value;
      elem["step"] = $(element).children('.form-group').children('.row').children('.input-group').children(".myloop_bus_step")[0].value;
    }else if (elclas == "myloop_type_bus"){
      elem['ext'] =  $(element).children('.row').children('.form-group').children('.input-group').children(".myloop_buscoon_ext")[0].value;
      elem['inn'] =  $(element).children('.row').children('.form-group').children('.input-group').children(".myloop_buscoon_inn")[0].value;
    }
    elem['children'] =  find_nested_loop_entries($(element).children(".myloop_nested").children(".myloop_item"));
    elements.push(elem);
  });
  return elements;
}



function verify_loop_tree(tree){
  function check_bus(bus){
    switch (bus['ext'] + bus['inn']) {
      case 'RG':
      case 'RO':
      case 'RB':
      case 'GB':
      case 'GO':
      case 'BO':
      return false;
      default:
      return "Invalid bus combination";
    };
  }
  function check_loop(loop){
    if (!( /\d/.test(loop["from"]) && /\d/.test(loop["to"]) && /\d/.test(loop["step"]))){
      return "Loop parameters must be integers.";
    }
    loop["from"] = parseInt(loop.from);
    loop["to"] = parseInt(loop.to);
    loop["step"] = parseInt(loop.step);
    if (loop["from"] < 0 || loop["to"] > 7)
    return "Loop boundaries must be within the 0 - 7 range";
    if (loop["step"] < -7 || loop["step"] > 7)
    return "Loop step must be within the -7 - 7 range";
    if ((loop.to - loop.from)*loop.step < 0)
    return "Incorrect loop step sign";
    return false;
  }
  var hasrootnode = 0;
  var hassecondnode = 0;
  var hasthirdnode = 0;
  var root_node_type = undefined;
  for (let root_i = 0; root_i < tree.length; root_i++){
    let rootnode = tree[root_i];
    hasrootnode += 1;
    if (rootnode.type == "myloop_type_bus") return "Loop order root nodes must be loops!";
    if (root_node_type){
      if (root_node_type != rootnode.type) return "Different loop types on root level";
    }else root_node_type = rootnode.type;
    var error = check_loop(rootnode);
    if (error) return error;
    for (let second_i = 0; second_i < rootnode.children.length; second_i++){
      let secondnode = rootnode.children[second_i];
      hassecondnode += 1;
      if (secondnode.type == "myloop_type_bus") return "Loop order 2-nd level nodes must be loops!";
      if (secondnode.type == root_node_type) return "Second-level loop types must differ from first one!"
      var error = check_loop(secondnode);
      if (error) return error;
      for (let third_i = 0; third_i < secondnode.children.length; third_i++){
        let thirdnode = secondnode.children[third_i];
        hasthirdnode += 1;
        if (thirdnode.type != "myloop_type_bus") return "Loop order 3-rd level nodes must be buses!";
        var error = check_bus(thirdnode);
        if (error) return error;
      };
    };
  };
  if (! hasrootnode) return "Loop order must contain at least one root node";
  if (! hassecondnode) return "Loop order must contain at least one 2nd level node";
  if (! hasthirdnode) return "Loop order must contain at least one 3rd level node";
  return false;
} 

function show_error(text){
  $("#myerrorbar")[0].classList.remove("myhide");
  $("#myerrorbar")[0].innerHTML = text;
}

function hide_error(){
  $("#myerrorbar")[0].classList.add("myhide");
}

function gen_loop_tree(){
  container = $(".myloop_container_nested > .myloop_item" );
  tree = find_nested_loop_entries(container);
  var error = verify_loop_tree(tree);
  if (error){
    show_error(error);
    $("#myloop_order_err")[0].classList.remove("myhide");
    return false;
  }else{
    hide_error();
    $("#myloop_order_err")[0].classList.add("myhide");
  }
  return tree;
}

function create_configuration(){
  let commutator_port = $("#relay_com_ports_select")[0].value;
  let commutator_relay_delay = $("#relay_delay")[0].value;
  let smu_port = $("#smu_ports_select")[0].value;
  let smu_type = $("#smu_types_select")[0].value;
  let led_port = $("#led_ports_select")[0].value;
  let led_type = $("#led_types_select")[0].value;
  let voltage_amp_factor = $("#smu_voltage_factor")[0].value;
  let voltage_time_step = $("#smu_time_step")[0].value;
  let voltage_time_total = $("#smu_time_total")[0].value;
  let voltage_amp_factor_rec = $("#smu_voltage_factor_rec")[0].value;
  let voltage_time_step_rec = $("#smu_time_step_rec")[0].value;
  let voltage_time_total_rec = $("#smu_time_total_rec")[0].value;
  let loop_order_tree = gen_loop_tree();
  let led_i_profile_filename;
  let smu_v_profile_filename;
  let output_folder = $('#output_folder')[0].value;
  if (led_current_array.length > 0) 
  led_i_profile_filename = $("#current_profile_text_path")[0].value;
  if (voltage_profile_array.length > 0) 
  smu_v_profile_filename = $("#voltage_profile_text_path")[0].value;
  let smu_custom_pars = {};
  $('.smu_custom_parameters').each(function(index, value) {
    let custom_id = this.id.substring(11);
    let custom_value = this.value;
    smu_custom_pars[custom_id] = {value: custom_value}
  });
  let configuration = {
    "comm_port": commutator_port,
    "comm_relay_delay": commutator_relay_delay,
    "smu_port": smu_port,
    "smu_type": smu_type,
    "led_port": led_port,
    "led_type": led_type,
    "smu_v_factor": voltage_amp_factor,
    "smu_t_step": voltage_time_step,
    "smu_t_total": voltage_time_total,
    "smu_v_profile": voltage_profile_array,
    "smu_v_factor_rec": voltage_amp_factor_rec,
    "smu_t_step_rec": voltage_time_step_rec,
    "smu_t_total_rec": voltage_time_total_rec,
    "smu_v_profile_rec": voltage_profile_array_rec,
    "led_i_profile": led_current_array,
    "smu_v_profile_filename": smu_v_profile_filename,
    "led_i_profile_filename": led_i_profile_filename,
    "loop_order_tree": loop_order_tree,
    'output_folder': output_folder,
    'smu_custom_pars': smu_custom_pars,
    'smu_recovery_enable' : $('#smu_recovery_enable')[0].checked,
    'smu_rec_thresh': $('#smu_rec_thresh')[0].value
  }
  return configuration;
}

function save_configuration_to_cookie(){
  let configuration = create_configuration();
  bake_cookie("current_configuration", configuration);
  return true;
}

function parse_loop_node(tree_node){
  let dom_node;
  if (tree_node.type == "myloop_type_ext" || tree_node.type == "myloop_type_inn"){
    dom_node = $.parseHTML(myloop_gen_loop( (tree_node.type == "myloop_type_ext" ? "external" : "inner"), tree_node.from, tree_node.to, tree_node.step ));
    for (let child_i = 0; child_i < tree_node.children.length; child_i++){
      $(dom_node).children(".myloop_nested").append(parse_loop_node(tree_node.children[child_i]));
    }
  }else if (tree_node.type == "myloop_type_bus"){
    dom_node = $.parseHTML(myloop_gen_bus(tree_node.ext, tree_node.inn));
  }
  return dom_node;
}

function load_configuration(configuration){
  if (! configuration) return;
  voltage_profile_array = configuration["smu_v_profile"];
  voltage_profile_array_rec = configuration["smu_v_profile_rec"];
  led_current_array = configuration["led_i_profile"];
  if (! voltage_profile_array) voltage_profile_array = [];
  if (! voltage_profile_array_rec) voltage_profile_array_rec = [];
  if (! led_current_array) led_current_array = [];
  $("#relay_com_ports_select").empty();
  $("#relay_com_ports_select").append($.parseHTML(`<option>${configuration["comm_port"]}</option>`));
  $("#relay_com_ports_select")[0].value = configuration["comm_port"];
  $("#relay_delay")[0].value = configuration["comm_relay_delay"];
  $("#smu_types_select").empty();
  $("#smu_types_select").append($.parseHTML(`<option>${configuration["smu_type"]}</option>`));
  $("#smu_types_select")[0].value = configuration["smu_type"];
  $("#smu_ports_select").empty();
  $("#smu_ports_select").append($.parseHTML(`<option>${configuration["smu_port"]}</option>`));
  $("#smu_ports_select")[0].value = configuration["smu_port"];
  $("#led_types_select").empty();
  $("#led_types_select").append($.parseHTML(`<option>${configuration["led_type"]}</option>`));
  $("#led_types_select")[0].value = configuration["led_type"];
  $("#led_ports_select").empty();
  $("#led_ports_select").append($.parseHTML(`<option>${configuration["led_port"]}</option>`));
  $("#led_ports_select")[0].value = configuration["led_port"];
  $("#smu_voltage_factor")[0].value = configuration["smu_v_factor"];
  $("#smu_time_step")[0].value = configuration["smu_t_step"];
  $("#smu_time_total")[0].value = configuration["smu_t_total"];
  $("#smu_voltage_factor_rec")[0].value = configuration["smu_v_factor_rec"];
  $("#smu_time_step_rec")[0].value = configuration["smu_t_step_rec"];
  $("#smu_time_total_rec")[0].value = configuration["smu_t_total_rec"];
  $('#smu_recovery_enable')[0].checked = configuration["smu_recovery_enable"];
  $('#output_folder')[0].value = configuration['output_folder'] ? configuration['output_folder'] : "{timestamp}";
  $('#smu_rec_thresh')[0].value = configuration['smu_rec_thresh'];
  
  if ($('#smu_recovery_enable')[0].checked){
    $('#smu_recovery_container').css('display','block');
  }else{
    $('#smu_recovery_container').css('display','none');
  }

  custom_smu_pars_update(function (){
    for (const [key, value] of Object.entries(configuration['smu_custom_pars'])) {
      $('#smu_custom_' + key)[0].value = value['value'];
    }
  }
  );

  if (voltage_profile_array.length > 0){
    $("#voltage_profile_text_path")[0].value = configuration["smu_v_profile_filename"];
  }
  if (led_current_array.length > 0){
    $("#current_profile_text_path")[0].value = configuration["led_i_profile_filename"];
  }
  let tree = configuration["loop_order_tree"];
  if (tree){
    container = $(".myloop_container_nested");
    container.empty();
    container = container[0];
    for (let root_i = 0; root_i < tree.length; root_i++){
      $(container).append(parse_loop_node(tree[root_i]));
    }
    update_verification_table();
    
  }
  updatedragula();
}

function bake_cookie(name, value) {
  var cookie = [name, '=', JSON.stringify(value)].join('');
  document.cookie = cookie;
}

function read_cookie(name) {
  var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
  result && (result = JSON.parse(result[1]));
  return result;
}

function delete_cookie(name) {
  document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT'].join('');
}

load_configuration(read_cookie("current_configuration"));

// Function to download data to a file
function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
  window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);  
    }, 0); 
  }
}

function save_configuration_to_file(){
  let configuration = create_configuration();
  download(JSON.stringify(configuration), "Sensor_array_configuration_" + (new Date().toLocaleString()), "plain");
  return true;
}

$("#configuration_global_file").on("change",function(){
  let fr=new FileReader();
  fr.onload=function(){
    load_configuration(JSON.parse(fr.result));
    save_configuration_to_cookie();
  }
  fr.readAsText(this.files[0]);
});

function disable_editing(){
  $(".configuration_disabler").prop('disabled', true);
  if (drake){
    drake.destroy();
  }
}

function enable_editing(){
  $(".configuration_disabler").prop('disabled', false);
  updatedragula();
}

function start_run(){
  let pixel_loop = update_verification_table();
  if (pixel_loop.err){
    show_error("Check verification table");
    return;
  }
  let commutator_port = $("#relay_com_ports_select")[0].value;
  if (! commutator_port){
    show_error("Invalid commutator port");
    $('#myerror_popup_comm_port')[0].classList.remove('myhide');
    return;
  }
  let commutator_relay_delay = parseInt($("#relay_delay")[0].value);
  if (! commutator_relay_delay || commutator_relay_delay < 1){
    show_error("Invalid commutator relay delay");
    $('#myerror_popup_relay_delay')[0].classList.remove('myhide');
    return;
  }
  let output_folder = $('#output_folder')[0].value;
  if( ! /\S/.test(output_folder)){
    show_error("Invalid output folder name");
    $('#myerror_popup_output_folder')[0].classList.remove('myhide');
    return;
  }
  let smu_type = $("#smu_types_select")[0].value;
  if (! smu_type){
    show_error("Invalid SMU type");
    $('#myerror_popup_smu_type')[0].classList.remove('myhide');
    return;
  }
  let smu_port = $("#smu_ports_select")[0].value;
  if (! smu_port){
    show_error("Invalid SMU port");
    $('#myerror_popup_smu_port')[0].classList.remove('myhide');
    return;
  }
  let led_type = $("#led_types_select")[0].value;
  if (! smu_type){
    show_error("Invalid LED type");
    $('#myerror_popup_smu_type')[0].classList.remove('myhide');
    return;
  }
  let led_port = $("#led_ports_select")[0].value;
  if (! smu_port){
    show_error("Invalid LED port");
    $('#myerror_popup_smu_port')[0].classList.remove('myhide');
    return;
  }
  let voltage_amp_factor = parseFloat( $("#smu_voltage_factor")[0].value );
  if (! voltage_amp_factor || voltage_amp_factor <= 0){
    show_error("Invalid SMU amplitude factor");
    $('#myerror_popup_smu_v_factor')[0].classList.remove('myhide');
    return;
  }
  let voltage_time_step = parseFloat( $("#smu_time_step")[0].value );
  if (! voltage_time_step || voltage_time_step <= 0){
    show_error("Invalid SMU time step");
    $('#myerror_popup_smu_t_step')[0].classList.remove('myhide');
    return;
  }
  let voltage_time_total = parseFloat( $("#smu_time_total")[0].value );
  if (! voltage_time_total || voltage_time_total <= 0){
    show_error("Invalid SMU total time");
    $('#myerror_popup_smu_t_total')[0].classList.remove('myhide');
    return;
  }
  if(voltage_profile_array.length == 0){
    show_error("Empty SMU voltage profile");
    $('#myerror_popup_smu_v_profile')[0].classList.remove('myhide');
    return;
  }
  let voltage_amp_factor_rec = parseFloat( $("#smu_voltage_factor_rec")[0].value );
  let voltage_time_step_rec = parseFloat( $("#smu_time_step_rec")[0].value );
  let voltage_time_total_rec = parseFloat( $("#smu_time_total_rec")[0].value );
  let smu_rec_thresh = parseFloat($('#smu_rec_thresh')[0].value);
  if($('#smu_recovery_enable')[0].checked){ 
    if (! smu_rec_thresh || smu_rec_thresh <= 0){
      show_error("Invalid SMU recovery threshold");
      $('#myerror_popup_smu_rec_thresh')[0].classList.remove('myhide');
      return;
    }
    if (! voltage_amp_factor_rec || voltage_amp_factor_rec <= 0){
      show_error("Invalid SMU amplitude factor_rec");
      $('#myerror_popup_smu_v_factor_rec')[0].classList.remove('myhide');
      return;
    }
    if (! voltage_time_step_rec || voltage_time_step_rec <= 0){
      show_error("Invalid SMU time step");
      $('#myerror_popup_smu_t_step_rec')[0].classList.remove('myhide');
      return;
    }
    if (! voltage_time_total_rec || voltage_time_total_rec <= 0){
      show_error("Invalid SMU total time");
      $('#myerror_popup_smu_t_total_rec')[0].classList.remove('myhide');
      return;
    }
    if(voltage_profile_array_rec.length == 0){
      show_error("Empty SMU voltage profile");
      $('#myerror_popup_smu_v_profile_rec')[0].classList.remove('myhide');
      return;
    }
  }
  let smu_custom_pars = {};
  custom_pars_error = false;
  $('.smu_custom_parameters').each(function(index, value) {
    let custom_id = this.id.substring(11);
    let custom_value = this.value;
    if( ! /\S/.test(custom_value)){
      show_error("Empty SMU custom parameter");
      $('#myerror_popup_smu_custom_' + custom_id)[0].classList.remove('myhide');
      custom_pars_error = true;
      return;
    }
    smu_custom_pars[custom_id] = {value: custom_value}
  });
  if (custom_pars_error) return;
  let configuration = {
    "comm_port": commutator_port,
    "comm_relay_delay": commutator_relay_delay,
    "smu_type": smu_type,
    "smu_port": smu_port,
    "smu_v_factor": voltage_amp_factor,
    "smu_t_step": voltage_time_step,
    "smu_t_total": voltage_time_total,
    "smu_v_profile": voltage_profile_array,
    "pixel_loop": pixel_loop,
    "led_port": led_port,
    "led_type": led_type,
    'output_folder': output_folder,
    'smu_custom_pars': smu_custom_pars,
    "smu_v_factor_rec": voltage_amp_factor_rec,
    "smu_t_step_rec": voltage_time_step_rec,
    "smu_t_total_rec": voltage_time_total_rec,
    "smu_v_profile_rec": voltage_profile_array_rec,
    'smu_recovery_enable': $("#smu_recovery_enable")[0].checked,
    'smu_rec_thresh': smu_rec_thresh
  }
  save_configuration_to_cookie();
  console.log("Start run with settings:");
  console.log(configuration);
  
  onok = function(){ 
    disable_editing();
    $("#run-stop-button")[0].classList.remove("myhide");
    $("#run-start-button")[0].classList.add("myhide");
    bake_cookie("current_state", "run");
    window.location.href = "pages/run/run.html";
  }
  onfail = function(responce){
    show_error("Unable to start the run: "+responce);
  }
  send_start_run_cmd(configuration, onok, onfail);
}

function stop_run(){
  console.log("Stop run");
  onok = function(){ 
    enable_editing();
    $("#run-stop-button")[0].classList.add("myhide");
    $("#run-start-button")[0].classList.remove("myhide");
    bake_cookie("current_state", "idle");
  }
  onfail = function(responce){
    show_error("Unable to start the run: "+responce);
  }
  send_stop_run_cmd(onok, onfail);
}

if (read_cookie("current_state") == "run"){
  disable_editing();
  $("#run-stop-button")[0].classList.remove("myhide");
  $("#run-start-button")[0].classList.add("myhide");
}

if (read_cookie("current_state") == "idle"){
  enable_editing();
  $("#run-stop-button")[0].classList.add("myhide");
  $("#run-start-button")[0].classList.remove("myhide");
}

try {
  disable_dashboard_updating();
  
  check_run_state();
} catch (error) {
  console.error(error);
}

function gen_smu_v_example(){
  let data = {
    datasets: [
      {
        label: 'SMU Voltage',
        data: [],
        backgroundColor: '#4B49AC',
        borderColor: '#4B49AC',
        fill: false,
        showLine: true,
        order: 1
      }
    ],
  };
  
  const config = {
    'type': 'scatter',
    'data': data,
    options: {
      elements: {
        point:{radius:5},
        line: {tension: .0}
      },
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            display: true,
            autoSkip: false,
            maxRotation: 0,
            padding: 18,
            // fontColor:"#4B49AC"
          },
          gridLines: {
            display: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Time',
            // fontColor: '#4B49AC'
          }
        }],
        yAxes: [
          {
            display: true,
            ticks: {
              display: true,
              autoSkip: false,
              maxRotation: 0,
              padding: 18,
              // fontColor:"#4B49AC"
            },
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'SMU V',
              // fontColor: '#4B49AC'
            }
          }
        ]
      },
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        filler: {
          propagate: false
        },
        zoom: {
          // Container for pan options
          pan: {
            enabled: true,
            mode: 'x',
            rangeMin: {
              x: 0,
            },
            rangeMax: {
              x: null,
            },
            speed: 20,
            threshold: 10,
          },
          // Container for zoom options
          zoom: {
            enabled: true,
            mode: 'x',
            rangeMin: {
              x: 0,
            },
            rangeMax: {
              x: null,
            },
            speed: 0.1,
            threshold: 2,
            sensitivity: 3,
          }
        }
      }
    }
  };
  var signalChartCanvas = $("#my-smu-voltage-example").get(0).getContext("2d");
  var signalChart = new Chart(signalChartCanvas, config);
  return signalChart;
}

function gen_pix_map_example(){
  pin_chart_radius = 10;
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
                    drawBorder: false,
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
        orange_data.push({x: 0, y:1+i+0.25, r:radius});
        red_data.push({x: 1+i-0.25, y:0, r:radius});
        blue_data.push({x: 1+i+0.25, y:9, r:radius});
        green_data.push({x: 9, y:1+i-0.25, r:radius});
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
    var pinChartCanvas = $("#my-pixel-map-example").get(0).getContext("2d");
    var pinChart = new Chart(pinChartCanvas, {
        type: 'bubble',
        data: data,
        options: areaOptions
    });
    return pinChart
}

var smu_v_example_chart = gen_smu_v_example()
var pixel_map_examp_chart = gen_pix_map_example();

function draw_smu_v_example(recovery = false){
  // console.log(recovery);
  let suffix = recovery ? "_rec" : "";
  $('.mybig_popup').css('display','block');
  $('#my-pixel-map-example').css('display','none');
  $('#my-smu-voltage-example').css('display','block');

  let newdataset = [];
  let curr_t = 0;

  let voltage_time_step = parseFloat( $("#smu_time_step"+suffix)[0].value );
  if (! voltage_time_step || voltage_time_step <= 0){
    show_error("Invalid SMU time step");
    $('#myerror_popup_smu_t_step'+suffix)[0].classList.remove('myhide');
    return;
  }
  let voltage_time_total = parseFloat( $("#smu_time_total"+suffix)[0].value );
  if (! voltage_time_total || voltage_time_total <= 0){
    show_error("Invalid SMU total time");
    $('#myerror_popup_smu_t_total'+suffix)[0].classList.remove('myhide');
    return;
  }

  let myprofile = recovery ? voltage_profile_array_rec : voltage_profile_array;

  if(myprofile.length == 0){
    show_error("Empty SMU voltage profile");
    $('#myerror_popup_smu_v_profile'+suffix)[0].classList.remove('myhide');
    return;
  }

  let voltage_amp_factor = parseFloat( $("#smu_voltage_factor"+suffix)[0].value );
  if (! voltage_amp_factor || voltage_amp_factor <= 0){
    show_error("Invalid SMU amplitude factor");
    $('#myerror_popup_smu_v_factor'+suffix)[0].classList.remove('myhide');
    return;
  }

  while (curr_t < voltage_time_total){
    for (let vol_i = 0; vol_i < myprofile.length; vol_i ++){
      newdataset.push({x: curr_t, y: myprofile[vol_i]*voltage_amp_factor});
      newdataset.push({x: curr_t+voltage_time_step, y: myprofile[vol_i]*voltage_amp_factor});
      curr_t += voltage_time_step;
    }
  }
  smu_v_example_chart.data.datasets[0].data.length = 0;
  smu_v_example_chart.data.datasets[0].data = newdataset
  smu_v_example_chart.update();
}

function draw_pixel_map_example(){
  function descrToCoords(descr){
    let pin = parseInt(descr[1]);
    switch (descr[0]){
        case 'R': return [1+pin-0.25, 0];
        case 'G': return [0, 1+pin -0.25];
        case 'B': return [8-pin + 0.25, 0];
        case 'O': return [0, 8-pin + 0.25];
    }
  }
  $('.mybig_popup').css('display','block');
  $('#my-pixel-map-example').css('display','block');
  $('#my-smu-voltage-example').css('display','none');
  // console.log(pixel_map_examp_chart.chart.datasets);
  pixel_map_examp_chart.chart.data.datasets.length = 4;
  let pixel_loop = update_verification_table();
  if (pixel_loop.err){
    show_error("Check verification table");
    return;
  }
  maxcurrent = Math.max(...pixel_loop.loop.map(pixel => pixel['curr']));
  console.log(maxcurrent)
  newdata = [];
  newbgcolors = [];
  for (let i = 0; i < pixel_loop.loop.length; i++){
    newcoordsext = descrToCoords(pixel_loop.loop[i]["ext"]);
    newcoordsinn = descrToCoords(pixel_loop.loop[i]["inn"]);
    // console.log(newcoordsext, newcoordsinn)
    newdata.push({x: newcoordsext[0] + newcoordsinn[0], y: newcoordsext[1] + newcoordsinn[1], r:5});
    newbgcolors.push('rgba(75,73,172,'+(pixel_loop.loop[i]['curr']/maxcurrent) + ')')
    // newbgcolors.push('rgb(75,73,'+Math.round(172*pixel_loop.loop[i]['curr']/maxcurrent)+')')
    console.log(newbgcolors[newbgcolors.length-1])
  }
  console.log(newbgcolors)
  newdataset = {
    'label': 'Data',
    'data': newdata,
    'pointBackgroundColor': newbgcolors,
    'pointBorderColor': newbgcolors,
    'fillColor': newbgcolors,
    'backgroundColor': newbgcolors
  }
  // console.log(pixel_map_examp_chart.chart.datasets)
  pixel_map_examp_chart.chart.data.datasets.push(newdataset);
  pixel_map_examp_chart.update();
  // 
}