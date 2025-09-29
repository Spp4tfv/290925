
const passwordLengthInput = document.getElementById('passwordLength');
const specialCharsInput = document.getElementById('specialChars');
const digitsInput = document.getElementById('digits');
const lettersInput = document.getElementById('letters');
const passwordDisplay = document.getElementById('passwordDisplay');
const generateBtn = document.getElementById('generateBtn');
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeModal = document.getElementById('closeModal');
const passwordList = document.getElementById('passwordList');
const clearHistoryBtn = document.getElementById('clearHistory');
const lengthError = document.getElementById('lengthError');

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '0123456789';
const specialChars = '@#+-()?';

let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

function updateLettersField() {
    const length = parseInt(passwordLengthInput.value) || 0;
    const special = parseInt(specialCharsInput.value) || 0;
    const digitsCount = parseInt(digitsInput.value) || 0;
    
    const lettersCount = length - special - digitsCount;
    lettersInput.value = Math.max(0, lettersCount);
    
    if (lettersCount < 0) {
        lettersInput.style.backgroundColor = '#ffcccc';
    } else {
        lettersInput.style.backgroundColor = '';
    }
}

passwordLengthInput.addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 4 || value > 50) {
        lengthError.style.display = 'block';
        this.style.borderColor = '#dc3545';
    } else {
        lengthError.style.display = 'none';
        this.style.borderColor = '#ddd';
    }
    updateLettersField();
});

specialCharsInput.addEventListener('input', updateLettersField);
digitsInput.addEventListener('input', updateLettersField);

function generatePassword() {
    const length = parseInt(passwordLengthInput.value);
    const specialCount = parseInt(specialCharsInput.value);
    const digitsCount = parseInt(digitsInput.value);
    const lettersCount = parseInt(lettersInput.value);
    
    if (length < 4 || length > 50) {
        passwordDisplay.textContent = 'Ошибка: длина должна быть от 4 до 50 символов';
        return;
    }
    
    if (specialCount + digitsCount + lettersCount !== length) {
        passwordDisplay.textContent = 'Ошибка: сумма символов не соответствует длине пароля';
        return;
    }
    
    let password = '';
    
    for (let i = 0; i < specialCount; i++) {
        const randomIndex = Math.floor(Math.random() * specialChars.length);
        password += specialChars[randomIndex];
    }
    
    for (let i = 0; i < digitsCount; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        password += digits[randomIndex];
    }
    
    for (let i = 0; i < lettersCount; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        password += letters[randomIndex];
    }
    
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    passwordDisplay.textContent = password;
    
    passwordHistory.push(password);
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
}

function displayPasswordHistory() {
passwordList.innerHTML = '';
    
    if (passwordHistory.length === 0) {
        passwordList.innerHTML = '<li class="password-item">История паролей пуста</li>';
        return;
    }
    
    passwordHistory.slice().reverse().forEach((password, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'password-item';
        
        const passwordSpan = document.createElement('span');
        passwordSpan.textContent = password;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Копировать';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(password)
                .then(() => {
                    copyBtn.textContent = 'Скопировано!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Копировать';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Ошибка копирования: ', err);
                });
        });
        
        listItem.appendChild(passwordSpan);
        listItem.appendChild(copyBtn);
        passwordList.appendChild(listItem);
    });
}

function clearHistory() {
    passwordHistory = [];
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    displayPasswordHistory();
}

generateBtn.addEventListener('click', generatePassword);

historyBtn.addEventListener('click', () => {
    displayPasswordHistory();
    historyModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

clearHistoryBtn.addEventListener('click', clearHistory);

window.addEventListener('click', (event) => {
    if (event.target === historyModal) {
        historyModal.style.display = 'none';
    }
});
updateLettersField();