var form = document.getElementById("form");
var input = document.getElementById("query");
var body = document.getElementById("dict_container"); 
input.addEventListener("input", function() {
  var query = input.value;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/search?query=" + query);
  xhr.onload = function() {
    if (xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response.length);
      body.innerHTML = "";
      var departament_container = ``;
      for (var i = 0; i < response.length; i++){
        departament_container += `
        <div class="departament_container">
          <div class="departament_name_container">
            ${response[i]["name"]}
          </div>
          <div class="departament_contacts_container">
            <table id="table_contacts">
                <thead>
                    <tr>
                        <th>Сотрудник</th>
                        <th>Должность</th>
                        <th>Почта</th>
                        <th>Внутреннний номер телефона</th>
                        <th>Номер телефона</th>
                    </tr>
                </thead>`;
        for (var j = 0; j < response[i]["contacts"].length; j++){
          departament_container += `
          <tr class="table_contacts_container">
            <th>${response[i]["contacts"][j][1]}</th>
            <th>${response[i]["contacts"][j][2]}</th>
            <th>${response[i]["contacts"][j][3]}</th>
            <th>${response[i]["contacts"][j][5]}</th>
            <th>${response[i]["contacts"][j][6]}</th>
          </tr>
          `
        }
        departament_container+= "</table></div></div>";
      }
    console.log(departament_container);
    body.innerHTML += departament_container;
    }
  };
  xhr.send();
});
