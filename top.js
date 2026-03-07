/**
 * 英検リスニング練習 — トップページ
 * 級の選択 → 試験の選択 → quiz.html に遷移
 */
(function () {
    'use strict';

    // ===== Exam Catalog =====
    const EXAM_CATALOG = [
        {
            id: 'grade-pre1',
            name: '準1級',
            nameEn: 'Pre-1',
            icon: '準1',
            color: '#f59e0b',
            colorRgb: '245, 158, 11',
            exams: [
                { id: '2018-3', label: '2018年度 第3回', sub: '一次試験リスニング' },
                { id: '2019-1', label: '2019年度 第1回', sub: '一次試験リスニング' },
                { id: '2019-2', label: '2019年度 第2回', sub: '一次試験リスニング' },
                { id: '2019-3', label: '2019年度 第3回', sub: '一次試験リスニング' },
                { id: '2020-1', label: '2020年度 第1回', sub: '一次試験リスニング' },
                { id: '2020-3', label: '2020年度 第3回', sub: '一次試験リスニング' },
                { id: '2021-1', label: '2021年度 第1回', sub: '一次試験リスニング' },
                { id: '2021-2', label: '2021年度 第2回', sub: '一次試験リスニング' },
                { id: '2021-3', label: '2021年度 第3回', sub: '一次試験リスニング' },
                { id: '2022-1', label: '2022年度 第1回', sub: '一次試験リスニング' },
                { id: '2022-2', label: '2022年度 第2回', sub: '一次試験リスニング' },
                { id: '2022-3', label: '2022年度 第3回', sub: '一次試験リスニング' },
                { id: '2023-1', label: '2023年度 第1回', sub: '一次試験リスニング' },
                { id: '2023-2', label: '2023年度 第2回', sub: '一次試験リスニング' },
                { id: '2023-3', label: '2023年度 第3回', sub: '一次試験リスニング' },
                { id: '2024-1', label: '2024年度 第1回', sub: '一次試験リスニング' },
                { id: '2024-2', label: '2024年度 第2回', sub: '一次試験リスニング' },
                { id: '2024-3', label: '2024年度 第3回', sub: '一次試験リスニング' },
                { id: '2025-1', label: '2025年度 第1回', sub: '一次試験リスニング' },
                { id: '2025-2', label: '2025年度 第2回', sub: '一次試験リスニング' },
                { id: '2025-3', label: '2025年度 第3回', sub: '一次試験リスニング' }
            ]
        },
        {
            id: 'grade2',
            name: '2級',
            nameEn: 'Grade 2',
            icon: '2',
            color: '#4f8cff',
            colorRgb: '79, 140, 255',
            exams: [
                { id: '2020-1', label: '2020年度 第1回', sub: '一次試験リスニング' },
                { id: '2020-2', label: '2020年度 第2回', sub: '一次試験リスニング' },
                { id: '2020-3', label: '2020年度 第3回', sub: '一次試験リスニング' },
                { id: '2021-1', label: '2021年度 第1回', sub: '一次試験リスニング' },
                { id: '2021-2', label: '2021年度 第2回', sub: '一次試験リスニング' },
                { id: '2021-3', label: '2021年度 第3回', sub: '一次試験リスニング' },
                { id: '2022-1', label: '2022年度 第1回', sub: '一次試験リスニング' },
                { id: '2022-2', label: '2022年度 第2回', sub: '一次試験リスニング' },
                { id: '2022-3', label: '2022年度 第3回', sub: '一次試験リスニング' },
                { id: '2023-1', label: '2023年度 第1回', sub: '一次試験リスニング' },
                { id: '2023-2', label: '2023年度 第2回', sub: '一次試験リスニング' },
                { id: '2023-3', label: '2023年度 第3回', sub: '一次試験リスニング' },
                { id: '2024-1', label: '2024年度 第1回', sub: '一次試験リスニング' },
                { id: '2024-2', label: '2024年度 第2回', sub: '一次試験リスニング' },
                { id: '2024-3', label: '2024年度 第3回', sub: '一次試験リスニング' },
                { id: '2025-1', label: '2025年度 第1回', sub: '一次試験リスニング' },
                { id: '2025-2', label: '2025年度 第2回', sub: '一次試験リスニング' },
                { id: '2025-3', label: '2025年度 第3回', sub: '一次試験リスニング' }
            ]
        },
        {
            id: 'grade-pre2plus',
            name: '準2級プラス',
            nameEn: 'Pre-2 Plus',
            icon: '準2+',
            color: '#8b5cf6',
            colorRgb: '139, 92, 246',
            exams: [
                { id: '2025-1', label: '2025年度 第1回', sub: '一次試験リスニング' },
                { id: '2025-2', label: '2025年度 第2回', sub: '一次試験リスニング' },
                { id: '2025-3', label: '2025年度 第3回', sub: '一次試験リスニング' }
            ]
        },
        {
            id: 'grade-pre2',
            name: '準2級',
            nameEn: 'Pre-2',
            icon: '準2',
            color: '#10b981',
            colorRgb: '16, 185, 129',
            exams: [
                { id: '2024-1', label: '2024年度 第1回', sub: '一次試験リスニング' },
                { id: '2024-2', label: '2024年度 第2回', sub: '一次試験リスニング' },
                { id: '2024-3', label: '2024年度 第3回', sub: '一次試験リスニング' },
                { id: '2025-1', label: '2025年度 第1回', sub: '一次試験リスニング' },
                { id: '2025-2', label: '2025年度 第2回', sub: '一次試験リスニング' },
                { id: '2025-3', label: '2025年度 第3回', sub: '一次試験リスニング' }
            ]
        },
        {
            id: 'grade3',
            name: '3級',
            nameEn: 'Grade 3',
            icon: '3',
            color: '#f472b6',
            colorRgb: '244, 114, 182',
            exams: []
        }
    ];

    // DOM
    const gradeGrid = document.getElementById('gradeGrid');
    const gradeSection = document.getElementById('gradeSection');
    const examSection = document.getElementById('examSection');
    const examSectionTitle = document.getElementById('examSectionTitle');
    const examList = document.getElementById('examList');
    const noExams = document.getElementById('noExams');
    const backToGrades = document.getElementById('backToGrades');

    // ===== Render Grade Cards =====
    function renderGrades() {
        gradeGrid.innerHTML = '';
        EXAM_CATALOG.forEach(grade => {
            const card = document.createElement('div');
            card.className = 'grade-card' + (grade.exams.length === 0 ? ' disabled' : '');
            card.style.setProperty('--grade-color', grade.color);
            card.style.setProperty('--grade-color-rgb', grade.colorRgb);

            const examCount = grade.exams.length;
            const countText = examCount > 0 ? `${examCount}件の試験データ` : '準備中';

            card.innerHTML = `
        <div class="grade-icon">${grade.icon}</div>
        <div class="grade-name">${grade.name}</div>
        <div class="grade-name-en">${grade.nameEn}</div>
        <div class="grade-count">
          <span class="grade-count-dot"></span>
          ${countText}
        </div>
      `;

            if (grade.exams.length > 0) {
                card.addEventListener('click', () => showExams(grade));
            }

            gradeGrid.appendChild(card);
        });
    }

    // ===== Show Exam List =====
    function showExams(grade) {
        gradeSection.classList.add('hidden');
        examSection.classList.remove('hidden');
        examSectionTitle.textContent = `${grade.name} — 試験を選択`;
        examSectionTitle.style.color = grade.color;

        examList.innerHTML = '';

        if (grade.exams.length === 0) {
            noExams.classList.remove('hidden');
            examList.style.display = 'none';
            return;
        }

        noExams.classList.add('hidden');
        examList.style.display = '';

        grade.exams.forEach(exam => {
            const card = document.createElement('a');
            card.className = 'exam-card';
            card.href = `quiz.html?grade=${grade.id}&exam=${exam.id}`;

            card.innerHTML = `
        <div class="exam-info">
          <div class="exam-label">${exam.label}</div>
          <div class="exam-sub">${exam.sub || ''}</div>
        </div>
        <div class="exam-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </div>
      `;

            examList.appendChild(card);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===== Back to Grades =====
    function showGrades() {
        examSection.classList.add('hidden');
        gradeSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    backToGrades.addEventListener('click', showGrades);

    // ===== Init =====
    renderGrades();
})();
