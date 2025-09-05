# Aplikasi Pokemon - React Native Expo

Aplikasi Pokemon cross-platform yang dibangun dengan React Native dan Expo, menampilkan fitur offline-first, state management dengan Zustand, dan testing komprehensif dengan Jest.

## Fitur Utama

- Cross-platform (iOS, Android, Web)
- Data Pokemon dari PokéAPI dengan pagination
- Sistem favorit offline-first dengan auto-sync
- UI modern dengan animasi dan desain responsif
- State management menggunakan Zustand
- Testing lengkap dengan Jest

## Teknologi yang Digunakan

- **React Native & Expo SDK 53** - Framework mobile cross-platform
- **TypeScript** - JavaScript dengan type safety
- **Zustand** - State management
- **Axios** - HTTP client untuk API
- **React Navigation** - Navigasi aplikasi
- **AsyncStorage** - Penyimpanan data lokal
- **Jest** - Framework testing

## Instalasi

### Persyaratan
- Node.js 16+
- npm atau yarn
- Expo CLI

### Langkah Instalasi
```bash
# Clone repository
git clone <repository-url>
cd PokedexApp

# Install dependencies
npm install --legacy-peer-deps

# Jalankan aplikasi
npm start

# Jalankan di platform tertentu
npm run web      # Browser
npm run android  # Android
npm run ios      # iOS (macOS only)
```

## Fitur Offline-First

### Cara Kerja
1. Data favorit disimpan di AsyncStorage (storage lokal)
2. Action add/remove favorit bekerja tanpa internet
3. Perubahan offline disimpan dalam queue untuk sync
4. Auto-sync ketika koneksi internet kembali
5. Indikator visual untuk status online/offline

### Keunggulan
- Aplikasi tetap berfungsi tanpa internet
- Perubahan favorit langsung terlihat di UI
- Data tidak hilang meskipun offline
- Sinkronisasi otomatis ketika online

## State Management

### Pokemon Store
Mengelola data Pokemon dan loading states:
- Daftar Pokemon dengan pagination
- Detail Pokemon dengan caching
- Loading states (loading, loadingMore, loadingDetail)
- Error handling

### Favorites Store
Menangani sistem favorit offline-first:
- Add/remove Pokemon dari favorit
- Penyimpanan offline dengan AsyncStorage
- Queue action untuk sync
- Auto-sync ketika online

### Network Store
Monitor konektivitas jaringan:
- Deteksi status online/offline
- Pemeriksaan koneksi berkala

## API Integration

Integrasi dengan PokéAPI (https://pokeapi.co):
- **Daftar Pokemon**: List Pokemon dengan pagination
- **Detail Pokemon**: Info lengkap Pokemon (tipe, ability, gambar)
- **Error Handling**: Retry logic dan error handling
- **Connection Check**: Deteksi status online/offline

## Testing dengan Jest

### Coverage Testing
Aplikasi memiliki testing lengkap untuk semua logika bisnis kritis:

- **API Integration Tests** (9 tests) - pokemonApi.test.ts
- **State Management Tests** (15 tests) - pokemonStore.test.ts
- **Offline Functionality Tests** (22 tests) - favoritesStore.test.ts

**Total: 46 test cases dalam 3 test suites**

### Menjalankan Testing

#### Semua Test
```bash
npm test
```

#### Test Spesifik
```bash
npm test pokemonApi      # Test API integration
npm test pokemonStore    # Test state management
npm test favoritesStore  # Test offline functionality
```


#### Watch Mode (Development)
```bash
npm run test:watch
```


## UI/UX

### Desain
- Material Design modern dengan interface yang intuitif
- Layout responsif untuk berbagai ukuran layar
- Animasi smooth dan micro-interactions
- Loading states dengan skeleton screens

### User Experience
- Pull-to-refresh untuk refresh data
- Infinite scroll untuk pagination
- Indikator status online/offline
- Error messages yang user-friendly
- Loading feedback yang progressif

## Development

### Script yang Tersedia
```bash
npm start                # Jalankan Expo development server
npm run android         # Jalankan di Android
npm run ios            # Jalankan di iOS
npm run web            # Jalankan di browser
npm test               # Jalankan test suite
npm run test:watch     # Test dalam watch mode
```

### Troubleshooting

#### Masalah Dependencies
```bash
npm install --legacy-peer-deps
```

#### Clear Metro Cache
```bash
npx expo start --clear
```

#### Reset Test Cache
```bash
npm test -- --clearCache
```

