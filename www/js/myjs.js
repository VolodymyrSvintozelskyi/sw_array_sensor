var drake =  window.dragula();
updatedragula = (function() {
  if (drake){
    drake.destroy();
  }
  drake = dragula([].slice.apply(document.querySelectorAll('.myloop_nested')));
});

function updatemaxheight_verification(){
  let newvalue = parseInt($("#mycommutator_card").css("height")) - parseInt($("#mysmu_card").css("height")) - parseInt($("#mysmu_card").css("margin-bottom"));
  $("#myverification_card").css("max-height", newvalue);
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
addFileHandler('current_profile_text_path', 'current_profile_text_button', 'current_profile_text_input');

// function update_relay_com_ports_callback(pars){
//   console.log(pars)
// }

document.getElementById("update_relay_com_ports").addEventListener('click',function (){
  eel.getComPortList()().then((ports) => {
    select = $("#relay_com_ports_select")[0];
    select.innerHTML = "";
    ports.forEach(port => {
      opt = document.createElement('option');
      opt.value = port;
      opt.innerHTML = port;
      select.appendChild(opt);
    });
  }); 
} );

function myloop_del_node(but){
  console.log("del");
  but.closest(".myloop_node").remove();
  updatedragula();
}

function myloop_add_loop(type){
  if (type=="external"){
    shorttype = "ext";
    title = "External";
  }else{
    shorttype = "inn";
    title = "Inner";
  }
  var html_loop = `
    <div class="myloop_item myloop_node myloop_type_${shorttype}" onmouseup="update_verification_table()">
      <div class="form-group row col-sm-10">
        <div class="row  col-sm-12">
          <h6 class="col-sm-11 col-form-label">${title} BNC pin loop</h6>
        </div>
        <div class="row col-sm-12">
          <div class="input-group col-sm-4">
            <div class="input-group-prepend">
              <span class="input-group-text">From:</span>
            </div>
            <input type="number" class="form-control dis-arrows myloop_bus_from" min="0" max="7" onfocusout="update_verification_table()">
          </div>
          <div class="input-group col-sm-3">
            <div class="input-group-prepend">
              <span class="input-group-text">To:</span>
            </div>
            <input type="number" class="form-control dis-arrows myloop_bus_to" min="0" max="7" onfocusout="update_verification_table()">
          </div>
          <div class="input-group col-sm-4">
            <div class="input-group-prepend">
              <span class="input-group-text">Step:</span>
            </div>
            <input type="number" class="form-control dis-arrows myloop_bus_step" min="-7" max="7" onfocusout="update_verification_table()">
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
  container = $(".myloop_container_nested")[0];
  $(container).append($.parseHTML(html_loop));
  updatedragula();
}

function myloop_add_bus(){
  var html_loop = `
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
            <option value="B">Blue</option>
            <option value="G">Green</option>
            <option value="R">Red</option>
            <option value="O">Orange</option>
          </select>
        </div>
        <div class="input-group col-sm-5">
          <div class="input-group-prepend">
            <span class="input-group-text bg-danger text-white">Inner:</span>
          </div>
          <select class="form-control myloop_buscoon_inn">
            <option value="B">Blue</option>
            <option value="G">Green</option>
            <option value="R">Red</option>
            <option value="O">Orange</option>
          </select>
        </div>
        <button type="button" class="btn btn-outline-danger btn-icon col-sm-1"  onclick="myloop_del_node(this);">
          <i class="ti-trash"></i>
        </button>
      </div>
    </div>
  </div>
  `;
  container = $(".myloop_container_nested")[0];
  $(container).append($.parseHTML(html_loop));
  updatedragula();
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
  let tree = gen_loop_tree();
  if (! tree) return;
  let tabl_body = $("#myverification_tabl_body");
  tabl_body.empty();
  let pixel_id = 0;
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
            let current = pixel_id;
            pixel_id++;
            let status = "Ok";
            let html_status = `<div class="badge badge-success">Ok</div>`;
            if (status != "Ok") html_status = `<div class="badge badge-danger">Oops!</div>`;
            let html_line = `<tr>
              <!-- <td>${externalpin}</td> -->
              <td><div class="badge badge-${getPinColor(thirdnode.ext)}">${externalpin}</div></td>
              <td><div class="badge badge-${getPinColor(thirdnode.inn)}">${innerpin}</div></td>
              <td>${current}</td>
              <td class="font-weight-medium">${html_status}</td>
            </tr>`;
            $(tabl_body).append($.parseHTML(html_line));
          }
        }
      }
    }
  }
  $("#myverification_counter")[0].innerHTML = pixel_id;
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
    console.log(bus['ext'] + bus['inn']);
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
  // console.log(hasrootnode + " " + hassecondnode + " " + hasthirdnode);
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
    console.log(error);
    return false;
  }else{
    hide_error();
  }
  return tree;
  // console.log(container);
  // console.log(find_nested_loop_entries(container));
  // console.log( container.find( ".myloop_item" ));
}

