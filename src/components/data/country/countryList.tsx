  export const countryList = [
  { code: "BD", name: "Bangladesh" },
  { code: "CN", name: "China" },
  { code: "TW", name: "Chinese Taipei" },
  { code: "HK", name: "Hong Kong" },
  { code: "ID", name: "Indonesia" },
  { code: "IN", name: "India" },
  { code: "IR", name: "Iran" },
  { code: "JO", name: "Jordan" },
  { code: "JP", name: "Japan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "MY", name: "Malaysia" },
  { code: "MN", name: "Mongolia" },
  { code: "MM", name: "Myanmar" },
  { code: "PH", name: "Philippines" },
  { code: "QA", name: "Qatar" },
  { code: "SG", name: "Singapore" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SY", name: "Syria" },
  { code: "TH", name: "Thailand" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" }
];


export const getCodeByName = (name: string) => {
  const country = countryList.find(c => c.name.toLowerCase() === name.toLowerCase());
  return country?.code || null;
};