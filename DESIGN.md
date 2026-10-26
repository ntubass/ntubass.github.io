---
version: alpha
name: 臺大工管系學會 — 牛皮紙拼貼
description: 延伸系學會 logo 的手作拼貼風：牛皮紙底、撕紙卡片、拍立得與紙膠帶，照片是主角、文字是重點。
colors:
  kraft: "#ddd5c4"
  paper: "#fbf8f1"
  paper-warm: "#efe9dc"
  ink: "#2b2420"
  ink-soft: "#5f564a"
  red: "#9a3a33"
  red-text: "#b5524a"
  gold: "#bc8d3b"
  gold-bright: "#d1a548"
  tape-gold: "rgba(188, 141, 59, 0.55)"
  tape-red: "rgba(154, 58, 51, 0.45)"
  dark-bg: "#1f1a17"
typography:
  display:
    fontFamily: Noto Sans TC
    fontWeight: 900
    letterSpacing: -0.01em
    lineHeight: 1.12
  heading:
    fontFamily: Noto Sans TC
    fontWeight: 900
    lineHeight: 1.25
  body:
    fontFamily: Noto Sans TC
    fontWeight: 500
    lineHeight: 1.85
  label:
    fontFamily: Noto Sans TC
    fontWeight: 700
rounded:
  button: 14px
  pill: 999px
  card: 6px
  photo: 2px
spacing:
  section: 72px
  section-lg: 96px
  gutter: 16px
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
  nav-link-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-warm}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
---

## Overview

系學會的 logo 是手作拼貼：撕下來的紙、牛皮紙底、紅星星、金星芒。網站直接延伸這個材質，
讓人一看就知道是同一個系學會。整體感覺是「活潑的學生感」，像一本貼滿活動照片的手帳。

- **照片是主角**：首頁 Hero 是鋪滿的拍立得拼貼，跟著視窗等比縮放。
- **文字是重點**：標題放在最上層的撕紙卡片上，粗黑體、大字。
- **材質要真**：背景有紙纖維、輕微皺褶與對摺的摺痕，但要淡，不能搶照片。

## Colors

- `kraft` 是全站背景，取自 logo 的牛皮紙（原色 `#C5BBA2` 調淡）。
- `paper` 是卡片、拍立得相框、撕紙卡片的底色。
- `ink` 是主要文字色，不用純黑。`ink-soft` 是次要文字，在 `kraft` 上對比仍要達 4.5:1。
- `red`（logo 的紅星星）只用在主按鈕與少量重點標示；`red-text` 是需要放在淺底上的紅色小字。
- `gold`（logo 的金星芒）用在螢光筆底線、紙膠帶、預約狀態等輔助標示。
- 程式裡的對應：Tailwind 的 `neutral` 是暖灰（paper → ink）、`yellow` 是金色系、`orange` 是紅色系，
  所以既有的 `bg-yellow-400`、`text-orange-400` 會自動變成品牌色。

## Typography

- 只用 **Noto Sans TC（思源黑體）**，不用宋體。標題 900、內文 500、標籤 700。
- 中文標題一律加 `word-break: keep-all`，只在標點後換行，不能斷在詞的中間。
- 段落用 `text-wrap: pretty`，行高 1.85。

## Layout

- 內容寬度最多 1320px；首頁 Hero 拼貼可以跟著視窗放大到 1680px，且不超過一個畫面高。
- 區塊之間要有足夠留白（72–96px）。交替的區塊用「紙張」底色，而不是突然變成深色的區塊。
- 手機版（760px 以下）照片在上、文字卡片在下，不做複雜疊放。

## Elevation & Depth

- 陰影帶暖色：`rgba(60, 45, 30, …)`，不用純黑陰影。
- 拍立得與撕紙卡片有明顯的落影；一般卡片只有淡淡的陰影。
- 按鈕用 `4px 5px 0` 的硬陰影加 2px 墨色邊框，像貼紙；按下時陰影變小、往下沉。

## Shapes

- 拍立得：白框、下緣留白較寬，微微傾斜（-6° 到 7°），頂端有紙膠帶。
- 撕紙卡片：邊緣用 clip-path 做出不規則的撕痕。
- 按鈕 14px 圓角；導覽列的目前頁面是墨色膠囊。

## Components

- **Hero 拼貼**（`HomeHero.astro`）：10 個固定位置的拍立得，照片由 `src/data_files/hero.ts` 設定。
- **內頁 Hero**（`PageHero.astro`）：左邊撕紙標題卡、右邊一張傾斜的大拍立得。
- **幹部照片**：拍立得相框加紙膠帶。
- **主按鈕**紅底；**次按鈕**紙色底。兩者都有墨色邊框與硬陰影。

## Do's and Don'ts

- Do：用系學會自己的照片；照片沒有到位前，說明文字留白，不要編造活動名稱。
- Do：照片可以互相遮擋，但按鈕和文字一定要在最上層，不能被蓋住。
- Don't：不要在每個標題上加小標籤、短色條或「→」箭頭裝飾。
- Don't：標題不要只把一個詞換顏色。
- Don't：不要用紫藍漸層、emoji 圖示、純黑或純灰。
- Don't：不要放假的心得、評價或數字。
