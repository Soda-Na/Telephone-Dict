// Функция дебаунса
function debounce(func, delay) {
  let timeout;
  return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

document.addEventListener("DOMContentLoaded", function() {
  const input = document.getElementById("query");
  const dictContainer = document.getElementById("dict_container");
  const emailsDepartament = document.getElementById("emails_departament");
  let departaments = departamentsData;

  // Обработка ввода с дебаунсом 300ms
  input.addEventListener("input", debounce(function() {
      const query = input.value.toLowerCase().trim();
      filterDepartaments(query);
  }, 300));

  function filterDepartaments(query) {
      dictContainer.innerHTML = "";
      let filteredDepartaments = [];

      // Фильтрация данных
      departaments.forEach(dept => {
          const matchesDept = dept.name.toLowerCase().includes(query);
          const filteredContacts = dept.contacts.filter(contact => {
              return Object.values(contact).some(value => String(value).toLowerCase().includes(query));
          });

          if (matchesDept || filteredContacts.length > 0) {
              filteredDepartaments.push({
                  name: dept.name,
                  contacts: matchesDept ? dept.contacts : filteredContacts
              });
          }
      });

      // Сортировка
      filteredDepartaments.sort((a, b) => {
          if (a.name.toLowerCase() === "администрация") return -1;
          if (b.name.toLowerCase() === "администрация") return 1;
          return 0;
      });

      // Управление видимостью блока почт для рассылок
      emailsDepartament.style.display = query !== "" ? "none" : "block";

      // Генерация HTML без анимаций
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
          dept.contacts.forEach(contact => {
              const tr = document.createElement("tr");
              tr.className = "contact_row";
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

      // Запуск анимации после генерации DOM
      requestAnimationFrame(() => {
          const contactRows = dictContainer.querySelectorAll(".contact_row");
          contactRows.forEach((row, index) => {
              setTimeout(() => {
                  row.classList.add("visible");
              }, index * 100); // Задержка для последовательности
          });
      });
  }

  // Инициализация анимации при загрузке страницы
  filterDepartaments("");
});