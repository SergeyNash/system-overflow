(() => {
  const canvas = document.getElementById("system-canvas");
  const ctx = canvas.getContext("2d", { alpha: true });
  const root = document.querySelector(".experience");
  const startButton = document.getElementById("start-button");
  const actionButton = document.getElementById("action-button");
  const nodeActionButton = document.getElementById("node-action-button");
  const resetButton = document.getElementById("reset-button");
  const nextButton = document.getElementById("next-button");
  const navItems = [...document.querySelectorAll(".nav-item")];
  const sceneLabel = document.getElementById("scene-label");
  const observationTitle = document.getElementById("observation-title");
  const observationText = document.getElementById("observation-text");
  const metricThroughput = document.getElementById("metric-throughput");
  const metricBottleneck = document.getElementById("metric-bottleneck");
  const eventLogList = document.getElementById("event-log-list");
  const logCount = document.getElementById("log-count");
  const accessibleState = document.getElementById("accessible-state");
  const hint = document.getElementById("interaction-hint");
  const nodePanel = document.getElementById("node-panel");
  const powerSlider = document.getElementById("power-slider");
  const powerLabel = document.getElementById("power-label");
  const powerDown = document.getElementById("power-down");
  const pauseButton = document.getElementById("pause-button");
  let flowModel = FlowModel.create();
  let selectedNode = null;
  let paused = false;
  let holdProgress = 0;
  let holdApplied = false;
  let intervention = null;
  let baselineLimit = "C1";
  const levelNames = ["Базовая", "Ускоренная", "Высокая", "Предельная"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const palette = {
    text: "#f4f1ea",
    muted: "#989ca3",
    flow: "#cbd5e1",
    load: "#d97706",
    overload: "#f97316",
    risk: "#ef4444",
  };

  const order = ["intro", "bottleneck", "delay", "missing", "final", "free"];
  const workNodes = ["A", "B", "C1", "C2", "D"];

  const copy = {
    intro: {
      label: "Живая система",
      initialTitle: "Система проявляется.",
      initialText: "Потоки уже движутся. Попробуйте сначала просто наблюдать.",
      idleTitle: "Потяните один из узлов.",
      idleText: "Связи растянутся, а последствие может появиться не там, где было действие.",
      finalTitle: "Вы изменили один элемент.",
      finalText: "Почему напряжение возникло в другом месте?",
      action: "Начать эксперименты",
      state: "Живая система реагирует на курсор. Первое действие - перемещение узла.",
    },
    bottleneck: {
      label: "01. Узкое место",
      thesis: "Поток проходит через связанные участки. Понаблюдайте, где он скапливается.",
      invite: "Один участок не справляется с потоком. Попробуйте его ускорить.",
      localTitle: "Локальная скорость выросла.",
      localText: "Но скорость системы изменилась только там, где было снято ограничение.",
      consequenceTitle: "Ограничение переместилось.",
      consequenceText: "Теперь поток упирается в следующий участок.",
      finalTitle: "Локальная скорость и результат системы меняются по-разному.",
      finalText: "Оптимизация вне ограничения почти не меняет итоговый поток.",
      state: "Перед C1 образуется очередь. Итоговый поток равен пропускной способности ограничения.",
    },
    delay: {
      label: "02. Задержка",
      thesis: "Когда результат запаздывает, мы склонны воздействовать сильнее, чем необходимо.",
      invite: "Добавьте импульс.",
      action: "Добавить импульс",
      waitTitle: "Результата пока не видно.",
      waitText: "Воздействие уже движется по системе.",
      consequenceTitle: "Система не игнорировала воздействие.",
      consequenceText: "Она отвечала с задержкой.",
      finalTitle: "Отсутствие немедленного ответа не означает отсутствие реакции.",
      finalText: "Иногда последствия просто ещё не дошли до места, где их можно увидеть.",
      state: "Импульсы проходят длинную цепочку и накладываются в целевом узле.",
    },
    missing: {
      label: "03. Отсутствующая связь",
      thesis: "Иногда проблема находится в связи, которой никогда не было.",
      invite: "Всё работает. Почему результата нет?",
      action: "Показать отсутствие",
      hintTitle: "Попробуйте смотреть не на узлы.",
      hintText: "Ни один элемент не выглядит сломанным.",
      absenceTitle: "Чего здесь не хватает?",
      absenceText: "Поток огибает пустое место.",
      actionConnect: "Создать связь",
      consequenceTitle: "Здесь ничего не было сломано.",
      consequenceText: "Связи просто не существовало.",
      finalTitle: "Иногда нужно искать не неисправный элемент.",
      finalText: "А отсутствующее отношение между элементами.",
      state: "Локальные части системы работают, но результат не достигается без новой связи.",
    },
    final: {
      label: "Общая карта",
      title: "Мир редко состоит из отдельных вещей.",
      text: "Чаще он состоит из связей, задержек, ограничений и последствий, которые не видны с первого взгляда.",
      extra: "Смотрите не только на то, что находится перед вами. Смотрите на то, что происходит между.",
      action: "Исследовать свободно",
      state: "Три эксперимента собраны в одну карту: ограничение, задержка и отсутствующая связь.",
    },
    free: {
      label: "Свободный режим",
      title: "Смотрите на то, что происходит между.",
      text: "Перемещайте узлы и наблюдайте, как система продолжает перестраиваться после действия.",
      action: "Изменить поток",
      state: "Свободное исследование без правильного ответа и оценки.",
    },
  };

  const scenes = {
    intro: {
      nodes: [
        n("source", 0.4, 0.38, 15, 0.08, true),
        n("core", 0.55, 0.48, 25, 0.16, true),
        n("buffer", 0.68, 0.36, 17, 0.15, false),
        n("remote", 0.76, 0.65, 19, 0.08, false),
        n("sink", 0.47, 0.72, 16, 0.08, true),
        n("latent", 0.28, 0.62, 14, 0.05, true),
      ],
      connections: [
        c("source", "core", 0.78),
        c("core", "buffer", 0.55),
        c("buffer", "remote", 0.42),
        c("core", "sink", 0.5),
        c("latent", "source", 0.62),
        c("latent", "sink", 0.36),
      ],
    },
    bottleneck: {
      nodes: [
        n("source", 0.11, 0.5, 13, 0.1, false, { label: "Вход", role: "boundary", capacity: 0.86 }),
        n("A", 0.25, 0.5, 17, 0.16, true, { label: "A", role: "work", capacity: 0.58 }),
        n("B", 0.39, 0.5, 18, 0.2, true, { label: "B", role: "work", capacity: 0.62 }),
        n("C1", 0.56, 0.35, 22, 0.72, true, { label: "C1", role: "work", capacity: 0.34 }),
        n("C2", 0.56, 0.66, 18, 0.18, true, { label: "C2", role: "work", capacity: 0.7 }),
        n("D", 0.74, 0.5, 21, 0.22, true, { label: "D", role: "work", capacity: 0.56 }),
        n("out", 0.88, 0.5, 14, 0.08, false, { label: "Выход", role: "boundary", capacity: 0.72 }),
      ],
      connections: [
        c("source", "A", 0.82),
        c("A", "B", 0.66),
        c("B", "C1", 0.38),
        c("B", "C2", 0.7),
        c("C1", "D", 0.52),
        c("C2", "D", 0.68),
        c("D", "out", 0.46),
      ],
    },
    delay: {
      nodes: [
        n("push", 0.22, 0.58, 18, 0.1, true),
        n("relay1", 0.35, 0.42, 15, 0.1, false),
        n("relay2", 0.5, 0.33, 16, 0.08, false),
        n("relay3", 0.66, 0.45, 18, 0.1, false),
        n("result", 0.78, 0.63, 25, 0.12, false),
        n("return", 0.48, 0.72, 14, 0.06, false),
      ],
      connections: [
        c("push", "relay1", 0.56),
        c("relay1", "relay2", 0.48),
        c("relay2", "relay3", 0.38),
        c("relay3", "result", 0.4),
        c("result", "return", 0.28),
        c("return", "push", 0.22),
      ],
    },
    missing: {
      nodes: [
        n("left", 0.27, 0.46, 17, 0.1, true),
        n("logic", 0.43, 0.35, 16, 0.12, true),
        n("near", 0.54, 0.57, 20, 0.14, true),
        n("target", 0.74, 0.5, 24, 0.04, false),
        n("support", 0.4, 0.69, 14, 0.08, true),
        n("outer", 0.68, 0.29, 13, 0.08, false),
      ],
      connections: [
        c("left", "logic", 0.54),
        c("logic", "near", 0.5),
        c("left", "support", 0.42),
        c("support", "near", 0.38),
        c("outer", "target", 0.3),
      ],
      ghost: ["near", "target"],
    },
    final: {
      nodes: [
        n("b1", 0.2, 0.45, 15, 0.32, false),
        n("b2", 0.31, 0.52, 22, 0.62, false),
        n("b3", 0.42, 0.48, 16, 0.24, false),
        n("d1", 0.52, 0.32, 15, 0.16, false),
        n("d2", 0.64, 0.42, 18, 0.42, false),
        n("d3", 0.57, 0.68, 15, 0.18, false),
        n("m1", 0.73, 0.36, 16, 0.12, false),
        n("m2", 0.84, 0.57, 23, 0.3, false),
      ],
      connections: [
        c("b1", "b2", 0.25),
        c("b2", "b3", 0.6),
        c("b3", "d1", 0.42),
        c("d1", "d2", 0.38),
        c("d2", "d3", 0.34),
        c("d3", "m1", 0.5),
        c("m1", "m2", 0.7),
        c("b2", "d3", 0.28),
      ],
      ghost: ["m1", "m2"],
    },
    free: {
      nodes: [
        n("a", 0.25, 0.38, 16, 0.12, true),
        n("b", 0.42, 0.31, 19, 0.18, true),
        n("c", 0.6, 0.4, 22, 0.22, true),
        n("d", 0.75, 0.58, 16, 0.14, true),
        n("e", 0.52, 0.68, 20, 0.2, true),
        n("f", 0.32, 0.62, 14, 0.1, true),
        n("g", 0.78, 0.34, 13, 0.08, true),
      ],
      connections: [
        c("a", "b", 0.52),
        c("b", "c", 0.42),
        c("c", "d", 0.48),
        c("d", "e", 0.4),
        c("e", "f", 0.44),
        c("f", "a", 0.36),
        c("c", "e", 0.28),
        c("g", "c", 0.22),
      ],
    },
  };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let sceneId = "intro";
  let phase = "intro.reveal";
  let phaseTime = 0;
  let totalTime = 0;
  let transition = 1;
  let lastTime = performance.now();
  let nodes = [];
  let connections = [];
  let particles = [];
  let impulses = [];
  let ghostConnection = null;
  let pendingObservations = [];
  let eventLog = [];
  let eventId = 0;
  let typingTimer = null;
  let actionCount = 0;
  let completed = new Set();
  let completionPending = new Set();
  let selectedNodes = new Set();
  let bottleneckOverview = false;
  let throughput = { before: 0, current: 0, bottleneck: "C1", changed: 0 };
  let firstDragDone = false;
  let firstHoverDone = false;
  let controlsLocked = false;
  let timeScale = 1;
  let pointer = { x: -999, y: -999, down: false, node: null, startedAt: null };

  function n(id, nx, ny, radius, load, interactive, meta = {}) {
    return { id, nx, ny, radius, load, interactive, ...meta };
  }

  function c(from, to, capacity) {
    return { from, to, capacity };
  }

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail: { scene: sceneId, phase, ...detail } }));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes.forEach((item) => {
      item.x = item.nx * width;
      const mobile = window.innerWidth < 820;
      const top = sceneId === "bottleneck" ? (mobile ? 380 : 250) : 0;
      const bottom = sceneId === "bottleneck" ? (mobile ? height - 350 : height - 300) : height;
      const pos = sceneId === "bottleneck" && mobile ? { source: [0.15, 0.12], A: [0.5, 0.12], B: [0.5, 0.36], C1: [0.26, 0.60], C2: [0.74, 0.60], D: [0.5, 0.86], out: [0.85, 0.86] }[item.id] : null;
      item.x = (pos ? pos[0] : item.nx) * width;
      item.y = top + (pos ? pos[1] : item.ny) * Math.max(160, bottom - top);
      item.tx = item.x;
      item.ty = item.y;
    });
  }

  function createNode(config) {
    return {
      ...config,
      x: config.nx * width,
      y: config.ny * height,
      tx: config.nx * width,
      ty: config.ny * height,
      vx: 0,
      vy: 0,
      queue: 0,
      speed: 0,
      processed: 0,
      baseLoad: config.load,
      capacity: config.capacity || 0.5,
      baseCapacity: config.capacity || 0.5,
      powerLevel: 0,
      role: config.role || "work",
      label: config.label || config.id,
      pulse: Math.random() * Math.PI * 2,
      fixed: false,
    };
  }

  function createConnection(config) {
    return {
      ...config,
      heat: 0,
      queue: 0,
      flow: 0.35 + config.capacity * 0.65,
      live: true,
      ghost: false,
      width: 1 + (1 - config.capacity) * 2.2,
    };
  }

  function loadScene(id, nextPhase) {
    controlsLocked = false;
    paused = false;
    pauseButton.textContent = "Пауза";
    pauseButton.setAttribute("aria-pressed", "false");
    pointer.down = false;
    pointer.node = null;
    selectedNode = null;
    holdProgress = 0;
    holdApplied = false;
    intervention = null;
    sceneId = id;
    root.dataset.scene = id;
    nodePanel.hidden = id !== "bottleneck";
    pauseButton.hidden = id !== "bottleneck";
    const scene = scenes[id];
    phase = nextPhase || (id === "intro" ? "intro.reveal" : id === "final" ? "final.map" : id === "free" ? "free.explore" : "experiment.forming");
    phaseTime = 0;
    transition = 1;
    actionCount = 0;
    pendingObservations = [];
    eventLog = [];
    eventId = 0;
    if (typingTimer) clearTimeout(typingTimer);
    completionPending.delete(id);
    selectedNodes.clear();
    impulses = [];
    timeScale = 1;
    bottleneckOverview = false;
    nodes = scene.nodes.map(createNode);
    connections = scene.connections.map(createConnection);
    ghostConnection = scene.ghost ? { from: scene.ghost[0], to: scene.ghost[1], visible: id === "final", live: id === "final", suspicion: 0 } : null;
    seedSceneState(id);
    resize();
    createParticles();
    root.classList.toggle("has-started", id !== "intro" || firstDragDone);
    setCopyForScene(id);
    seedEventLog(id);
    updateSidebarMetrics();
    updateNav();
    updateControls();
    emit(id === "intro" ? "scene_loaded" : id === "final" ? "final_scene_shown" : id === "free" ? "free_mode_started" : "experiment_started", { id });
  }

  function seedSceneState(id) {
    if (id === "bottleneck") {
      flowModel = FlowModel.create();
      // Begin with a short, real warm-up; its queue is produced by demand.
      for (let i = 0; i < 90; i++) FlowModel.step(flowModel, 1 / 60);
      baselineLimit = FlowModel.steady(flowModel).limit;
      throughput = { before: 0, current: 0, bottleneck: baselineLimit, changed: 0 };
      calculateBottleneckFlow();
      throughput.before = throughput.current;
    }
    if (id === "final") {
      link("b1", "b2").queue = 0.75;
      link("d1", "d2").heat = 0.55;
      if (ghostConnection) ghostConnection.suspicion = 0.65;
    }
  }

  function setCopyForScene(id) {
    const text = copy[id];
    sceneLabel.textContent = text.label;
    if (id === "intro") {
      showCopy(text.initialTitle, text.initialText, text.state);
      hint.textContent = "Наведите курсор на узел.";
    } else if (id === "bottleneck") {
      showCopy(text.label, text.thesis, text.state);
      hint.textContent = "Выберите узел или удерживайте его, чтобы повысить мощность.";
    } else if (id === "delay" || id === "missing") {
      showCopy(text.label, text.thesis, text.state);
      hint.textContent = "Сначала наблюдайте за поведением системы.";
    } else if (id === "final") {
      showCopy(text.title, text.text, text.state);
      hint.textContent = text.extra;
    } else {
      showCopy(text.title, text.text, text.state);
      hint.textContent = "Перемещайте узлы. Система продолжит отвечать.";
    }
  }

  function showCopy(title, text, state) {
    observationTitle.textContent = title;
    observationText.textContent = text;
    if (state) accessibleState.textContent = state;
    updateSidebarMetrics();
  }

  function seedEventLog(id) {
    renderEventLog();
  }

  function pushEvent({ type = "state", title, text, metricDelta = "", silent = false }) {
    eventId += 1;
    eventLog.push({
      id: eventId,
      type,
      title,
      text,
      visibleText: "",
      metricDelta,
    });
    eventLog = eventLog.slice(-9);
    renderEventLog();
    typeLatestEvent();
    if (!silent) updateSidebarMetrics();
  }

  function renderEventLog() {
    if (!eventLogList || !logCount) return;
    logCount.textContent = `${eventLog.length} событий`;
    const latestId = eventLog.at(-1)?.id;
    eventLogList.innerHTML = eventLog
      .map(
        (item) => `
          <li class="log-entry ${item.id === latestId ? "is-current" : ""}" data-type="${item.type}">
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.id === latestId ? item.visibleText : item.text)}</p>
              ${item.metricDelta ? `<span class="delta">${escapeHtml(item.metricDelta)}</span>` : ""}
            </div>
          </li>
        `
      )
      .join("");
    eventLogList.scrollTop = eventLogList.scrollHeight;
  }

  function typeLatestEvent() {
    if (typingTimer) clearTimeout(typingTimer);
    const item = eventLog.at(-1);
    if (!item) return;
    if (reducedMotion) {
      item.visibleText = item.text;
      renderEventLog();
      return;
    }
    item.visibleText = "";
    let index = 0;
    const tick = () => {
      const current = eventLog.at(-1);
      if (!current || current.id !== item.id) return;
      index = Math.min(item.text.length, index + 2);
      item.visibleText = item.text.slice(0, index);
      renderEventLog();
      if (index < item.text.length) typingTimer = setTimeout(tick, 18);
    };
    tick();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function updateSidebarMetrics() {
    if (!metricThroughput || !metricBottleneck) return;
    if (sceneId === "bottleneck") {
      metricThroughput.parentElement.hidden = !completed.has("bottleneck");
      metricBottleneck.parentElement.hidden = !bottleneckOverview;
      metricThroughput.textContent = `${throughput.current} ед./такт`;
      metricBottleneck.textContent = bottleneckOverview ? boundaryLabel(throughput.bottleneck) : "наблюдайте за очередями";
    } else {
      metricThroughput.parentElement.hidden = false;
      metricBottleneck.parentElement.hidden = false;
      metricThroughput.textContent = "-";
      metricBottleneck.textContent = "-";
    }
  }

  function updateNodeActionPosition() {
    // Controls stay in one place; canvas nodes remain selectable by touch.
  }

  function scheduleObservation(delay, title, text, state, nextPhase, eventName) {
    pendingObservations.push({ at: totalTime + delay, title, text, state, nextPhase, eventName });
    pendingObservations.sort((a, b) => a.at - b.at);
  }

  function setPhase(nextPhase) {
    phase = nextPhase;
    phaseTime = 0;
    updateControls();
  }

  function updateNav() {
    navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.scene === sceneId));
  }

  function updateControls() {
    const text = copy[sceneId];
    actionButton.hidden = false;
    if (nodeActionButton) nodeActionButton.hidden = true;
    nextButton.hidden = false;
    resetButton.hidden = false;
    actionButton.disabled = controlsLocked;
    nextButton.disabled = controlsLocked;

    if (sceneId === "intro") {
      actionButton.textContent = firstDragDone ? copy.intro.action : "Сначала потяните узел";
      nextButton.textContent = firstDragDone ? "Начать эксперименты" : "Дальше";
      nextButton.disabled = !firstDragDone;
    } else if (sceneId === "bottleneck") {
      actionButton.hidden = true;
      actionButton.textContent = bottleneckOverview ? "Скрыть обзор" : "Показать систему целиком";
      actionButton.hidden = !completed.has("bottleneck");
      actionButton.disabled = controlsLocked;
      nodeActionButton.hidden = false;
      nodeActionButton.textContent = selectedNode ? (node(selectedNode).powerLevel === 3 ? "Предельная мощность" : "Ускорить " + selectedNode) : "Выберите узел";
      nodeActionButton.disabled = controlsLocked || !selectedNode || node(selectedNode).powerLevel >= 3;
      powerDown.disabled = controlsLocked || !selectedNode || node(selectedNode).powerLevel === 0;
      powerSlider.disabled = controlsLocked || !selectedNode;
      powerSlider.value = selectedNode ? node(selectedNode).powerLevel : 0;
      powerLabel.textContent = selectedNode ? `${selectedNode} · ${levelNames[node(selectedNode).powerLevel]}` : "Выберите участок";
      document.querySelectorAll("[data-node]").forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.node === selectedNode));
        button.disabled = controlsLocked;
      });
      nextButton.textContent = "Перейти к задержке";
      nextButton.disabled = !completed.has("bottleneck") || controlsLocked;
    } else if (sceneId === "delay") {
      actionButton.textContent = text.action;
      nextButton.textContent = "Следующий эксперимент";
      nextButton.disabled = !completed.has("delay");
    } else if (sceneId === "missing") {
      actionButton.textContent = ghostConnection && ghostConnection.visible ? text.actionConnect : text.action;
      nextButton.textContent = "Завершить исследование";
      nextButton.disabled = !completed.has("missing");
    } else if (sceneId === "final") {
      actionButton.textContent = text.action;
      nextButton.textContent = "Пройти ещё раз";
    } else if (sceneId === "free") {
      actionButton.textContent = text.action;
      nextButton.textContent = "Открыть эксперименты";
    }
  }

  function node(id) {
    return nodes.find((item) => item.id === id);
  }

  function link(from, to) {
    return connections.find((item) => item.from === from && item.to === to);
  }

  function connectedLinks(id) {
    return connections.filter((item) => item.from === id || item.to === id);
  }

  function createParticles() {
    particles = [];
    const count = reducedMotion ? 32 : window.innerWidth < 760 ? 62 : 130;
    for (let i = 0; i < count; i += 1) particles.push(makeParticle(i / count));
  }

  function makeParticle(offset = Math.random()) {
    const liveLinks = connections.filter((item) => item.live);
    const item = liveLinks[Math.floor(Math.random() * liveLinks.length)];
    return {
      link: item,
      t: offset,
      speed: 0.04 + Math.random() * 0.055,
      size: 0.9 + Math.random() * 1.8,
      heat: Math.random() * 0.15,
      delay: Math.random() * 1.5,
    };
  }

  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function nearestNode(pos, onlyInteractive = false) {
    let best = null;
    let bestDistance = Infinity;
    nodes.forEach((item) => {
      if (onlyInteractive && !item.interactive) return;
      const distance = Math.hypot(item.x - pos.x, item.y - pos.y);
      if (distance < item.radius + 26 && distance < bestDistance) {
        best = item;
        bestDistance = distance;
      }
    });
    return best;
  }

  function onPointerDown(event) {
    const pos = pointerPosition(event);
    const picked = nearestNode(pos, true);
    pointer = { ...pointer, ...pos, down: true, node: picked, startedAt: performance.now(), startX: pos.x, startY: pos.y };
    if (!picked) {
      if (sceneId === "bottleneck") {
        const boundary = nearestNode(pos);
        if (boundary?.role === "boundary") inspectBottleneckNode(boundary);
      }
      return;
    }
    holdApplied = false;
    holdProgress = 0;
    if (sceneId === "bottleneck") inspectBottleneckNode(picked);
    picked.fixed = true;
    root.classList.add("has-started");
    if (sceneId === "intro") {
      setPhase("intro.first_drag");
      emit("first_drag_start", { node: picked.id });
    }
  }

  function onPointerMove(event) {
    const pos = pointerPosition(event);
    pointer.x = pos.x;
    pointer.y = pos.y;
    const hovered = nearestNode(pos, true);
    if (hovered && !firstHoverDone) {
      firstHoverDone = true;
      emit("first_hover", { node: hovered.id });
    }
    if (pointer.down && pointer.node && sceneId !== "bottleneck") {
      pointer.node.x = pos.x;
      pointer.node.y = pos.y;
      pointer.node.tx = pos.x;
      pointer.node.ty = pos.y;
      pointer.node.load = Math.min(1, pointer.node.load + 0.01);
      connectedLinks(pointer.node.id).forEach((item) => (item.heat = Math.min(1, item.heat + 0.018)));
    }
  }

  function onPointerUp() {
    if (pointer.node) {
      const moved = Math.hypot(pointer.x - pointer.startX, pointer.y - pointer.startY);
      const wasTap = moved < 12 && performance.now() - pointer.startedAt < 700;
      pointer.node.fixed = false;
      if (sceneId === "intro") finishIntroDrag(pointer.node);
      if (sceneId === "bottleneck" && wasTap && !controlsLocked) inspectBottleneckNode(pointer.node);
      if (sceneId === "missing" && ghostConnection && ghostConnection.visible && !ghostConnection.live) connectMissingLink();
    }
    pointer.down = false;
    pointer.node = null;
    holdProgress = 0;
  }

  function finishIntroDrag(picked) {
    if (firstDragDone) return;
    firstDragDone = true;
    emit("first_drag_complete", { node: picked.id });
    controlsLocked = true;
    const remote = node("remote");
    remote.load = 0.84;
    remote.queue = 0.72;
    link("buffer", "remote").heat = 0.9;
    link("buffer", "remote").queue = 0.68;
    setPhase("intro.remote_effect");
    emit("first_remote_effect");
    scheduleObservation(1.0, copy.intro.finalTitle, copy.intro.finalText, "После первого перемещения напряжение возникло в удалённой части системы.", "intro.first_observation", "first_observation_shown");
  }

  function boundaryLabel(id) {
    return id === "source" ? "Вход" : id === "out" ? "Выход" : id;
  }

  function inspectBottleneckNode(target) {
    if (!target || target.role !== "work") {
      showCopy("Это граница системы.", "Вход и выход показывают поток. Их нельзя ускорять как участок обработки.");
      return;
    }
    selectedNode = target.id;
    selectedNodes.clear();
    selectedNodes.add(target.id);
    updateControls();
  }

  function changePower(level) {
    if (sceneId !== "bottleneck" || controlsLocked || !selectedNode) return;
    const item = node(selectedNode);
    const nextLevel = Math.max(0, Math.min(3, Number(level)));
    if (nextLevel === item.powerLevel) return;
    const before = FlowModel.steady(flowModel);
    const oldLevel = item.powerLevel;
    flowModel.levels[item.id] = nextLevel;
    item.powerLevel = nextLevel;
    item.capacity = FlowModel.capacities(flowModel)[item.id];
    item.effect = 1;
    actionCount++;
    intervention = { id: item.id, before, beforeQueue: flowModel.queues[before.limit] || 0, at: totalTime, increased: nextLevel > oldLevel };
    controlsLocked = true;
    setPhase("experiment.acting");
    showCopy(nextLevel > oldLevel ? `${item.id} стал мощнее.` : `${item.id} замедлен.`, "Понаблюдайте, как изменится поток после этого участка.");
    pushEvent({ title: `Мощность ${item.id} изменена`, text: `${levelNames[oldLevel]} → ${levelNames[nextLevel]}.`, metricDelta: `мощность ${Math.round(before.cap[item.id] * 100)} → ${Math.round(item.capacity * 100)}` });
    emit("bottleneck_power_changed", { node: item.id, powerLevel: nextLevel });
    updateControls();
  }

  function applyAction() {
    if (controlsLocked) return;
    if (sceneId === "intro") {
      if (firstDragDone) goNext();
      else {
        showCopy(copy.intro.idleTitle, copy.intro.idleText, copy.intro.state);
        hint.textContent = "Сначала потяните узел: последствие должно появиться в системе.";
      }
      return;
    }
    if (sceneId === "bottleneck") showBottleneckOverview();
    if (sceneId === "delay") addDelayImpulse();
    if (sceneId === "missing") revealOrConnectMissing();
    if (sceneId === "final") loadScene("free");
    if (sceneId === "free") stirFreeMode();
  }

  function removeCurrentConstraint() {
    if (selectedNode) changePower(node(selectedNode).powerLevel + 1);
  }

  function calculateBottleneckFlow(dt = 0) {
    if (sceneId !== "bottleneck") return throughput;
    const state = dt > 0 ? FlowModel.step(flowModel, dt) : FlowModel.steady(flowModel);
    nodes.forEach(item => {
      item.capacity = state.cap[item.id];
      item.powerLevel = flowModel.levels[item.id] || 0;
      item.processed = flowModel.processed[item.id] || 0;
      item.speed = item.capacity;
      item.queue = Math.min(1, (flowModel.queues[item.id] || 0) / 0.65);
      item.load = Math.min(1, 0.12 + item.queue * 0.68 + (item.processed / item.capacity) * 0.12);
    });
    node("source").processed = state.cap.source;
    throughput.current = Math.round(flowModel.output * 100);
    throughput.bottleneck = state.limit;
    throughput.changed = throughput.current - throughput.before;
    connections.forEach(item => {
      const source = node(item.from);
      const target = node(item.to);
      let flow = source.processed;
      if (item.from === "B") flow *= item.to === "C1" ? 0.65 : 0.35;
      item.flow = flow;
      item.queue = target.queue;
      item.heat = Math.min(1, target.queue * 0.8);
    });
    updateSidebarMetrics();
    return throughput;
  }

  function setLinkState(from, to, flow, queue) {
    const item = link(from, to);
    if (!item) return;
    item.flow = Math.min(1, 0.15 + flow);
    item.queue = Math.min(1, queue);
    item.heat = Math.max(item.heat, Math.min(1, queue * 0.9 + flow * 0.25));
  }

  function addDelayImpulse() {
    actionCount += 1;
    setPhase(actionCount === 1 ? "experiment.acting" : "experiment.consequence");
    impulses.push({ path: ["push", "relay1", "relay2", "relay3", "result"], t: 0, strength: 0.22 + actionCount * 0.06, observed: false });
    node("push").load = Math.min(1, node("push").load + 0.15);
    connectedLinks("push").forEach((item) => (item.heat = Math.min(1, item.heat + 0.24)));
    if (actionCount === 1) scheduleObservation(1.25, copy.delay.waitTitle, copy.delay.waitText, copy.delay.state, "experiment.inviting");
  }

  function revealOrConnectMissing() {
    if (!ghostConnection.visible) {
      ghostConnection.visible = true;
      ghostConnection.suspicion = 0.7;
      setPhase("experiment.consequence");
      showCopy(copy.missing.absenceTitle, copy.missing.absenceText, copy.missing.state);
      updateControls();
      return;
    }
    connectMissingLink();
  }

  function connectMissingLink() {
    if (!ghostConnection || ghostConnection.live || completionPending.has("missing")) return;
    ghostConnection.live = true;
    const newLink = createConnection({ from: ghostConnection.from, to: ghostConnection.to, capacity: 0.76 });
    newLink.heat = 0.76;
    connections.push(newLink);
    node("target").load = 0.68;
    node("target").queue = 0;
    setPhase("experiment.consequence");
    emit("experiment_key_event", { id: "missing" });
    scheduleObservation(1.0, copy.missing.consequenceTitle, copy.missing.consequenceText, copy.missing.state, "experiment.observation");
    scheduleObservation(2.8, copy.missing.finalTitle, copy.missing.finalText, copy.missing.state, "experiment.completed", "experiment_completed");
    completionPending.add("missing");
    updateControls();
  }

  function stirFreeMode() {
    actionCount += 1;
    nodes.forEach((item, index) => {
      item.load = Math.min(1, item.load + 0.06 + (index % 3) * 0.05);
      item.tx += Math.sin(index + actionCount) * 22;
      item.ty += Math.cos(index * 1.7 + actionCount) * 18;
    });
    connections.forEach((item, index) => (item.heat = Math.max(item.heat, index % 2 ? 0.3 : 0.55)));
    showCopy("Система продолжает отвечать.", "Изменение не заканчивается в момент действия.", copy.free.state);
  }

  function showBottleneckOverview() {
    bottleneckOverview = !bottleneckOverview;
    showCopy(bottleneckOverview ? "Сравните участок и всю систему." : copy.bottleneck.finalTitle,
      bottleneckOverview ? `Вход: 86. Выход сейчас: ${throughput.current}. Установившийся выход: ${Math.round(FlowModel.steady(flowModel).output * 100)}. Ограничение: ${boundaryLabel(throughput.bottleneck)}.` : copy.bottleneck.finalText);
    updateControls();
    emit("bottleneck_overview_opened");
  }

  function goNext() {
    const index = order.indexOf(sceneId);
    const next = order[Math.min(order.length - 1, index + 1)];
    if (sceneId === "intro" && !firstDragDone) return;
    if (["bottleneck", "delay", "missing"].includes(sceneId) && !completed.has(sceneId)) return;
    loadScene(next);
  }

  function resetScene() {
    if (sceneId === "intro") firstDragDone = false;
    if (["bottleneck", "delay", "missing"].includes(sceneId)) completed.delete(sceneId);
    controlsLocked = false;
    loadScene(sceneId);
    emit("experiment_restarted", { id: sceneId });
  }

  function simulate(dt) {
    if (sceneId === "bottleneck" && paused) return;
    const scaledDt = dt * (sceneId === "delay" ? timeScale : 1);
    phaseTime += dt;
    totalTime += dt;
    transition = Math.max(0, transition - dt * 1.5);
    runScheduledObservation();
    runSceneTimers(dt);
    simulateNodes(dt);
    simulateParticles(scaledDt);
    simulateImpulses(scaledDt);
  }

  function runScheduledObservation() {
    if (!pendingObservations.length || totalTime < pendingObservations[0].at) return;
    const item = pendingObservations.shift();
    showCopy(item.title, item.text, item.state);
    if (sceneId === "bottleneck") {
      pushEvent({
        type: item.nextPhase === "experiment.completed" ? "result" : "state",
        title: item.title,
        text: item.text,
        metricDelta: `throughput: ${throughput.current}; ограничение: ${throughput.bottleneck}`,
      });
    }
    if (item.nextPhase) setPhase(item.nextPhase);
    if (item.eventName) emit(item.eventName, { id: sceneId });
    if (item.nextPhase === "experiment.completed") {
      completed.add(sceneId);
      completionPending.delete(sceneId);
      controlsLocked = false;
      updateControls();
    }
    if (item.nextPhase === "intro.first_observation") {
      controlsLocked = false;
      updateControls();
    }
  }

  function runSceneTimers(dt) {
    if (sceneId === "intro") {
      if (phase === "intro.reveal" && phaseTime > (reducedMotion ? 0.8 : 3)) {
        setPhase("intro.idle");
        showCopy(copy.intro.idleTitle, copy.intro.idleText, copy.intro.state);
      }
      if (!firstDragDone && phaseTime > 8) {
        hint.textContent = window.innerWidth < 760 ? "Зажмите и потяните узел." : "Потяните один из узлов.";
        const latent = node("latent");
        if (latent && !pointer.down) latent.tx += Math.sin(totalTime * 4) * 0.45;
      }
    }

    if (sceneId === "bottleneck") {
      if (pointer.down && pointer.node?.role === "work" && !controlsLocked && !holdApplied) {
        holdProgress = Math.min(1, (performance.now() - pointer.startedAt) / 650);
        if (holdProgress >= 1) {
          holdApplied = true;
          inspectBottleneckNode(pointer.node);
          changePower(pointer.node.powerLevel + 1);
        }
      }
      if (phase === "experiment.forming" && phaseTime > 1.2) setPhase("experiment.observing");
      if (phase === "experiment.observing" && phaseTime > 3) {
        setPhase("experiment.inviting");
        showCopy("Один участок не справляется с потоком.", "Выберите участок и попробуйте его ускорить.");
      }
      if (intervention && totalTime - intervention.at > 2.4) {
        const effect = intervention;
        intervention = null;
        const state = FlowModel.steady(flowModel);
        const moved = state.limit !== effect.before.limit;
        const delta = Math.round((state.output - effect.before.output) * 100);
        let title, text;
        if (moved) {
          title = "Ограничение переместилось.";
          text = state.limit === "out" ? "Теперь очередь образуется перед выходом. Граница системы тоже может ограничивать поток." : state.limit === "source" ? "Внутренние участки получили запас мощности. Теперь результат ограничен тем, сколько поступает на вход." : `Понаблюдайте за ${boundaryLabel(state.limit)}: поток теперь упирается в другой участок.`;
        } else if (delta === 0) {
          title = "Мощность узла изменилась. Итоговый поток — нет.";
          text = "У участка появился запас мощности, но ограничение осталось в другом месте.";
        } else {
          title = delta > 0 ? "Поток стал быстрее." : "Поток стал медленнее.";
          text = "Очереди продолжают меняться. Сравните участок с выходом всей системы.";
        }
        showCopy(title, text, title + " " + text);
        pushEvent({ title, text, metricDelta: `установившийся выход ${Math.round(effect.before.output * 100)} → ${Math.round(state.output * 100)}` });
        if (moved && effect.increased && effect.before.limit === baselineLimit && flowModel.queues[baselineLimit] < effect.beforeQueue && (flowModel.queues[state.limit] || 0) > 0.05) {
          completed.add("bottleneck");
          emit("experiment_completed", { id: "bottleneck" });
        }
        controlsLocked = false;
        setPhase(completed.has("bottleneck") ? "experiment.completed" : "experiment.inviting");
      }
    }

    if (sceneId === "delay" && phase === "experiment.forming" && phaseTime > 1.2) {
      setPhase("experiment.inviting");
      showCopy(copy.delay.invite, copy.delay.thesis, copy.delay.state);
    }
    if (sceneId === "missing" && phase === "experiment.forming" && phaseTime > 1.2) {
      setPhase("experiment.observing");
      showCopy(copy.missing.invite, copy.missing.thesis, copy.missing.state);
    }
    if (sceneId === "missing" && phase === "experiment.observing" && phaseTime > 7 && !ghostConnection.visible) {
      setPhase("experiment.inviting");
      showCopy(copy.missing.hintTitle, copy.missing.hintText, copy.missing.state);
    }
  }

  function simulateNodes(dt) {
    if (sceneId === "bottleneck") calculateBottleneckFlow(dt * 2);
    nodes.forEach((item, index) => {
      if (!item.fixed) {
        const pull = sceneId === "free" ? 0.012 : 0.018;
        item.vx = (item.vx + (item.tx - item.x) * pull) * 0.9;
        item.vy = (item.vy + (item.ty - item.y) * pull) * 0.9;
        const drift = reducedMotion ? 0.02 : 0.14;
        item.x += item.vx + Math.sin(totalTime * 0.7 + item.pulse + index) * drift;
        item.y += item.vy + Math.cos(totalTime * 0.8 + item.pulse + index) * drift;
      }
      const floor = item.baseLoad + item.queue * 0.28;
      item.load = Math.max(floor, item.load - dt * 0.05);
      item.queue = Math.max(0, item.queue - dt * (sceneId === "bottleneck" ? 0.01 : 0.035));
      item.effect = Math.max(0, (item.effect || 0) - dt * (reducedMotion ? 2.6 : 1.2));
    });
    connections.forEach((item) => {
      item.heat = Math.max(0, item.heat - dt * 0.07);
      item.queue = Math.max(0, item.queue - dt * 0.018);
    });
  }

  function simulateParticles(dt) {
    particles.forEach((particle) => {
      if (!particle.link || !particle.link.live) {
        Object.assign(particle, makeParticle(0));
        return;
      }
      if (particle.delay > 0) {
        particle.delay -= dt;
        return;
      }
      const congestion = particle.link.queue + particle.link.heat * 0.4;
      const beforeQueue = congestion > 0.45 && particle.t > 0.56 && particle.t < 0.88;
      const speed = particle.speed * (sceneId === "bottleneck" ? Math.max(0.05, particle.link.flow * 2) : 1) * (beforeQueue ? 0.22 : 1) * (1 - Math.min(0.55, congestion * 0.3));
      particle.t += dt * speed;
      particle.heat = Math.max(particle.heat * 0.96, particle.link.heat * 0.75, particle.link.queue * 0.45);
      if (beforeQueue && Math.random() < 0.08) particle.t -= 0.01;
      if (particle.t > 1) Object.assign(particle, makeParticle(0));
    });
  }

  function simulateImpulses(dt) {
    if (!impulses.length) return;
    impulses.forEach((impulse) => {
      impulse.t += dt * (reducedMotion ? 0.16 : 0.24);
      const segment = Math.min(impulse.path.length - 1, Math.floor(impulse.t * (impulse.path.length - 1)));
      const currentNode = node(impulse.path[segment]);
      if (currentNode) currentNode.load = Math.min(1, currentNode.load + impulse.strength * dt * 1.5);
    });

    const reached = impulses.filter((item) => item.t > 0.82).length;
    if (reached >= 2) {
      const result = node("result");
      if (result) {
        result.load = Math.min(1, result.load + dt * 1.5 + 0.02 * impulses.length);
        result.queue = Math.min(1, result.queue + dt * 1.4);
        connectedLinks("result").forEach((item) => (item.heat = Math.min(1, item.heat + dt * 1.4)));
      }
    }

    if (sceneId === "delay" && actionCount >= 2 && reached >= 2 && !completed.has("delay") && !completionPending.has("delay")) {
      completionPending.add("delay");
      emit("experiment_key_event", { id: "delay" });
      scheduleObservation(0.7, copy.delay.consequenceTitle, copy.delay.consequenceText, copy.delay.state, "experiment.observation");
      scheduleObservation(2.5, copy.delay.finalTitle, copy.delay.finalText, copy.delay.state, "experiment.completed", "experiment_completed");
    }
    impulses = impulses.filter((item) => item.t < 1.25);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalAlpha = sceneId === "intro" && phase === "intro.reveal" ? Math.min(1, phaseTime / 2.4) : 1 - transition * 0.25;
    drawField();
    drawConnections();
    drawGhost();
    drawParticles();
    if (sceneId === "bottleneck") drawQueueClusters();
    drawImpulses();
    drawNodes();
    if (sceneId === "final") drawFinalLabels();
    if (sceneId === "delay") drawTimeLayer();
    ctx.restore();
    updateNodeActionPosition();
  }

  function drawField() {
    ctx.save();
    ctx.globalAlpha = reducedMotion ? 0.16 : 0.25;
    nodes.forEach((item) => {
      const radius = 110 + item.load * 90 + item.queue * 40;
      const gradient = ctx.createRadialGradient(item.x, item.y, 0, item.x, item.y, radius);
      gradient.addColorStop(0, `rgba(217,119,6,${0.08 * (item.load + item.queue)})`);
      gradient.addColorStop(0.45, "rgba(203,213,225,0.025)");
      gradient.addColorStop(1, "rgba(203,213,225,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(item.x, item.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function connectionCurve(item) {
    const from = node(item.from);
    const to = node(item.to);
    if (!from || !to) return null;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const load = Math.max(item.heat, item.queue, (from.load + to.load) * 0.28);
    const volume = Math.max(item.flow || 0, item.capacity || 0);
    const angle = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI / 2;
    const bend = Math.sin(from.pulse + to.pulse) * 16 + load * 18;
    return { from, to, cx: midX + Math.cos(angle) * bend, cy: midY + Math.sin(angle) * bend, load, volume };
  }

  function drawConnections() {
    connections.forEach((item) => {
      const curve = connectionCurve(item);
      if (!curve) return;
      ctx.save();
      ctx.lineCap = "round";
      const queuePressure = item.queue || 0;
      const flowAlpha = Math.min(0.82, 0.18 + curve.volume * 0.44 + curve.load * 0.18);
      ctx.strokeStyle = queuePressure > 0.42 ? `rgba(239,68,68,${0.38 + queuePressure * 0.42})` : `rgba(203,213,225,${flowAlpha})`;
      ctx.lineWidth = item.width + curve.load * 2.2 + curve.volume * 4.8;
      ctx.beginPath();
      ctx.moveTo(curve.from.x, curve.from.y);
      ctx.quadraticCurveTo(curve.cx, curve.cy, curve.to.x, curve.to.y);
      ctx.stroke();
      ctx.strokeStyle = `rgba(244,241,234,${0.06 + curve.volume * 0.16})`;
      ctx.lineWidth = 0.9 + curve.volume * 1.1;
      ctx.beginPath();
      ctx.moveTo(curve.from.x, curve.from.y);
      ctx.quadraticCurveTo(curve.cx, curve.cy, curve.to.x, curve.to.y);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawGhost() {
    if (!ghostConnection || (!ghostConnection.visible && sceneId !== "missing" && sceneId !== "final")) return;
    const from = node(ghostConnection.from);
    const to = node(ghostConnection.to);
    if (!from || !to || ghostConnection.live) return;
    ctx.save();
    ctx.setLineDash([7, 10]);
    ctx.lineWidth = 1 + ghostConnection.suspicion * 1.6;
    ctx.strokeStyle = ghostConnection.visible ? `rgba(217,119,6,${0.18 + ghostConnection.suspicion * 0.5})` : "rgba(203,213,225,0.12)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.quadraticCurveTo((from.x + to.x) / 2, (from.y + to.y) / 2 - 54, to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function quadraticPoint(curve, t) {
    return {
      x: (1 - t) * (1 - t) * curve.from.x + 2 * (1 - t) * t * curve.cx + t * t * curve.to.x,
      y: (1 - t) * (1 - t) * curve.from.y + 2 * (1 - t) * t * curve.cy + t * t * curve.to.y,
    };
  }

  function drawParticles() {
    particles.forEach((particle) => {
      if (!particle.link || particle.delay > 0) return;
      const curve = connectionCurve(particle.link);
      if (!curve) return;
      const point = quadraticPoint(curve, particle.t);
      const alpha = 0.2 + particle.heat * 0.5;
      ctx.save();
      ctx.fillStyle = particle.heat > 0.4 ? `rgba(249,115,22,${alpha})` : `rgba(203,213,225,${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, particle.size + particle.heat * 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawQueueClusters() {
    connections.forEach((item) => {
      if (item.queue < 0.08) return;
      const curve = connectionCurve(item);
      if (!curve) return;
      const count = Math.min(18, Math.max(4, Math.round(item.queue * 18)));
      ctx.save();
      for (let i = 0; i < count; i += 1) {
        const jitter = Math.sin(totalTime * 2.4 + i * 1.7) * 0.012;
        const t = Math.max(0.56, Math.min(0.93, 0.72 + (i % 6) * 0.026 + jitter));
        const point = quadraticPoint(curve, t);
        const row = Math.floor(i / 6) - 1;
        const alpha = 0.24 + item.queue * 0.42;
        ctx.fillStyle = `rgba(249,115,22,${alpha})`;
        ctx.beginPath();
        ctx.arc(point.x + row * 5, point.y + row * 4, 2.2 + item.queue * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function drawImpulses() {
    impulses.forEach((impulse) => {
      const max = impulse.path.length - 1;
      const raw = Math.min(max - 0.001, impulse.t * max);
      const index = Math.floor(raw);
      const local = raw - index;
      const tempConnection = { from: impulse.path[index], to: impulse.path[index + 1], heat: impulse.strength, queue: 0, capacity: 0.5 };
      const curve = connectionCurve(tempConnection);
      if (!curve) return;
      const point = quadraticPoint(curve, local);
      ctx.save();
      ctx.strokeStyle = `rgba(217,119,6,${0.3 + impulse.strength})`;
      ctx.lineWidth = 1.5 + impulse.strength * 6;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10 + impulse.strength * 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawNodes() {
    nodes.forEach((item) => {
      const hover = Math.hypot(pointer.x - item.x, pointer.y - item.y) < item.radius + 24;
      const selected = selectedNodes.has(item.id);
      const effect = item.effect || 0;
      const constrained = sceneId === "bottleneck" && bottleneckOverview && (item.id === throughput.bottleneck || (item.label && item.label === throughput.bottleneck));
      const load = Math.min(1, item.load + item.queue * 0.5);
      const radius = item.radius + load * 7 + (item.powerLevel || 0) * 2.8 + effect * 8 + (hover && item.interactive ? 4 : 0);
      ctx.save();
      ctx.shadowBlur = constrained ? 42 : selected || effect > 0 ? 34 : 15 + load * 25;
      ctx.shadowColor = constrained ? "rgba(239,68,68,0.9)" : selected ? "rgba(244,241,234,0.72)" : effect > 0 ? "rgba(190,242,100,0.72)" : load > 0.48 ? "rgba(249,115,22,0.68)" : "rgba(203,213,225,0.28)";
      ctx.fillStyle = constrained ? `rgba(239,68,68,${0.28 + load * 0.34})` : load > 0.62 ? `rgba(249,115,22,${0.24 + load * 0.3})` : `rgba(203,213,225,${0.07 + load * 0.18})`;
      ctx.strokeStyle = constrained ? "rgba(248,113,113,0.98)" : effect > 0 ? "rgba(190,242,100,0.9)" : selected ? "rgba(244,241,234,0.92)" : load > 0.48 ? `rgba(249,115,22,${0.58 + load * 0.25})` : "rgba(244,241,234,0.5)";
      ctx.lineWidth = constrained ? 3.2 : selected || effect > 0 ? 2.4 : 1.1 + load * 1.8;
      ctx.beginPath();
      if (load > 0.78) {
        for (let i = 0; i < 6; i += 1) {
          const angle = (Math.PI * 2 * i) / 6 + item.pulse;
          const r = radius * (i % 2 ? 0.86 : 1.08);
          const x = item.x + Math.cos(angle) * r;
          const y = item.y + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      } else {
        ctx.arc(item.x, item.y, radius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = constrained ? "rgba(254,226,226,0.92)" : "rgba(244,241,234,0.72)";
      ctx.beginPath();
      ctx.arc(item.x, item.y, Math.max(2, radius * 0.15), 0, Math.PI * 2);
      ctx.fill();
      if (sceneId === "bottleneck") {
        drawBottleneckNodeLabel(item, radius);
        if (pointer.node === item && pointer.down && holdProgress > 0) {
          ctx.strokeStyle = "#f4f1ea";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(item.x, item.y, radius + 10, -Math.PI / 2, -Math.PI / 2 + holdProgress * Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    });
  }

  function drawBottleneckNodeLabel(item, radius) {
    const constrained = bottleneckOverview && (item.id === throughput.bottleneck || item.label === throughput.bottleneck);
    ctx.shadowBlur = 0;
    ctx.textAlign = "center";
    ctx.font = "14px Cascadia Mono, Consolas, monospace";
    ctx.fillStyle = constrained ? "rgba(248,113,113,0.95)" : item.role === "boundary" ? "rgba(152,156,163,0.62)" : "rgba(244,241,234,0.78)";
    ctx.fillText(constrained ? `${item.label} · предел` : item.label, item.x, item.y - radius - 12);
    if (item.role !== "work" || !bottleneckOverview) return;
    const v = Math.round((item.processed || 0) * 100);
    const cap = Math.round(item.capacity * 100);
    const q = Math.round((item.queue || 0) * 100);
    const y = item.y + radius + 18;
    ctx.fillStyle = q > 25 ? "rgba(249,115,22,0.82)" : "rgba(244,241,234,0.54)";
    ctx.fillText(`v${v} / cap${cap}`, item.x, y);
    ctx.fillText(`q${q}`, item.x, y + 15);
  }


  function drawTimeLayer() {
    const y = height - (window.innerWidth < 760 ? 190 : 94);
    ctx.save();
    ctx.strokeStyle = "rgba(203,213,225,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width * 0.22, y);
    ctx.lineTo(width * 0.78, y);
    ctx.stroke();
    impulses.forEach((impulse) => {
      const x = width * (0.22 + Math.min(1, impulse.t) * 0.56);
      ctx.fillStyle = "rgba(217,119,6,0.55)";
      ctx.beginPath();
      ctx.arc(x, y, 4 + impulse.strength * 9, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawFinalLabels() {
    const labels = [
      ["ограничение", 0.3, 0.68],
      ["задержка", 0.58, 0.2],
      ["отсутствующая связь", 0.75, 0.72],
    ];
    ctx.save();
    ctx.font = "12px Cascadia Mono, Consolas, monospace";
    ctx.fillStyle = "rgba(244,241,234,0.46)";
    labels.forEach(([text, x, y]) => ctx.fillText(text, width * x, height * y));
    ctx.restore();
  }


  function loop(now) {
    const dt = Math.min(0.045, (now - lastTime) / 1000);
    lastTime = now;
    simulate(reducedMotion ? dt * 0.55 : dt);
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  startButton.addEventListener("click", () => {
    if (!firstDragDone) {
      showCopy(copy.intro.idleTitle, copy.intro.idleText, copy.intro.state);
      hint.textContent = "Сначала потяните узел. Это важнее кнопки.";
      return;
    }
    loadScene("bottleneck");
  });
  actionButton.addEventListener("click", applyAction);
  if (nodeActionButton) nodeActionButton.addEventListener("click", removeCurrentConstraint);
  resetButton.addEventListener("click", resetScene);
  nextButton.addEventListener("click", () => {
    if (sceneId === "final") {
      loadScene("intro");
      firstDragDone = false;
      completed.clear();
      return;
    }
    if (sceneId === "free") {
      loadScene("bottleneck");
      return;
    }
    goNext();
  });
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const target = item.dataset.scene;
      if (target === "intro") {
        firstDragDone = false;
        completed.clear();
      }
      loadScene(target);
    });
  });

  document.querySelectorAll("[data-node]").forEach(button => button.addEventListener("click", () => inspectBottleneckNode(node(button.dataset.node))));
  powerSlider.addEventListener("input", () => changePower(powerSlider.value));
  powerDown.addEventListener("click", () => selectedNode && changePower(node(selectedNode).powerLevel - 1));
  pauseButton.addEventListener("click", () => {
    paused = !paused;
    pauseButton.textContent = paused ? "Продолжить" : "Пауза";
    pauseButton.setAttribute("aria-pressed", String(paused));
  });
  window.addEventListener("pointercancel", onPointerUp);
  resize();
  loadScene("intro");
  requestAnimationFrame(loop);
})();
