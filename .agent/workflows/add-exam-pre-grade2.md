---
description: 準2級のリスニング過去問をAudiPassに追加する
---
// turbo-all

# 準2級リスニング過去問の追加ワークフロー

## 前提条件
- ユーザーが以下を提供する:
  1. ソースフォルダパス（例: `G:\マイドライブ\text\bookshelf\英検過去問\準2級\準2級YYYY-N`）
  2. 正解番号の画像（第1部: No.1-10、第2部: No.11-20、第3部: No.21-30）

## 試験の構造（準2級リスニング）— 2級との違いに注意！
- **第1部 (Part 1)**: No.1-10（対話 → **3択・選択肢は音声放送**）
  - `partType: "spoken-choices"`、`question: null`
  - **UI: 回答前は番号(1,2,3)のみ表示、回答後に英文テキスト表示**
- **第2部 (Part 2)**: No.11-20（対話 → 質問 → 4択印刷）
- **第3部 (Part 3)**: No.21-30（パッセージ → 質問 → 4択印刷）
- **音声ファイル: 3つ**（`P2Q-part1.mp3`, `P2Q-part2.mp3`, `P2Q-part3.mp3`）
- 合計30問

## ステップ

### 1. ソースフォルダの確認
`list_dir` で確認。必要ファイル:
- **音声**: Part 1/2/3 用の3つのMP3
- **スクリプトPDF**: ファイル名に`script`を含む
- **試験PDF**: 本試験冊子（選択肢確認用）

### 2. PDFからテキスト抽出
```python
import fitz
doc = fitz.open(r'パス\script.pdf')
text = ''
for i in range(len(doc)):
    text += f'=== PAGE {i+1} ===\n' + doc[i].get_text() + '\n'
doc.close()
with open(r'C:\tmp\script_p2_YYYY_N.txt', 'w', encoding='utf-8') as f:
    f.write(text)
```

### 3. 生成スクリプトの作成
`C:\tmp\gen_p2_YYYY_N.py` を作成。

#### 音声分割ロジック（3パート共通）
```python
# 8秒以上の無音 = 解答時間の区切り
def find_answer_silences(mp3):  # n=-35dB, d=2.0, filter > 8s

# 各パートで10個の解答無音区間を検出 → 10問に分割
```

#### Part 1 のデータ構造（3択・spoken-choices）
```json
{
  "number": 1,
  "lines": [
    {"speaker": "male", "text": "..."},
    {"speaker": "female", "text": "..."},
    {"speaker": "male", "text": "..."}
  ],
  "question": null,
  "choices": ["選択肢1", "選択肢2", "選択肢3"],
  "answer": 3,
  "audioFile": "audio/part1_q01.mp3",
  "explanation": "日本語解説",
  "highlights": ["キーフレーズ"],
  "choiceAnalysis": "選択肢1→... 選択肢2→... 選択肢3→..."
}
```
- `question` は **`null`**（質問文なし）
- `choices` は **3つ**（スクリプトの★1/☆1等から取得）

#### Part 2/3 のデータ構造（4択・通常形式）
2級のPart 1/Part 2と同じ形式。

#### data.json の構造
```json
{
  "title": "YYYY年度 第N回検定一次試験 英検準2級 リスニング",
  "parts": [
    {
      "name": "第1部", "nameEn": "Part 1",
      "description": "対話を聞き、最後の文に対する応答として最も適切なものを、放送される1, 2, 3の中から一つ選ぶ形式です。",
      "questionRange": "No. 1 〜 No. 10",
      "partType": "spoken-choices",
      "questions": [...]
    },
    {
      "name": "第2部", "nameEn": "Part 2",
      "description": "対話を聞き、その質問に対して最も適切な答えを1, 2, 3, 4の中から一つ選ぶ形式です。",
      "questionRange": "No. 11 〜 No. 20",
      "questions": [...]
    },
    {
      "name": "第3部", "nameEn": "Part 3",
      "description": "英文を聞き、その質問に対して最も適切な答えを1, 2, 3, 4の中から一つ選ぶ形式です。",
      "questionRange": "No. 21 〜 No. 30",
      "questions": [...]
    }
  ]
}
```

#### 出力先
```python
OUT = os.path.join(BASE, "data", "grade-pre2", "YYYY-N")
```

### 4. スクリプトの実行
```bash
python C:\tmp\gen_p2_YYYY_N.py 2>&1 | Out-File C:\tmp\gen_p2_YYYY_N_out.txt -Encoding utf8
```

### 5. 出力の検証
- 各パート: **10個の解答無音区間**が検出されていること
- 全30問の音声ファイルが生成されていること

### 6. top.js のカタログ更新
`grade-pre2` の `exams` に**時系列順で**追加:
```javascript
{ id: 'YYYY-N', label: 'YYYY年度 第N回', sub: '一次試験リスニング' },
```

## 注意事項
- 音声ファイル名はフォルダによって異なる。必ず `list_dir` で確認
- Part 1 の `question` は必ず `null` にする
- Part 1 のスクリプト記号: ★=男性A, ☆=女性A, ☆☆=ナレーター/女性B
- Part 1 の speaker は `male`/`female`、Part 2/3 は対話なら `male`/`female`、パッセージなら `narrator`
- `explanation`, `choiceAnalysis` は日本語
