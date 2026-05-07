<script>
  let { onStart, onBack } = $props();

  let player1 = $state('');
  let player2 = $state('');

  function start() {
    const p1 = player1.trim() || 'Jugador 1';
    const p2 = player2.trim() || 'Jugador 2';
    onStart({ players: [p1, p2] });
  }

  function swap() {
    const temp = player1;
    player1 = player2;
    player2 = temp;
  }
</script>

<div class="flex flex-col items-center justify-center min-h-[100dvh] gap-5 p-4">
  <h2 class="text-2xl font-bold text-[var(--gold)]">¿Quién juega?</h2>

  <div class="flex flex-col gap-3 w-full max-w-xs">
    <div>
      <label class="text-xs text-[var(--gold)] uppercase tracking-wider block mb-1">Jugador 1 (empieza)</label>
      <input
        type="text"
        bind:value={player1}
        placeholder="Nombre"
        maxlength="12"
        class="w-full px-3 py-2 bg-[var(--cell)] border border-[var(--gold)] border-opacity-30 rounded text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--gold)]"
      />
    </div>
    <div>
      <label class="text-xs text-[var(--cream)] opacity-60 uppercase tracking-wider block mb-1">Jugador 2</label>
      <input
        type="text"
        bind:value={player2}
        placeholder="Nombre"
        maxlength="12"
        class="w-full px-3 py-2 bg-[var(--cell)] border border-[var(--gold)] border-opacity-30 rounded text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--gold)]"
      />
    </div>

    <button
      onclick={swap}
      class="self-center px-3 py-1.5 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] opacity-70 text-xs rounded transition-all cursor-pointer border border-[var(--gold)] border-opacity-20"
    >
      ⇅ Invertir orden
    </button>
  </div>

  <button
    onclick={start}
    class="px-8 py-3 bg-[var(--gold)] hover:brightness-110 text-[var(--bg)] font-bold text-sm uppercase tracking-wider rounded transition-all cursor-pointer"
  >
    Empezar
  </button>

  <button
    onclick={onBack}
    class="px-4 py-2 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] opacity-60 text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
  >
    ← Volver
  </button>
</div>
