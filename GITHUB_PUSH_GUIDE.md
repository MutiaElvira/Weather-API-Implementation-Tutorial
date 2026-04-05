# 🚀 PANDUAN PUSH KE GITHUB

## 📋 Langkah-Langkah Push Repository

### 1. Setup Remote Origin
```bash
git remote add origin https://github.com/USERNAME/PROJECTPWEB1.git
```
**Ganti USERNAME dengan GitHub username kamu yang sebenarnya!**

### 2. Push ke GitHub
```bash
git push -u origin main
```

### 3. Verifikasi di GitHub
- Buka https://github.com/USERNAME/PROJECTPWEB1
- Pastikan semua file sudah ter-upload

---

## 🔧 Jika Ada Error

### Error: "Repository not found"
- Pastikan repository sudah dibuat di GitHub
- Cek username & repository name benar
- Pastikan repository public (bukan private)

### Error: "Permission denied"
- Pastikan kamu sudah login ke GitHub di terminal
- Setup SSH key atau gunakan personal access token

### Error: "Branch 'main' does not exist"
- Jalankan: `git branch -M main` dulu
- Kemudian push lagi

---

## 🌐 Enable GitHub Pages

Setelah push berhasil:

1. Buka repository di GitHub
2. Klik **Settings** tab
3. Scroll ke **Pages** section
4. Di **Source** dropdown, pilih **Deploy from a branch**
5. Di **Branch** dropdown, pilih **main**
6. Klik **Save**
7. Tunggu 1-2 menit, refresh halaman
8. Website akan live di: `https://USERNAME.github.io/PROJECTPWEB1/`

---

## 📝 Command Lengkap (Copy-Paste)

```bash
# Setup remote (ganti USERNAME)
git remote add origin https://github.com/USERNAME/PROJECTPWEB1.git

# Push ke GitHub
git push -u origin main

# Cek status
git status
git remote -v
```

---

## ✅ Checklist

- [ ] Repository sudah dibuat di GitHub
- [ ] Username di remote URL sudah benar
- [ ] Push berhasil tanpa error
- [ ] Files terlihat di GitHub repository
- [ ] GitHub Pages sudah di-enable
- [ ] Website live dan bisa diakses

---

## 🎯 Tips

1. **Buat repository dulu di GitHub** sebelum push
2. **Repository name**: `PROJECTPWEB1` (sesuai tugas)
3. **Public repository** agar bisa diakses semua orang
4. **Add README.md** untuk dokumentasi
5. **Test website** setelah GitHub Pages live

---

## 🔍 Troubleshooting

### Cek Git Status
```bash
git status          # Lihat status file
git log --oneline   # Lihat commit history
git remote -v       # Lihat remote URL
```

### Jika Stuck
```bash
# Reset remote jika salah
git remote remove origin
git remote add origin https://github.com/USERNAME/PROJECTPWEB1.git

# Force push jika perlu (hati-hati!)
git push -u origin main --force
```

---

**Good luck dengan push ke GitHub! 🚀**