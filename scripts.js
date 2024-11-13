document.addEventListener('DOMContentLoaded', () => {
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');
    const form = document.getElementById('loginForm');
    const toast = document.getElementById('toast');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const rememberMeContainer = document.getElementById('rememberMeContainer');
    let action = 'login';

    // Массив цветов для пузырей
    const bubbleColors = [
        'rgba(173, 216, 230, 0.6)', // светло-голубой
        'rgba(255, 182, 193, 0.6)', // светло-розовый
        'rgba(144, 238, 144, 0.6)', // светло-зеленый
        'rgba(255, 255, 224, 0.6)', // светло-желтый
        'rgba(221, 160, 221, 0.6)', // светло-фиолетовый
        'rgba(135, 206, 250, 0.6)', // светло-синий
    ];

    //  Создаем пузыри с рандомным цветом
    function createBubble() {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");


        const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
        bubble.style.backgroundColor = color;

        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.width = `${Math.random() * 60 + 20}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.animationDuration = `${Math.random() * 10 + 5}s`;
        document.querySelector(".bubble-background").appendChild(bubble);


        bubble.addEventListener("animationend", () => {
            bubble.remove();
        });
    }


    setInterval(createBubble, 1500);

    // Функция для отображения уведомления
    function showToast(message, type) {
        toast.textContent = message;
        toast.className = 'toast show ' + (type === 'success' ? 'success' : 'error');
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    // Переключение между вкладками Вход и Регистрация
    loginTab.addEventListener('click', () => {
        action = 'login';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        rememberMeContainer.style.display = 'flex';
        loginMessage.textContent = ''; // Очистка сообщений при переключении
    });

    registerTab.addEventListener('click', () => {
        action = 'register';
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        rememberMeContainer.style.display = 'none';
        loginMessage.textContent = ''; // Очистка сообщений при переключении
    });

    // Проверка уникальности логина только при регистрации
    loginInput.addEventListener('input', function() {
        if (action === 'register') {
            const login = loginInput.value.trim();

            if (login.length > 0) {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', 'check_login.php', true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);

                        if (response.available) {
                            loginMessage.textContent = 'Логин доступен';
                            loginMessage.style.color = 'green';
                        } else {
                            loginMessage.textContent = 'Логин уже занят';
                            loginMessage.style.color = 'red';
                        }
                    } else {
                        console.error('Ошибка сервера при проверке логина.');
                    }
                };

                xhr.onerror = function() {
                    console.error('Ошибка сети при проверке логина.');
                };

                xhr.send('login=' + encodeURIComponent(login));
            } else {
                loginMessage.textContent = '';
            }
        } else {
            loginMessage.textContent = ''; // Сброс сообщения при входе
        }
    });


    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const login = loginInput.value.trim();
        const password = passwordInput.value;


        if (login.length === 0 || password.length < 6) {
            showToast('Пожалуйста, введите корректные данные', 'error');
            return;
        }

        // AJAX-запрос на регистрацию или вход
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'auth.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    showToast(response.message, 'success');

                    if (action === 'register') {
                        // Очистка формы после успешной регистрации
                        loginMessage.textContent = '';
                        loginInput.value = '';
                        passwordInput.value = '';

                        // Автоматическое переключение на режим входа после регистрации
                        action = 'login';
                        loginTab.classList.add('active');
                        registerTab.classList.remove('active');
                        rememberMeContainer.style.display = 'flex';

                        // Обновляем текст кнопки на "Войти"
                        form.querySelector('button[type="submit"]').textContent = 'Войти';
                    }
                } else {
                    showToast(response.message, 'error');
                }
            } else {
                console.error('Ошибка сервера при отправке формы.');
            }
        };

        xhr.onerror = function() {
            showToast('Ошибка сети. Попробуйте снова.', 'error');
        };

        xhr.send('action=' + action + '&login=' + encodeURIComponent(login) + '&password=' + encodeURIComponent(password));
    });
});