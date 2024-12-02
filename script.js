// Настройки AWS SDK
AWS.config.update({
    region: 'eu-west-2', // Укажите ваш регион
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // Ваш Identity Pool ID
    })
});

const cognito = new AWS.CognitoIdentityServiceProvider();
const s3 = new AWS.S3();

document.getElementById('sign-up-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const params = {
        ClientId: '6qs2idtr2q3fhs5tfiapub7ilf', // Укажите Client ID из Cognito
        Username: username,
        Password: password,
        UserAttributes: [
            { Name: 'email', Value: email }
        ]
    };

    cognito.signUp(params, function (err, data) {
        if (err) {
            alert('Ошибка регистрации: ' + err.message);
        } else {
            alert('Регистрация прошла успешно!');
        }
    });
});

document.getElementById('sign-in-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: '6qs2idtr2q3fhs5tfiapub7ilf', // Укажите Client ID из Cognito
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    };

    cognito.initiateAuth(params, function (err, data) {
        if (err) {
            alert('Ошибка входа: ' + err.message);
        } else {
            alert('Вход прошел успешно!');
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityId: data.AuthenticationResult.IdToken
            });

            // Показать возможность загрузки файла
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('upload-container').style.display = 'block';
        }
    });
});

function uploadFile() {
    const file = document.getElementById('file-upload').files[0];
    const params = {
        Bucket: 'ali.45', // Укажите ваш S3 bucket
        Key: file.name,
        Body: file,
        ContentType: file.type,
        ACL: 'public-read' // Укажите права доступа
    };

    s3.upload(params, function (err, data) {
        if (err) {
            alert('Ошибка загрузки файла: ' + err.message);
        } else {
            alert('Файл успешно загружен: ' + data.Location);
        }
    });
}
