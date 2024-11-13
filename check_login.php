<?php
// Подключение к базе данных
$dsn = 'mysql:host=localhost;dbname=user_registration;charset=utf8';
$username = 'root';
$password = '';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Ошибка подключения к базе данных: ' . $e->getMessage()]));
}

// Получаем логин из запроса
if (isset($_POST['login'])) {
    $login = trim($_POST['login']);

    // Проверка, существует ли логин в базе данных
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE login = :login");
    $stmt->execute(['login' => $login]);
    $exists = $stmt->fetchColumn() > 0;

    // Отправляем JSON-ответ
    echo json_encode(['available' => !$exists]);
} else {
    echo json_encode(['error' => 'Логин не передан']);
}
?>
