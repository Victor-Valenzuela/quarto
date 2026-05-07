const STORAGE_KEY = 'quarto-game-state';

export function saveGameState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { }
}

export function loadGameState() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

export function clearGameState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) { }
}