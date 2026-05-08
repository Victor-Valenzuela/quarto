<script>
  import { loadGameState, clearGameState } from '../lib/storage.js';
  import PantallaInicio from './PantallaInicio.svelte';
  import PantallaSetup from './PantallaSetup.svelte';
  import Juego from './Juego.svelte';

  let screen = $state('inicio');
  let players = $state(['Jugador 1', 'Jugador 2']);
  let isPortrait = $state(false);

  // Retomar partida si hay estado guardado
  const saved = loadGameState();
  if (saved) {
    players = saved.players;
    screen = 'juego';
  }

  // Detectar orientación
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 1024px)');
    isPortrait = mq.matches;
    mq.addEventListener('change', (e) => { isPortrait = e.matches; });
  }

  function goToSetup() {
    screen = 'setup';
  }

  function startGame(config) {
    players = config.players;
    screen = 'juego';
  }

  function restart() {
    clearGameState();
    screen = 'inicio';
    players = ['Jugador 1', 'Jugador 2'];
  }

  function backToStart() {
    screen = 'inicio';
  }
</script>

{#if screen === 'inicio'}
  <PantallaInicio onStart={goToSetup} />
{:else if screen === 'setup'}
  <PantallaSetup onStart={startGame} onBack={backToStart} />
{:else if screen === 'juego'}
  {#if isPortrait}
    <div class="flex flex-col items-center justify-center min-h-[100dvh] gap-6 p-4">
      <h1 class="text-4xl font-bold tracking-wide uppercase text-[var(--gold)] title-font">Quarto</h1>
      <p class="text-sm text-[var(--cream)] opacity-50">Partida en curso</p>
      <button
        onclick={() => {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().then(() => {
              if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {});
              }
            }).catch(() => {});
          }
        }}
        class="px-6 py-3 bg-[var(--gold)] hover:brightness-110 text-[var(--bg)] font-bold text-sm uppercase tracking-wider rounded transition-all cursor-pointer"
      >
        ⛶ Continuar partida
      </button>
      <button
        onclick={restart}
        class="px-4 py-2 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] opacity-50 text-xs uppercase tracking-wider rounded transition-all cursor-pointer border border-[var(--gold)] border-opacity-20"
      >
        🏠 Volver al inicio
      </button>
    </div>
  {:else}
    <Juego {players} onRestart={restart} />
  {/if}
{/if}
