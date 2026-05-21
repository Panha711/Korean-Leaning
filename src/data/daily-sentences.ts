/** Daily conversation sentences from EPS-TOPIK lesson PDFs (4–18, 재밌는 대화) */
export interface DailySentenceLine {
  speaker?: string;
  korean: string;
  english: string;
  /** Khmer translation of this line (custom dialogues; built-in uses map lookup) */
  khmer?: string;
}

/** Where the conversation happens — use filters like Cafe, Restaurant */
export type DailySentencePlace =
  | "introduction"
  | "home"
  | "cafe"
  | "restaurant"
  | "supermarket"
  | "shop"
  | "transport"
  | "directions"
  | "hospital"
  | "mall"
  | "clothes"
  | "work"
  | "travel"
  | "entertainment"
  | "weather"
  | "friends";

export const DAILY_SENTENCE_PLACE_LABELS: Record<DailySentencePlace, string> = {
  introduction: "Introduction",
  home: "Home",
  cafe: "Cafe",
  restaurant: "Restaurant",
  supermarket: "Supermarket",
  shop: "Market & shopping",
  transport: "Transport",
  directions: "Directions",
  hospital: "Hospital / pharmacy",
  mall: "Mall",
  clothes: "Clothes shop",
  work: "Work / office",
  travel: "Travel",
  entertainment: "Movies & fun",
  weather: "Weather",
  friends: "Friends & family",
};

/** Filter chips — most useful places first */
export const DAILY_SENTENCE_PLACE_ORDER: DailySentencePlace[] = [
  "cafe",
  "restaurant",
  "supermarket",
  "shop",
  "mall",
  "clothes",
  "transport",
  "directions",
  "hospital",
  "work",
  "home",
  "introduction",
  "friends",
  "weather",
  "travel",
  "entertainment",
];

export interface DailySentenceGroup {
  id: string;
  num: number;
  lesson: number;
  title: string;
  situation: string;
  /** Optional override; otherwise uses DAILY_SENTENCE_PLACE_BY_ID */
  place?: DailySentencePlace;
  lines: DailySentenceLine[];
}

export const DAILY_SENTENCE_PLACE_BY_ID: Record<string, DailySentencePlace> = {
  "ds-1": "introduction",
  "ds-2": "home",
  "ds-3": "friends",
  "ds-4": "friends",
  "ds-5": "friends",
  "ds-6": "friends",
  "ds-7": "friends",
  "ds-8": "weather",
  "ds-9": "weather",
  "ds-10": "friends",
  "ds-11": "friends",
  "ds-12": "friends",
  "ds-13": "restaurant",
  "ds-14": "restaurant",
  "ds-15": "restaurant",
  "ds-16": "supermarket",
  "ds-17": "supermarket",
  "ds-18": "home",
  "ds-19": "transport",
  "ds-20": "transport",
  "ds-21": "home",
  "ds-22": "shop",
  "ds-23": "transport",
  "ds-24": "transport",
  "ds-25": "friends",
  "ds-26": "friends",
  "ds-27": "work",
  "ds-28": "hospital",
  "ds-29": "mall",
  "ds-30": "clothes",
  "ds-31": "clothes",
  "ds-32": "travel",
  "ds-33": "travel",
  "ds-34": "travel",
  "ds-35": "entertainment",
  "ds-36": "entertainment",
  "ds-37": "introduction",
  "ds-38": "restaurant",
  "ds-39": "introduction",
  "ds-40": "home",
  "ds-41": "cafe",
  "ds-42": "cafe",
  "ds-43": "cafe",
  "ds-44": "cafe",
  "ds-45": "cafe",
  "ds-46": "shop",
  "ds-47": "shop",
  "ds-48": "shop",
  "ds-49": "directions",
  "ds-50": "directions",
  "ds-51": "directions",
  "ds-52": "hospital",
  "ds-53": "hospital",
  "ds-54": "work",
  "ds-55": "work",
  "ds-56": "restaurant",
  "ds-57": "restaurant",
  "ds-58": "supermarket",
  "ds-59": "supermarket",
  "ds-60": "transport",
  "ds-61": "transport",
  "ds-62": "transport",
  "ds-63": "home",
  "ds-64": "home",
  "ds-65": "friends",
  "ds-66": "friends",
  "ds-67": "weather",
  "ds-68": "travel",
  "ds-69": "travel",
  "ds-70": "entertainment",
  "ds-71": "entertainment",
  "ds-72": "introduction",
};

export function getDailySentencePlace(group: DailySentenceGroup): DailySentencePlace {
  return group.place ?? DAILY_SENTENCE_PLACE_BY_ID[group.id] ?? "friends";
}

export const DAILY_SENTENCE_LESSON_LABELS: Record<number, string> = {
  4: "Nationality & job",
  5: "Schedule & weekends",
  6: "Time & weather",
  7: "Weather & personality",
  8: "Shopping & family",
  9: "Food & ordering",
  10: "Prices & chores",
  11: "Transport & trash",
  12: "Directions & travel",
  13: "Weekend plans",
  14: "Locations",
  15: "Clothes",
  17: "Vacation & travel",
  18: "Entertainment",
};

export const dailySentenceGroups: DailySentenceGroup[] = [
  {
    id: "ds-1",
    num: 1,
    lesson: 4,
    title: "Where are you from?",
    situation: "Meeting someone new",
    lines: [
      { speaker: "A", korean: "국적이 어디예요?", english: "What is your nationality?" },
      { speaker: "B", korean: "국적이 캄보디아예요.", english: "I am Cambodian." },
      { speaker: "A", korean: "직업이 뭐예요?", english: "What is your job?" },
      { speaker: "B", korean: "학생이에요.", english: "I am a student." },
    ],
  },
  {
    id: "ds-2",
    num: 2,
    lesson: 4,
    title: "What are you doing?",
    situation: "Small talk at home",
    lines: [
      { speaker: "A", korean: "지금 뭐 해요?", english: "What are you doing now?" },
      { speaker: "B", korean: "텔레비전을 봐요.", english: "I am watching TV." },
      { speaker: "A", korean: "저도 텔레비전을 봐요.", english: "I am watching TV too." },
    ],
  },
  {
    id: "ds-3",
    num: 3,
    lesson: 5,
    title: "Weekend plans",
    situation: "Making plans",
    lines: [
      { speaker: "A", korean: "주말에 뭐 하고 싶어요?", english: "What do you want to do on the weekend?" },
      { speaker: "B", korean: "토요일에 한국어를 배워요. 일요일에 아르바이트해요.", english: "On Saturday I study Korean. On Sunday I work part-time." },
      { speaker: "A", korean: "그럼 일요일 저녁에 뭐 해요?", english: "Then what do you do Sunday evening?" },
      { speaker: "B", korean: "친구하고 영화를 봐요.", english: "I watch a movie with a friend." },
    ],
  },
  {
    id: "ds-4",
    num: 4,
    lesson: 5,
    title: "What day is it?",
    situation: "Talking about the calendar",
    lines: [
      { speaker: "A", korean: "오늘이 무슨 요일이에요?", english: "What day is today?" },
      { speaker: "B", korean: "오늘은 수요일이에요.", english: "Today is Wednesday." },
      { speaker: "A", korean: "생일이 언제예요?", english: "When is your birthday?" },
      { speaker: "B", korean: "생일은 6월 20일이에요.", english: "My birthday is June 20th." },
    ],
  },
  {
    id: "ds-5",
    num: 5,
    lesson: 5,
    title: "Saturday activities",
    situation: "Casual chat",
    lines: [
      { speaker: "A", korean: "토요일에 뭐 해요?", english: "What do you do on Saturday?" },
      { speaker: "B", korean: "운동해요.", english: "I exercise." },
      { speaker: "A", korean: "그럼 일요일에는 뭐 해요?", english: "Then what do you do on Sunday?" },
      { speaker: "B", korean: "요리해요.", english: "I cook." },
    ],
  },
  {
    id: "ds-6",
    num: 6,
    lesson: 6,
    title: "What time is it?",
    situation: "Asking the time",
    lines: [
      { speaker: "A", korean: "지금 몇 시예요?", english: "What time is it now?" },
      { speaker: "B", korean: "지금 10시 11분이에요.", english: "It is 10:11 now." },
      { speaker: "A", korean: "점심은 몇 시에 먹어요?", english: "What time do you eat lunch?" },
      { speaker: "B", korean: "12시에 먹어요.", english: "I eat at 12 o'clock." },
    ],
  },
  {
    id: "ds-7",
    num: 7,
    lesson: 6,
    title: "Birthday party",
    situation: "Inviting friends",
    lines: [
      { speaker: "A", korean: "생일 파티가 언제예요?", english: "When is the birthday party?" },
      { speaker: "B", korean: "오늘 6월 10일이에요.", english: "Today is June 10th." },
      { speaker: "A", korean: "생일 파티에서 뭐 해요?", english: "What do you do at the birthday party?" },
      { speaker: "B", korean: "케이크를 먹고 선물을 줘요.", english: "We eat cake and give gifts." },
    ],
  },
  {
    id: "ds-8",
    num: 8,
    lesson: 7,
    title: "How is the weather?",
    situation: "Talking about weather",
    lines: [
      { speaker: "A", korean: "오늘 날씨가 어때요?", english: "How is the weather today?" },
      { speaker: "B", korean: "날씨가 좋아요.", english: "The weather is nice." },
      { speaker: "A", korean: "그럼 공원에 가요.", english: "Then let's go to the park." },
    ],
  },
  {
    id: "ds-9",
    num: 9,
    lesson: 7,
    title: "Hot and cold",
    situation: "Describing temperature",
    lines: [
      { speaker: "A", korean: "오늘 덥지요?", english: "It is hot today, isn't it?" },
      { speaker: "B", korean: "네, 덥습니다. 어제는 시원했어요.", english: "Yes, it is hot. Yesterday it was cool." },
      { speaker: "A", korean: "내일은 비가 와요?", english: "Will it rain tomorrow?" },
      { speaker: "B", korean: "네, 비가 많이 와요.", english: "Yes, it will rain a lot." },
    ],
  },
  {
    id: "ds-10",
    num: 10,
    lesson: 7,
    title: "Personality",
    situation: "Describing a friend",
    lines: [
      { speaker: "A", korean: "친구 성격이 어때요?", english: "What is your friend's personality like?" },
      { speaker: "B", korean: "친구는 키가 크고 성격이 좋아요.", english: "My friend is tall and has a good personality." },
    ],
  },
  {
    id: "ds-11",
    num: 11,
    lesson: 8,
    title: "Where do you work?",
    situation: "Family & jobs",
    lines: [
      { speaker: "A", korean: "어머니는 어디에서 일해요?", english: "Where does your mother work?" },
      { speaker: "B", korean: "병원에서 일해요.", english: "She works at a hospital." },
      { speaker: "A", korean: "어머니 직업이 뭐예요?", english: "What is your mother's job?" },
      { speaker: "B", korean: "간호사예요.", english: "She is a nurse." },
    ],
  },
  {
    id: "ds-12",
    num: 12,
    lesson: 8,
    title: "Brother and sister",
    situation: "Talking about siblings",
    lines: [
      { speaker: "A", korean: "형이 몇 살이에요?", english: "How old is your older brother?" },
      { speaker: "B", korean: "형은 스물다섯 살이에요.", english: "My brother is twenty-five." },
      { speaker: "A", korean: "형은 무슨 일을 해요?", english: "What does your brother do?" },
      { speaker: "B", korean: "형은 회사원이에요.", english: "My brother is an office worker." },
    ],
  },
  {
    id: "ds-13",
    num: 13,
    lesson: 9,
    title: "Ordering food",
    situation: "At a restaurant",
    lines: [
      { speaker: "A", korean: "주문하시겠어요?", english: "Would you like to order?" },
      { speaker: "B", korean: "김밥 하나 주세요.", english: "One kimbap, please." },
      { speaker: "A", korean: "또 주문하시겠어요?", english: "Would you like to order anything else?" },
      { speaker: "B", korean: "라면 하나 더 주세요.", english: "One more ramen, please." },
    ],
  },
  {
    id: "ds-14",
    num: 14,
    lesson: 9,
    title: "Chinese food",
    situation: "Ordering together",
    lines: [
      { speaker: "A", korean: "뭐 먹을 거예요?", english: "What will you eat?" },
      { speaker: "B", korean: "탕수육이요.", english: "Sweet and sour pork." },
      { speaker: "A", korean: "저는 자장면이요.", english: "I'll have jajangmyeon." },
    ],
  },
  {
    id: "ds-15",
    num: 15,
    lesson: 9,
    title: "Takeaway",
    situation: "Packing food to go",
    lines: [
      { speaker: "A", korean: "포장해 주세요.", english: "Please wrap it to go." },
      { speaker: "B", korean: "네, 포장할게요.", english: "Yes, I'll pack it for you." },
      { speaker: "A", korean: "맛있게 드세요.", english: "Enjoy your meal." },
    ],
  },
  {
    id: "ds-16",
    num: 16,
    lesson: 10,
    title: "At the supermarket",
    situation: "Buying groceries",
    lines: [
      { speaker: "A", korean: "안녕하세요. 오늘 할인 상품이 있어요?", english: "Hello. Are there any sale items today?" },
      { speaker: "B", korean: "네, 우유와 빵이 싸요.", english: "Yes, milk and bread are cheap." },
      { speaker: "A", korean: "그럼 우유 한 병하고 빵 다섯 개 주세요.", english: "Then one bottle of milk and five pieces of bread, please." },
    ],
  },
  {
    id: "ds-17",
    num: 17,
    lesson: 10,
    title: "How much is it?",
    situation: "Paying at the counter",
    lines: [
      { speaker: "A", korean: "이거 얼마예요?", english: "How much is this?" },
      { speaker: "B", korean: "사만 원이에요.", english: "It is 40,000 won." },
      { speaker: "A", korean: "너무 비싸요. 조금 깎아 주세요.", english: "It is too expensive. Please give a small discount." },
      { speaker: "B", korean: "네, 사만 원이에요.", english: "Okay, 40,000 won." },
    ],
  },
  {
    id: "ds-18",
    num: 18,
    lesson: 10,
    title: "Helping at home",
    situation: "House chores",
    lines: [
      { speaker: "A", korean: "오늘 집안일을 뭐 해요?", english: "What housework do you do today?" },
      { speaker: "B", korean: "저는 빨래를 해요. 수아 씨는 설거지해요.", english: "I do the laundry. Su-a does the dishes." },
      { speaker: "A", korean: "고마워요.", english: "Thank you." },
    ],
  },
  {
    id: "ds-19",
    num: 19,
    lesson: 11,
    title: "Taking the bus",
    situation: "Asking about transport",
    lines: [
      { speaker: "A", korean: "버스 정류장이 어디예요?", english: "Where is the bus stop?" },
      { speaker: "B", korean: "회사 앞에 있어요.", english: "It is in front of the company." },
      { speaker: "A", korean: "지하철역까지 어떻게 가요?", english: "How do I get to the subway station?" },
      { speaker: "B", korean: "버스를 타고 가세요.", english: "Take the bus." },
    ],
  },
  {
    id: "ds-20",
    num: 20,
    lesson: 11,
    title: "How long does it take?",
    situation: "Travel time",
    lines: [
      { speaker: "A", korean: "공항까지 얼마나 걸려요?", english: "How long does it take to the airport?" },
      { speaker: "B", korean: "한 시간쯤 걸려요.", english: "It takes about one hour." },
    ],
  },
  {
    id: "ds-21",
    num: 21,
    lesson: 11,
    title: "Sorting trash",
    situation: "Recycling at home",
    lines: [
      { speaker: "A", korean: "쓰레기를 어떻게 버려요?", english: "How do you throw away trash?" },
      { speaker: "B", korean: "일반 쓰레기와 음식물 쓰레기를 분리해서 버려요.", english: "We separate general trash and food waste." },
      { speaker: "A", korean: "플라스틱은 어디에 버려요?", english: "Where do you throw plastic?" },
      { speaker: "B", korean: "재활용통에 버려요.", english: "Put it in the recycling bin." },
    ],
  },
  {
    id: "ds-22",
    num: 22,
    lesson: 12,
    title: "Going to the market",
    situation: "Directions on foot",
    lines: [
      { speaker: "A", korean: "시장에 어떻게 가요?", english: "How do I go to the market?" },
      { speaker: "B", korean: "택시를 타고 가요.", english: "Go by taxi." },
      { speaker: "A", korean: "시장까지 얼마나 걸려요?", english: "How long to the market?" },
      { speaker: "B", korean: "이십 분쯤 걸려요.", english: "About twenty minutes." },
    ],
  },
  {
    id: "ds-23",
    num: 23,
    lesson: 12,
    title: "Traffic jam",
    situation: "Explaining lateness",
    lines: [
      { speaker: "A", korean: "왜 늦었어요?", english: "Why were you late?" },
      { speaker: "B", korean: "날씨가 더워서 차가 막혔어요.", english: "It was hot so there was a traffic jam." },
      { speaker: "A", korean: "그래서 택시를 탔어요?", english: "So did you take a taxi?" },
      { speaker: "B", korean: "네, 느려서 택시를 탔어요.", english: "Yes, I took a taxi because it was slow." },
    ],
  },
  {
    id: "ds-24",
    num: 24,
    lesson: 12,
    title: "Why take the subway?",
    situation: "Giving a reason",
    lines: [
      { speaker: "A", korean: "왜 지하철을 타고 왔어요?", english: "Why did you come by subway?" },
      { speaker: "B", korean: "회사가 멀어서 지하철을 타고 왔어요.", english: "The company is far, so I came by subway." },
    ],
  },
  {
    id: "ds-25",
    num: 25,
    lesson: 13,
    title: "This weekend",
    situation: "Making weekend plans",
    lines: [
      { speaker: "A", korean: "이번 주말에 뭐 할 거예요?", english: "What will you do this weekend?" },
      { speaker: "B", korean: "토요일에 쇼핑하고 영화를 볼 거예요.", english: "On Saturday I'll shop and watch a movie." },
      { speaker: "A", korean: "일요일에는요?", english: "What about Sunday?" },
      { speaker: "B", korean: "일요일에는 쉴 거예요.", english: "On Sunday I will rest." },
    ],
  },
  {
    id: "ds-26",
    num: 26,
    lesson: 13,
    title: "Studying at the PC room",
    situation: "Weekend study",
    lines: [
      { speaker: "A", korean: "오늘 뭐 할 거예요?", english: "What will you do today?" },
      { speaker: "B", korean: "PC방에서 공부할 거예요.", english: "I will study at the PC room." },
    ],
  },
  {
    id: "ds-27",
    num: 27,
    lesson: 14,
    title: "Where are you?",
    situation: "Finding someone",
    lines: [
      { speaker: "A", korean: "지금 어디에 있어요?", english: "Where are you now?" },
      { speaker: "B", korean: "사무실에 있어요.", english: "I am at the office." },
      { speaker: "A", korean: "사무실이 어디예요?", english: "Where is the office?" },
      { speaker: "B", korean: "은행 옆에 있어요. 2층에 있어요.", english: "It is next to the bank. It is on the 2nd floor." },
    ],
  },
  {
    id: "ds-28",
    num: 28,
    lesson: 14,
    title: "Finding the pharmacy",
    situation: "Asking directions",
    lines: [
      { speaker: "A", korean: "약국이 어디에 있어요?", english: "Where is the pharmacy?" },
      { speaker: "B", korean: "편의점 옆에 있어요.", english: "It is next to the convenience store." },
      { speaker: "A", korean: "편의점은 어디예요?", english: "Where is the convenience store?" },
      { speaker: "B", korean: "은행 뒤에 있어요.", english: "It is behind the bank." },
    ],
  },
  {
    id: "ds-29",
    num: 29,
    lesson: 14,
    title: "At the department store",
    situation: "Inside a mall",
    lines: [
      { speaker: "A", korean: "백화점에 가요?", english: "Are you going to the department store?" },
      { speaker: "B", korean: "네, 백화점에 가요.", english: "Yes, I'm going to the department store." },
      { speaker: "A", korean: "화장실이 어디예요?", english: "Where is the restroom?" },
      { speaker: "B", korean: "오른쪽에 있어요.", english: "It is on the right." },
    ],
  },
  {
    id: "ds-30",
    num: 30,
    lesson: 15,
    title: "Buying clothes",
    situation: "At a clothing shop",
    lines: [
      { speaker: "A", korean: "무슨 색 옷을 좋아해요?", english: "What color clothes do you like?" },
      { speaker: "B", korean: "검은색 옷을 좋아해요.", english: "I like black clothes." },
      { speaker: "A", korean: "이 옷은 어때요?", english: "How about this clothes?" },
      { speaker: "B", korean: "예뻐요. 입어 봐도 돼요?", english: "It's pretty. May I try it on?" },
    ],
  },
  {
    id: "ds-31",
    num: 31,
    lesson: 15,
    title: "Online shopping",
    situation: "Buying online",
    lines: [
      { speaker: "A", korean: "인터넷으로 옷을 사요?", english: "Do you buy clothes online?" },
      { speaker: "B", korean: "네, 인터넷으로 자주 사요.", english: "Yes, I often buy online." },
    ],
  },
  {
    id: "ds-32",
    num: 32,
    lesson: 17,
    title: "Summer vacation",
    situation: "Travel plans",
    lines: [
      { speaker: "A", korean: "여름 휴가에 뭐 할 거예요?", english: "What will you do for summer vacation?" },
      { speaker: "B", korean: "제주도에 갈 거예요.", english: "I will go to Jeju Island." },
      { speaker: "A", korean: "제주도에서 뭐 할 거예요?", english: "What will you do in Jeju?" },
      { speaker: "B", korean: "비행기를 타고 가요. 한라산에 올라갈 거예요.", english: "I'll go by plane. I'll climb Hallasan." },
    ],
  },
  {
    id: "ds-33",
    num: 33,
    lesson: 17,
    title: "How was Jeju?",
    situation: "After a trip",
    lines: [
      { speaker: "A", korean: "제주도에 갔어요?", english: "Did you go to Jeju?" },
      { speaker: "B", korean: "네, 재미있었어요. 음식도 맛있었어요.", english: "Yes, it was fun. The food was delicious too." },
    ],
  },
  {
    id: "ds-34",
    num: 34,
    lesson: 17,
    title: "Trip to Gyeongju",
    situation: "Cultural travel",
    lines: [
      { speaker: "A", korean: "휴가에 어디에 갈 거예요?", english: "Where will you go on vacation?" },
      { speaker: "B", korean: "경주에 갈 거예요.", english: "I will go to Gyeongju." },
      { speaker: "A", korean: "경주에서 뭐 할 거예요?", english: "What will you do in Gyeongju?" },
      { speaker: "B", korean: "역사 유적지를 구경할 거예요.", english: "I will see historical sites." },
    ],
  },
  {
    id: "ds-35",
    num: 35,
    lesson: 18,
    title: "What will you watch?",
    situation: "Choosing entertainment",
    lines: [
      { speaker: "A", korean: "오늘 저녁에 뭐 볼 거예요?", english: "What will you watch tonight?" },
      { speaker: "B", korean: "영화를 볼 거예요.", english: "I will watch a movie." },
      { speaker: "A", korean: "저는 드라마를 볼 거예요.", english: "I will watch a drama." },
    ],
  },
  {
    id: "ds-36",
    num: 36,
    lesson: 18,
    title: "Going to a concert",
    situation: "Weekend fun",
    lines: [
      { speaker: "A", korean: "주말에 콘서트에 갈 거예요?", english: "Will you go to a concert on the weekend?" },
      { speaker: "B", korean: "네, 콘서트에 갈 거예요.", english: "Yes, I will go to a concert." },
    ],
  },
  {
    id: "ds-37",
    num: 37,
    lesson: 4,
    title: "Nice to meet you",
    situation: "First meeting",
    lines: [
      { korean: "안녕하세요.", english: "Hello." },
      { korean: "만나서 반갑습니다.", english: "Nice to meet you." },
      { korean: "잘 부탁합니다.", english: "Please take care of me. (polite intro)" },
    ],
  },
  {
    id: "ds-38",
    num: 38,
    lesson: 9,
    title: "Is it delicious?",
    situation: "At the table",
    lines: [
      { speaker: "A", korean: "맛있어요?", english: "Is it delicious?" },
      { speaker: "B", korean: "네, 맛있어요.", english: "Yes, it's delicious." },
      { speaker: "A", korean: "더 드세요.", english: "Please eat more." },
    ],
  },
  {
    id: "ds-39",
    num: 39,
    lesson: 10,
    title: "Thank you and goodbye",
    situation: "Leaving politely",
    lines: [
      { korean: "감사합니다.", english: "Thank you." },
      { korean: "천만에요.", english: "You're welcome." },
      { korean: "안녕히 가세요.", english: "Goodbye. (to someone leaving)" },
    ],
  },
  {
    id: "ds-40",
    num: 40,
    lesson: 11,
    title: "Must take out trash",
    situation: "Obligation",
    lines: [
      { speaker: "A", korean: "오늘 쓰레기를 버려야 돼요?", english: "Do we have to take out the trash today?" },
      { speaker: "B", korean: "네, 쓰레기를 분리해서 버려야 해요.", english: "Yes, we have to separate and throw away trash." },
    ],
  },
  {
    id: "ds-41",
    num: 41,
    lesson: 9,
    place: "cafe",
    title: "Ordering at a cafe",
    situation: "At a cafe counter",
    lines: [
      { speaker: "A", korean: "어서 오세요. 주문하시겠어요?", english: "Welcome. Would you like to order?" },
      { speaker: "B", korean: "아메리카노 한 잔 주세요.", english: "One Americano, please." },
      { speaker: "A", korean: "따뜻한 거예요, 차가운 거예요?", english: "Hot or iced?" },
      { speaker: "B", korean: "아이스로 주세요.", english: "Iced, please." },
    ],
  },
  {
    id: "ds-42",
    num: 42,
    lesson: 9,
    place: "cafe",
    title: "Finding a seat",
    situation: "Inside a cafe",
    lines: [
      { speaker: "A", korean: "여기 앉아도 돼요?", english: "May I sit here?" },
      { speaker: "B", korean: "네, 앉으세요.", english: "Yes, please sit down." },
      { speaker: "A", korean: "와이파이 비밀번호가 뭐예요?", english: "What is the Wi-Fi password?" },
      { speaker: "B", korean: "영수증 뒤에 있어요.", english: "It is on the back of the receipt." },
    ],
  },
  {
    id: "ds-43",
    num: 43,
    lesson: 9,
    place: "cafe",
    title: "Paying at a cafe",
    situation: "At the cafe register",
    lines: [
      { speaker: "A", korean: "얼마예요?", english: "How much is it?" },
      { speaker: "B", korean: "사천 오백 원이에요.", english: "It is 4,500 won." },
      { speaker: "A", korean: "카드로 계산할게요.", english: "I will pay by card." },
      { speaker: "B", korean: "네, 감사합니다.", english: "Yes, thank you." },
    ],
  },
  {
    id: "ds-44",
    num: 44,
    lesson: 9,
    place: "cafe",
    title: "Meeting at a cafe",
    situation: "Meeting a friend",
    lines: [
      { speaker: "A", korean: "카페에서 만날까요?", english: "Shall we meet at the cafe?" },
      { speaker: "B", korean: "좋아요. 몇 시에 만날까요?", english: "Sounds good. What time shall we meet?" },
      { speaker: "A", korean: "3시에 만나요.", english: "Let's meet at 3 o'clock." },
      { speaker: "B", korean: "알겠어요. 이따 봐요.", english: "Okay. See you later." },
    ],
  },
  {
    id: "ds-45",
    num: 45,
    lesson: 9,
    place: "cafe",
    title: "To-go coffee",
    situation: "Taking coffee to go",
    lines: [
      { speaker: "A", korean: "여기서 드시고 가세요?", english: "For here or to go?" },
      { speaker: "B", korean: "포장해 주세요.", english: "To go, please." },
      { speaker: "A", korean: "네, 잠시만 기다려 주세요.", english: "Yes, please wait a moment." },
    ],
  },
  {
    id: "ds-46",
    num: 46,
    lesson: 8,
    place: "shop",
    title: "Buying fruit at the market",
    situation: "Traditional market",
    lines: [
      { speaker: "A", korean: "사과 1킬로 주세요.", english: "One kilo of apples, please." },
      { speaker: "B", korean: "네, 여기 있어요.", english: "Yes, here you are." },
      { speaker: "A", korean: "이거 얼마예요?", english: "How much is this?" },
      { speaker: "B", korean: "오천 원이에요.", english: "It is 5,000 won." },
    ],
  },
  {
    id: "ds-47",
    num: 47,
    lesson: 10,
    place: "shop",
    title: "Discount at the store",
    situation: "Shopping sale",
    lines: [
      { speaker: "A", korean: "오늘 할인해요?", english: "Is there a discount today?" },
      { speaker: "B", korean: "네, 오늘 싸요.", english: "Yes, it is cheap today." },
      { speaker: "A", korean: "그럼 두 개 주세요.", english: "Then two, please." },
    ],
  },
  {
    id: "ds-48",
    num: 48,
    lesson: 8,
    place: "shop",
    title: "Wrong size",
    situation: "Clothes shop / market",
    lines: [
      { speaker: "A", korean: "더 큰 거 있어요?", english: "Do you have a bigger one?" },
      { speaker: "B", korean: "네, 잠시만요.", english: "Yes, one moment." },
      { speaker: "A", korean: "이거 입어 봐도 돼요?", english: "May I try this on?" },
    ],
  },
  {
    id: "ds-49",
    num: 49,
    lesson: 12,
    place: "directions",
    title: "Where is the subway?",
    situation: "On the street",
    lines: [
      { speaker: "A", korean: "실례합니다. 지하철역이 어디예요?", english: "Excuse me. Where is the subway station?" },
      { speaker: "B", korean: "저기 신호등 앞에서 왼쪽으로 가세요.", english: "Go left at the traffic light over there." },
      { speaker: "A", korean: "걸어서 얼마나 걸려요?", english: "How long on foot?" },
      { speaker: "B", korean: "오 분쯤 걸려요.", english: "About five minutes." },
    ],
  },
  {
    id: "ds-50",
    num: 50,
    lesson: 12,
    place: "directions",
    title: "Turn right at the corner",
    situation: "Giving directions",
    lines: [
      { speaker: "A", korean: "병원에 어떻게 가요?", english: "How do I get to the hospital?" },
      { speaker: "B", korean: "모퉁이에서 오른쪽으로 가세요.", english: "Go right at the corner." },
      { speaker: "A", korean: "그다음에는요?", english: "And then?" },
      { speaker: "B", korean: "두 블록 가면 왼쪽에 있어요.", english: "Go two blocks; it is on the left." },
    ],
  },
  {
    id: "ds-51",
    num: 51,
    lesson: 14,
    place: "directions",
    title: "Is it far?",
    situation: "Asking distance",
    lines: [
      { speaker: "A", korean: "공원이 멀어요?", english: "Is the park far?" },
      { speaker: "B", korean: "아니요, 가까워요.", english: "No, it is close." },
      { speaker: "A", korean: "지도로 보여 주세요.", english: "Please show me on the map." },
      { speaker: "B", korean: "네, 여기예요.", english: "Yes, it is here." },
    ],
  },
  {
    id: "ds-52",
    num: 52,
    lesson: 14,
    place: "hospital",
    title: "I have a headache",
    situation: "At the clinic",
    lines: [
      { speaker: "A", korean: "어디가 아파요?", english: "Where does it hurt?" },
      { speaker: "B", korean: "머리가 아파요.", english: "My head hurts." },
      { speaker: "A", korean: "언제부터 아팠어요?", english: "Since when has it hurt?" },
      { speaker: "B", korean: "어제부터 아팠어요.", english: "Since yesterday." },
    ],
  },
  {
    id: "ds-53",
    num: 53,
    lesson: 14,
    place: "hospital",
    title: "Buying medicine",
    situation: "At the pharmacy",
    lines: [
      { speaker: "A", korean: "감기약 있어요?", english: "Do you have cold medicine?" },
      { speaker: "B", korean: "네, 이거 드세요. 하루에 세 번 드세요.", english: "Yes, take this. Take it three times a day." },
      { speaker: "A", korean: "식후에 먹어요?", english: "Do I take it after meals?" },
      { speaker: "B", korean: "네, 식후에 드세요.", english: "Yes, take it after meals." },
    ],
  },
  {
    id: "ds-54",
    num: 54,
    lesson: 14,
    place: "work",
    title: "Morning meeting",
    situation: "At the office",
    lines: [
      { speaker: "A", korean: "오늘 회의가 몇 시예요?", english: "What time is the meeting today?" },
      { speaker: "B", korean: "오전 10시에 시작해요.", english: "It starts at 10 a.m." },
      { speaker: "A", korean: "회의실이 어디예요?", english: "Where is the meeting room?" },
      { speaker: "B", korean: "3층에 있어요.", english: "It is on the 3rd floor." },
    ],
  },
  {
    id: "ds-55",
    num: 55,
    lesson: 5,
    place: "work",
    title: "Asking for a day off",
    situation: "Talking to a manager",
    lines: [
      { speaker: "A", korean: "내일 쉬어도 돼요?", english: "May I take tomorrow off?" },
      { speaker: "B", korean: "왜요?", english: "Why?" },
      { speaker: "A", korean: "병원에 가야 해요.", english: "I have to go to the hospital." },
      { speaker: "B", korean: "네, 알겠어요.", english: "Yes, I understand." },
    ],
  },
  {
    id: "ds-56",
    num: 56,
    lesson: 9,
    place: "restaurant",
    title: "Making a reservation",
    situation: "Calling a restaurant",
    lines: [
      { speaker: "A", korean: "예약하고 싶어요.", english: "I would like to make a reservation." },
      { speaker: "B", korean: "몇 명이세요?", english: "How many people?" },
      { speaker: "A", korean: "두 명이에요. 저녁 7시에요.", english: "Two people. At 7 p.m." },
      { speaker: "B", korean: "네, 예약했습니다.", english: "Yes, you are reserved." },
    ],
  },
  {
    id: "ds-57",
    num: 57,
    lesson: 9,
    place: "restaurant",
    title: "Not too spicy",
    situation: "Ordering food",
    lines: [
      { speaker: "A", korean: "이거 매워요?", english: "Is this spicy?" },
      { speaker: "B", korean: "조금 매워요.", english: "It is a little spicy." },
      { speaker: "A", korean: "안 맵게 해 주세요.", english: "Please make it not spicy." },
      { speaker: "B", korean: "네, 알겠습니다.", english: "Yes, understood." },
    ],
  },
  {
    id: "ds-58",
    num: 58,
    lesson: 10,
    place: "supermarket",
    title: "Where is the milk?",
    situation: "In a supermarket",
    lines: [
      { speaker: "A", korean: "실례합니다. 우유가 어디에 있어요?", english: "Excuse me. Where is the milk?" },
      { speaker: "B", korean: "냉장 코너에 있어요.", english: "It is in the refrigerated section." },
      { speaker: "A", korean: "계란도 있어요?", english: "Do you also have eggs?" },
      { speaker: "B", korean: "네, 옆에 있어요.", english: "Yes, they are next to it." },
    ],
  },
  {
    id: "ds-59",
    num: 59,
    lesson: 10,
    place: "supermarket",
    title: "Need a bag",
    situation: "At the checkout",
    lines: [
      { speaker: "A", korean: "봉투 필요하세요?", english: "Do you need a bag?" },
      { speaker: "B", korean: "네, 하나 주세요.", english: "Yes, one please." },
      { speaker: "A", korean: "영수증 드릴까요?", english: "Would you like a receipt?" },
      { speaker: "B", korean: "네, 주세요.", english: "Yes, please." },
    ],
  },
  {
    id: "ds-60",
    num: 60,
    lesson: 11,
    place: "transport",
    title: "Which bus?",
    situation: "At a bus stop",
    lines: [
      { speaker: "A", korean: "시청에 가는 버스가 뭐예요?", english: "Which bus goes to city hall?" },
      { speaker: "B", korean: "146번 버스를 타세요.", english: "Take bus number 146." },
      { speaker: "A", korean: "여기서 타요?", english: "Do I get on here?" },
      { speaker: "B", korean: "네, 여기서 타세요.", english: "Yes, get on here." },
    ],
  },
  {
    id: "ds-61",
    num: 61,
    lesson: 11,
    place: "transport",
    title: "Buying a subway ticket",
    situation: "At the station",
    lines: [
      { speaker: "A", korean: "일회용 교통카드 주세요.", english: "One single-use transit card, please." },
      { speaker: "B", korean: "어디까지 가세요?", english: "Where are you going?" },
      { speaker: "A", korean: "홍대까지요.", english: "To Hongdae." },
      { speaker: "B", korean: "천삼백 원이에요.", english: "It is 1,300 won." },
    ],
  },
  {
    id: "ds-62",
    num: 62,
    lesson: 11,
    place: "transport",
    title: "Getting off the subway",
    situation: "On the train",
    lines: [
      { speaker: "A", korean: "다음 역이 어디예요?", english: "What is the next station?" },
      { speaker: "B", korean: "강남역이에요.", english: "It is Gangnam Station." },
      { speaker: "A", korean: "환승해야 해요?", english: "Do I need to transfer?" },
      { speaker: "B", korean: "네, 2호선으로 갈아타세요.", english: "Yes, transfer to Line 2." },
    ],
  },
  {
    id: "ds-63",
    num: 63,
    lesson: 11,
    place: "home",
    title: "Inviting a friend home",
    situation: "On the phone",
    lines: [
      { speaker: "A", korean: "오늘 우리 집에 올래요?", english: "Do you want to come to my house today?" },
      { speaker: "B", korean: "좋아요. 몇 시에 갈까요?", english: "Sounds good. What time should I come?" },
      { speaker: "A", korean: "6시에 와요. 저녁 먹어요.", english: "Come at 6. Let's eat dinner." },
      { speaker: "B", korean: "네, 갈게요.", english: "Yes, I will come." },
    ],
  },
  {
    id: "ds-64",
    num: 64,
    lesson: 10,
    place: "home",
    title: "Washing dishes",
    situation: "Sharing chores",
    lines: [
      { speaker: "A", korean: "오늘 설거지 누가 해요?", english: "Who does the dishes today?" },
      { speaker: "B", korean: "제가 할게요.", english: "I will do it." },
      { speaker: "A", korean: "고마워요. 내일은 제가 할게요.", english: "Thank you. I will do it tomorrow." },
    ],
  },
  {
    id: "ds-65",
    num: 65,
    lesson: 6,
    place: "friends",
    title: "Running late",
    situation: "Texting a friend",
    lines: [
      { speaker: "A", korean: "미안해요. 조금 늦을 것 같아요.", english: "Sorry. I think I will be a little late." },
      { speaker: "B", korean: "괜찮아요. 천천히 오세요.", english: "It's okay. Take your time." },
      { speaker: "A", korean: "10분 후에 도착해요.", english: "I will arrive in 10 minutes." },
    ],
  },
  {
    id: "ds-66",
    num: 66,
    lesson: 7,
    place: "friends",
    title: "Congratulations",
    situation: "Celebrating good news",
    lines: [
      { speaker: "A", korean: "시험에 합격했어요?", english: "Did you pass the exam?" },
      { speaker: "B", korean: "네, 합격했어요!", english: "Yes, I passed!" },
      { speaker: "A", korean: "축하해요!", english: "Congratulations!" },
      { speaker: "B", korean: "감사합니다.", english: "Thank you." },
    ],
  },
  {
    id: "ds-67",
    num: 67,
    lesson: 7,
    place: "weather",
    title: "Bring an umbrella",
    situation: "Before going out",
    lines: [
      { speaker: "A", korean: "오늘 우산 가져가세요.", english: "Take an umbrella today." },
      { speaker: "B", korean: "왜요?", english: "Why?" },
      { speaker: "A", korean: "오후에 비가 올 거예요.", english: "It will rain in the afternoon." },
      { speaker: "B", korean: "알겠어요. 고마워요.", english: "Okay. Thank you." },
    ],
  },
  {
    id: "ds-68",
    num: 68,
    lesson: 17,
    place: "travel",
    title: "At the airport",
    situation: "Checking in",
    lines: [
      { speaker: "A", korean: "여권 보여 주세요.", english: "Please show your passport." },
      { speaker: "B", korean: "여기 있어요.", english: "Here it is." },
      { speaker: "A", korean: "창가 좌석이에요, 복도 좌석이에요?", english: "Window seat or aisle seat?" },
      { speaker: "B", korean: "창가 좌석으로 주세요.", english: "A window seat, please." },
    ],
  },
  {
    id: "ds-69",
    num: 69,
    lesson: 17,
    place: "travel",
    title: "Hotel check-in",
    situation: "At the hotel front desk",
    lines: [
      { speaker: "A", korean: "체크인하고 싶어요.", english: "I would like to check in." },
      { speaker: "B", korean: "예약자 성함이 뭐예요?", english: "What is the name on the reservation?" },
      { speaker: "A", korean: "김민수예요.", english: "It is Kim Min-su." },
      { speaker: "B", korean: "네, 502호입니다.", english: "Yes, room 502." },
    ],
  },
  {
    id: "ds-70",
    num: 70,
    lesson: 18,
    place: "entertainment",
    title: "Going to karaoke",
    situation: "Weekend plans",
    lines: [
      { speaker: "A", korean: "노래방에 갈까요?", english: "Shall we go to karaoke?" },
      { speaker: "B", korean: "좋아요! 몇 시에 만날까요?", english: "Sounds good! What time shall we meet?" },
      { speaker: "A", korean: "8시에 만나요.", english: "Let's meet at 8." },
      { speaker: "B", korean: "재미있겠어요!", english: "It will be fun!" },
    ],
  },
  {
    id: "ds-71",
    num: 71,
    lesson: 18,
    place: "entertainment",
    title: "Which movie?",
    situation: "Choosing a film",
    lines: [
      { speaker: "A", korean: "무슨 영화 볼 거예요?", english: "What movie will you watch?" },
      { speaker: "B", korean: "액션 영화를 볼 거예요.", english: "I will watch an action movie." },
      { speaker: "A", korean: "표는 샀어요?", english: "Did you buy tickets?" },
      { speaker: "B", korean: "네, 인터넷으로 샀어요.", english: "Yes, I bought them online." },
    ],
  },
  {
    id: "ds-72",
    num: 72,
    lesson: 4,
    place: "introduction",
    title: "Name and age",
    situation: "Getting to know someone",
    lines: [
      { speaker: "A", korean: "이름이 뭐예요?", english: "What is your name?" },
      { speaker: "B", korean: "저는 소피아예요.", english: "I am Sophia." },
      { speaker: "A", korean: "몇 살이에요?", english: "How old are you?" },
      { speaker: "B", korean: "스물다섯 살이에요.", english: "I am twenty-five years old." },
    ],
  },
];

/** One filter chip can match several place tags (e.g. market + supermarket) */
export const DAILY_SENTENCE_PLACE_GROUPS: Partial<
  Record<DailySentencePlace, DailySentencePlace[]>
> = {
  shop: ["shop", "supermarket", "mall", "clothes"],
};

export function searchDailySentences(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return dailySentenceGroups;
  return dailySentenceGroups.filter((g) => {
    const place = getDailySentencePlace(g);
    const placeLabel = DAILY_SENTENCE_PLACE_LABELS[place].toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.situation.toLowerCase().includes(q) ||
      placeLabel.includes(q) ||
      place.includes(q) ||
      g.lines.some(
        (l) =>
          l.korean.toLowerCase().includes(q) ||
          l.english.toLowerCase().includes(q)
      ) ||
      String(g.num).includes(q)
    );
  });
}

export function filterDailySentencesByPlace(
  groups: DailySentenceGroup[],
  place: DailySentencePlace | "all"
) {
  if (place === "all") return groups;
  const aliases = DAILY_SENTENCE_PLACE_GROUPS[place];
  if (aliases) {
    return groups.filter((g) => aliases.includes(getDailySentencePlace(g)));
  }
  return groups.filter((g) => getDailySentencePlace(g) === place);
}

export function countDailySentencesForPlaceFilter(
  place: DailySentencePlace | "all"
) {
  return filterDailySentencesByPlace(dailySentenceGroups, place).length;
}

export function getDailySentencesByLesson(lesson: number) {
  return dailySentenceGroups.filter((g) => g.lesson === lesson);
}

export function countDailySentencesByPlace(place: DailySentencePlace) {
  return dailySentenceGroups.filter((g) => getDailySentencePlace(g) === place).length;
}

/** Vocabulary from daily sentences not already in EPS word list */
export const dailySentenceExtraVocab = [
  { korean: "김밥", english: "kimbap (rice roll)", lesson: 13 },
  { korean: "라면", english: "ramen / instant noodles", lesson: 13 },
  { korean: "탕수육", english: "sweet and sour pork", lesson: 13 },
  { korean: "자장면", english: "jajangmyeon (black bean noodles)", lesson: 13 },
  { korean: "주문하다", english: "to order (food)", lesson: 13 },
  { korean: "만나서 반갑습니다", english: "nice to meet you", lesson: 13 },
  { korean: "잘 부탁합니다", english: "please take care of me", lesson: 13 },
  { korean: "천만에요", english: "you're welcome", lesson: 13 },
  { korean: "안녕히 가세요", english: "goodbye (to someone leaving)", lesson: 13 },
  { korean: "여행", english: "trip / travel", lesson: 17 },
  { korean: "휴가", english: "vacation / holiday", lesson: 17 },
  { korean: "제주도", english: "Jeju Island", lesson: 17 },
  { korean: "한라산", english: "Hallasan (mountain)", lesson: 17 },
  { korean: "경주", english: "Gyeongju (city)", lesson: 17 },
  { korean: "역사 유적지", english: "historical site", lesson: 17 },
  { korean: "콘서트", english: "concert", lesson: 18 },
  { korean: "드라마", english: "drama (TV)", lesson: 18 },
  { korean: "재미있다", english: "to be fun / interesting", lesson: 18 },
  { korean: "막히다", english: "to be blocked / traffic jam", lesson: 12 },
  { korean: "재활용통", english: "recycling bin", lesson: 11 },
  { korean: "음식물 쓰레기", english: "food waste", lesson: 11 },
  { korean: "일반 쓰레기", english: "general trash", lesson: 11 },
  { korean: "입어 보다", english: "to try on (clothes)", lesson: 15 },
  { korean: "인터넷", english: "internet", lesson: 15 },
] as const;

/** Grammar highlighted in daily-sentence lessons */
export const dailySentenceExtraGrammar = [
  { korean: "-고 싶어요", english: "want to (do)", lesson: 13 },
  { korean: "-(으)ㄹ 거예요", english: "will (future plan)", lesson: 13 },
  { korean: "-아/어서", english: "because / so (reason)", lesson: 12 },
  { korean: "-아/어 보다", english: "try doing", lesson: 15 },
] as const;
