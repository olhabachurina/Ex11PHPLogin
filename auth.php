<?php
// Подключение к базе данных
$dsn = 'mysql:host=localhost;dbname=user_registration;charset=utf8';
$username = 'root';
$password = '';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка подключения к базе данных']);
    exit();
}

// Получение типа запроса (вход или регистрация)
$action = $_POST['action'] ?? '';
$login = $_POST['login'] ?? '';
$password = $_POST['password'] ?? '';

if ($action === 'register') {
    // Проверка на уникальность логина
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE login = :login");
    $stmt->execute(['login' => $login]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Логин уже занят']);
    } else {
        // Хеширование пароля и добавление нового пользователя
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (login, password) VALUES (:login, :password)");
        $stmt->execute(['login' => $login, 'password' => $hashedPassword]);
        echo json_encode(['success' => true, 'message' => 'Вы успешно зарегистрированы']);
    }
} elseif ($action === 'login') {
    // Проверка логина и пароля для входа
    $stmt = $pdo->prepare("SELECT * FROM users WHERE login = :login");
    $stmt->execute(['login' => $login]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode(['success' => true, 'message' => 'Успешный вход']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Неверный логин или пароль']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Неправильное действие']);
}
?>