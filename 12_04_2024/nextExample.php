<?php
if (!isset($_COOKIE['hits'])) {
    $ile = 1;
} else {
    $ile = (int)$_COOKIE['hits'];
    if ($ile < 1)
        $ile = 1;
    $ile++;
}
setcookie("hits", $ile);
?>

<!DOCTYPE html>
<html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale.0">
        <title>Licznik odwiedzin - cookie</title>
    </head>
    <body>
        <p>
            <?php
            if ($ile == 1)
                $str = "raz";
            else
                $str = "razy";
            echo "Witamy, odwiedziłes nas $ile $str.";
            ?>
        </p>
    </body>
</html>