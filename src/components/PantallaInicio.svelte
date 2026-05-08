<script>
  let { onStart, hasSavedGame = false, onContinue = null } = $props();
</script>

<div class="flex flex-col items-center justify-center min-h-[100dvh] gap-6 p-4">
  <div class="text-center">
    <h1 class="text-5xl sm:text-7xl font-bold tracking-wide uppercase text-[var(--gold)]">
      Quarto
    </h1>
    <p class="text-[var(--cream)] opacity-60 mt-2 text-sm tracking-widest uppercase">Piensa dos veces</p>
  </div>

  <div class="text-center text-sm text-[var(--cream)] opacity-50 max-w-sm">
    16 piezas, 4 atributos. Alinea 4 que compartan algo en común. Tu rival elige qué pieza juegas.
  </div>

  <button
    onclick={onStart}
    class="px-8 py-2 bg-[var(--gold)] hover:brightness-110 text-[var(--bg)] font-bold text-lg uppercase tracking-wider rounded transition-all cursor-pointer"
  >
    Jugar
  </button>

  {#if hasSavedGame}
    <button
      onclick={onContinue}
      class="px-6 py-2 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] text-sm uppercase tracking-wider rounded transition-all cursor-pointer border border-[var(--gold)] border-opacity-40"
    >
      ▶ Continuar partida
    </button>
  {/if}
</div>
