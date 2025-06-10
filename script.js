document.addEventListener('DOMContentLoaded', () => {
    const BOARD_SIZE = 5;
    const MAX_ATTEMPTS = 6;
    let currentRow = 0;
    let currentTile = 0;
    let gameOver = false;
    let word = '';
    
    const WORDS = [
        "ABRIR", "ADEUS", "ADEGA", "ADORA", "AFINS", "AFIAR", "AGITO", "ALMAS", "ALTOS",
        "AMADO", "AMIGA", "AMIGO", "ANJOS", "ANTES", "APITA", "ARMAS", "ASSAR", "ATUAL", "ATIRO",
        "ATUAL", "ATRAS", "AVISO", "AZULI", "BAIXO", "BALDE", "BALAS", "BANHO", "BARCO",
        "BEBER", "BEIRA", "BEIJO", "BLOCO", "BODES", "LAGOA", "BONUS", "BOTAR",
        "BRISA", "BRUXA", "BURRO", "CABOS", "CACAU", "CACHO", "CAIXA", "CAMPO", "CANIL", "CASPA",
        "CARRO", "CASAL", "CARTA", "CEGOS", "CENAS", "CENHO", "CERTO", "CHATA", "CHUVA", "CINZA",
        "CLIMA", "CLOUD", "COISA", "COMUM", "CORPO", "CORAL", "COSTA", "CREME", "CUBOS", "CULPA",
        "DANÇA", "DEDOS", "DEITA", "DENTE", "DICAS", "DIZER", "DOCES", "DORES", "DOZES", "PRAGA",
        "DUETO", "EDUCA", "EGITO", "ELITE", "EMAIL", "ENTAO", "ENTRE", "ERROS", "ESCOL", "ESSES",
        "EXATO", "FALTA", "FALAR", "FELIZ", "FERIR", "FESTA", "FICAR", "FILHO", "FIZER",
        "FOLHA", "FRACO", "FREIO", "FUNDO", "GANHO", "GARFO", "GATOS", "GIROU", "GIRAR",
        "GOSTO", "GRITO", "GLOSS", "HINOS", "HORAS", "HOTEL", "IDEAL", "IGUAL", "LEIGA", "INDIO",
        "JANTA", "JOGOS", "JOVEM", "JULHO", "JUNHO", "LADOS", "LARGO", "LATIM", "LEITE", "LIMAO",
        "LINDO", "LINHA", "LOUCO", "MACAS", "MAGIA", "MALAS", "MANTO", "MARCO", "MEDIR", "MEDOS",
        "MELAO", "MENTE", "METRO", "MEXER", "MODOS", "MONTE", "MORRO", "MORTE", "MOTOR", "NADAR",
        "NASCE", "NEVEA", "NINJA", "NOITE", "NORTE", "NORMA", "NORTE", "NOVAS", "NOVOS", "NUNCA",
        "OBRAS", "OCUPA", "OGUMS", "OJETE", "OLHAR", "ONTEM", "OPACO", "ORDEN", "ORGUL", "OSSOS",
        "OVOES", "PAGAR", "PALMA", "PALAV", "PAPEL", "PARAR", "PARDE", "PASTA", "PEDRA", "PEGAR",
        "PENAL", "PERDA", "PERTO", "PISTA", "PLENA", "PODER", "PONTA", "PORTA", "POUCO", "PRATO",
        "PRETO", "PRIME", "PRISA", "PROVA", "PULSO", "QUASE", "QUEDA", "QUERO", "QUIET",
        "RAIVA", "RANGO", "RESTA", "REVES", "RIMAS", "RISCO", "RISOS", "ROMPE", "RONDA", "ROSAI",
        "SABER", "SABOR", "SAFRA", "SALTO", "SAMBA", "SAUDA", "SAUDE", "SENHA", "SINAL", "SOBRE",
        "SONHO", "SONSA", "SORRI", "SARRO", "SUAVE", "TANTO", "TARDE", "TERÇO", "TERMO", "TERRA",
        "TINHA", "TIPOS", "TIRAR", "TIRAS", "TIGRE", "TODOS", "TOQUE", "TRAMA", "TRAVO", "TREVO",
        "TREZE", "TRIBO", "TROCA", "TROPA", "TROTE", "TULIO", "TUMOR", "TUPIS", "TURVO", "UNHAS",
        "URUBU", "VALER", "VALOR", "VELHA", "VELHO", "VERBO", "VERDE", "VESTE", "VIRAR", "VIVER",
        "VISTA", "VITOR", "VOZES", "VULTO", "XADRE", "XAMÃS", "ZANGÃ", "ZEBRA", "ZONAS"
      ];
      
    
    word = WORDS[Math.floor(Math.random() * WORDS.length)];
    console.log('Palavra secreta:', word);
    
    const board = document.getElementById('board');
    
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'board-row';
        
        for (let j = 0; j < BOARD_SIZE; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-state', 'empty');
            tile.setAttribute('data-index', `${i}-${j}`);
            row.appendChild(tile);
        }
        
        board.appendChild(row);
    }
    
    const keyboardButtons = document.querySelectorAll('.keyboard button');
    keyboardButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (gameOver) return;
            
            const key = button.textContent;
            
            if (key === '⌫') {
                deleteLetter();
            } else if (key === 'Enter') {
                submitGuess();
            } else {
                insertLetter(key);
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        if (e.key === 'Backspace') {
            deleteLetter();
        } else if (e.key === 'Enter') {
            submitGuess();
        } else if (/^[A-Za-z]$/.test(e.key)) {
            insertLetter(e.key.toUpperCase());
        }
    });
    
    function insertLetter(letter) {
        if (currentTile >= BOARD_SIZE) return;
        
        const tile = document.querySelector(`[data-index="${currentRow}-${currentTile}"]`);
        tile.textContent = letter;
        tile.setAttribute('data-state', 'tentative');
        currentTile++;
    }
    
    function deleteLetter() {
        if (currentTile <= 0) return;
        
        currentTile--;
        const tile = document.querySelector(`[data-index="${currentRow}-${currentTile}"]`);
        tile.textContent = '';
        tile.setAttribute('data-state', 'empty');
    }
    
    function submitGuess() {
        if (currentTile !== BOARD_SIZE) {
            showMessage('Palavra incompleta!');
            return;
        }
        
        let guess = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            const tile = document.querySelector(`[data-index="${currentRow}-${i}"]`);
            guess += tile.textContent;
        }
        
        if (!WORDS.includes(guess)) {
            showMessage('Palavra não conhecida!');
            return;
        }
        
        checkGuess(guess);
    }
    
    function checkGuess(guess) {
        const wordArray = word.split('');
        const guessArray = guess.split('');
        const result = [];
        
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (guessArray[i] === wordArray[i]) {
                result[i] = 'correct';
                wordArray[i] = null; 
            }
        }
        
        for (let i = 0; i < BOARD_SIZE; i++) {
            if (result[i]) continue; 
            
            const index = wordArray.indexOf(guessArray[i]);
            if (index !== -1) {
                result[i] = 'present';
                wordArray[index] = null; 
            } else {
                result[i] = 'absent';
            }
        }
        
        for (let i = 0; i < BOARD_SIZE; i++) {
            const tile = document.querySelector(`[data-index="${currentRow}-${i}"]`);
            tile.setAttribute('data-state', result[i]);
        }
        
        for (let i = 0; i < BOARD_SIZE; i++) {
            const key = document.querySelector(`[data-key="${guessArray[i]}"]`);
            if (!key) continue;
            
            const currentState = key.getAttribute('data-state');
            
            if (currentState === 'correct') continue;
            if (currentState === 'present' && result[i] !== 'correct') continue;
            
            key.setAttribute('data-state', result[i]);
        }
        
        if (guess === word) {
            showMessage('Parabéns! Você acertou!', true);
            gameOver = true;
            return;
        }
        
        currentRow++;
        currentTile = 0;
        
        if (currentRow >= MAX_ATTEMPTS) {
            showMessage(`Fim de jogo! A palavra era: ${word}`, true);
            gameOver = true;
        }
    }
    
    function showMessage(text, isPersistent = false) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        
        if (!isPersistent) {
            setTimeout(() => {
                messageElement.textContent = '';
            }, 2000);
        }
    }
});