
const PRODUCTS = [
  { id:"P001", 
    name:"高架/羅馬柱花籃", 
    category:"熱門商品", 
    price:2000, 
    variants:["A款(高架)","B款(高架)","C款(羅馬柱)","D款(羅馬柱)"],  
    variantPrices:{
    "A款(高架)":2000,
    "B款(高架)":3000,
    "C款(羅馬柱)":4000,
    "D款(羅馬柱)":5000}, 
    image:"images/flower1.jpg",
    images:[                      
      "images/flower1.jpg",
      "images/flower4.jpg",
    ],
    description:"高架與羅馬柱花籃皆為常見致意花禮，整體以素雅配色呈現莊重心意。可依需求選擇款式" },

  { id:"P002", 
    name:"租賃蘭花", 
    category:"熱門商品", 
    price:3500, 
    variants:["5株","6株","7株","8株"], 
    variantPrices:{
    "5株":3500,
    "6株":4000,
    "7株":4500,
    "8株":5000},
        image:[
      "images/orchid2.jpg",
    ] , 
    description:"租賃蘭花適合靈堂與追思會場擺設，花況由專人挑選與配送，呈現整潔一致的莊重氛圍。可依株數與場地需求選擇" },

  { id:"P003", 
    name:"一般蓮花塔", 
    category:"蓮花塔", 
    price:2600, 
    variants:["心經佛頭蓮花塔","心經觀音塔","小型蓮花塔"], 
    variantPrices:{
    "心經佛頭蓮花塔":2600,
    "心經觀音塔":2600,
    "小型蓮花塔":1800},
    image:[
      "images/tower1.jpg",
    ] ,
    images:[
      "images/tower1.jpg",
      "images/tower2.jpg",
      "images/tower3.jpg",
    ] ,
    description:"蓮花塔象徵祝禱與圓滿，適合告別式、追思會場或祭祀使用。可依宗教與習俗偏好選擇款式，整體設計以莊重不花俏為原則" },

  { id:"P004", 
    name:"靈屋", 
    category:"紙紮系列", 
    price:3500, 
    variants:["現代"], 
    variantPrices:{
    "傳統":3500
    },
    image:[
      "images/house1.jpg",
    ] ,
    description:"紙紮靈屋用於傳統祭祀儀式，象徵居所與安頓。提供傳統與現代款式，造型細節不同" },

  { id:"P005", 
    name:"庫錢", 
    category:"紙錢", 
    price:100, 
    variants:["一般款","壓花款"],
    variantPrices:{
    "一般款":100,
    "壓花款":120
    }, 
    image:[
      "images/coolmon1.jpg",
    ] ,
    description:"壓花款比較扎實~" },

  { id:"P006", 
    name:"日常生活用品", 
    category:"紙紮系列", 
    price:200, 
    variants:["衣服","首飾","鞋"], 
    variantPrices:{
    "衣服":200
    ,"首飾":250,
    "鞋":200
    },
    image:[
      "images/shoe2.jpg",
    ] ,
    images:[
      "images/jewel1.jpg",
      "images/shoe2.jpg",
      "images/short1.jpg",
    ] ,
    description:"以紙紮形式呈現日常用品象徵心意，適用於祭祀儀式。整體風格偏簡約，避免過度浮誇。" },

  { id:"P007", 
    name:"元寶塔", 
    category:"蓮花塔", 
    price:1800, 
    variants:["元寶花塔","小型元寶塔"], 
    variantPrices:{
    "元寶花塔":3000,
    "小型元寶塔":1800
    },
    image:[
      "images/yb1.jpg",
    ] ,
        images:[
      "images/yb1.jpg",
      "images/yb2.jpg",
    ] ,
    description:"元寶塔象徵祝福與圓滿，適合搭配祭祀儀式使用。提供花塔與小型款" },

  { id:"P008", 
    name:"私錢", 
    category:"紙錢", 
    price:100, 
    variants:["一般款"], 
    image:[
      "images/mymoney1.jpg",
    ] ,
    description:"私錢為常見紙錢類別，適合一般祭祀需求。包裝簡潔好攜帶，適用於日常祭拜或追思場合。" },

  { id:"P009", 
    name:"其他", 
    category:"紙紮系列", 
    price:1200, 
    variants:["電子產品","LV皮箱"], 
    image:[
      "images/ap.jpg",
    ] ,
    images:[
      "images/ap.jpg",
      "images/lv.jpg",
    ] ,
    description:"提供特殊紙紮品項作為象徵性心意（示意用）。可選擇電子產品或精品行李等造型，" },

  { id:"P010", 
    name:"特殊款蓮花", 
    category:"蓮花塔", 
    price:4000, 
    variants:["大孝獅塔","九品蓮花塔"], 
    variantPrices:{
    "大孝獅塔":4500,
    "九品蓮花塔":5000  
    },
    image:[
      "images/lion.jpg",
    ] ,
    images:[
      "images/lion.jpg",
      "images/nine.jpg",
    ] ,
    description:"特殊款蓮花塔造型較大型、層數更高，適合較大型場地或希望呈現更完整祝禱心意者。可依習俗與需求選擇不同層級款式" },

  { id:"P011", 
    name:"紙鈔", 
    category:"財寶箱", 
    price:300, 
    variants:["財寶箱"], 
    image:[
      "images/box.jpg",
    ] ,
    description:"紙鈔系列提供不同幣別款式，可依儀式需求選擇。適合作為祭祀搭配品項，方便一次備齊" },

  { id:"P012", 
    name:"平安米塔", 
    category:"熱門商品", 
    price:5000, 
    variants:["七層","九層","十一層"], 
    variantPrices:{
    "七層":5000,
    "九層":8000,
    "十一層":11000
    },
    image:[
      "images/rice2.jpg",
    ] ,
    description:"「平安米塔象徵祝福與安定，適合追思、祭祀或致意場合。可依層數挑選大小。」" }
];

const CATEGORIES = ["全部", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

function productImageDataURI(title){
  const safe = (title || "商品").replace(/&/g, "＆");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="480">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.08"/>
        <stop offset="1" stop-color="#2f2a25" stop-opacity="0.92"/>
      </linearGradient>
    </defs>
    <rect width="800" height="480" fill="#2f2a25"/>
    <rect width="800" height="480" fill="url(#g)"/>
    <circle cx="660" cy="120" r="90" fill="#ffffff" fill-opacity="0.08"/>
    <circle cx="140" cy="360" r="120" fill="#ffffff" fill-opacity="0.06"/>
    <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle"
      font-family="Arial, 'Noto Sans TC', sans-serif" font-size="40" fill="#ffffff" fill-opacity="0.92">${safe}</text>
    <text x="50%" y="64%" dominant-baseline="middle" text-anchor="middle"
      font-family="Arial, 'Noto Sans TC', sans-serif" font-size="18" fill="#ffffff" fill-opacity="0.82">白光選品 · 前端展示</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function heroImageDataURI(label){
  const safe = (label || "白光選品").replace(/&/g, "＆");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.08"/>
        <stop offset="1" stop-color="#6b4f3a" stop-opacity="0.65"/>
      </linearGradient>
      <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2f2a25" stop-opacity="0.9"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="700" fill="url(#g2)"/>
    <rect width="1200" height="700" fill="url(#g1)"/>
    <circle cx="980" cy="170" r="150" fill="#ffffff" fill-opacity="0.07"/>
    <circle cx="220" cy="540" r="200" fill="#ffffff" fill-opacity="0.05"/>
    <text x="70" y="120" font-family="Arial,'Noto Sans TC',sans-serif" font-size="44" fill="#ffffff" fill-opacity="0.92">${safe}</text>
    <text x="70" y="175" font-family="Arial,'Noto Sans TC',sans-serif" font-size="20" fill="#ffffff" fill-opacity="0.82">更清楚、更便利的線上選購流程</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function money(n){
  return "NT$ " + Number(n).toLocaleString("zh-Hant-TW");
}
