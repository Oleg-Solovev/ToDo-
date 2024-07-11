// Приложение для создания списка дел todo-app

(function () {

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

    // Создаём и возвращаем элемент для списка дел
    function createTodoItemElement(todoObj, { onDone, onDelete }) {
        const doneClass = 'list-group-item-success';
        let item = document.createElement('li');
        // Группа кнопок
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // Стили для элемента списка и размещения кнопок в правой части
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = todoObj.name;

        // Если выбрано значение "true" - красим элемент зеленым цветом
        if (todoObj.done) {
            item.classList.add(doneClass);
        };
        // Добавление классов для кнопок
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // Добавляем обработчика на кнопку "Готово"
        doneButton.addEventListener('click', () => {
            onDone({ todoObj, element: item });
            item.classList.toggle(doneClass, todoObj.done);
        });

        // Добавляем обработчика на кнопку "Удалить"
        deleteButton.addEventListener('click', () => {
            onDelete({ todoObj, element: item });
        });

        // Вкладываем кнопки в отдельный блок
        buttonGroup.append(doneButton, deleteButton);
        // buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return item;
    }

    // Первая функция при запуске приложения. Создаём список дел
    async function createTodoApp(container, title, owner) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoListUl = createTodoList();
        const handlers = {
            onDone({ todoObj }) {
                todoObj.done = !todoObj.done;
                fetch(`http://localhost:3000/api/todos/${todoObj.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ done: todoObj.done }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            },
            onDelete({ todoObj, element }) {
                if (!confirm('Вы уверены?')) {
                    return;
                }
                element.remove();
                fetch(`http://localhost:3000/api/todos/${todoObj.id}`, {
                    method: 'DELETE',
                });
            }
        };

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoListUl);

        //  Запрос на сервер загружаем список дел
        const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        const todoItemList = await response.json();

        todoItemList.forEach(todoItem => {
                const todoItemElement = createTodoItemElement(todoItem, handlers);
                todoListUl.append(todoItemElement);
        });

        // Проверка в консоли
        console.log(todoList);


        // Создание события браузером на форме после нажатия на Enter или кнопку создания дела
        todoItemForm.form.addEventListener('submit', async e => {
            // Строка ниже отменяет перезагрузку браузером страницы при отправке формы
            e.preventDefault();

            // Если поле ввода осталось пустым, игнорируем создание дела
            if (!todoItemForm.input.value) {
                return;
            };

            // Создание дела в виде объекта
            let todoObj = {
                id: Math.round(Math.random() * 1000),
                name: todoItemForm.input.value.trim(),
                done: false,
                owner,
            };

            //  Запрос на сервер сохраняем дело
            const response = await fetch('http://localhost:3000/api/todos', {
                method: 'POST',
                body: JSON.stringify(todoObj),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            // Возвращаем дело с сервера
            const todoItem = await response.json();

            // Создаем и добавляем в список новый элемент дела с данными с сервера
            const todoItemElement = createTodoItemElement(todoItem, handlers);
            todoListUl.append(todoItemElement);
            // Очистка поля от значения
            todoItemForm.input.value = '';

            // Проверка в консоли
            console.log(todoList);

        });

    }

    let todoList = [];
    window.createTodoApp = createTodoApp;

})();


