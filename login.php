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


$login = $_POST['login'] ?? '';
$password = $_POST['password'] ?? '';

// Проверка логина и пароля
if (!empty($login) && !empty($password)) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE login = :login");
    $stmt->execute(['login' => $login]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode(['success' => true, 'message' => 'Успешный вход']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Неверный логин или пароль']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Логин и пароль обязательны']);
}
?>
