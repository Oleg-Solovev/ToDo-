// Приложение для создания списка дел todo-app

(function () {

    let todoList = [];

    // Создаём и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }


    // Создаём и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        // Установка атрибута disabled
        button.setAttribute('disabled', true);
        // Отмена атрибута disabled при вводе текста
        input.oninput = function () {
            if (input.value.length > 0) {
                button.removeAttribute("disabled");
            }
        }

        // возврат по отдельности для доступа к каждому элементу
        return {
            form,
            input,
            button,
        }
    }


    // Создаём и возвращаем список для элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // Сохраняем массив дел в LS 
    function saveInLocalStorage(name, data) {
        localStorage.setItem(name, JSON.stringify(data));
    }

    // Загружаем массив дел из LS 
    function downloadFromLocalStorage(name) {
        // Получаем данные в виде строки из LS
        let data = localStorage.getItem(name);
        // Если есть данные в LS - парсим, если нет - возвращаем пустой массив
        return data ? JSON.parse(data) : [];
    }


    // Создаём и возвращаем элемент для списка дел
    function createTodoItem(obj, listName) {
        let item = document.createElement('li');

        // Группа кнопок
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // Стили для элемента списка и размещения кнопок в правой части
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;
        // Если выбрано значение "true" - красим элемент зеленым цветом
        if (obj.done) {
            item.classList.add('list-group-item-success')
        };
        // Добавление классов для кнопок
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // Добавляем обработчика на кнопку "Готово"
        doneButton.addEventListener('click', function () {
            if (obj.done) {
                item.classList.remove('list-group-item-success');
                obj.done = false;
            } else {
                item.classList.add('list-group-item-success');
                obj.done = true;
            };
            let objList = downloadFromLocalStorage(listName);
            for (i = 0; i < objList.length; i++) {
                if (obj.id === objList[i].id) {
                    objList[i].done = obj.done;
                    saveInLocalStorage(listName, objList);
                }
            }
            console.log(objList);
        });

        // Добавляем обработчика на кнопку "Удалить"
        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                item.remove();
                // Загружаю, изменяю и снова записываю в LS массив при удалении дела
                let objList = downloadFromLocalStorage(listName);
                todoList = objList.filter(el => el.id !== obj.id)
                saveInLocalStorage(listName, todoList);
            }
        });


        // Вкладываем кнопки в отдельный блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // Делаем доступ к элементу и кнопкам, чтобы отрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    // Первая функция при запуске приложения. Создаём список дел
    function createTodoApp(container, title = 'Список дел', listName = "") {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoListUl = createTodoList();


        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoListUl);


        // Загружаем массив дел из LS
        todoList = downloadFromLocalStorage(listName);


        // Создаём и возвращаем элементы из массива LS
        for (let todoObj of todoList) {
            todoListUl.append(createTodoItem(todoObj, listName).item);
        }

        // Проверка в консоли
        console.log(todoList);


        // Создание события браузером на форме после нажатия на Enter или кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e) {
            // Строка ниже отменяет перезагрузку браузером страницы при отправке формы
            e.preventDefault();

            // Если поле ввода осталось пустым, игнорируем создание элемента
            if (!todoItemForm.input.value) {
                return;
            };

            // Создание дела в виде объекта
            let todoObj = {
                id: Math.round(Math.random() * 1000),
                name: todoItemForm.input.value,
                done: false,
            }

            // Добавляем дело в список и сохраняем в LS
            todoList.push(todoObj);
            saveInLocalStorage(listName, todoList);

            // Создаем и добавляем в список новое дело с названием из поля ввода
            todoItem = createTodoItem(todoObj, listName);
            todoListUl.append(todoItem.item);
            // Очистка поля от значения
            todoItemForm.input.value = '';

            // Проверка в консоли
            console.log(todoList);

        });

    }

    window.createTodoApp = createTodoApp;

})();


