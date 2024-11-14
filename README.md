# คู่มือการติดตั้งและรันโปรเจกต์ Next.js

### 1. ติดตั้ง Node.js และ npm
โปรเจกต์ Next.js ต้องการ Node.js และ npm (Node Package Manager) ในการติดตั้งและรันโปรเจกต์ คุณสามารถดาวน์โหลดและติดตั้ง Node.js ได้จาก [เว็บไซต์ Node.js.](https://nodejs.org/en)

หลังจากติดตั้งแล้ว คุณสามารถตรวจสอบเวอร์ชันของ Node.js และ npm ด้วยคำสั่ง:

```bash
node -v
npm -v
```

### 2. ดาวน์โหลดโปรเจกต์
ดาวน์โหลดไฟล์โปรเจกต์ได้จาก [https://github.com/ZamPotter/tic-tac-toe-game.git](https://github.com/ZamPotter/tic-tac-toe-game/archive/refs/heads/main.zip) แตกไฟล์และเก็บไว้ในโฟลเดอร์ที่คุณต้องการ

### 3. ดาวน์โหลดไฟล์ .env.local
ดาวน์โหลดไฟล์ .env.local จากไฟล์ที่แนบมาให้ในเมล

นำไฟล์ .env.local ไปวางในโฟลเดอร์รากของโปรเจกต์ (ในโฟลเดอร์เดียวกับที่มีไฟล์ package.json)

### 4. ติดตั้ง Dependencies
โปรเจกต์ Next.js จะมีไฟล์ package.json ซึ่งระบุ dependencies ต่างๆ ที่จำเป็นต้องติดตั้งเพื่อให้โปรเจกต์ทำงานได้

ให้เปิดเทอร์มินัลหรือ Command Prompt แล้วเข้าไปในโฟลเดอร์โปรเจกต์ จากนั้นติดตั้ง dependencies ด้วยคำสั่ง:

```bash
npm install
```

คำสั่งนี้จะติดตั้งแพ็กเกจทั้งหมดที่ระบุในไฟล์ package.json เช่น React, Next.js, และอื่นๆ ที่โปรเจกต์ต้องการ

### 5. รันโปรเจกต์ในโหมดพัฒนา (Development Mode)

เมื่อทุกอย่างพร้อมแล้ว คุณสามารถเริ่มเซิร์ฟเวอร์พัฒนา (development server) โดยใช้คำสั่งนี้:

```bash
npm run dev
```

คำสั่งนี้จะเริ่มเซิร์ฟเวอร์ Next.js ที่พอร์ต 3000 (ตามค่าเริ่มต้น) และสามารถเข้าถึงโปรเจกต์ได้ที่ http://localhost:3000 ในเว็บเบราว์เซอร์

### ปล. โปรเจ็กต์นี้ใช้
- node v22.11.0
- next v15.0.3
- nextjs-auth0 v3.5.0
