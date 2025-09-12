# GodotAwesome Tema Sistemi Kullanım Kılavuzu

Bu kılavuz, GodotAwesome sitenizin tema sistemini nasıl kullanacağınızı açıklar. Bu sistem sayesinde sitenizin renklerini ve fontlarını kolayca değiştirebilirsiniz.

## 📁 Dosya Yapısı

```
_sass/
├── _theme-variables.scss    # Ana tema değişkenleri
├── _theme-config.scss       # Tema konfigürasyonları
├── _syntax.scss            # Kod vurgulama stilleri
└── _starsnonscss.scss      # Yıldız rating sistemi

assets/css/
├── main.scss               # Ana SCSS dosyası
└── screen.css              # Ana CSS stilleri (tema değişkenleri ile güncellendi)
```

## 🎨 Tema Değiştirme

### 1. Hazır Temalar Kullanma

`_sass/_theme-config.scss` dosyasını açın ve `$active-theme` değişkenini değiştirin:

```scss
// Mevcut tema seçenekleri:
$active-theme: 'default';  // Varsayılan yeşil tema
$active-theme: 'blue';     // Mavi tema
$active-theme: 'purple';   // Mor tema
$active-theme: 'orange';   // Turuncu tema
$active-theme: 'dark';     // Koyu tema
$active-theme: 'custom';   // Özel tema
```

### 2. Özel Renkler Tanımlama

`_sass/_theme-config.scss` dosyasında `custom` tema bölümünü düzenleyin:

```scss
@else if $active-theme == 'custom' {
  $primary-color: #your-color !global;        // Ana renginiz
  $primary-hover: #your-hover-color !global;  // Hover renginiz
  $primary-dark: #your-dark-color !global;    // Koyu ton
  $secondary-color: #your-secondary !global;  // İkincil renk
}
```

## 🛠️ Gelişmiş Özelleştirme

### Ana Tema Değişkenlerini Düzenleme

`_sass/_theme-variables.scss` dosyasını düzenleyerek daha detaylı özelleştirmeler yapabilirsiniz:

#### Renkler
- `$primary-color`: Ana renk (linkler, vurgular)
- `$primary-hover`: Hover durumu rengi
- `$text-primary`: Ana metin rengi
- `$background-white`: Arka plan rengi

#### Fontlar
- `$font-family-primary`: Ana font ailesi
- `$font-family-heading`: Başlık fontları
- `$font-family-article`: Makale içerik fontları
- `$font-family-brand`: Logo/marka fontları

#### Boyutlar
- `$font-size-base`: Temel font boyutu
- `$spacing-md`: Orta boşluk
- `$border-radius-medium`: Orta kenarlık yarıçapı

## 🔧 Tema Sistemi Nasıl Çalışır?

1. **Değişken Tanımlama**: `_theme-variables.scss` dosyasında tüm tema değişkenleri tanımlanır
2. **Tema Seçimi**: `_theme-config.scss` dosyasında aktif tema belirlenir
3. **CSS Uygulama**: `screen.css` dosyasında CSS custom properties (CSS variables) kullanılır
4. **Import Sırası**: `main.scss` dosyasında tema dosyaları ilk sırada import edilir

## 📝 Örnek Kullanımlar

### Mavi Tema Aktif Etme
```scss
// _sass/_theme-config.scss dosyasında:
$active-theme: 'blue';
```

### Kendi Renklerinizi Kullanma
```scss
// _sass/_theme-config.scss dosyasında:
$active-theme: 'custom';

// Ve custom bölümünde:
@else if $active-theme == 'custom' {
  $primary-color: #ff6b6b !global;     // Kırmızımsı
  $primary-hover: #ff5252 !global;     // Daha koyu kırmızı
  $primary-dark: #f44336 !global;      // Çok koyu kırmızı
  $secondary-color: #4ecdc4 !global;   // Turkuaz
}
```

### Font Değiştirme
```scss
// _sass/_theme-variables.scss dosyasında:
$font-family-primary: 'Roboto', sans-serif !default;
$font-family-heading: 'Montserrat', sans-serif !default;
```

## 🚀 Değişiklikleri Uygulama

1. Tema dosyalarını düzenleyin
2. Jekyll'i yeniden başlatın: `bundle exec jekyll serve`
3. Tarayıcınızı yenileyin

## 🎯 İpuçları

- **Test Edin**: Tema değişikliklerini yapmadan önce yedek alın
- **Kontrast**: Metin okunabilirliği için yeterli kontrast sağlayın
- **Responsive**: Değişikliklerin mobil cihazlarda da iyi göründüğünden emin olun
- **Performance**: Çok fazla custom property kullanmaktan kaçının

## 🔍 Sorun Giderme

### SCSS Hataları
- Noktalı virgül (`;`) unutmayın
- `!global` flag'ini kullanmayı unutmayın
- Renk kodlarının geçerli olduğundan emin olun

### Değişiklikler Görünmüyor
- Jekyll'i yeniden başlatın
- Tarayıcı cache'ini temizleyin
- CSS dosyasının doğru import edildiğini kontrol edin

## 📞 Destek

Tema sistemi ile ilgili sorunlarınız için:
- GitHub Issues açabilirsiniz
- Dokümantasyonu kontrol edin
- Community forumlarından yardım alabilirsiniz
