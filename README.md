# רוני 70 · תשע בריבוע

משחק איקס-עיגול בשתי קבוצות עם שאלות על רוני. נבנה ב-React + Vite.

## עריכת תוכן

כל השאלות, התשובות, הצבעים והכותרות נמצאים בקובץ אחד: `src/data/game.ts`.

## הרצה מקומית

```bash
npm install
npm run dev        # http://localhost:5173
```

## בנייה

```bash
npm run build
```

הבנייה מייצרת **קובץ אחד בלבד**: `dist/index.html`. הקוד, העיצוב והגופנים כבר בתוכו, ולכן:

- אפשר לפתוח אותו בלחיצה כפולה, גם בלי אינטרנט (טוב למחשב שמחובר למקרן באירוע).
- אפשר להעלות אותו לכל אחסון, בלי הגדרות נוספות.

## העלאה לאינטרנט (הכי פשוט)

1. מריצים `npm run build`.
2. נכנסים ל-<https://app.netlify.com/drop> וגוררים לשם את התיקייה `dist`.
3. מקבלים קישור לשיתוף.

אפשרויות נוספות: Vercel, Cloudflare Pages או GitHub Pages. בכולן פקודת הבנייה היא `npm run build` ותיקיית הפרסום היא `dist`.

## הטמעה בתוך אתר אחר (Wix, WordPress וכו')

```html
<iframe src="https://הכתובת-שלכם/" width="100%" height="800" style="border:0" allow="fullscreen"></iframe>
```

## בדיקות

```bash
npm run check      # בדיקת טיפוסים + בנייה
```
