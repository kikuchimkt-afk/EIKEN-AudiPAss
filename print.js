/**
 * AudiPass — 宿題プリント生成
 * 級・試験・パートを選んでA4プリントを生成
 */
(function () {
    'use strict';

    // ===== EXAM CATALOG (same as top.js) =====
    const EXAM_CATALOG = [
        {
            id: 'grade-pre1', name: 'CEFR B2（準1級相当）', nameEn: 'CSE 2304', icon: 'B2',
            color: '#f59e0b', colorRgb: '245, 158, 11',
            exams: [
                { id: '2018-3', label: '2018年度 第3回' },
                { id: '2019-1', label: '2019年度 第1回' },
                { id: '2019-2', label: '2019年度 第2回' },
                { id: '2019-3', label: '2019年度 第3回' },
                { id: '2020-1', label: '2020年度 第1回' },
                { id: '2020-3', label: '2020年度 第3回' },
                { id: '2021-1', label: '2021年度 第1回' },
                { id: '2021-2', label: '2021年度 第2回' },
                { id: '2021-3', label: '2021年度 第3回' },
                { id: '2022-1', label: '2022年度 第1回' },
                { id: '2022-2', label: '2022年度 第2回' },
                { id: '2022-3', label: '2022年度 第3回' },
                { id: '2023-1', label: '2023年度 第1回' },
                { id: '2023-2', label: '2023年度 第2回' },
                { id: '2023-3', label: '2023年度 第3回' },
                { id: '2024-1', label: '2024年度 第1回' },
                { id: '2024-2', label: '2024年度 第2回' },
                { id: '2024-3', label: '2024年度 第3回' },
                { id: '2025-1', label: '2025年度 第1回' },
                { id: '2025-2', label: '2025年度 第2回' },
                { id: '2025-3', label: '2025年度 第3回' }
            ]
        },
        {
            id: 'grade2', name: 'CEFR B1（２級相当）', nameEn: 'CSE 1980', icon: 'B1',
            color: '#4f8cff', colorRgb: '79, 140, 255',
            exams: [
                { id: '2018-1', label: '2018年度 第1回' },
                { id: '2018-2', label: '2018年度 第2回' },
                { id: '2018-3', label: '2018年度 第3回' },
                { id: '2019-1', label: '2019年度 第1回' },
                { id: '2019-2', label: '2019年度 第2回' },
                { id: '2019-3', label: '2019年度 第3回' },
                { id: '2020-1', label: '2020年度 第1回' },
                { id: '2020-2', label: '2020年度 第2回' },
                { id: '2020-3', label: '2020年度 第3回' },
                { id: '2021-1', label: '2021年度 第1回' },
                { id: '2021-2', label: '2021年度 第2回' },
                { id: '2021-3', label: '2021年度 第3回' },
                { id: '2022-1', label: '2022年度 第1回' },
                { id: '2022-2', label: '2022年度 第2回' },
                { id: '2022-3', label: '2022年度 第3回' },
                { id: '2023-1', label: '2023年度 第1回' },
                { id: '2023-2', label: '2023年度 第2回' },
                { id: '2023-3', label: '2023年度 第3回' },
                { id: '2024-1', label: '2024年度 第1回' },
                { id: '2024-2', label: '2024年度 第2回' },
                { id: '2024-3', label: '2024年度 第3回' },
                { id: '2025-1', label: '2025年度 第1回' },
                { id: '2025-2', label: '2025年度 第2回' },
                { id: '2025-3', label: '2025年度 第3回' }
            ]
        },
        {
            id: 'grade-pre2plus', name: 'CEFR A2-B1（準2級プラス相当）', nameEn: 'CSE 1878', icon: 'A2+',
            color: '#8b5cf6', colorRgb: '139, 92, 246',
            exams: [
                { id: '2025-1', label: '2025年度 第1回' },
                { id: '2025-2', label: '2025年度 第2回' },
                { id: '2025-3', label: '2025年度 第3回' }
            ]
        },
        {
            id: 'grade-pre2', name: 'CEFR A2（準2級相当）', nameEn: 'CSE 1728', icon: 'A2',
            color: '#10b981', colorRgb: '16, 185, 129',
            exams: [
                { id: '2018-1', label: '2018年度 第1回' },
                { id: '2018-2', label: '2018年度 第2回' },
                { id: '2018-3', label: '2018年度 第3回' },
                { id: '2019-1', label: '2019年度 第1回' },
                { id: '2019-2', label: '2019年度 第2回' },
                { id: '2019-3', label: '2019年度 第3回' },
                { id: '2020-1', label: '2020年度 第1回' },
                { id: '2020-2', label: '2020年度 第2回' },
                { id: '2020-3', label: '2020年度 第3回' },
                { id: '2021-1', label: '2021年度 第1回' },
                { id: '2021-2', label: '2021年度 第2回' },
                { id: '2021-3', label: '2021年度 第3回' },
                { id: '2022-1', label: '2022年度 第1回' },
                { id: '2022-2', label: '2022年度 第2回' },
                { id: '2022-3', label: '2022年度 第3回' },
                { id: '2023-1', label: '2023年度 第1回' },
                { id: '2023-2', label: '2023年度 第2回' },
                { id: '2023-3', label: '2023年度 第3回' },
                { id: '2024-1', label: '2024年度 第1回' },
                { id: '2024-2', label: '2024年度 第2回' },
                { id: '2024-3', label: '2024年度 第3回' },
                { id: '2025-1', label: '2025年度 第1回' },
                { id: '2025-2', label: '2025年度 第2回' },
                { id: '2025-3', label: '2025年度 第3回' }
            ]
        },
        {
            id: 'grade3', name: 'CEFR A1（３級相当）', nameEn: 'CSE 1456', icon: 'A1',
            color: '#f472b6', colorRgb: '244, 114, 182',
            exams: []
        }
    ];

    const BASE_URL = 'https://eiken-audi-p-ass.vercel.app/';

    // DOM
    const gradeChips = document.getElementById('gradeChips');
    const examCheckboxes = document.getElementById('examCheckboxes');
    const partCheckboxes = document.getElementById('partCheckboxes');
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const printPreview = document.getElementById('printPreview');
    const printContent = document.getElementById('printContent');

    let selectedGrade = null;

    // ===== Render Grade Chips =====
    function renderGradeChips() {
        gradeChips.innerHTML = '';
        EXAM_CATALOG.forEach(grade => {
            if (grade.exams.length === 0) return;
            const chip = document.createElement('button');
            chip.className = 'grade-chip';
            chip.textContent = grade.name;
            chip.style.setProperty('--chip-color', grade.color);
            chip.addEventListener('click', () => selectGrade(grade, chip));
            gradeChips.appendChild(chip);
        });
    }

    function selectGrade(grade, chip) {
        selectedGrade = grade;
        document.querySelectorAll('.grade-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderExamCheckboxes(grade);
        updateGenerateBtn();
    }

    // ===== Render Exam Checkboxes =====
    function renderExamCheckboxes(grade) {
        examCheckboxes.innerHTML = '';

        // Select All / Deselect All
        const allBtn = document.createElement('button');
        allBtn.className = 'select-all-btn';
        allBtn.textContent = '全選択';
        allBtn.addEventListener('click', () => {
            const boxes = examCheckboxes.querySelectorAll('input[type="checkbox"]');
            const allChecked = [...boxes].every(b => b.checked);
            boxes.forEach(b => { b.checked = !allChecked; });
            allBtn.textContent = allChecked ? '全選択' : '全解除';
            updateGenerateBtn();
        });
        examCheckboxes.appendChild(allBtn);

        grade.exams.forEach(exam => {
            const label = document.createElement('label');
            label.className = 'exam-checkbox-label';
            label.innerHTML = `<input type="checkbox" value="${exam.id}"><span>${exam.label}</span>`;
            label.querySelector('input').addEventListener('change', updateGenerateBtn);
            examCheckboxes.appendChild(label);
        });
    }

    // ===== Update Generate Button =====
    function updateGenerateBtn() {
        const checkedExams = getSelectedExams();
        const checkedParts = getSelectedParts();
        generateBtn.disabled = !selectedGrade || checkedExams.length === 0 || checkedParts.length === 0;
    }

    function getSelectedExams() {
        return [...examCheckboxes.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
    }

    function getSelectedParts() {
        return [...partCheckboxes.querySelectorAll('input[type="checkbox"]:checked')].map(cb => parseInt(cb.value));
    }

    // Part checkbox change
    partCheckboxes.querySelectorAll('input').forEach(cb => {
        cb.addEventListener('change', updateGenerateBtn);
    });

    // ===== Generate Print =====
    generateBtn.addEventListener('click', async () => {
        if (!selectedGrade) return;

        const examIds = getSelectedExams();
        const partIndices = getSelectedParts();
        const showChoices = document.getElementById('optChoices').checked;
        const showQR = document.getElementById('optQR').checked;
        const showAnswerGrid = false;

        generateBtn.textContent = '読み込み中...';
        generateBtn.disabled = true;

        try {
            // Fetch all selected exam data
            const examDataList = [];
            for (const examId of examIds) {
                const url = `data/${selectedGrade.id}/${examId}/data.json`;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`Failed to load ${url}`);
                const data = await resp.json();
                examDataList.push({ examId, data, label: selectedGrade.exams.find(e => e.id === examId)?.label || examId });
            }

            // Render sheets
            printContent.innerHTML = '';
            for (const { examId, data, label } of examDataList) {
                const sheet = createPrintSheet(data, label, examId, partIndices, showChoices, showQR, showAnswerGrid);
                printContent.appendChild(sheet);
            }

            // Generate QR codes (async)
            if (showQR) {
                await generateAllQRCodes();
            }

            printPreview.style.display = '';
            printBtn.style.display = '';
            generateBtn.textContent = 'プリントを生成';
            generateBtn.disabled = false;

            // Scroll to preview
            printPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (err) {
            console.error(err);
            alert('データの読み込みに失敗しました: ' + err.message);
            generateBtn.textContent = 'プリントを生成';
            generateBtn.disabled = false;
        }
    });

    // ===== Create Print Sheet =====
    function createPrintSheet(data, examLabel, examId, partIndices, showChoices, showQR, showAnswerGrid) {
        const sheet = document.createElement('div');
        sheet.className = 'print-sheet';

        // Header
        const header = document.createElement('div');
        header.className = 'sheet-header';
        header.innerHTML = `
      <div class="sheet-title">${selectedGrade.name} リスニング 宿題プリント</div>
      <div class="sheet-subtitle">${examLabel} 一次試験リスニング</div>
    `;
        sheet.appendChild(header);

        // Info row
        const infoRow = document.createElement('div');
        infoRow.className = 'sheet-info-row';
        infoRow.innerHTML = `
      <div>名前: <span class="name-field">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
      <div>日付: <span class="date-field">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
    `;
        sheet.appendChild(infoRow);

        // QR Code
        if (showQR) {
            const qrSection = document.createElement('div');
            qrSection.className = 'qr-section';
            const qrDiv = document.createElement('div');
            qrDiv.className = 'qr-container';
            qrDiv.dataset.url = `${BASE_URL}quiz.html?grade=${selectedGrade.id}&exam=${examId}`;
            qrSection.appendChild(qrDiv);
            const qrText = document.createElement('div');
            qrText.className = 'qr-text';
            qrText.innerHTML = `📱 QRコードをスマホで読み取って音声を聴きましょう<br><strong>AudiPass</strong> で問題を解いて自動採点できます`;
            qrSection.appendChild(qrText);
            sheet.appendChild(qrSection);
        }

        // Parts
        const allQuestions = [];
        partIndices.forEach(pi => {
            if (pi >= data.parts.length) return;
            const part = data.parts[pi];
            const section = document.createElement('div');
            section.className = 'part-section';

            const title = document.createElement('div');
            title.className = 'part-title';
            title.textContent = `${part.name}（${part.nameEn}）— ${part.questionRange || ''}`;
            section.appendChild(title);

            // Instruction
            const isSpoken = part.partType === 'spoken-choices';
            if (isSpoken) {
                const instr = document.createElement('div');
                instr.className = 'part-instruction';
                instr.textContent = '※ 選択肢は音声で放送されます。音声を聴いて1, 2, 3の中から答えを選んでください。';
                section.appendChild(instr);
            }

            // Questions - format to match actual exam layout
            // Analyzed from actual exam PDFs:
            // ALL grades: Part 1/2 = No. + choices only (question text is read aloud)
            // Pre-1 only: Part 2 has (A)-(F) passage labels (2 questions/passage)
            // Pre-1 only: Part 3 has (G)-(K) labels with Situation + Question + choices
            // Other grades: NO passage labels, NO question text shown
            const partNum = pi + 1;
            const isGradePre1 = selectedGrade.id === 'grade-pre1';

            // Pre-1 passage label config
            let passageLabelOffset = 0;
            let questionsPerPassage = 2;
            if (isGradePre1 && partNum === 3) {
                questionsPerPassage = 1;
                // Part 3 continues after Part 2's passage labels
                if (data.parts.length > 1) {
                    passageLabelOffset = Math.ceil(data.parts[1].questions.length / 2);
                }
            }
            let passageCounter = 0;

            part.questions.forEach((q, qi) => {
                allQuestions.push(q);
                const qBlock = document.createElement('div');
                qBlock.className = 'q-block';

                let html = '';

                // Passage labels: Pre-1 Part 2 and 3 only
                if (isGradePre1 && partNum >= 2 && showChoices) {
                    const isNewGroup = (qi % questionsPerPassage === 0);
                    if (isNewGroup) {
                        const letterIndex = passageLabelOffset + passageCounter;
                        const letter = String.fromCharCode(65 + letterIndex);
                        html += `<div class="q-passage-label">(${letter})</div>`;
                        passageCounter++;
                    }
                }

                // Question number
                html += `<div class="q-number">No. ${q.number}</div>`;

                // Situation + Question: Pre-1 Part 3 only
                if (isGradePre1 && partNum === 3 && q.situation) {
                    html += `<div class="q-situation"><span class="situation-label">Situation:</span> ${esc(q.situation)}</div>`;
                    if (q.question) {
                        html += `<div class="q-question">${esc(q.question)}</div>`;
                    }
                }
                // All other parts/grades: do NOT show question text

                // Show choices (unless spoken-choices or user disabled)
                if (showChoices && !isSpoken && q.choices && q.choices.length > 0) {
                    html += `<div class="q-choices">
              ${q.choices.map((c, i) => `<div class="q-choice">${i + 1}. ${esc(c)}</div>`).join('')}
            </div>`;
                }

                qBlock.innerHTML = html;
                section.appendChild(qBlock);
            });

            sheet.appendChild(section);
        });

        // Answer Grid
        if (showAnswerGrid && allQuestions.length > 0) {
            const gridSection = document.createElement('div');
            gridSection.className = 'answer-grid-section';
            gridSection.innerHTML = `<div class="answer-grid-title">解答欄</div>`;
            const grid = document.createElement('div');
            grid.className = 'answer-grid';

            allQuestions.forEach(q => {
                const numChoices = q.choices ? q.choices.length : 3;
                const cell = document.createElement('div');
                cell.className = 'answer-cell';
                let bubblesHtml = '';
                for (let i = 1; i <= numChoices; i++) {
                    bubblesHtml += `<div class="bubble">${i}</div>`;
                }
                cell.innerHTML = `<span class="answer-num">No.${q.number}</span><div class="answer-bubbles">${bubblesHtml}</div>`;
                grid.appendChild(cell);
            });

            gridSection.appendChild(grid);
            sheet.appendChild(gridSection);
        }

        // Footer
        const footer = document.createElement('div');
        footer.className = 'sheet-footer';
        footer.textContent = 'AudiPass — Listening Practice';
        sheet.appendChild(footer);

        return sheet;
    }

    // ===== Generate QR Codes =====
    async function generateAllQRCodes() {
        const containers = printContent.querySelectorAll('.qr-container');
        for (const container of containers) {
            const url = container.dataset.url;
            try {
                new QRCode(container, {
                    text: url,
                    width: 80,
                    height: 80,
                    colorDark: '#1a1a1a',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });
            } catch (e) {
                console.error('QR generation error:', e);
            }
        }
    }

    // ===== Print =====
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // ===== Utility =====
    function esc(text) {
        if (!text) return '';
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

    // ===== Init =====
    renderGradeChips();

})();
