document.addEventListener("DOMContentLoaded", function() {
  const input = document.getElementById("query");
  const dictContainer = document.getElementById("dict_container");
  const emailsDepartament = document.getElementById("emails_departament");
  let departaments = departamentsData;

  input.addEventListener("input", function() {
      const query = input.value.toLowerCase().trim();
      filterDepartaments(query);
  });

  function filterDepartaments(query) {
      dictContainer.innerHTML = "";
      let filteredDepartaments = [];

      // Фильтруем данные на клиенте
      departaments.forEach(dept => {
          const matchesDept = dept.name.toLowerCase().includes(query);
          const filteredContacts = dept.contacts.filter(contact => {
              return Object.values(contact).some(value =>
                  String(value).toLowerCase().includes(query)
              );
          });

          if (matchesDept || filteredContacts.length > 0) {
              filteredDepartaments.push({
                  name: dept.name,
                  contacts: matchesDept ? dept.contacts : filteredContacts
              });
          }
      });

      // Сортируем, чтобы "Администрация" была первой
      filteredDepartaments.sort((a, b) => {
          if (a.name.toLowerCase() === "администрация") return -1;
          if (b.name.toLowerCase() === "администрация") return 1;
          return 0;
      });

      // Если есть запрос, скрываем блок с почтами для рассылок
      if (query !== "") {
          emailsDepartament.style.display = "none";
      } else {
          emailsDepartament.style.display = "block";
      }

      // Генерация HTML с анимацией
      filteredDepartaments.forEach(dept => {
          const deptContainer = document.createElement("div");
          deptContainer.className = "departament_container";

          const deptName = document.createElement("div");
          deptName.className = "departament_name_container";
          deptName.textContent = dept.name;
          deptContainer.appendChild(deptName);

          const contactsContainer = document.createElement("div");
          contactsContainer.className = "departament_contacts_container";

          const table = document.createElement("table");
          table.className = "table_contacts";

          const thead = document.createElement("thead");
          thead.innerHTML = `
              <tr>
                  <th class="Employee">Сотрудник</th>
                  <th class="Post">Должность</th>
                  <th class="Email">Почта</th>
                  <th class="ExtensionPhone">Внутренний номер телефона</th>
                  <th class="Phone">Номер телефона</th>
              </tr>
          `;
          table.appendChild(thead);

          const tbody = document.createElement("tbody");

          dept.contacts.forEach((contact, index) => {
              const tr = document.createElement("tr");
              tr.className = "contact_row animate-slide-down";
              tr.style.animationDelay = `${index * 0.1}s`; // Задержка для последовательности
              tr.innerHTML = `
                  <td>${contact[1]}</td>
                  <td>${contact[2]}</td>
                  <td>${contact[3]}</td>
                  <td>${contact[5]}</td>
                  <td>${contact[6]}</td>
              `;
              tbody.appendChild(tr);
          });

          table.appendChild(tbody);
          contactsContainer.appendChild(table);
          deptContainer.appendChild(contactsContainer);
          dictContainer.appendChild(deptContainer);
      });
  }

  // Инициализация анимации при загрузке страницы
  filterDepartaments("");
});