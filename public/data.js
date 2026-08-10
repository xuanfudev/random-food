// =============================================
// Food Data - Vietnamese & International Dishes
// =============================================

const FOOD_DATA = [
  // === CƠM ===
  { name: "Cơm Tấm Sườn Bì Chả", emoji: "🍚", category: "com", desc: "Cơm tấm với sườn nướng, bì và chả trứng — chuẩn vị Sài Gòn", tags: ["sáng", "trưa"] },
  { name: "Cơm Gà Xối Mỡ", emoji: "🍗", category: "com", desc: "Gà giòn xối mỡ ăn kèm cơm nóng và nước mắm chua ngọt", tags: ["trưa", "tối"] },
  { name: "Cơm Rang Dưa Bò", emoji: "🥩", category: "com", desc: "Cơm chiên với dưa cải chua và thịt bò xào thơm lừng", tags: ["trưa", "tối"] },
  { name: "Cơm Sườn Nướng", emoji: "🍖", category: "com", desc: "Sườn heo ướp đậm đà nướng than hoa, ăn kèm cơm trắng", tags: ["trưa", "tối"] },
  { name: "Cơm Chiên Dương Châu", emoji: "🍳", category: "com", desc: "Cơm chiên với trứng, lạp xưởng, đậu và tôm khô", tags: ["trưa", "tối"] },
  { name: "Cơm Gà Hải Nam", emoji: "🐔", category: "com", desc: "Gà luộc mềm mịn ăn kèm cơm nấu nước gà thơm", tags: ["trưa", "tối"] },
  { name: "Cơm Bò Lúc Lắc", emoji: "🥘", category: "com", desc: "Bò xào tỏi tiêu sốt đặc biệt, ăn kèm cơm và rau sống", tags: ["tối"] },
  { name: "Cơm Cà Ri Gà", emoji: "🍛", category: "com", desc: "Cà ri gà thơm béo kiểu Việt, ăn kèm cơm hoặc bánh mì", tags: ["trưa", "tối"] },
  { name: "Cơm Thịt Kho Tàu", emoji: "🥢", category: "com", desc: "Thịt ba chỉ kho nước dừa với trứng, ngọt mặn đậm đà", tags: ["trưa", "tối"] },
  { name: "Cơm Gà Xé Phay", emoji: "🥗", category: "com", desc: "Gà xé nhỏ trộn hành tây, rau răm và nước mắm chua ngọt", tags: ["trưa"] },

  // === PHỞ & BÚN ===
  { name: "Phở Bò", emoji: "🍜", category: "pho", desc: "Phở bò truyền thống với nước dùng ninh xương đậm đà", tags: ["sáng", "trưa", "tối"] },
  { name: "Phở Gà", emoji: "🐓", category: "pho", desc: "Phở gà thanh ngọt, thịt gà mềm thơm", tags: ["sáng", "trưa"] },
  { name: "Bún Bò Huế", emoji: "🌶️", category: "pho", desc: "Bún bò cay nồng đặc trưng xứ Huế với giò heo và mắm ruốc", tags: ["sáng", "trưa"] },
  { name: "Bún Chả Hà Nội", emoji: "🥩", category: "pho", desc: "Bún chả nướng than hoa với nước chấm chua ngọt đặc trưng Hà Nội", tags: ["trưa"] },
  { name: "Bún Riêu Cua", emoji: "🦀", category: "pho", desc: "Bún riêu cua đồng chua chua, ngọt thanh với cà chua", tags: ["sáng", "trưa"] },
  { name: "Bún Thịt Nướng", emoji: "🥬", category: "pho", desc: "Bún trộn với thịt nướng, rau sống, đậu phộng và nước mắm", tags: ["trưa", "tối"] },
  { name: "Hủ Tiếu Nam Vang", emoji: "🍲", category: "pho", desc: "Hủ tiếu nước trong với tôm, thịt heo và gan xắt lát", tags: ["sáng"] },
  { name: "Mì Quảng", emoji: "🍝", category: "pho", desc: "Mì Quảng đặc trưng miền Trung với tôm, thịt và nước lèo nghệ", tags: ["trưa"] },
  { name: "Bún Mắm", emoji: "🐟", category: "pho", desc: "Bún mắm miền Tây đậm đà với hải sản và rau sống", tags: ["trưa", "tối"] },
  { name: "Bánh Canh Cua", emoji: "🦞", category: "pho", desc: "Bánh canh sợi to mềm với cua xé nhỏ và nước dùng sánh mịn", tags: ["sáng", "trưa"] },
  { name: "Cao Lầu Hội An", emoji: "🏮", category: "pho", desc: "Mì cao lầu đặc sản Hội An với thịt xá xíu và rau sống", tags: ["trưa"] },
  { name: "Bún Đậu Mắm Tôm", emoji: "🫘", category: "pho", desc: "Bún đậu hũ chiên giòn chấm mắm tôm — món ăn gây nghiện!", tags: ["trưa", "tối"] },

  // === ĂN VẶT ===
  { name: "Bánh Mì Thịt", emoji: "🥖", category: "an-vat", desc: "Bánh mì giòn nhân thịt, pate, rau và nước sốt đặc biệt", tags: ["sáng", "chiều"] },
  { name: "Bánh Tráng Trộn", emoji: "🫓", category: "an-vat", desc: "Bánh tráng trộn với xoài, khô bò, trứng cút và sốt me", tags: ["chiều"] },
  { name: "Gỏi Cuốn", emoji: "🌯", category: "an-vat", desc: "Cuốn tôm thịt tươi mát chấm tương đậu phộng", tags: ["chiều", "tối"] },
  { name: "Bánh Xèo", emoji: "🥞", category: "an-vat", desc: "Bánh xèo giòn rụm nhân tôm thịt, giá đỗ, cuốn rau chấm mắm", tags: ["trưa", "tối"] },
  { name: "Bánh Cuốn", emoji: "🧻", category: "an-vat", desc: "Bánh cuốn nóng nhân thịt, mộc nhĩ ăn kèm chả quế", tags: ["sáng"] },
  { name: "Xôi Mặn", emoji: "🍙", category: "an-vat", desc: "Xôi nếp dẻo với hành phi, chả lụa, trứng muối và ruốc", tags: ["sáng"] },
  { name: "Bánh Bao", emoji: "🥟", category: "an-vat", desc: "Bánh bao nhân thịt trứng cút, mềm mịn thơm nóng", tags: ["sáng", "chiều"] },
  { name: "Chả Giò / Nem Rán", emoji: "🌮", category: "an-vat", desc: "Nem chiên giòn vàng nhân thịt, miến, mộc nhĩ", tags: ["chiều", "tối"] },
  { name: "Cá Viên Chiên", emoji: "🧆", category: "an-vat", desc: "Cá viên chiên giòn chấm tương ớt — món ăn vặt quen thuộc", tags: ["chiều"] },
  { name: "Bắp Xào Tôm Khô", emoji: "🌽", category: "an-vat", desc: "Bắp (ngô) xào bơ tôm khô hành lá thơm nức", tags: ["chiều"] },
  { name: "Ốc Luộc Sả", emoji: "🐚", category: "an-vat", desc: "Ốc luộc sả lá gừng, chấm muối tiêu chanh cay cay", tags: ["tối"] },
  { name: "Takoyaki", emoji: "🐙", category: "an-vat", desc: "Bánh bạch tuộc kiểu Nhật, nóng hổi với sốt và rong biển", tags: ["chiều"] },

  // === ĐỒ UỐNG ===
  { name: "Trà Sữa Trân Châu", emoji: "🧋", category: "do-uong", desc: "Trà sữa béo ngậy với trân châu dai mềm — chất gây nghiện", tags: ["chiều"] },
  { name: "Cà Phê Sữa Đá", emoji: "☕", category: "do-uong", desc: "Cà phê phin Việt Nam pha sữa đặc, đổ đá lạnh", tags: ["sáng", "chiều"] },
  { name: "Nước Mía", emoji: "🥤", category: "do-uong", desc: "Nước mía ép tươi mát lạnh, giải nhiệt ngày hè", tags: ["chiều"] },
  { name: "Sinh Tố Bơ", emoji: "🥑", category: "do-uong", desc: "Sinh tố bơ béo ngậy với sữa đặc — đơn giản mà ngon", tags: ["chiều"] },
  { name: "Chè Thái", emoji: "🍧", category: "do-uong", desc: "Chè Thái đầy màu sắc với nước cốt dừa, trái cây và thạch", tags: ["chiều", "tối"] },
  { name: "Nước Dừa Tươi", emoji: "🥥", category: "do-uong", desc: "Dừa tươi mát lành, giàu khoáng chất và siêu giải khát", tags: ["chiều"] },
  { name: "Trà Đào Cam Sả", emoji: "🍑", category: "do-uong", desc: "Trà đào thơm mát với cam tươi và sả — best seller mọi quán", tags: ["chiều"] },
  { name: "Sữa Chua Dẻo", emoji: "🫙", category: "do-uong", desc: "Sữa chua dẻo mịn ăn kèm topping trái cây và thạch", tags: ["chiều"] },

  // === MÓN TÂY ===
  { name: "Pizza", emoji: "🍕", category: "tay", desc: "Pizza phô mai kéo sợi với đủ loại topping hấp dẫn", tags: ["trưa", "tối"] },
  { name: "Burger Bò", emoji: "🍔", category: "tay", desc: "Burger bò nướng juicy với phô mai, rau và sốt đặc biệt", tags: ["trưa", "tối"] },
  { name: "Pasta Carbonara", emoji: "🍝", category: "tay", desc: "Mì Ý sốt kem trứng béo ngậy với thịt xông khói", tags: ["trưa", "tối"] },
  { name: "Steak Bò", emoji: "🥩", category: "tay", desc: "Bò bít tết nướng medium rare với khoai tây và rau", tags: ["tối"] },
  { name: "Gà Rán", emoji: "🍗", category: "tay", desc: "Gà rán giòn rụm vàng ươm, ăn kèm khoai chiên và coleslaw", tags: ["trưa", "tối"] },
  { name: "Salad Caesar", emoji: "🥗", category: "tay", desc: "Salad rau xanh tươi mát với sốt Caesar, phô mai parmesan", tags: ["trưa"] },
  { name: "Sandwich Gà", emoji: "🥪", category: "tay", desc: "Sandwich gà nướng với rau, phô mai và sốt mayo", tags: ["sáng", "trưa"] },
  { name: "Fish & Chips", emoji: "🐟", category: "tay", desc: "Cá chiên giòn bọc bột ăn kèm khoai tây chiên kiểu Anh", tags: ["trưa", "tối"] },

  // === HÀN & NHẬT ===
  { name: "Sushi", emoji: "🍣", category: "han-nhat", desc: "Cơm cuộn cá tươi kiểu Nhật — thanh đạm và tinh tế", tags: ["trưa", "tối"] },
  { name: "Ramen", emoji: "🍜", category: "han-nhat", desc: "Mì ramen Nhật Bản với nước dùng tonkotsu đậm đà", tags: ["trưa", "tối"] },
  { name: "Tokbokki", emoji: "🌶️", category: "han-nhat", desc: "Bánh gạo Hàn Quốc xào sốt cay ngọt — cay xé lưỡi!", tags: ["chiều", "tối"] },
  { name: "Gimbap", emoji: "🍙", category: "han-nhat", desc: "Cơm cuộn Hàn Quốc với rau, trứng, cà rốt và thịt", tags: ["sáng", "trưa"] },
  { name: "Mì Cay Hàn Quốc", emoji: "🔥", category: "han-nhat", desc: "Mì cay 7 cấp độ — thử thách dành cho người can đảm!", tags: ["tối"] },
  { name: "BBQ Hàn Quốc", emoji: "🥓", category: "han-nhat", desc: "Thịt nướng Hàn Quốc tại bàn với đủ loại banchan", tags: ["tối"] },
  { name: "Tempura", emoji: "🍤", category: "han-nhat", desc: "Tôm và rau chiên tempura giòn nhẹ kiểu Nhật", tags: ["trưa", "tối"] },
  { name: "Cơm Trộn Bibimbap", emoji: "🍲", category: "han-nhat", desc: "Cơm trộn Hàn Quốc với rau, thịt bò, trứng và sốt gochujang", tags: ["trưa", "tối"] },
];

// Category labels for display
const CATEGORIES = {
  "all": { label: "Tất cả", emoji: "🍽️" },
  "com": { label: "Cơm", emoji: "🍚" },
  "pho": { label: "Phở & Bún", emoji: "🍜" },
  "an-vat": { label: "Ăn vặt", emoji: "🍢" },
  "do-uong": { label: "Đồ uống", emoji: "🧋" },
  "tay": { label: "Món Tây", emoji: "🍕" },
  "han-nhat": { label: "Hàn & Nhật", emoji: "🍣" },
};

// Wheel color palette - vibrant and appetizing
const WHEEL_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF8C32", "#C576F6", "#45B7D1", "#F97B7B",
  "#FFAD60", "#96CEB4", "#DDA0DD", "#87CEEB",
  "#FFA07A", "#98FB98", "#DEB887", "#FFB6C1",
];
