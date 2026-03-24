---
description: 2級のリスニング過去問をAudiPassに追加する
---
// turbo-all

# 2級リスニング過去問の追加ワークフロー

## 前提条件
- ユーザーが以下を提供する:
  1. ソースフォルダパス（例: `G:\マイドライブ\text\bookshelf\英検過去問\2級\2級YYYY-N`）
  2. 正解番号の画像（第1部: No.1-15、第2部: No.16-30）

## 試験の構造（2級リスニング）
- **第1部 (Part 1)**: No.1-15（対話 → 質問）各問4択
- **第2部 (Part 2)**: No.16-30（パッセージ → 質問）各問4択
- 合計30問

## ステップ

### 1. ソースフォルダの確認
ソースフォルダを `list_dir` で確認する。以下のファイルが必要:
- **音声ファイル**: Part 1用とPart 2用の2つのMP3（ファイル名は年度ごとに異なる）
  - 例: `2Q-part1.mp3`, `2Q-part2.mp3` または `2Q-part11.mp3`, `2Q-part21.mp3`
- **スクリプトPDF**: リスニング原稿（ファイル名に`script`を含む）
- **試験PDF**: 選択肢が含まれる本試験冊子

### 2. PDFからテキスト抽出
pymupdf (fitz) を使ってPDFからテキストを抽出する:
```python
import fitz
doc = fitz.open(r'パス\script.pdf')
with open(r'C:\tmp\script_g2_YYYY_N.txt', 'w', encoding='utf-8') as f:
    for i, page in enumerate(doc):
        f.write(f'=== PAGE {i+1} ===\n')
        f.write(page.get_text() + '\n')
```
- スクリプトPDF → `C:\tmp\script_g2_YYYY_N.txt`
- 試験PDF → `C:\tmp\exam_g2_YYYY_N.txt`

### 3. 抽出テキストの確認
- スクリプトからNo.1-30の対話/パッセージと質問を確認
- 試験冊子のリスニングセクション（ページ後半、「第1部」「第2部」のあたり）から各問の4つの選択肢を確認

### 4. 生成スクリプトの作成
`C:\tmp\gen_g2_YYYY_N.py` を作成する。以下の構造に従う:

#### 音声分割ロジック（重要！）
```python
import os, subprocess, re, json, imageio_ffmpeg
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

# 8秒以上の無音 = 解答時間の区切り（-35dB, d=2.0で検出）
def find_answer_silences(mp3):
    r = subprocess.run([FFMPEG, "-i", mp3, "-af", "silencedetect=n=-35dB:d=2.0", "-f", "null", "-"],
                       capture_output=True, text=True, encoding='utf-8', errors='replace')
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr or "")]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr or "")]
    return sorted([(s, e) for s, e in zip(starts, ends) if e - s > 8], key=lambda x: x[0])

# 一般的な無音検出（イントロ終了位置の特定に使用）
def find_silences(mp3, noise=-38, dur=1.8):
    ...

# Part 1: イントロ後のQ1開始位置を特定し、15問に分割
# Part 2: 15問に分割（イントロがある場合とない場合がある）
```

#### 分割のルール
- **Part 1**: `find_answer_silences` で15個の解答無音区間を検出 → 各問の境界として使う
  - Q1の開始: イントロ末尾の無音（`find_silences`で検出）の終了位置
  - Q(n)の開始: 前の解答無音区間の終了位置
  - Q(n)の終了: その問の解答無音区間の開始位置
- **Part 2**: 同様に15問分割。Q16の開始はイントロ無音の終了位置（`0.0s`の場合もある）

#### データ構造
各問の形式（Part 1 = 対話形式）:
```json
{
  "number": 1,
  "lines": [
    {"speaker": "male", "text": "..."},
    {"speaker": "female", "text": "..."}
  ],
  "question": "...",
  "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "answer": 1,
  "audioFile": "audio/part1_q01.mp3",
  "explanation": "日本語の解説",
  "highlights": ["本文中のキーフレーズ"],
  "choiceAnalysis": "選択肢1→... 選択肢2→... 選択肢3→... 選択肢4→..."
}
```
Part 2 の場合、`lines` は1つだけで `"speaker": "narrator"`。

#### 正解の辞書
ユーザーが提供した正解画像から読み取り:
```python
answers = {1:3, 2:3, 3:1, ..., 30:1}
```

#### 出力先
```python
BASE = r"g:\マイドライブ\AudiPass"
OUT = os.path.join(BASE, "data", "grade2", "YYYY-N")  # 例: 2023-3
AUDIO_OUT = os.path.join(OUT, "audio")
```

#### data.json の構造
```json
{
  "title": "YYYY年度 第N回検定一次試験 英検2級 リスニング",
  "parts": [
    {
      "name": "第1部", "nameEn": "Part 1",
      "description": "対話を聞き、その質問に対して最も適切な答えを1, 2, 3, 4の中から一つ選ぶ形式です。",
      "questionRange": "No. 1 〜 No. 15",
      "questions": [...]
    },
    {
      "name": "第2部", "nameEn": "Part 2",
      "description": "英文を聞き、その質問に対して最も適切な答えを1, 2, 3, 4の中から一つ選ぶ形式です。",
      "questionRange": "No. 16 〜 No. 30",
      "questions": [...]
    }
  ]
}
```

### 5. スクリプトの実行
```bash
python C:\tmp\gen_g2_YYYY_N.py 2>&1 | Out-File C:\tmp\gen_g2_YYYY_N_out.txt -Encoding utf8
```

### 6. 出力の検証
出力ファイルで以下を確認:
- Part 1: **15個の解答無音区間**が検出されていること
- Part 2: **15〜16個の解答無音区間**が検出されていること（16個目は末尾のエンディング無音）
- 全30問の音声ファイルが生成されていること
- 各セグメントの長さが妥当であること（Part 1: 25-42秒、Part 2: 29-72秒が目安）

### 7. top.js のカタログ更新
`g:\マイドライブ\AudiPass\top.js` の `EXAM_CATALOG` の `grade2` セクションに新しい試験を**時系列順で**追加:
```javascript
{ id: 'YYYY-N', label: 'YYYY年度 第N回', sub: '一次試験リスニング' },
```

### 8. 完了報告
ユーザーに以下を報告:
- 音声分割の結果（各パートの問題数とセグメント長の範囲）
- カタログの更新内容
- 現在の2級試験一覧

## 注意事項
- 音声ファイル名はフォルダによって異なる（`2Q-part1.mp3` or `2Q-part11.mp3` など）。必ず `list_dir` で確認する
- `explanation` は日本語で書く（なぜその答えが正しいかを簡潔に説明）
- `choiceAnalysis` は日本語で全4択の分析（正解の根拠と不正解の理由）
- `highlights` はスクリプト中の根拠となるフレーズ（英語のまま）
- Part 1 の speaker は `male`/`female`、Part 2 は `narrator`
- 出力パスは `data/grade2/YYYY-N/` 形式（ハイフン区切り）
