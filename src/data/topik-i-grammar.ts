/** TOPIK I grammar — 84 patterns (Tammy Korean TOPIKⅠ Grammar PDF) */
export interface TopikGrammarItem {
  id: string;
  num: number;
  korean: string;
  english: string;
  lesson: number;
  exampleKorean?: string;
  exampleEnglish?: string;
}

export const TOPIK_I_GRAMMAR_LESSON_LABELS: Record<number, string> = {
  1: "Particles 1 — subject, topic, object, direction",
  2: "Particles 2 — honorific, comparison, experience",
  3: "Patterns — reason, ability, intention",
  4: "Patterns — purpose, condition, requests",
  5: "Patterns — formal style, obligation, negation",
};

export const topikIGrammar: TopikGrammarItem[] = [
  { id: "topik-g-1", num: 1, korean: "이/가", english: "subject particle", lesson: 1, exampleKorean: "날씨가 좋아요.", exampleEnglish: "The weather is good." },
  { id: "topik-g-2", num: 2, korean: "은/는", english: "topic particle", lesson: 1, exampleKorean: "선생님은 지금 안 계세요.", exampleEnglish: "The teacher is not here now." },
  { id: "topik-g-3", num: 3, korean: "을/를", english: "object particle", lesson: 1, exampleKorean: "책을 읽어요.", exampleEnglish: "I am reading a book." },
  { id: "topik-g-4", num: 4, korean: "(으)로", english: "to / by / with (direction, means)", lesson: 1, exampleKorean: "저는 부산으로 가요.", exampleEnglish: "I am going to Busan." },
  { id: "topik-g-5", num: 5, korean: "(이)랑", english: "and", lesson: 1, exampleKorean: "설렁탕이랑 김밥 주세요.", exampleEnglish: "Please give me seolleongtang and kimbap." },
  { id: "topik-g-6", num: 6, korean: "(이)랑", english: "with", lesson: 1, exampleKorean: "친구랑 같이 왔어요.", exampleEnglish: "I came with a friend." },
  { id: "topik-g-7", num: 7, korean: "하고", english: "and", lesson: 1, exampleKorean: "양념 치킨하고 맥주 주세요.", exampleEnglish: "Please give me yangnyeom chicken and beer." },
  { id: "topik-g-8", num: 8, korean: "도", english: "also / as well", lesson: 1, exampleKorean: "내일도 오늘도 비가 와요.", exampleEnglish: "It is raining today and tomorrow too." },
  { id: "topik-g-9", num: 9, korean: "에", english: "to / at (place, time)", lesson: 1, exampleKorean: "남대문 시장에 가고 싶어요.", exampleEnglish: "I want to go to Namdaemun market." },
  { id: "topik-g-10", num: 10, korean: "에서", english: "from / at (action place)", lesson: 1, exampleKorean: "공항에서 지하철 타고 왔어요.", exampleEnglish: "I came by subway from the airport." },
  { id: "topik-g-11", num: 11, korean: "까지", english: "until / up to", lesson: 1, exampleKorean: "강남까지 가고 싶어요.", exampleEnglish: "I want to go as far as Gangnam." },
  { id: "topik-g-12", num: 12, korean: "부터", english: "from (starting point)", lesson: 1, exampleKorean: "지하철은 아침 5시부터 운영해요.", exampleEnglish: "The subway operates from 5 a.m." },
  { id: "topik-g-13", num: 13, korean: "와/과", english: "and (with nouns)", lesson: 1, exampleKorean: "토미 씨와 친구예요.", exampleEnglish: "Tommy and I are friends." },
  { id: "topik-g-14", num: 14, korean: "께", english: "to (polite)", lesson: 2, exampleKorean: "부모님께 드리고 싶어요.", exampleEnglish: "I want to give it to my parents." },
  { id: "topik-g-15", num: 15, korean: "께서", english: "honorific subject marker", lesson: 2, exampleKorean: "할머니께서 부탁하셨어요.", exampleEnglish: "My grandmother asked me to." },
  { id: "topik-g-16", num: 16, korean: "에게", english: "to (person)", lesson: 2, exampleKorean: "우리 엄마에게 주고 싶어요.", exampleEnglish: "I want to give it to my mother." },
  { id: "topik-g-17", num: 17, korean: "에게서", english: "from (person)", lesson: 2, exampleKorean: "호텔 직원에게서 받았어요.", exampleEnglish: "I got it from the hotel staff." },
  { id: "topik-g-18", num: 18, korean: "한테", english: "to (casual person)", lesson: 2, exampleKorean: "백화점 안내원한테 물어보세요.", exampleEnglish: "Please ask the department store guide." },
  { id: "topik-g-19", num: 19, korean: "한테서", english: "from (casual person)", lesson: 2, exampleKorean: "이거는 친구한테서 선물로 받은 거예요.", exampleEnglish: "I got this as a gift from my friend." },
  { id: "topik-g-20", num: 20, korean: "(이)나", english: "or", lesson: 2, exampleKorean: "버스나 지하철 타고 갈게요.", exampleEnglish: "I will take a bus or the subway." },
  { id: "topik-g-21", num: 21, korean: "(이)나", english: "or (choice)", lesson: 2, exampleKorean: "교환이나 환불 원하시면 연락주세요.", exampleEnglish: "Contact us for an exchange or refund." },
  { id: "topik-g-22", num: 22, korean: "(이)나", english: "rather", lesson: 2, exampleKorean: "밥이나 먹으러 가고 싶어요.", exampleEnglish: "I would rather go eat." },
  { id: "topik-g-23", num: 23, korean: "(이)나", english: "even (as many as)", lesson: 2, exampleKorean: "쇼핑하는데 열 시간이나 걸렸어요.", exampleEnglish: "It took even ten hours to shop." },
  { id: "topik-g-24", num: 24, korean: "만", english: "only", lesson: 2, exampleKorean: "지금 5000원만 있어요.", exampleEnglish: "I have only 5,000 won now." },
  { id: "topik-g-25", num: 25, korean: "의", english: "possessive ('s)", lesson: 2, exampleKorean: "내 친구의 그림은 아주 멋져요.", exampleEnglish: "My friend's drawing is awesome." },
  { id: "topik-g-26", num: 26, korean: "마다", english: "every / whenever", lesson: 2, exampleKorean: "한국에 올 때마다 이 가게를 찾아요.", exampleEnglish: "I visit this shop whenever I come to Korea." },
  { id: "topik-g-27", num: 27, korean: "밖에", english: "only (nothing but)", lesson: 2, exampleKorean: "시간이 한 시간밖에 없어요.", exampleEnglish: "I have only one hour." },
  { id: "topik-g-28", num: 28, korean: "보다", english: "more than / better than", lesson: 2, exampleKorean: "이것보다 이게 더 어울려요.", exampleEnglish: "This suits better than that." },
  { id: "topik-g-29", num: 29, korean: "처럼", english: "like / similar to", lesson: 2, exampleKorean: "배우처럼 생기셨네요.", exampleEnglish: "You look like an actor." },
  { id: "topik-g-30", num: 30, korean: "(으)ㄴ 것 같다", english: "I think / it seems", lesson: 2, exampleKorean: "택시 비용이 좀 비싼 것 같아요.", exampleEnglish: "I think the taxi fare is a bit expensive." },
  { id: "topik-g-31", num: 31, korean: "(으)ㄹ 것 같다", english: "I guess / assume", lesson: 2, exampleKorean: "이 화장품은 인기가 많을 것 같아요.", exampleEnglish: "I guess this cosmetic will be popular." },
  { id: "topik-g-32", num: 32, korean: "(으)ㄴ 적이 있다", english: "have (ever) done", lesson: 3, exampleKorean: "이 가게에 와 본 적이 있어요.", exampleEnglish: "I have been to this store." },
  { id: "topik-g-33", num: 33, korean: "(으)ㄴ 적이 없다", english: "have never done", lesson: 3, exampleKorean: "저는 한국에 가본 적이 없어요.", exampleEnglish: "I have never been to Korea." },
  { id: "topik-g-34", num: 34, korean: "(으)ㄴ 지", english: "how long since", lesson: 3, exampleKorean: "이 가게가 생긴 지 얼마나 됐어요?", exampleEnglish: "How long has this store been open?" },
  { id: "topik-g-35", num: 35, korean: "(으)ㄴ 지", english: "since (time passed)", lesson: 3, exampleKorean: "한국에 온 지 3일이 지났습니다.", exampleEnglish: "Three days have passed since I came to Korea." },
  { id: "topik-g-36", num: 36, korean: "(으)ㄴ데(요)", english: "although", lesson: 3, exampleKorean: "역에서 좀 먼데요.", exampleEnglish: "Although it is a little far from the station." },
  { id: "topik-g-37", num: 37, korean: "(으)ㄴ데(요)", english: "but / excuse me", lesson: 3, exampleKorean: "죄송한데요, 길 좀 알려줄 수 있어요?", exampleEnglish: "Excuse me, but can you tell me the way?" },
  { id: "topik-g-38", num: 38, korean: "(으)니까", english: "because / since", lesson: 3, exampleKorean: "달러 밖에 없으니까 환전해야 돼요.", exampleEnglish: "I need to exchange money because I only have dollars." },
  { id: "topik-g-39", num: 39, korean: "(으)ㄹ 것이다", english: "will be", lesson: 3, exampleKorean: "여기 식당은 맛있을 거예요.", exampleEnglish: "The restaurant here will be delicious." },
  { id: "topik-g-40", num: 40, korean: "(으)ㄹ 때", english: "when", lesson: 3, exampleKorean: "내가 버스 타고 있었을 때 잃어버렸어요.", exampleEnglish: "I lost it when I was on the bus." },
  { id: "topik-g-41", num: 41, korean: "(으)ㄹ 수 있다", english: "can", lesson: 3, exampleKorean: "저는 한국말 조금 할 수 있어요.", exampleEnglish: "I can speak Korean a little." },
  { id: "topik-g-42", num: 42, korean: "(으)ㄹ 수 없다", english: "cannot", lesson: 3, exampleKorean: "여기서는 사진을 찍을 수 없어요.", exampleEnglish: "You cannot take photos here." },
  { id: "topik-g-43", num: 43, korean: "(으)ㄹ게요", english: "will (promise)", lesson: 3, exampleKorean: "제가 할게요.", exampleEnglish: "I will do it." },
  { id: "topik-g-44", num: 44, korean: "(으)ㄹ까 하다", english: "thinking of (doing)", lesson: 3, exampleKorean: "명동에 갈까 해요.", exampleEnglish: "I am thinking of going to Myeongdong." },
  { id: "topik-g-45", num: 45, korean: "(으)ㄹ까 봐", english: "worried that", lesson: 3, exampleKorean: "여행 가는데 현금이 모자랄까 봐 걱정했어요.", exampleEnglish: "I was worried I would not have enough cash for the trip." },
  { id: "topik-g-46", num: 46, korean: "(으)ㄹ까요?", english: "shall we?", lesson: 3, exampleKorean: "여기서 걸어갈까요?", exampleEnglish: "Shall we walk from here?" },
  { id: "topik-g-47", num: 47, korean: "(으)ㄹ래요", english: "will (my choice)", lesson: 3, exampleKorean: "저는 이걸로 할래요.", exampleEnglish: "I will go with this one." },
  { id: "topik-g-48", num: 48, korean: "(으)ㄹ래요?", english: "would you like to?", lesson: 3, exampleKorean: "이걸로 계산하실래요?", exampleEnglish: "Would you like to pay with this?" },
  { id: "topik-g-49", num: 49, korean: "(으)러 가다", english: "go in order to", lesson: 4, exampleKorean: "한국에 관광하러 갈 거예요.", exampleEnglish: "I will go to Korea to travel." },
  { id: "topik-g-50", num: 50, korean: "(으)러 오다", english: "come in order to", lesson: 4, exampleKorean: "여기에 예약하러 왔어요.", exampleEnglish: "I came here to make a reservation." },
  { id: "topik-g-51", num: 51, korean: "(으)려고", english: "going to (intend)", lesson: 4, exampleKorean: "한국말을 공부하려고 해요.", exampleEnglish: "I am going to study Korean." },
  { id: "topik-g-52", num: 52, korean: "(으)려고요", english: "planning to", lesson: 4, exampleKorean: "아이돌 콘서트에 가려고요.", exampleEnglish: "I am planning to go to a concert." },
  { id: "topik-g-53", num: 53, korean: "(으)면", english: "if / when", lesson: 4, exampleKorean: "부산에 가면 뭘 볼 수 있을까요?", exampleEnglish: "What can I see if I go to Busan?" },
  { id: "topik-g-54", num: 54, korean: "(으)면서", english: "while", lesson: 4, exampleKorean: "핸드폰을 보면서 걷지 마세요.", exampleEnglish: "Do not walk while looking at your phone." },
  { id: "topik-g-55", num: 55, korean: "(으)ㅂ시다", english: "let's", lesson: 4, exampleKorean: "순두부를 주문해 봅시다.", exampleEnglish: "Let's order sundubu." },
  { id: "topik-g-56", num: 56, korean: "(으)세요", english: "please (polite)", lesson: 4, exampleKorean: "삼겹살 2인분 주세요.", exampleEnglish: "Please give us two servings of samgyeopsal." },
  { id: "topik-g-57", num: 57, korean: "(으)십시오", english: "please (formal honorific)", lesson: 4, exampleKorean: "또 놀러 오십시오.", exampleEnglish: "Please visit us again." },
  { id: "topik-g-58", num: 58, korean: "(이)지요?", english: "right? / isn't it?", lesson: 4, exampleKorean: "카드로 계산 되지요?", exampleEnglish: "I can pay by card, right?" },
  { id: "topik-g-59", num: 59, korean: "거나", english: "or", lesson: 4, exampleKorean: "시장에 가거나 카페에 가고 싶어요.", exampleEnglish: "I want to go to the market or a café." },
  { id: "topik-g-60", num: 60, korean: "게", english: "make [adjective]", lesson: 4, exampleKorean: "싸게 해 주세요.", exampleEnglish: "Please make it cheaper." },
  { id: "topik-g-61", num: 61, korean: "게 되다", english: "come to / end up", lesson: 4, exampleKorean: "한국에 오게 됐어요.", exampleEnglish: "I ended up coming to Korea." },
  { id: "topik-g-62", num: 62, korean: "고", english: "and then / after", lesson: 4, exampleKorean: "밥 먹고 자요.", exampleEnglish: "I will eat and sleep." },
  { id: "topik-g-63", num: 63, korean: "고 싶다", english: "want to", lesson: 4, exampleKorean: "약국에 가고 싶어요.", exampleEnglish: "I want to go to the pharmacy." },
  { id: "topik-g-64", num: 64, korean: "고 있다", english: "is / am -ing", lesson: 4, exampleKorean: "지금 무슨 말 할까 생각하고 있어요.", exampleEnglish: "I am thinking about what to say." },
  { id: "topik-g-65", num: 65, korean: "군요", english: "I see / so it is", lesson: 4, exampleKorean: "병원에 가려면 여기 쭉 가면 되는군요.", exampleEnglish: "I can go straight this way to the hospital, I see." },
  { id: "topik-g-66", num: 66, korean: "기 때문에", english: "because of", lesson: 4, exampleKorean: "너무 많이 걸었기 때문에 다리가 아파요.", exampleEnglish: "My legs hurt because I walked too much." },
  { id: "topik-g-67", num: 67, korean: "기 전에", english: "before", lesson: 5, exampleKorean: "결제하기 전에 확인하고 싶은 게 있는데요.", exampleEnglish: "I want to check something before paying." },
  { id: "topik-g-68", num: 68, korean: "기로 하다", english: "decided to", lesson: 5, exampleKorean: "오늘은 쇼핑하기로 했어요.", exampleEnglish: "I decided to go shopping today." },
  { id: "topik-g-69", num: 69, korean: "네요", english: "isn't it / I see", lesson: 5, exampleKorean: "그럼 다 합쳐서 4000원이네요.", exampleEnglish: "So it is 4,000 won altogether." },
  { id: "topik-g-70", num: 70, korean: "는 게 좋겠다", english: "had better", lesson: 5, exampleKorean: "시간이 없으니까 빨리 가는 게 좋겠어요.", exampleEnglish: "We had better hurry since we do not have much time." },
  { id: "topik-g-71", num: 71, korean: "는데", english: "but / background", lesson: 5, exampleKorean: "입국 심사하는데 별로 많이 안 기다렸어요.", exampleEnglish: "I did not wait much for immigration." },
  { id: "topik-g-72", num: 72, korean: "ㅂ/습니까?", english: "formal polite question", lesson: 5, exampleKorean: "언제 한국에 갑니까?", exampleEnglish: "When are you going to Korea?" },
  { id: "topik-g-73", num: 73, korean: "ㅂ/습니다", english: "formal polite statement", lesson: 5, exampleKorean: "내일 한국에 갑니다.", exampleEnglish: "I am going to Korea tomorrow." },
  { id: "topik-g-74", num: 74, korean: "아/어/여 보다", english: "try doing", lesson: 5, exampleKorean: "이것도 시식해 보세요.", exampleEnglish: "Please try this too." },
  { id: "topik-g-75", num: 75, korean: "아/어/여 주다", english: "do for someone", lesson: 5, exampleKorean: "알려줘서 고마워요.", exampleEnglish: "Thank you for telling me." },
  { id: "topik-g-76", num: 76, korean: "아/어/여야 되다", english: "must / have to", lesson: 5, exampleKorean: "한국어를 공부해야 돼요.", exampleEnglish: "I have to study Korean." },
  { id: "topik-g-77", num: 77, korean: "아/어/여야 하다", english: "must / have to", lesson: 5, exampleKorean: "차 타고 가야 해요.", exampleEnglish: "I have to go by car." },
  { id: "topik-g-78", num: 78, korean: "아/어요", english: "informal polite ending", lesson: 5, exampleKorean: "좋아요.", exampleEnglish: "That is good." },
  { id: "topik-g-79", num: 79, korean: "았/었/였으면 좋겠다", english: "wish / hope", lesson: 5, exampleKorean: "빨리 배달 왔으면 좋겠어요.", exampleEnglish: "I hope the delivery arrives soon." },
  { id: "topik-g-80", num: 80, korean: "지 말다", english: "do not", lesson: 5, exampleKorean: "담배 피우지 마세요.", exampleEnglish: "Please do not smoke." },
  { id: "topik-g-81", num: 81, korean: "지 못하다", english: "cannot", lesson: 5, exampleKorean: "도와주지 못해서 죄송해요.", exampleEnglish: "Sorry I could not help much." },
  { id: "topik-g-82", num: 82, korean: "지 않다", english: "do not / not", lesson: 5, exampleKorean: "지하철 타지 않고 걸어갈게요.", exampleEnglish: "I will walk instead of taking the subway." },
  { id: "topik-g-83", num: 83, korean: "지만", english: "but / however", lesson: 5, exampleKorean: "오래 전에 주문했지만 요리가 아직 안 왔어요.", exampleEnglish: "We ordered a while ago, but the food is not here yet." },
  { id: "topik-g-84", num: 84, korean: "이/가 아니다", english: "is not", lesson: 5, exampleKorean: "제 물건이 아니에요.", exampleEnglish: "That is not mine." },
];

export function searchTopikGrammar(query: string): TopikGrammarItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return topikIGrammar;
  return topikIGrammar.filter(
    (g) =>
      g.korean.toLowerCase().includes(q) ||
      g.english.toLowerCase().includes(q) ||
      (g.exampleKorean?.toLowerCase().includes(q) ?? false) ||
      (g.exampleEnglish?.toLowerCase().includes(q) ?? false) ||
      String(g.num).includes(q),
  );
}
