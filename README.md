# 臺大工管系學會網站

國立臺灣大學工商管理學系系學會的官方網站，網址：https://ntubass.github.io/

用 [Astro](https://astro.build/) 製作，推送到 GitHub 後會自動部署到 GitHub Pages
（設定在 `.github/workflows/deploy.yml`）。

## 在自己電腦上預覽

需要先安裝 [Node.js](https://nodejs.org/)（24 版以上）。

```bash
npm install      # 第一次使用時安裝套件
npm run dev      # 開啟預覽，網址會顯示在終端機（通常是 http://localhost:4321）
```

## 常改的內容在哪裡

| 想改的東西 | 檔案 |
| --- | --- |
| 網站上的文字（標題、說明、按鈕文字） | `src/copy/zh-tw.ts` |
| 活動成果的活動、照片與連結 | `src/data_files/activities.ts`（照片放 `src/images/activities/`） |
| 幹部名單與照片 | `src/data_files/team.ts`（照片放 `src/images/team/`） |
| 合作夥伴 | `src/data_files/partners.ts`（標誌放 `src/images/partners/`） |
| 場地借用的教室 | `src/data_files/venues.ts`（借用紀錄存在 Firebase，同學在網站上直接預約） |
| Google 登入、線上預約、角色權限 | `src/data_files/firebase.ts`、`firestore.rules`（設定步驟見 `FIREBASE.md`） |
| 幹部招募 | `src/data_files/recruit.ts` |
| 學習資源（每篇一個 Markdown 檔） | `src/content/resources/zh-tw/` |
| 職涯訪談（每篇一個 Markdown 檔） | `src/content/interviews/zh-tw/` |
| 導覽列與社群連結 | `src/data_files/navigation.ts` |
| 網站名稱、信箱 | `src/data_files/constants.ts` |

## 更新網站

```bash
npm run build        # 先確認可以正常建置（會檢查錯誤）
git add -A
git commit -m "說明這次改了什麼"
git push             # 推上去後幾分鐘，網站就會更新
```

`_unused/` 資料夾裡是範本附的、目前用不到的檔案，說明在 `_unused/說明.md`。
