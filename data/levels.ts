import { Level } from '@/types';

export const levels: Level[] = [
  {
    id: 1,
    title: "안녕, 세상아!",
    description: "파이썬에 오신 것을 환영해요! 모든 프로그래머가 처음 배우는 것은 바로 '화면에 글자 출력하기'예요.",
    easyExplain: [
      "🎯 'print'는 '화면에 보여줘!'라는 명령어예요!",
      "print()라고 적으면 괄호 안의 내용을 화면에 보여줘요.",
      "글자를 보여주고 싶으면 따옴표(' ')로 감싸야 해요!",
      "print('안녕') 하면 컴퓨터가 '안녕'이라고 화면에 써줘요!",
      "⚠️ 따옴표를 빼먹으면 에러가 나요!"
    ],
    koreanDict: [
      { word: "출력", pos: "명사", meaning: "컴퓨터가 결과를 화면에 보여주는 것" },
      { word: "명령어", pos: "명사", meaning: "컴퓨터에게 '이렇게 해!'라고 시키는 말" },
      { word: "따옴표", pos: "명사", meaning: "글자를 감싸는 기호 ' ' 또는 \" \"" },
      { word: "괄호", pos: "명사", meaning: "( ) 이렇게 생긴 기호" }
    ],
    englishDict: [
      { word: "print", phonetic: "프린트", pos: "동사", plural: null, singular: null, meaning: "인쇄하다, 출력하다", codingUse: "화면에 글자를 보여주는 명령어" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'print'는 화면에 보여주라는 명령어예요!", result: null },
        { round: "2단계", desc: "print('안녕, 세상아!') → 괄호 안의 내용을 화면에 보여줘!", result: null },
        { round: "3단계", desc: "'안녕, 세상아!'는 따옴표 안에 있으니까 글자 그대로 출력해요", result: "안녕, 세상아!" }
      ],
      summary: "💡 핵심: print()는 괄호 안의 내용을 화면에 보여주는 명령어예요!"
    },
    task: "화면에 '안녕, 세상아!' 라고 출력해보세요.",
    starterCode: "# 아래 코드에서 ??? 부분을 채워보세요!\nprint('???')",
    expectedOutput: "안녕, 세상아!",
    hint: "print('안녕, 세상아!')",
    hintExplain: "print() 안에 출력하고 싶은 글자를 작은따옴표로 감싸서 넣으면 돼요!",
    solution: "print('안녕, 세상아!')"
  },
  {
    id: 2,
    title: "숫자 담는 상자 (변수)",
    description: "변수는 숫자나 글자를 담아두는 상자예요. 상자에 이름을 붙여서 나중에 다시 꺼내 쓸 수 있어요!",
    easyExplain: [
      "🎯 '='는 '오른쪽 값을 왼쪽 상자에 넣어!'라는 명령어예요!",
      "age = 25 라고 적으면 'age'라는 상자에 25를 넣는 거예요.",
      "⚠️ '='는 '같다'는 뜻이 아니라 '넣는다'는 뜻이에요!",
      "나중에 age를 부르면 상자 안의 25가 나와요!",
      "print(age)하면 상자 안의 값을 화면에 보여줘요."
    ],
    koreanDict: [
      { word: "변수", pos: "명사", meaning: "값을 담아두는 상자. 이름을 붙여서 나중에 다시 쓸 수 있어요" },
      { word: "값", pos: "명사", meaning: "숫자(25)나 글자('안녕') 같은 데이터" },
      { word: "저장", pos: "명사", meaning: "나중에 쓰려고 보관해 두는 것" }
    ],
    englishDict: [
      { word: "age", phonetic: "에이지", pos: "명사", plural: null, singular: null, meaning: "나이", codingUse: "나이를 저장하는 변수 이름으로 자주 사용" },
      { word: "print", phonetic: "프린트", pos: "동사", plural: null, singular: null, meaning: "인쇄하다", codingUse: "화면에 보여주는 명령어" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'='는 오른쪽 값을 왼쪽 상자에 넣으라는 명령어예요!", result: null },
        { round: "2단계", desc: "age = 25 → 'age'라는 상자에 숫자 25를 넣어요", result: null },
        { round: "3단계", desc: "print(age) → age 상자를 열어서 안에 뭐가 있는지 봐요", result: null },
        { round: "4단계", desc: "상자 안에 25가 있으니까 25를 화면에 보여줘요!", result: "25" }
      ],
      summary: "💡 핵심: '='는 값을 상자에 넣는 명령어, print()는 상자 안의 값을 보여주는 명령어예요!"
    },
    task: "'age'라는 이름의 상자에 25를 넣고, 그 상자 안의 숫자를 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요!\nage = ???\nprint(age)",
    expectedOutput: "25",
    hint: "age = 25\nprint(age)",
    hintExplain: "첫 줄에서 age라는 상자에 25를 넣고, 둘째 줄에서 상자 안의 값을 출력해요!",
    solution: "age = 25\nprint(age)"
  },
  {
    id: 3,
    title: "글자 담는 상자 (문자열)",
    description: "상자에는 숫자뿐만 아니라 글자(문자열)도 담을 수 있어요! 글자는 따옴표로 감싸주면 됩니다.",
    easyExplain: [
      "🎯 'f'는 '문자열 안에 변수를 넣을게!'라는 표시예요!",
      "f를 붙이면 {변수이름} 자리에 변수 값이 자동으로 들어가요!",
      "name = '파이썬' 하면 name 상자에 '파이썬'이 들어가요.",
      "f'안녕, {name}!' 에서 {name}이 '파이썬'으로 바뀌어요!",
      "⚠️ f를 안 붙이면 {name}이 그대로 글자로 나와요!"
    ],
    koreanDict: [
      { word: "문자열", pos: "명사", meaning: "글자들이 줄줄이 연결된 것. '안녕하세요'처럼 글자 여러 개가 모인 것" },
      { word: "중괄호", pos: "명사", meaning: "{ } 이렇게 생긴 기호" }
    ],
    englishDict: [
      { word: "name", phonetic: "네임", pos: "명사", plural: "names", pluralPhonetic: "네임스", singular: null, meaning: "이름", codingUse: "이름을 저장하는 변수로 자주 사용" },
      { word: "string", phonetic: "스트링", pos: "명사", plural: "strings", pluralPhonetic: "스트링스", singular: null, meaning: "문자열, 줄", codingUse: "글자들의 나열을 의미" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'f'는 문자열 안에 변수를 넣겠다는 표시예요!", result: null },
        { round: "2단계", desc: "name = '파이썬' → name 상자에 '파이썬' 글자를 넣어요", result: null },
        { round: "3단계", desc: "print(f'안녕, {name}!') → f가 붙어있으니 {name}을 찾아요", result: null },
        { round: "4단계", desc: "{name} 자리에 상자 안의 '파이썬'을 넣어요", result: null },
        { round: "5단계", desc: "'안녕, 파이썬!'이 완성되어 화면에 출력돼요!", result: "안녕, 파이썬!" }
      ],
      summary: "💡 핵심: f-string을 쓰면 {변수} 자리에 변수 값이 자동으로 들어가요!"
    },
    task: "'name' 상자에 '파이썬'을 넣고, '안녕, 파이썬!' 이라고 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요!\nname = '???'\nprint(f'안녕, {name}!')",
    expectedOutput: "안녕, 파이썬!",
    hint: "name = '파이썬'\nprint(f'안녕, {name}!')",
    hintExplain: "f를 붙이고 중괄호 {name} 안에 변수 이름을 넣으면 그 값이 들어가요!",
    solution: "name = '파이썬'\nprint(f'안녕, {name}!')"
  },
  {
    id: 4,
    title: "변수 값 넣어서 출력하기",
    description: "변수에 저장된 값을 문장 안에 넣어서 출력할 수 있어요!",
    easyExplain: [
      "🎯 '{변수}'는 '여기에 변수 값을 넣어줘!'라는 표시예요!",
      "f를 앞에 붙이고 중괄호 {}로 변수를 감싸면 돼요!",
      "color = '파랑' → color 상자에 '파랑'을 넣어요",
      "f'... {color}...' → {color} 자리에 '파랑'이 들어가요",
      "⚠️ 중괄호 안에는 변수 이름을 정확히 써야 해요!"
    ],
    koreanDict: [
      { word: "변수", pos: "명사", meaning: "값을 담아두는 상자" },
      { word: "출력", pos: "명사", meaning: "화면에 보여주는 것" }
    ],
    englishDict: [
      { word: "color", phonetic: "컬러", pos: "명사", plural: "colors", pluralPhonetic: "컬러스", singular: null, meaning: "색깔", codingUse: "색깔을 저장하는 변수로 자주 사용" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'{변수}'는 변수 값이 들어갈 자리를 표시하는 거예요!", result: null },
        { round: "2단계", desc: "color = '파랑' → color 상자에 '파랑'을 넣어요", result: null },
        { round: "3단계", desc: "print(f'내가 좋아하는 색은 {color}이야') 를 만나요", result: null },
        { round: "4단계", desc: "{color}를 찾아서 상자 안의 '파랑'을 꺼내요", result: null },
        { round: "5단계", desc: "'내가 좋아하는 색은 파랑이야'가 화면에 출력돼요!", result: "내가 좋아하는 색은 파랑이야" }
      ],
      summary: "💡 핵심: f'문장 {변수} 문장' 형태로 쓰면 변수 값이 문장 안에 쏙 들어가요!"
    },
    task: "color 변수에 '파랑'을 넣고, '내가 좋아하는 색은 파랑이야' 라고 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요!\ncolor = '???'\nprint(f'내가 좋아하는 색은 {color}이야')",
    expectedOutput: "내가 좋아하는 색은 파랑이야",
    hint: "color = '파랑'\nprint(f'내가 좋아하는 색은 {color}이야')",
    hintExplain: "color에 '파랑'을 넣으면 {color} 자리에 '파랑'이 들어가요!",
    solution: "color = '파랑'\nprint(f'내가 좋아하는 색은 {color}이야')"
  },
  {
    id: 5,
    title: "계산기 만들기",
    description: "파이썬은 훌륭한 계산기예요! +, -, *, / 로 덧셈, 뺄셈, 곱셈, 나눗셈을 할 수 있어요.",
    easyExplain: [
      "🎯 '+'는 더하기, '-'는 빼기 명령어예요!",
      "'*'(별표)는 곱하기 명령어예요! (x 대신 *를 써요)",
      "'/'(슬래시)는 나누기 명령어예요! (÷ 대신 /를 써요)",
      "print(10 + 5) 하면 자동으로 계산해서 15가 나와요!",
      "⚠️ 계산식은 따옴표 없이 그냥 써요!"
    ],
    koreanDict: [
      { word: "연산", pos: "명사", meaning: "더하기, 빼기, 곱하기, 나누기 같은 계산" },
      { word: "연산자", pos: "명사", meaning: "+, -, *, / 같은 계산 기호" }
    ],
    englishDict: [
      { word: "plus", phonetic: "플러스", pos: "명사/전치사", plural: null, singular: null, meaning: "더하기, ~을 더한", codingUse: "+ 기호로 두 숫자를 더할 때 사용" },
      { word: "minus", phonetic: "마이너스", pos: "명사/전치사", plural: null, singular: null, meaning: "빼기, ~을 뺀", codingUse: "- 기호로 숫자를 뺄 때 사용" },
      { word: "asterisk", phonetic: "애스터리스크", pos: "명사", plural: "asterisks", pluralPhonetic: "애스터리스크스", singular: null, meaning: "별표 (*)", codingUse: "* 기호로 곱하기할 때 사용" },
      { word: "slash", phonetic: "슬래시", pos: "명사", plural: "slashes", pluralPhonetic: "슬래시즈", singular: null, meaning: "빗금 (/)", codingUse: "/ 기호로 나누기할 때 사용" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'+'는 더하기 명령어예요! (-, *, /도 있어요)", result: null },
        { round: "2단계", desc: "print(15 + 27) 을 만나요", result: null },
        { round: "3단계", desc: "괄호 안의 15 + 27 을 먼저 계산해요", result: null },
        { round: "4단계", desc: "15 + 27 = 42 가 돼요", result: null },
        { round: "5단계", desc: "print(42) 가 되어서 42를 화면에 보여줘요!", result: "42" }
      ],
      summary: "💡 핵심: print() 안에 계산식을 넣으면 자동으로 계산해서 결과를 보여줘요!"
    },
    task: "15 + 27 을 계산해서 결과를 출력해보세요.",
    starterCode: "# ??? 부분에 계산식을 넣으세요!\nprint(??? + ???)",
    expectedOutput: "42",
    hint: "print(15 + 27)",
    hintExplain: "print() 안에 계산식을 넣으면 자동으로 계산해서 결과를 보여줘요!",
    solution: "print(15 + 27)"
  },
  {
    id: 6,
    title: "만약에... (조건문)",
    description: "프로그램이 상황에 따라 다르게 행동하게 만들 수 있어요! '만약 ~라면' 이라는 조건을 주는 거예요.",
    easyExplain: [
      "🎯 'if'는 '만약에 ~라면'이라는 명령어예요!",
      "if 다음에 조건을 쓰고, 그 조건이 맞으면 실행해요!",
      "'>'는 '~보다 크다', '<'는 '~보다 작다'는 뜻이에요.",
      "if number > 5: → '만약 number가 5보다 크면'이라는 뜻!",
      "⚠️ if 다음 줄은 꼭 스페이스 4칸 들여쓰기해야 해요!"
    ],
    koreanDict: [
      { word: "조건문", pos: "명사", meaning: "조건에 따라 다르게 실행하는 코드. '만약 ~라면' 같은 것" },
      { word: "조건", pos: "명사", meaning: "맞는지 틀린지 확인하는 것. '5보다 큰가?' 같은 것" },
      { word: "들여쓰기", pos: "명사", meaning: "글 앞에 빈칸을 넣어서 안쪽으로 들어가게 쓰는 것" }
    ],
    englishDict: [
      { word: "if", phonetic: "이프", pos: "접속사", plural: null, singular: null, meaning: "만약 ~라면", codingUse: "조건이 맞을 때만 실행하게 하는 명령어" },
      { word: "number", phonetic: "넘버", pos: "명사", plural: "numbers", pluralPhonetic: "넘버스", singular: null, meaning: "숫자", codingUse: "숫자를 저장하는 변수로 자주 사용" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'if'는 '만약에 ~라면' 이라는 조건 명령어예요!", result: null },
        { round: "2단계", desc: "number = 10 → number 상자에 10을 넣어요", result: null },
        { round: "3단계", desc: "if number > 5: → '만약 number(10)가 5보다 크면' 확인해요", result: null },
        { round: "4단계", desc: "10 > 5 는 참(True)이에요! 10은 5보다 크니까요", result: null },
        { round: "5단계", desc: "조건이 참이니까 들여쓰기 된 코드를 실행해요", result: null },
        { round: "6단계", desc: "print('10은 5보다 커요') 실행!", result: "10은 5보다 커요" }
      ],
      summary: "💡 핵심: if는 조건이 참(True)일 때만 들여쓰기 된 코드를 실행해요!"
    },
    task: "숫자 10이 5보다 큰지 확인하고, 크다면 '10은 5보다 커요' 라고 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요!\nnumber = 10\nif number > ???:\n    print('10은 5보다 커요')",
    expectedOutput: "10은 5보다 커요",
    hint: "number = 10\nif number > 5:\n    print('10은 5보다 커요')",
    hintExplain: "if 다음 줄은 반드시 스페이스 4칸 들여쓰기를 해야 해요! 탭 키를 눌러도 돼요.",
    solution: "number = 10\nif number > 5:\n    print('10은 5보다 커요')"
  },
  {
    id: 7,
    title: "반복하기 (for 반복문)",
    description: "같은 일을 여러 번 반복할 때 사용해요! for 문을 쓰면 '~부터 ~까지' 반복할 수 있어요.",
    easyExplain: [
      "🎯 'for'는 '~동안 반복해!'라는 명령어예요!",
      "'range'는 '숫자 범위를 만들어줘!'라는 명령어예요!",
      "range(1, 4)는 1, 2, 3을 만들어요. (4는 포함 안 됨!)",
      "for i in range(1, 4): → i가 1, 2, 3으로 바뀌면서 반복!",
      "⚠️ range(1, 4)에서 4는 포함 안 돼요! '4 전까지'라는 뜻!"
    ],
    koreanDict: [
      { word: "반복문", pos: "명사", meaning: "같은 일을 여러 번 되풀이하는 코드" },
      { word: "범위", pos: "명사", meaning: "시작부터 끝까지의 구간. 1부터 3까지 같은 것" }
    ],
    englishDict: [
      { word: "for", phonetic: "포어", pos: "전치사/접속사", plural: null, singular: null, meaning: "~동안, ~를 위해", codingUse: "반복할 때 사용하는 명령어" },
      { word: "in", phonetic: "인", pos: "전치사", plural: null, singular: null, meaning: "~안에", codingUse: "'~안에서 하나씩 꺼내기'라는 뜻" },
      { word: "range", phonetic: "레인지", pos: "명사", plural: "ranges", pluralPhonetic: "레인지스", singular: null, meaning: "범위", codingUse: "숫자 범위를 만드는 명령어" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'for'는 반복 명령어, 'range'는 숫자 범위를 만드는 명령어예요!", result: null },
        { round: "2단계", desc: "range(1, 4) → 1, 2, 3 숫자를 만들어요 (4는 포함 안 됨!)", result: null },
        { round: "1번째 반복", desc: "i = 1 → print(i) → 1을 화면에 출력!", result: "1" },
        { round: "2번째 반복", desc: "i = 2 → print(i) → 2를 화면에 출력!", result: "2" },
        { round: "3번째 반복", desc: "i = 3 → print(i) → 3을 화면에 출력!", result: "3" },
        { round: "끝", desc: "range(1, 4)가 끝났으니 반복 종료!", result: null }
      ],
      summary: "💡 핵심: for와 range를 함께 쓰면 원하는 횟수만큼 반복할 수 있어요!"
    },
    task: "1부터 3까지 숫자를 차례대로 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요! (1부터 3까지)\nfor i in range(???, ???):\n    print(i)",
    expectedOutput: "1\n2\n3",
    hint: "for i in range(1, 4):\n    print(i)",
    hintExplain: "range(1, 4)는 1, 2, 3을 차례로 i에 넣어줘요. 4는 포함 안 돼요!",
    solution: "for i in range(1, 4):\n    print(i)"
  },
  {
    id: 8,
    title: "조건 반복 (while 반복문)",
    description: "조건이 맞는 동안 계속 반복해요! '~하는 동안 반복해' 라고 명령하는 거예요.",
    easyExplain: [
      "🎯 'while'은 '~하는 동안 계속 반복해!'라는 명령어예요!",
      "while 조건: → 조건이 참인 동안 계속 반복해요!",
      "'+='는 '더해서 다시 넣어!'라는 명령어예요!",
      "count += 1 은 count = count + 1 과 같아요!",
      "⚠️ 숫자를 증가시키지 않으면 영원히 반복해요!"
    ],
    koreanDict: [
      { word: "반복문", pos: "명사", meaning: "같은 일을 여러 번 되풀이하는 코드" },
      { word: "조건", pos: "명사", meaning: "맞는지 틀린지 확인하는 것" },
      { word: "무한반복", pos: "명사", meaning: "끝나지 않고 영원히 계속되는 것" }
    ],
    englishDict: [
      { word: "while", phonetic: "와일", pos: "접속사", plural: null, singular: null, meaning: "~하는 동안", codingUse: "조건이 참인 동안 계속 반복하는 명령어" },
      { word: "count", phonetic: "카운트", pos: "명사/동사", plural: "counts", pluralPhonetic: "카운츠", singular: null, meaning: "세다, 개수", codingUse: "숫자를 세는 변수로 자주 사용" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'while'은 조건이 참인 동안 반복하는 명령어예요!", result: null },
        { round: "2단계", desc: "'+='는 더해서 다시 넣으라는 명령어예요! (count += 1 은 1을 더함)", result: null },
        { round: "시작", desc: "count = 1 → count 상자에 숫자 1을 넣어요", result: null },
        { round: "1번째 반복", desc: "count(1) <= 3 ? ✅ 네! → print → 1 출력 → count += 1 → count가 2가 됨", result: "1" },
        { round: "2번째 반복", desc: "count(2) <= 3 ? ✅ 네! → print → 2 출력 → count += 1 → count가 3이 됨", result: "2" },
        { round: "3번째 반복", desc: "count(3) <= 3 ? ✅ 네! → print → 3 출력 → count += 1 → count가 4가 됨", result: "3" },
        { round: "4번째 확인", desc: "count(4) <= 3 ? ❌ 아니요! (4는 3보다 크니까) → 반복 끝!", result: null }
      ],
      summary: "💡 핵심: while은 조건 확인 → 실행 → 조건 확인을 반복해요. += 로 값을 바꿔야 끝나요!"
    },
    task: "1부터 3까지 숫자를 while 반복문으로 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요!\ncount = 1\nwhile count <= ???:\n    print(count)\n    count += 1",
    expectedOutput: "1\n2\n3",
    hint: "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1",
    hintExplain: "count += 1 은 count를 1씩 증가시켜요. 이게 없으면 무한 반복돼요!",
    solution: "count = 1\nwhile count <= 3:\n    print(count)\n    count += 1"
  },
  {
    id: 9,
    title: "여러 개 담기 (리스트)",
    description: "리스트는 여러 개의 값을 한 줄로 담을 수 있는 특별한 상자예요! 대괄호 []를 사용해요.",
    easyExplain: [
      "🎯 '[]'(대괄호)는 '여러 개를 한 줄로 담아!'라는 표시예요!",
      "['사과', '바나나', '오렌지'] → 3개를 하나의 리스트에 담아요!",
      "'[숫자]'는 '몇 번째 칸을 열어줘!'라는 명령어예요!",
      "⚠️ 순서는 0부터 시작해요! (첫번째=0, 두번째=1, 세번째=2)",
      "fruits[1]은 두 번째 칸(바나나)을 꺼내요!"
    ],
    koreanDict: [
      { word: "리스트", pos: "명사", meaning: "여러 개의 값을 순서대로 담는 상자. 칸이 여러 개인 필통 같은 것" },
      { word: "인덱스", pos: "명사", meaning: "리스트에서 몇 번째 칸인지 알려주는 번호. 0부터 시작해요" },
      { word: "대괄호", pos: "명사", meaning: "[ ] 이렇게 생긴 기호" }
    ],
    englishDict: [
      { word: "list", phonetic: "리스트", pos: "명사", plural: "lists", pluralPhonetic: "리스츠", singular: null, meaning: "목록", codingUse: "여러 값을 담는 자료 구조" },
      { word: "fruits", phonetic: "프루츠", pos: "명사 (복수형)", plural: null, singular: "fruit", singularPhonetic: "프루트", meaning: "과일들", codingUse: "과일 목록을 저장하는 변수로 자주 사용" },
      { word: "index", phonetic: "인덱스", pos: "명사", plural: "indexes", pluralPhonetic: "인덱시스", singular: null, meaning: "색인, 번호", codingUse: "리스트에서 몇 번째인지 나타내는 번호" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'[]'(대괄호)는 리스트를 만드는 표시예요!", result: null },
        { round: "2단계", desc: "'[숫자]'는 리스트에서 해당 번째 값을 꺼내는 명령어예요!", result: null },
        { round: "3단계", desc: "fruits = ['사과', '바나나', '오렌지'] → fruits 리스트 만들기", result: null },
        { round: "4단계", desc: "리스트 안의 순서: [0]사과, [1]바나나, [2]오렌지", result: null },
        { round: "5단계", desc: "print(fruits[1]) → 1번 칸을 열어봐요", result: null },
        { round: "6단계", desc: "1번 칸에는 '바나나'가 있어요!", result: "바나나" }
      ],
      summary: "💡 핵심: 리스트는 []로 만들고, [번호]로 값을 꺼내요. 번호는 0부터 시작!"
    },
    task: "과일 리스트 ['사과', '바나나', '오렌지']를 만들고, 두 번째 과일을 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요! (두번째 과일 출력)\nfruits = ['사과', '바나나', '오렌지']\nprint(fruits[???])",
    expectedOutput: "바나나",
    hint: "fruits = ['사과', '바나나', '오렌지']\nprint(fruits[1])",
    hintExplain: "리스트 순서는 0부터 시작해요! 첫번째=0, 두번째=1, 세번째=2",
    solution: "fruits = ['사과', '바나나', '오렌지']\nprint(fruits[1])"
  },
  {
    id: 10,
    title: "리스트에 추가하기",
    description: "리스트에 새로운 값을 추가할 수 있어요! append() 함수를 사용하면 끝에 추가됩니다.",
    easyExplain: [
      "🎯 '.append()'는 '리스트 맨 뒤에 추가해!'라는 명령어예요!",
      "리스트이름.append(값) 형태로 써요!",
      "numbers.append(4) → numbers 리스트 맨 뒤에 4를 추가해!",
      "[1, 2, 3]에 4를 append하면 [1, 2, 3, 4]가 돼요!",
      "⚠️ append는 항상 맨 뒤에만 추가해요!"
    ],
    koreanDict: [
      { word: "추가", pos: "명사", meaning: "새로운 것을 더하는 것" },
      { word: "메서드", pos: "명사", meaning: "특정 기능을 하는 명령어. 점(.)을 찍고 사용해요" }
    ],
    englishDict: [
      { word: "append", phonetic: "어펜드", pos: "동사", plural: null, singular: null, meaning: "덧붙이다, 추가하다", codingUse: "리스트 맨 뒤에 값을 추가하는 명령어" },
      { word: "numbers", phonetic: "넘버스", pos: "명사 (복수형)", plural: null, singular: "number", singularPhonetic: "넘버", meaning: "숫자들", codingUse: "숫자 목록을 저장하는 변수로 자주 사용" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'.append()'는 리스트 맨 뒤에 추가하라는 명령어예요!", result: null },
        { round: "2단계", desc: "numbers = [1, 2, 3] → 숫자 리스트 만들기", result: null },
        { round: "3단계", desc: "현재 리스트: [1, 2, 3] (3개)", result: null },
        { round: "4단계", desc: "numbers.append(4) → 맨 뒤에 4를 추가해!", result: null },
        { round: "5단계", desc: "리스트가 [1, 2, 3, 4]가 됐어요! (4개)", result: null },
        { round: "6단계", desc: "print(numbers) → 전체 리스트 출력!", result: "[1, 2, 3, 4]" }
      ],
      summary: "💡 핵심: .append(값)은 리스트 맨 뒤에 새 값을 추가하는 명령어예요!"
    },
    task: "숫자 리스트 [1, 2, 3]을 만들고, 4를 추가한 후 전체 리스트를 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요!\nnumbers = [1, 2, 3]\nnumbers.append(???)\nprint(numbers)",
    expectedOutput: "[1, 2, 3, 4]",
    hint: "numbers = [1, 2, 3]\nnumbers.append(4)\nprint(numbers)",
    hintExplain: ".append()는 리스트 맨 끝에 새 값을 추가해요!",
    solution: "numbers = [1, 2, 3]\nnumbers.append(4)\nprint(numbers)"
  },
  {
    id: 11,
    title: "나만의 명령어 (함수)",
    description: "함수는 여러 줄의 코드를 하나의 이름으로 묶어서 나만의 명령어를 만드는 거예요!",
    easyExplain: [
      "🎯 'def'는 '나만의 명령어를 만들게!'라는 명령어예요!",
      "def 명령어이름(): 형태로 써요!",
      "def greet(): 라고 적으면 'greet'라는 명령어를 만드는 거예요.",
      "명령어 안에 할 일을 적어놓으면 나중에 greet()로 실행해요!",
      "한 번 만들어 놓으면 계속 재사용할 수 있어요."
    ],
    koreanDict: [
      { word: "함수", pos: "명사", meaning: "여러 명령을 하나로 묶어서 이름을 붙인 것. 나만의 명령어" },
      { word: "정의", pos: "명사", meaning: "새로운 것을 만들어서 이름을 붙이는 것" },
      { word: "호출", pos: "명사", meaning: "만들어 놓은 함수를 실행하는 것" }
    ],
    englishDict: [
      { word: "def", phonetic: "데프", pos: "키워드 (define의 줄임말)", plural: null, singular: null, fullForm: "define", fullFormPhonetic: "디파인", meaning: "정의하다", codingUse: "새로운 함수를 만드는 명령어" },
      { word: "greet", phonetic: "그릿", pos: "동사", plural: null, singular: null, meaning: "인사하다", codingUse: "인사하는 함수 이름으로 자주 사용" },
      { word: "function", phonetic: "펑션", pos: "명사", plural: "functions", pluralPhonetic: "펑션스", singular: null, meaning: "기능, 함수", codingUse: "재사용 가능한 코드 블록" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'def'는 나만의 명령어를 만들기 위한 명령어예요!", result: null },
        { round: "2단계", desc: "def greet(): → 'greet'라는 이름의 명령어를 만들어요", result: null },
        { round: "3단계", desc: "print('안녕하세요!') → 이 명령어가 할 일을 적어요 (아직 실행 안 함!)", result: null },
        { round: "4단계", desc: "greet() → 이제 명령어를 실행해요!", result: null },
        { round: "5단계", desc: "greet 안의 print('안녕하세요!')가 실행돼요!", result: "안녕하세요!" }
      ],
      summary: "💡 핵심: def로 명령어를 만들고, 명령어이름()으로 실행해요!"
    },
    task: "'greet'라는 함수를 만들어서 '안녕하세요!'를 출력하게 하고, 그 함수를 실행해보세요.",
    starterCode: "# ??? 부분을 채워보세요!\ndef greet():\n    print('???')\n\ngreet()",
    expectedOutput: "안녕하세요!",
    hint: "def greet():\n    print('안녕하세요!')\n\ngreet()",
    hintExplain: "def로 함수를 만들고, 마지막에 함수이름()으로 실행해요!",
    solution: "def greet():\n    print('안녕하세요!')\n\ngreet()"
  },
  {
    id: 12,
    title: "함수에 값 전달하기",
    description: "함수에 값을 전달해서 더 유연하게 사용할 수 있어요! 이것을 '매개변수'라고 해요.",
    easyExplain: [
      "🎯 '매개변수'는 '함수에게 전달하는 값'이에요!",
      "def say_hello(name): 에서 name이 매개변수예요.",
      "say_hello('친구') 하면 name에 '친구'가 들어가요!",
      "같은 함수로 다른 값을 전달해서 다르게 실행할 수 있어요.",
      "⚠️ 함수를 만들 때랑 실행할 때 괄호 안을 맞춰야 해요!"
    ],
    koreanDict: [
      { word: "매개변수", pos: "명사", meaning: "함수에게 전달하는 값을 받는 상자. 택배 받는 우체통 같은 것" },
      { word: "전달", pos: "명사", meaning: "값을 함수에게 넘겨주는 것" },
      { word: "인자", pos: "명사", meaning: "함수를 실행할 때 괄호 안에 넣는 값" }
    ],
    englishDict: [
      { word: "say", phonetic: "세이", pos: "동사", plural: null, singular: null, meaning: "말하다", codingUse: "말하는 기능의 함수 이름에 자주 사용" },
      { word: "hello", phonetic: "헬로", pos: "감탄사", plural: null, singular: null, meaning: "안녕", codingUse: "인사 관련 함수나 변수에 자주 사용" },
      { word: "parameter", phonetic: "파라미터", pos: "명사", plural: "parameters", pluralPhonetic: "파라미터스", singular: null, meaning: "매개변수", codingUse: "함수가 받는 값을 담는 변수" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'매개변수'는 함수가 받는 값을 담는 상자예요!", result: null },
        { round: "2단계", desc: "def say_hello(name): → name을 받는 함수를 만들어요", result: null },
        { round: "3단계", desc: "print(f'안녕, {name}!') → name 자리에 받은 값이 들어갈 거예요", result: null },
        { round: "4단계", desc: "say_hello('친구') → 함수 실행! '친구'를 전달해요", result: null },
        { round: "5단계", desc: "name = '친구'가 돼요", result: null },
        { round: "6단계", desc: "'안녕, 친구!'가 화면에 출력돼요!", result: "안녕, 친구!" }
      ],
      summary: "💡 핵심: 함수(값)으로 실행하면, 그 값이 매개변수에 전달돼요!"
    },
    task: "'say_hello' 함수를 만들어서 이름을 받아 '안녕, 이름!' 을 출력하세요. '친구'로 테스트해보세요.",
    starterCode: "# ??? 부분을 채워보세요!\ndef say_hello(name):\n    print(f'안녕, {name}!')\n\nsay_hello('???')",
    expectedOutput: "안녕, 친구!",
    hint: "def say_hello(name):\n    print(f'안녕, {name}!')\n\nsay_hello('친구')",
    hintExplain: "괄호 안의 name이 매개변수예요. '친구'를 넣으면 name에 '친구'가 들어가요!",
    solution: "def say_hello(name):\n    print(f'안녕, {name}!')\n\nsay_hello('친구')"
  },
  {
    id: 13,
    title: "이름표 붙은 상자 (딕셔너리)",
    description: "딕셔너리는 각 값에 이름표(키)를 붙여서 저장해요! '이름': '값' 형태로 저장합니다.",
    easyExplain: [
      "🎯 '{}'(중괄호)는 '이름표가 붙은 서랍장을 만들어!'라는 표시예요!",
      "'키: 값' 형태로 이름표와 내용물을 함께 저장해요!",
      "{'name': '민수', 'age': 30} → 'name' 서랍에 '민수', 'age' 서랍에 30",
      "딕셔너리['키']로 원하는 서랍을 열어요!",
      "person['name']은 'name' 서랍을 열어서 '민수'를 꺼내요!"
    ],
    koreanDict: [
      { word: "딕셔너리", pos: "명사", meaning: "이름표(키)를 붙여서 값을 저장하는 것. 서랍마다 이름표가 붙은 서랍장 같은 것" },
      { word: "키", pos: "명사", meaning: "딕셔너리에서 값을 찾기 위한 이름표" },
      { word: "중괄호", pos: "명사", meaning: "{ } 이렇게 생긴 기호" }
    ],
    englishDict: [
      { word: "dictionary", phonetic: "딕셔너리", pos: "명사", plural: "dictionaries", pluralPhonetic: "딕셔너리스", singular: null, meaning: "사전", codingUse: "키와 값을 짝지어 저장하는 자료 구조" },
      { word: "person", phonetic: "퍼슨", pos: "명사", plural: "people", pluralPhonetic: "피플", singular: null, meaning: "사람", codingUse: "사람 정보를 저장하는 변수로 자주 사용" },
      { word: "key", phonetic: "키", pos: "명사", plural: "keys", pluralPhonetic: "키스", singular: null, meaning: "열쇠", codingUse: "딕셔너리에서 값을 찾는 이름표" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'{}'는 딕셔너리를 만드는 표시예요! (이름표 붙은 서랍장)", result: null },
        { round: "2단계", desc: "'키: 값'은 이름표와 내용물을 연결하는 방법이에요!", result: null },
        { round: "3단계", desc: "person = {'name': '민수', 'age': 30} → 딕셔너리 만들기", result: null },
        { round: "4단계", desc: "'name' 서랍에는 '민수', 'age' 서랍에는 30이 들어있어요", result: null },
        { round: "5단계", desc: "print(person['name']) → 'name' 서랍을 열어봐요", result: null },
        { round: "6단계", desc: "'name' 서랍 안에 '민수'가 있으니까 출력!", result: "민수" }
      ],
      summary: "💡 핵심: 딕셔너리는 {}로 만들고, ['키']로 원하는 값을 꺼내요!"
    },
    task: "사람 정보를 담은 딕셔너리를 만들어보세요: 이름은 '민수', 나이는 30. 그리고 이름을 출력하세요.",
    starterCode: "# ??? 부분을 채워보세요!\nperson = {'name': '???', 'age': ???}\nprint(person['name'])",
    expectedOutput: "민수",
    hint: "person = {'name': '민수', 'age': 30}\nprint(person['name'])",
    hintExplain: "딕셔너리는 중괄호 {}를 써요. 값을 꺼낼 때는 대괄호 []에 키를 넣어요!",
    solution: "person = {'name': '민수', 'age': 30}\nprint(person['name'])"
  },
  {
    id: 14,
    title: "글자 변환하기",
    description: "문자열에는 다양한 기능이 있어요! 대문자로 바꾸기, 소문자로 바꾸기 등을 할 수 있어요.",
    easyExplain: [
      "🎯 '.upper()'는 '모든 글자를 대문자로 바꿔!'라는 명령어예요!",
      "'.lower()'는 '모든 글자를 소문자로 바꿔!'라는 명령어예요!",
      "문자열.upper() 또는 문자열.lower() 형태로 써요!",
      "'hello'.upper() → 'HELLO'가 돼요!",
      "⚠️ 원래 문자열은 안 바뀌고, 바뀐 결과만 보여줘요!"
    ],
    koreanDict: [
      { word: "대문자", pos: "명사", meaning: "A, B, C처럼 큰 알파벳 글자" },
      { word: "소문자", pos: "명사", meaning: "a, b, c처럼 작은 알파벳 글자" },
      { word: "변환", pos: "명사", meaning: "다른 형태로 바꾸는 것" }
    ],
    englishDict: [
      { word: "upper", phonetic: "어퍼", pos: "형용사", plural: null, singular: null, meaning: "위쪽의, 상위의", codingUse: "대문자로 바꾸는 명령어" },
      { word: "lower", phonetic: "로워", pos: "형용사", plural: null, singular: null, meaning: "아래쪽의, 하위의", codingUse: "소문자로 바꾸는 명령어" },
      { word: "text", phonetic: "텍스트", pos: "명사", plural: "texts", pluralPhonetic: "텍스츠", singular: null, meaning: "글, 문자", codingUse: "글자를 저장하는 변수로 자주 사용" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "1단계", desc: "'.upper()'는 대문자로 바꾸는 명령어예요!", result: null },
        { round: "2단계", desc: "'.lower()'는 소문자로 바꾸는 명령어예요!", result: null },
        { round: "3단계", desc: "text = 'python programming' → text에 소문자 글자를 넣어요", result: null },
        { round: "4단계", desc: "print(text.upper()) → text를 대문자로 바꿔달라는 명령", result: null },
        { round: "5단계", desc: "'python programming'의 모든 글자를 대문자로 바꿔요", result: null },
        { round: "6단계", desc: "'PYTHON PROGRAMMING'이 화면에 출력돼요!", result: "PYTHON PROGRAMMING" }
      ],
      summary: "💡 핵심: .upper()는 대문자로, .lower()는 소문자로 바꾸는 명령어예요!"
    },
    task: "'python programming' 을 전부 대문자로 바꿔서 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요! (대문자로 바꾸기)\ntext = 'python programming'\nprint(text.???())",
    expectedOutput: "PYTHON PROGRAMMING",
    hint: "text = 'python programming'\nprint(text.upper())",
    hintExplain: ".upper()는 대문자로, .lower()는 소문자로 바꿔줘요!",
    solution: "text = 'python programming'\nprint(text.upper())"
  },
  {
    id: 15,
    title: "🏆 최종 도전!",
    description: "축하해요! 마지막 단계예요! 지금까지 배운 것을 모두 활용해보세요!",
    easyExplain: [
      "🎯 지금까지 배운 명령어들을 합쳐볼 거예요!",
      "[] → 리스트 만들기 (여러 숫자를 담는 상자)",
      "for...in → 리스트의 값을 하나씩 꺼내기",
      "* → 곱하기 계산",
      "print() → 결과를 화면에 보여주기"
    ],
    koreanDict: [
      { word: "리스트", pos: "명사", meaning: "여러 값을 순서대로 담는 상자" },
      { word: "반복문", pos: "명사", meaning: "같은 일을 여러 번 되풀이하는 코드" },
      { word: "곱하기", pos: "명사/동사", meaning: "숫자를 여러 번 더하는 계산 (3 × 2 = 6)" }
    ],
    englishDict: [
      { word: "for", phonetic: "포어", pos: "전치사/접속사", plural: null, singular: null, meaning: "~동안", codingUse: "반복하는 명령어" },
      { word: "in", phonetic: "인", pos: "전치사", plural: null, singular: null, meaning: "~안에서", codingUse: "리스트 안에서 하나씩 꺼낼 때 사용" },
      { word: "num", phonetic: "넘", pos: "명사 (number의 줄임말)", plural: null, singular: null, fullForm: "number", fullFormPhonetic: "넘버", meaning: "숫자", codingUse: "숫자 변수로 자주 사용" }
    ],
    detailedExplain: {
      title: "🔄 코드가 실행되는 순서",
      steps: [
        { round: "사용된 명령어", desc: "[] 리스트, for 반복, * 곱하기, print() 출력을 모두 사용해요!", result: null },
        { round: "시작", desc: "numbers = [1, 2, 3, 4, 5] → 숫자 리스트 만들기", result: null },
        { round: "1번째 반복", desc: "num = 1 → print(1 * 2) → 2 출력!", result: "2" },
        { round: "2번째 반복", desc: "num = 2 → print(2 * 2) → 4 출력!", result: "4" },
        { round: "3번째 반복", desc: "num = 3 → print(3 * 2) → 6 출력!", result: "6" },
        { round: "4번째 반복", desc: "num = 4 → print(4 * 2) → 8 출력!", result: "8" },
        { round: "5번째 반복", desc: "num = 5 → print(5 * 2) → 10 출력!", result: "10" },
        { round: "끝", desc: "리스트의 모든 숫자를 다 썼으니 반복 종료!", result: null }
      ],
      summary: "💡 핵심: 여러 명령어를 조합하면 더 복잡한 작업을 할 수 있어요! 축하해요! 🎉"
    },
    task: "숫자 리스트 [1,2,3,4,5]를 만들고, for 반복문으로 각 숫자에 2를 곱한 값을 출력해보세요.",
    starterCode: "# ??? 부분을 채워보세요! (각 숫자 x 2)\nnumbers = [1, 2, 3, 4, 5]\nfor num in numbers:\n    print(num * ???)",
    expectedOutput: "2\n4\n6\n8\n10",
    hint: "numbers = [1, 2, 3, 4, 5]\nfor num in numbers:\n    print(num * 2)",
    hintExplain: "리스트의 각 값이 num에 차례로 들어가고, 2를 곱해서 출력해요!",
    solution: "numbers = [1, 2, 3, 4, 5]\nfor num in numbers:\n    print(num * 2)"
  }
];

// Get level by ID (ID로 레벨 가져오기)
export function getLevelById(id: number): Level | undefined {
  return levels.find(level => level.id === id);
}

// Get total number of levels (전체 레벨 수)
export const TOTAL_LEVELS = levels.length;
