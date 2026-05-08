<script>
  import { loadGameState, clearGameState } from '../lib/storage.js';
  import PantallaInicio from './PantallaInicio.svelte';
  import PantallaSetup from './PantallaSetup.svelte';
  import Juego from './Juego.svelte';

  let screen = $state('inicio');
  let players = $state(['Jugador 1', 'Jugador 2']);
  let isPortrait = $state(false);
  let hasSavedGame = $state(false);

  // Verificar si hay partida guardada
  const saved = loadGameState();
  if (saved) {
    hasSavedGame = true;
    players = saved.players;
  }

  // Detectar orientación
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 1024px)');
    isPortrait = mq.matches;
    mq.addEventListener('change', (e) => { isPortrait = e.matches; });

    // Si sale de fullscreen durante partida, volver a inicio
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && screen === 'juego') {
        screen = 'inicio';
      }
    });
  }

  function goToSetup() {
    screen = 'setup';
  }

  function continueGame() {
    screen = 'juego';
  }

  function newGame() {
    clearGameState();
    hasSavedGame = false;
    screen = 'setup';
  }

  function startGame(config) {
    players = config.players;
    screen = 'juego';
  }

  function restart() {
    clearGameState();
    hasSavedGame = false;
    screen = 'inicio';
    players = ['Jugador 1', 'Jugador 2'];
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('portrait').catch(() => {});
        }
      }).catch(() => {});
    }
  }

  function backToStart() {
    screen = 'inicio';
  }

  function enterFullscreenAndPlay() {
    const isMobile = navigator.maxTouchPoints > 0 && window.innerWidth < 1024;
    if (isMobile && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      }).catch(() => {});
    }
    screen = 'juego';
  }
</script>

{#if screen === 'inicio'}
  {#if hasSavedGame}
    <div class="flex flex-col items-center justify-center min-h-[100dvh] gap-5 p-4">
      <h1 class="text-4xl font-bold tracking-wide uppercase text-[var(--gold)] title-font">Quarto</h1>
      <p class="text-sm text-[var(--cream)] opacity-50">Hay una partida en curso</p>
      <button
        onclick={enterFullscreenAndPlay}
        class="px-6 py-3 bg-[var(--gold)] hover:brightness-110 text-[var(--bg)] font-bold text-sm uppercase tracking-wider rounded transition-all cursor-pointer"
      >
        Continuar partida
      </button>
      <button
        onclick={newGame}
        class="px-4 py-2 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] opacity-60 text-xs uppercase tracking-wider rounded transition-all cursor-pointer border border-[var(--gold)] border-opacity-20"
      >
        Nueva partida
      </button>
    </div>
  {:else}
    <PantallaInicio onStart={goToSetup} />
  {/if}
{:else if screen === 'setup'}
  <PantallaSetup onStart={startGame} onBack={backToStart} />
{:else if screen === 'juego'}
  {#if isPortrait && !document.fullscreenElement}
    <div class="flex items-center justify-center min-h-[100dvh] bg-[var(--bg)]">
      <div class="w-8 h-8 border-3 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <Juego {players} onRestart={restart} />
  {/if}
{/if}
