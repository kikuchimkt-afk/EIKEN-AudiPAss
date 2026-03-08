/**
 * リスニング問題ビューア v3
 * URLパラメータからデータをfetchでロード
 * 問題ごとの再生ボタン + 選択肢 + 正誤チェック + 解説
 */
(function () {
  'use strict';

  // URL params
  const params = new URLSearchParams(window.location.search);
  const grade = params.get('grade') || 'grade2';
  const exam = params.get('exam') || '2025-2';
  const dataBase = `data/${grade}/${exam}/`;

  // DOM
  const tabsBar = document.getElementById('tabsBar');
  const partDescription = document.getElementById('partDescription');
  const questionsContainer = document.getElementById('questionsContainer');
  const expandAllBtn = document.getElementById('expandAllBtn');
  const collapseAllBtn = document.getElementById('collapseAllBtn');
  const resetBtn = document.getElementById('resetBtn');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const headerTitle = document.getElementById('headerTitle');
  const headerSubtitle = document.getElementById('headerSubtitle');
  const fullAudioBar = document.getElementById('fullAudioBar');
  const fullAudioBtn = document.getElementById('fullAudioBtn');
  const fullAudioIcon = fullAudioBtn.querySelector('.full-audio-icon');
  const fullAudioLabel = fullAudioBtn.querySelector('.full-audio-label');
  const fullAudioProgress = document.getElementById('fullAudioProgress');
  const fullAudioFill = document.getElementById('fullAudioFill');
  const fullAudioTime = document.getElementById('fullAudioTime');

  // State
  let EIKEN_DATA = null;
  let currentPartIndex = 0;
  let currentAudio = null;
  let currentPlayBtn = null;
  let currentSeekBar = null;
  let seekAnimFrame = null;
  let userAnswers = {}; // { questionNumber: chosenAnswer }

  // Full part audio state
  let fullPartAudio = null;
  let fullAudioAnimFrame = null;

  function fmtTime(s) {
    const m = Math.floor(s / 60);
    return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  function stopFullAudio() {
    if (fullPartAudio) {
      fullPartAudio.pause();
      if (fullPartAudio._blobUrl) URL.revokeObjectURL(fullPartAudio._blobUrl);
      fullPartAudio = null;
    }
    if (fullAudioAnimFrame) { cancelAnimationFrame(fullAudioAnimFrame); fullAudioAnimFrame = null; }
    fullAudioIcon.textContent = '▶';
    fullAudioLabel.textContent = '通し再生（本番形式）';
    fullAudioBtn.classList.remove('playing');
    fullAudioProgress.classList.remove('visible');
    fullAudioFill.style.width = '0%';
    fullAudioTime.textContent = '0:00 / 0:00';
  }

  function updateFullAudioProgress() {
    if (!fullPartAudio) { fullAudioAnimFrame = null; return; }
    const dur = fullPartAudio.duration || 0;
    const cur = fullPartAudio.currentTime || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    fullAudioFill.style.width = pct + '%';
    fullAudioTime.textContent = fmtTime(cur) + ' / ' + fmtTime(dur);
    fullAudioAnimFrame = requestAnimationFrame(updateFullAudioProgress);
  }

  async function toggleFullAudio() {
    // If playing, stop
    if (fullPartAudio && !fullPartAudio.paused) {
      // Pause (don't reset position)
      fullPartAudio.pause();
      fullAudioIcon.textContent = '▶';
      fullAudioLabel.textContent = '再開';
      fullAudioBtn.classList.remove('playing');
      if (fullAudioAnimFrame) { cancelAnimationFrame(fullAudioAnimFrame); fullAudioAnimFrame = null; }
      return;
    }

    // Resume if paused
    if (fullPartAudio && fullPartAudio.paused && fullPartAudio.currentTime > 0) {
      fullAudioIcon.textContent = '⏸';
      fullAudioLabel.textContent = '一時停止';
      fullAudioBtn.classList.add('playing');
      fullPartAudio.play();
      fullAudioAnimFrame = requestAnimationFrame(updateFullAudioProgress);
      return;
    }

    // Stop any individual question audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentPlayBtn) { currentPlayBtn.classList.remove('playing'); currentPlayBtn.innerHTML = PLAY_SVG; }
      if (currentAudio._blobUrl) URL.revokeObjectURL(currentAudio._blobUrl);
      hideSeekBar();
      currentAudio = null;
      currentPlayBtn = null;
    }

    const partNum = currentPartIndex + 1;
    const src = `${dataBase}audio/full_part${partNum}.mp3`;

    fullAudioIcon.textContent = '⏳';
    fullAudioLabel.textContent = '読み込み中...';

    try {
      const resp = await fetch(src);
      if (!resp.ok) throw new Error('not found');
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);

      fullPartAudio = new Audio();
      fullPartAudio._blobUrl = blobUrl;
      fullPartAudio.src = blobUrl;

      await new Promise((resolve) => {
        fullPartAudio.addEventListener('loadedmetadata', resolve, { once: true });
        setTimeout(resolve, 500);
      });

      fullAudioIcon.textContent = '⏸';
      fullAudioLabel.textContent = '一時停止';
      fullAudioBtn.classList.add('playing');
      fullAudioProgress.classList.add('visible');

      fullPartAudio.addEventListener('ended', stopFullAudio);
      fullPartAudio.addEventListener('error', stopFullAudio);

      await fullPartAudio.play();
      fullAudioAnimFrame = requestAnimationFrame(updateFullAudioProgress);
    } catch (e) {
      console.error('Full audio error:', e);
      stopFullAudio();
      fullAudioLabel.textContent = '音声なし';
      setTimeout(() => { fullAudioLabel.textContent = '通し再生（本番形式）'; }, 2000);
    }
  }

  fullAudioBtn.addEventListener('click', toggleFullAudio);

  // Seek on full audio progress bar click
  document.querySelector('.full-audio-track')?.addEventListener('click', (e) => {
    if (!fullPartAudio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    fullPartAudio.currentTime = pct * (fullPartAudio.duration || 0);
  });

  // Speaker config
  const SPEAKERS = {
    male: { icon: '♂', label: '男性', cls: 'male' },
    female: { icon: '♀', label: '女性', cls: 'female' },
    narrator: { icon: 'N', label: 'ナレーター', cls: 'narrator' }
  };

  // SVG icons
  const PLAY_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const PAUSE_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

  // ===== Load Data =====
  async function loadData() {
    try {
      const resp = await fetch(dataBase + 'data.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      EIKEN_DATA = await resp.json();

      // Update header — sanitize title to remove specific exam brand names
      const rawTitle = EIKEN_DATA.title || 'リスニング';
      const sanitizedTitle = rawTitle.replace(/英検/g, '').replace(/\s+/g, ' ').trim();
      headerTitle.textContent = sanitizedTitle;
      // Extract subtitle from title
      headerSubtitle.textContent = 'リスニング練習';

      // Fix audio paths — prefix with dataBase
      EIKEN_DATA.parts.forEach(part => {
        part.questions.forEach(q => {
          if (q.audioFile) {
            q.audioFile = dataBase + q.audioFile;
          }
        });
      });

      init();
    } catch (err) {
      questionsContainer.innerHTML = `
        <div style="text-align:center;padding:40px;color:var(--text-muted)">
          <p style="font-size:18px;margin-bottom:8px">データの読み込みに失敗しました</p>
          <p style="font-size:13px">${esc(err.message)}</p>
          <p style="margin-top:16px"><a href="index.html" style="color:var(--accent-blue)">← トップページに戻る</a></p>
        </div>
      `;
    }
  }

  // ===== Audio =====
  function hideSeekBar() {
    if (seekAnimFrame) { cancelAnimationFrame(seekAnimFrame); seekAnimFrame = null; }
    if (currentSeekBar) { currentSeekBar.classList.remove('visible'); currentSeekBar = null; }
  }

  function updateSeekBar() {
    if (!currentAudio || !currentSeekBar) { seekAnimFrame = null; return; }
    const dur = currentAudio.duration || 0;
    const cur = currentAudio.currentTime || 0;
    const pct = dur > 0 ? (cur / dur) * 100 : 0;
    const fill = currentSeekBar.querySelector('.seek-fill');
    const thumb = currentSeekBar.querySelector('.seek-thumb');
    const timeEl = currentSeekBar.querySelector('.seek-time');
    if (fill) fill.style.width = pct + '%';
    if (thumb) thumb.style.left = pct + '%';
    if (timeEl) {
      const fmt = s => { const m = Math.floor(s / 60); return m + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
      timeEl.textContent = fmt(cur) + ' / ' + fmt(dur);
    }
    seekAnimFrame = requestAnimationFrame(updateSeekBar);
  }

  async function playAudio(audioFile, btn, seekBar) {
    // Stop full part audio if playing
    stopFullAudio();

    // Stop previous
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentPlayBtn) { currentPlayBtn.classList.remove('playing'); currentPlayBtn.innerHTML = PLAY_SVG; }
      if (currentAudio._blobUrl) URL.revokeObjectURL(currentAudio._blobUrl);
      hideSeekBar();
    }

    if (currentPlayBtn === btn) {
      currentAudio = null;
      currentPlayBtn = null;
      return;
    }

    if (!audioFile) return;

    currentPlayBtn = btn;
    currentSeekBar = seekBar;
    btn.classList.add('playing');
    btn.innerHTML = PAUSE_SVG;
    if (seekBar) seekBar.classList.add('visible');

    const cleanup = () => {
      btn.classList.remove('playing');
      btn.innerHTML = PLAY_SVG;
      if (currentAudio && currentAudio._blobUrl) URL.revokeObjectURL(currentAudio._blobUrl);
      hideSeekBar();
      currentAudio = null;
      currentPlayBtn = null;
    };

    try {
      // Load entire file as blob for seekability
      const resp = await fetch(audioFile);
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Check if user clicked stop while loading
      if (currentPlayBtn !== btn) { URL.revokeObjectURL(blobUrl); return; }

      const audio = new Audio();
      audio._blobUrl = blobUrl;
      audio.preload = 'auto';
      currentAudio = audio;

      audio.addEventListener('ended', cleanup);
      audio.addEventListener('error', cleanup);

      // Wait for metadata to load so duration is available
      audio.src = blobUrl;
      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', resolve, { once: true });
        // Fallback timeout in case event already fired
        setTimeout(resolve, 500);
      });

      // Check again if user cancelled
      if (currentPlayBtn !== btn) { URL.revokeObjectURL(blobUrl); return; }

      await audio.play();
      // Force-start seekbar animation
      if (seekAnimFrame) cancelAnimationFrame(seekAnimFrame);
      seekAnimFrame = requestAnimationFrame(updateSeekBar);
    } catch (e) {
      cleanup();
    }
  }

  // ===== Tabs =====
  function renderTabs() {
    tabsBar.innerHTML = '';
    EIKEN_DATA.parts.forEach((part, i) => {
      const btn = document.createElement('button');
      btn.className = 'tab-btn' + (i === currentPartIndex ? ' active' : '');
      btn.innerHTML = `${part.nameEn}<span class="tab-badge">${part.questionRange}</span>`;
      btn.onclick = () => switchPart(i);
      tabsBar.appendChild(btn);
    });
  }

  function switchPart(i) {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    stopFullAudio();
    currentPartIndex = i;
    renderTabs();
    renderPartInfo();
    renderQuestions();
    updateScore();
  }

  function renderPartInfo() {
    const p = EIKEN_DATA.parts[currentPartIndex];
    partDescription.textContent = `${p.name}（${p.questionRange}）: ${p.description}`;
  }

  // ===== Highlight key phrases =====
  function highlightText(text, highlights) {
    if (!highlights || highlights.length === 0) return esc(text);
    let html = esc(text);
    highlights.forEach(phrase => {
      const escaped = esc(phrase);
      const regex = new RegExp(escaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      html = html.replace(regex, `<mark class="highlight-key">${escaped}</mark>`);
    });
    return html;
  }

  // ===== Questions =====
  function renderQuestions() {
    const part = EIKEN_DATA.parts[currentPartIndex];
    questionsContainer.innerHTML = '';

    part.questions.forEach((q, i) => {
      const card = createQuestionCard(q);
      questionsContainer.appendChild(card);
      requestAnimationFrame(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 35);
      });
    });
  }

  function createQuestionCard(q) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `q-${q.number}`;

    const answered = userAnswers[q.number];
    const isAnswered = answered !== undefined;
    if (isAnswered) {
      card.classList.add(answered === q.answer ? 'correct' : 'wrong');
    }

    // Header
    const header = document.createElement('div');
    header.className = 'question-header';

    const playBtn = document.createElement('button');
    playBtn.className = 'play-btn' + (q.audioFile ? '' : ' no-audio');
    playBtn.innerHTML = PLAY_SVG;
    playBtn.title = q.audioFile ? '再生' : '音声なし';
    // Seek bar
    const seekBar = document.createElement('div');
    seekBar.className = 'seek-bar';
    seekBar.innerHTML = `<div class="seek-track"><div class="seek-fill"></div><div class="seek-thumb"></div></div><div class="seek-time">0:00 / 0:00</div>`;

    // Prevent header toggle when interacting with seek bar
    seekBar.addEventListener('click', (e) => { e.stopPropagation(); });
    seekBar.addEventListener('mousedown', (e) => { e.stopPropagation(); });
    seekBar.addEventListener('touchstart', (e) => { e.stopPropagation(); });

    // Drag-to-seek
    const seekTrack = seekBar.querySelector('.seek-track');
    let isDragging = false;

    function seekTo(e) {
      if (!currentAudio || currentSeekBar !== seekBar) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const rect = seekTrack.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      currentAudio.currentTime = pct * (currentAudio.duration || 0);
    }

    seekTrack.addEventListener('mousedown', (e) => {
      if (!currentAudio || currentSeekBar !== seekBar) return;
      e.preventDefault();
      isDragging = true;
      seekTrack.classList.add('dragging');
      seekTo(e);
    });

    seekTrack.addEventListener('touchstart', (e) => {
      if (!currentAudio || currentSeekBar !== seekBar) return;
      isDragging = true;
      seekTrack.classList.add('dragging');
      seekTo(e);
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      seekTo(e);
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      seekTo(e);
    }, { passive: true });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      seekTrack.classList.remove('dragging');
    };
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    if (q.audioFile) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playAudio(q.audioFile, playBtn, seekBar);
      });
    }

    const numEl = document.createElement('div');
    numEl.className = 'question-number';
    numEl.textContent = q.number;

    const preview = document.createElement('div');
    preview.className = 'question-preview';
    const currentPart = EIKEN_DATA.parts[currentPartIndex];
    const isSpokenChoices = currentPart.partType === 'spoken-choices';
    if (isAnswered) {
      const resultIcon = answered === q.answer ? '✓' : '✗';
      const resultClass = answered === q.answer ? 'header-correct' : 'header-wrong';
      const previewText = q.question ? esc(q.question) : '応答を選んでください';
      preview.innerHTML = `<div class="question-preview-text ${resultClass}">${resultIcon} ${previewText}</div>`;
    } else {
      const hintText = isSpokenChoices ? '音声を聞いて応答を選んでください' : '問題を聞いて選択肢を選んでください';
      preview.innerHTML = `<div class="question-preview-text preview-muted">${hintText}</div>`;
    }

    const toggle = document.createElement('div');
    toggle.className = 'question-toggle';
    toggle.textContent = '▼';

    header.appendChild(playBtn);
    header.appendChild(numEl);
    header.appendChild(preview);
    header.appendChild(toggle);
    header.appendChild(seekBar);

    // Body
    const body = document.createElement('div');
    body.className = 'question-body';
    const inner = document.createElement('div');
    inner.className = 'question-body-inner';

    // Situation + Question (for Part 3 style questions)
    if (q.situation) {
      const sitBox = document.createElement('div');
      sitBox.className = 'situation-box';
      sitBox.innerHTML = `
        <div class="situation-label">Situation</div>
        <div class="situation-text">${esc(q.situation)}</div>
        <div class="situation-question"><span class="situation-q-label">Question:</span> ${esc(q.question)}</div>
      `;
      inner.appendChild(sitBox);
    }

    // Response label for spoken-choices (Part 1 style)
    if (isSpokenChoices && !isAnswered) {
      const respLabel = document.createElement('div');
      respLabel.className = 'response-label';
      respLabel.innerHTML = '🎧 <span>音声の最後に放送される応答（1〜3）から選んでください</span>';
      inner.appendChild(respLabel);
    }

    // Choices (always shown first, like exam paper)
    if (q.choices) {
      const choicesEl = document.createElement('div');
      choicesEl.className = 'choices-container';
      if (isSpokenChoices) choicesEl.classList.add('three-choices');

      q.choices.forEach((choice, ci) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        const choiceNum = ci + 1;

        if (isAnswered) {
          btn.classList.add('disabled');
          if (choiceNum === q.answer) btn.classList.add('correct-answer');
          if (choiceNum === answered && answered !== q.answer) btn.classList.add('wrong-answer');
          if (choiceNum === answered) btn.classList.add('selected');
        }

        // For spoken-choices: hide text before answering (audio-only choices)
        if (isSpokenChoices && !isAnswered) {
          btn.innerHTML = `<span class="choice-number">${choiceNum}</span>`;
          btn.classList.add('number-only');
        } else {
          btn.innerHTML = `
            <span class="choice-number">${choiceNum}</span>
            <span class="choice-text">${esc(choice)}</span>
          `;
        }

        if (!isAnswered) {
          btn.addEventListener('click', () => handleAnswer(q, choiceNum, card));
        }

        choicesEl.appendChild(btn);
      });

      inner.appendChild(choicesEl);
    }

    // After answering: show result + explanation + script
    if (isAnswered) {
      const badge = document.createElement('div');
      badge.className = 'answer-result ' + (answered === q.answer ? 'correct-badge' : 'wrong-badge');
      badge.textContent = answered === q.answer ? '✓ 正解！' : `✗ 不正解（正解: ${q.answer}）`;
      inner.appendChild(badge);

      const explSection = document.createElement('div');
      explSection.className = 'explanation-section';

      // Question text (skip for spoken-choices with no question)
      if (q.question) {
        const qBox = document.createElement('div');
        qBox.className = 'question-text-box';
        qBox.innerHTML = `
          <div class="question-label">Question</div>
          <div class="question-text">${esc(q.question)}</div>
        `;
        explSection.appendChild(qBox);
      }

      // Script with highlights
      const scriptSection = document.createElement('div');
      scriptSection.className = 'script-section';
      const scriptTitle = document.createElement('div');
      scriptTitle.className = 'section-title';
      scriptTitle.innerHTML = '📝 スクリプト <span class="section-subtitle">（黄色のハイライトが聞き取りポイント）</span>';
      scriptSection.appendChild(scriptTitle);

      const dlg = document.createElement('div');
      dlg.className = 'dialogue-lines';
      q.lines.forEach((line, li) => {
        const cfg = SPEAKERS[line.speaker] || SPEAKERS.narrator;
        const el = document.createElement('div');
        el.className = 'dialogue-line';
        // Highlight last line for spoken-choices (the one being responded to)
        if (isSpokenChoices && li === q.lines.length - 1) {
          el.classList.add('dialogue-prompt');
        }
        el.innerHTML = `
          <div class="speaker-icon ${cfg.cls}" title="${cfg.label}">${cfg.icon}</div>
          <div class="dialogue-text">${highlightText(line.text, q.highlights)}</div>
        `;
        dlg.appendChild(el);
      });
      // For spoken-choices: show the response options in script
      if (isSpokenChoices && q.choices) {
        const respDiv = document.createElement('div');
        respDiv.className = 'spoken-responses';
        respDiv.innerHTML = '<div class="spoken-responses-label">応答の選択肢:</div>';
        q.choices.forEach((c, ci) => {
          const rEl = document.createElement('div');
          rEl.className = 'spoken-response-item' + ((ci + 1) === q.answer ? ' correct-response' : '');
          rEl.innerHTML = `<span class="spoken-response-num">${ci + 1}</span> ${esc(c)}`;
          respDiv.appendChild(rEl);
        });
        dlg.appendChild(respDiv);
      }
      scriptSection.appendChild(dlg);
      explSection.appendChild(scriptSection);

      // Japanese explanation
      if (q.explanation) {
        const explBox = document.createElement('div');
        explBox.className = 'explanation-box';
        const explTitle = document.createElement('div');
        explTitle.className = 'section-title';
        explTitle.textContent = '💡 解説';
        explBox.appendChild(explTitle);
        const explText = document.createElement('div');
        explText.className = 'explanation-text';
        explText.textContent = q.explanation;
        explBox.appendChild(explText);
        explSection.appendChild(explBox);
      }

      // Choice analysis
      if (q.choiceAnalysis) {
        const analysisBox = document.createElement('div');
        analysisBox.className = 'analysis-box';
        const analysisTitle = document.createElement('div');
        analysisTitle.className = 'section-title';
        analysisTitle.textContent = '📋 選択肢の分析';
        analysisBox.appendChild(analysisTitle);
        const analysisText = document.createElement('div');
        analysisText.className = 'analysis-text';
        const parts = q.choiceAnalysis.split(/選択肢\d/).filter(s => s.trim());
        if (parts.length > 0) {
          parts.forEach((part, i) => {
            const item = document.createElement('div');
            item.className = 'analysis-item';
            const isCorrect = (i + 1) === q.answer;
            if (isCorrect) item.classList.add('analysis-correct');
            item.innerHTML = `<span class="analysis-num">${i + 1}</span>${esc(part.trim())}`;
            analysisText.appendChild(item);
          });
        } else {
          analysisText.textContent = q.choiceAnalysis;
        }
        analysisBox.appendChild(analysisText);
        explSection.appendChild(analysisBox);
      }

      inner.appendChild(explSection);

    } else if (!q.choices && q.answer) {
      const ansInfo = document.createElement('div');
      ansInfo.className = 'answer-result correct-badge';
      ansInfo.style.marginTop = '12px';
      ansInfo.textContent = `正解: ${q.answer}`;
      inner.appendChild(ansInfo);
    }

    body.appendChild(inner);

    header.addEventListener('click', () => card.classList.toggle('expanded'));
    card.appendChild(header);
    card.appendChild(body);

    return card;
  }

  function handleAnswer(q, chosen, card) {
    userAnswers[q.number] = chosen;
    const newCard = createQuestionCard(q);
    newCard.classList.add('expanded');
    newCard.style.opacity = '1';
    newCard.style.transform = 'translateY(0)';
    card.replaceWith(newCard);
    updateScore();
  }

  // ===== Score =====
  function updateScore() {
    const part = EIKEN_DATA.parts[currentPartIndex];
    const nums = part.questions.map(q => q.number);
    let correct = 0, total = 0;
    nums.forEach(n => {
      if (userAnswers[n] !== undefined) {
        total++;
        const q = part.questions.find(q => q.number === n);
        if (userAnswers[n] === q.answer) correct++;
      }
    });

    if (total === 0) {
      scoreDisplay.innerHTML = '';
    } else {
      scoreDisplay.innerHTML = `
        <span class="score-correct">○ ${correct}</span>
        <span>/</span>
        <span class="score-wrong">✗ ${total - correct}</span>
        <span style="color:var(--text-muted)">（${total}問回答済）</span>
      `;
    }
  }

  // ===== Controls =====
  expandAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.question-card').forEach(c => c.classList.add('expanded'));
  });
  collapseAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.question-card').forEach(c => c.classList.remove('expanded'));
  });
  resetBtn.addEventListener('click', () => {
    if (confirm('解答をリセットしますか？')) {
      userAnswers = {};
      renderQuestions();
      updateScore();
    }
  });

  // ===== Utility =====
  function esc(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  // ===== Init =====
  function init() {
    renderTabs();
    renderPartInfo();
    renderQuestions();
  }

  // Start
  loadData();
})();
