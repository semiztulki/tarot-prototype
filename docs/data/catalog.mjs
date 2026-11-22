import {WAITE_MEANINGS} from './waite-meanings.mjs';
export const CONTENT_VERSION = 'rws-waite-1922-0.2';
export const SUITS = {
 major: {ru:'Старшие арканы',en:'Major Arcana',symbol:'✧'},
 wands: {ru:'Жезлы',en:'Wands',symbol:'♧'}, cups: {ru:'Кубки',en:'Cups',symbol:'∪'},
 swords: {ru:'Мечи',en:'Swords',symbol:'†'}, pentacles: {ru:'Пентакли',en:'Pentacles',symbol:'◇'}
};

const cardIndex = [
  {
    "id": "major-fool",
    "suit": "major",
    "rank": 0,
    "name": {
      "ru": "Шут",
      "en": "The Fool"
    }
  },
  {
    "id": "major-magician",
    "suit": "major",
    "rank": 1,
    "name": {
      "ru": "Маг",
      "en": "The Magician"
    }
  },
  {
    "id": "major-priestess",
    "suit": "major",
    "rank": 2,
    "name": {
      "ru": "Верховная Жрица",
      "en": "The High Priestess"
    }
  },
  {
    "id": "major-empress",
    "suit": "major",
    "rank": 3,
    "name": {
      "ru": "Императрица",
      "en": "The Empress"
    }
  },
  {
    "id": "major-emperor",
    "suit": "major",
    "rank": 4,
    "name": {
      "ru": "Император",
      "en": "The Emperor"
    }
  },
  {
    "id": "major-hierophant",
    "suit": "major",
    "rank": 5,
    "name": {
      "ru": "Иерофант",
      "en": "The Hierophant"
    }
  },
  {
    "id": "major-lovers",
    "suit": "major",
    "rank": 6,
    "name": {
      "ru": "Влюблённые",
      "en": "The Lovers"
    }
  },
  {
    "id": "major-chariot",
    "suit": "major",
    "rank": 7,
    "name": {
      "ru": "Колесница",
      "en": "The Chariot"
    }
  },
  {
    "id": "major-strength",
    "suit": "major",
    "rank": 8,
    "name": {
      "ru": "Сила",
      "en": "Strength"
    }
  },
  {
    "id": "major-hermit",
    "suit": "major",
    "rank": 9,
    "name": {
      "ru": "Отшельник",
      "en": "The Hermit"
    }
  },
  {
    "id": "major-wheel",
    "suit": "major",
    "rank": 10,
    "name": {
      "ru": "Колесо Фортуны",
      "en": "Wheel of Fortune"
    }
  },
  {
    "id": "major-justice",
    "suit": "major",
    "rank": 11,
    "name": {
      "ru": "Правосудие",
      "en": "Justice"
    }
  },
  {
    "id": "major-hanged",
    "suit": "major",
    "rank": 12,
    "name": {
      "ru": "Повешенный",
      "en": "The Hanged Man"
    }
  },
  {
    "id": "major-death",
    "suit": "major",
    "rank": 13,
    "name": {
      "ru": "Смерть",
      "en": "Death"
    }
  },
  {
    "id": "major-temperance",
    "suit": "major",
    "rank": 14,
    "name": {
      "ru": "Умеренность",
      "en": "Temperance"
    }
  },
  {
    "id": "major-devil",
    "suit": "major",
    "rank": 15,
    "name": {
      "ru": "Дьявол",
      "en": "The Devil"
    }
  },
  {
    "id": "major-tower",
    "suit": "major",
    "rank": 16,
    "name": {
      "ru": "Башня",
      "en": "The Tower"
    }
  },
  {
    "id": "major-star",
    "suit": "major",
    "rank": 17,
    "name": {
      "ru": "Звезда",
      "en": "The Star"
    }
  },
  {
    "id": "major-moon",
    "suit": "major",
    "rank": 18,
    "name": {
      "ru": "Луна",
      "en": "The Moon"
    }
  },
  {
    "id": "major-sun",
    "suit": "major",
    "rank": 19,
    "name": {
      "ru": "Солнце",
      "en": "The Sun"
    }
  },
  {
    "id": "major-judgement",
    "suit": "major",
    "rank": 20,
    "name": {
      "ru": "Суд",
      "en": "Judgement"
    }
  },
  {
    "id": "major-world",
    "suit": "major",
    "rank": 21,
    "name": {
      "ru": "Мир",
      "en": "The World"
    }
  },
  {
    "id": "wands-1",
    "suit": "wands",
    "rank": 1,
    "name": {
      "ru": "Туз Жезлов",
      "en": "Ace of Wands"
    }
  },
  {
    "id": "wands-2",
    "suit": "wands",
    "rank": 2,
    "name": {
      "ru": "Двойка Жезлов",
      "en": "Two of Wands"
    }
  },
  {
    "id": "wands-3",
    "suit": "wands",
    "rank": 3,
    "name": {
      "ru": "Тройка Жезлов",
      "en": "Three of Wands"
    }
  },
  {
    "id": "wands-4",
    "suit": "wands",
    "rank": 4,
    "name": {
      "ru": "Четвёрка Жезлов",
      "en": "Four of Wands"
    }
  },
  {
    "id": "wands-5",
    "suit": "wands",
    "rank": 5,
    "name": {
      "ru": "Пятёрка Жезлов",
      "en": "Five of Wands"
    }
  },
  {
    "id": "wands-6",
    "suit": "wands",
    "rank": 6,
    "name": {
      "ru": "Шестёрка Жезлов",
      "en": "Six of Wands"
    }
  },
  {
    "id": "wands-7",
    "suit": "wands",
    "rank": 7,
    "name": {
      "ru": "Семёрка Жезлов",
      "en": "Seven of Wands"
    }
  },
  {
    "id": "wands-8",
    "suit": "wands",
    "rank": 8,
    "name": {
      "ru": "Восьмёрка Жезлов",
      "en": "Eight of Wands"
    }
  },
  {
    "id": "wands-9",
    "suit": "wands",
    "rank": 9,
    "name": {
      "ru": "Девятка Жезлов",
      "en": "Nine of Wands"
    }
  },
  {
    "id": "wands-10",
    "suit": "wands",
    "rank": 10,
    "name": {
      "ru": "Десятка Жезлов",
      "en": "Ten of Wands"
    }
  },
  {
    "id": "wands-11",
    "suit": "wands",
    "rank": 11,
    "name": {
      "ru": "Паж Жезлов",
      "en": "Page of Wands"
    }
  },
  {
    "id": "wands-12",
    "suit": "wands",
    "rank": 12,
    "name": {
      "ru": "Рыцарь Жезлов",
      "en": "Knight of Wands"
    }
  },
  {
    "id": "wands-13",
    "suit": "wands",
    "rank": 13,
    "name": {
      "ru": "Королева Жезлов",
      "en": "Queen of Wands"
    }
  },
  {
    "id": "wands-14",
    "suit": "wands",
    "rank": 14,
    "name": {
      "ru": "Король Жезлов",
      "en": "King of Wands"
    }
  },
  {
    "id": "cups-1",
    "suit": "cups",
    "rank": 1,
    "name": {
      "ru": "Туз Кубков",
      "en": "Ace of Cups"
    }
  },
  {
    "id": "cups-2",
    "suit": "cups",
    "rank": 2,
    "name": {
      "ru": "Двойка Кубков",
      "en": "Two of Cups"
    }
  },
  {
    "id": "cups-3",
    "suit": "cups",
    "rank": 3,
    "name": {
      "ru": "Тройка Кубков",
      "en": "Three of Cups"
    }
  },
  {
    "id": "cups-4",
    "suit": "cups",
    "rank": 4,
    "name": {
      "ru": "Четвёрка Кубков",
      "en": "Four of Cups"
    }
  },
  {
    "id": "cups-5",
    "suit": "cups",
    "rank": 5,
    "name": {
      "ru": "Пятёрка Кубков",
      "en": "Five of Cups"
    }
  },
  {
    "id": "cups-6",
    "suit": "cups",
    "rank": 6,
    "name": {
      "ru": "Шестёрка Кубков",
      "en": "Six of Cups"
    }
  },
  {
    "id": "cups-7",
    "suit": "cups",
    "rank": 7,
    "name": {
      "ru": "Семёрка Кубков",
      "en": "Seven of Cups"
    }
  },
  {
    "id": "cups-8",
    "suit": "cups",
    "rank": 8,
    "name": {
      "ru": "Восьмёрка Кубков",
      "en": "Eight of Cups"
    }
  },
  {
    "id": "cups-9",
    "suit": "cups",
    "rank": 9,
    "name": {
      "ru": "Девятка Кубков",
      "en": "Nine of Cups"
    }
  },
  {
    "id": "cups-10",
    "suit": "cups",
    "rank": 10,
    "name": {
      "ru": "Десятка Кубков",
      "en": "Ten of Cups"
    }
  },
  {
    "id": "cups-11",
    "suit": "cups",
    "rank": 11,
    "name": {
      "ru": "Паж Кубков",
      "en": "Page of Cups"
    }
  },
  {
    "id": "cups-12",
    "suit": "cups",
    "rank": 12,
    "name": {
      "ru": "Рыцарь Кубков",
      "en": "Knight of Cups"
    }
  },
  {
    "id": "cups-13",
    "suit": "cups",
    "rank": 13,
    "name": {
      "ru": "Королева Кубков",
      "en": "Queen of Cups"
    }
  },
  {
    "id": "cups-14",
    "suit": "cups",
    "rank": 14,
    "name": {
      "ru": "Король Кубков",
      "en": "King of Cups"
    }
  },
  {
    "id": "swords-1",
    "suit": "swords",
    "rank": 1,
    "name": {
      "ru": "Туз Мечей",
      "en": "Ace of Swords"
    }
  },
  {
    "id": "swords-2",
    "suit": "swords",
    "rank": 2,
    "name": {
      "ru": "Двойка Мечей",
      "en": "Two of Swords"
    }
  },
  {
    "id": "swords-3",
    "suit": "swords",
    "rank": 3,
    "name": {
      "ru": "Тройка Мечей",
      "en": "Three of Swords"
    }
  },
  {
    "id": "swords-4",
    "suit": "swords",
    "rank": 4,
    "name": {
      "ru": "Четвёрка Мечей",
      "en": "Four of Swords"
    }
  },
  {
    "id": "swords-5",
    "suit": "swords",
    "rank": 5,
    "name": {
      "ru": "Пятёрка Мечей",
      "en": "Five of Swords"
    }
  },
  {
    "id": "swords-6",
    "suit": "swords",
    "rank": 6,
    "name": {
      "ru": "Шестёрка Мечей",
      "en": "Six of Swords"
    }
  },
  {
    "id": "swords-7",
    "suit": "swords",
    "rank": 7,
    "name": {
      "ru": "Семёрка Мечей",
      "en": "Seven of Swords"
    }
  },
  {
    "id": "swords-8",
    "suit": "swords",
    "rank": 8,
    "name": {
      "ru": "Восьмёрка Мечей",
      "en": "Eight of Swords"
    }
  },
  {
    "id": "swords-9",
    "suit": "swords",
    "rank": 9,
    "name": {
      "ru": "Девятка Мечей",
      "en": "Nine of Swords"
    }
  },
  {
    "id": "swords-10",
    "suit": "swords",
    "rank": 10,
    "name": {
      "ru": "Десятка Мечей",
      "en": "Ten of Swords"
    }
  },
  {
    "id": "swords-11",
    "suit": "swords",
    "rank": 11,
    "name": {
      "ru": "Паж Мечей",
      "en": "Page of Swords"
    }
  },
  {
    "id": "swords-12",
    "suit": "swords",
    "rank": 12,
    "name": {
      "ru": "Рыцарь Мечей",
      "en": "Knight of Swords"
    }
  },
  {
    "id": "swords-13",
    "suit": "swords",
    "rank": 13,
    "name": {
      "ru": "Королева Мечей",
      "en": "Queen of Swords"
    }
  },
  {
    "id": "swords-14",
    "suit": "swords",
    "rank": 14,
    "name": {
      "ru": "Король Мечей",
      "en": "King of Swords"
    }
  },
  {
    "id": "pentacles-1",
    "suit": "pentacles",
    "rank": 1,
    "name": {
      "ru": "Туз Пентаклей",
      "en": "Ace of Pentacles"
    }
  },
  {
    "id": "pentacles-2",
    "suit": "pentacles",
    "rank": 2,
    "name": {
      "ru": "Двойка Пентаклей",
      "en": "Two of Pentacles"
    }
  },
  {
    "id": "pentacles-3",
    "suit": "pentacles",
    "rank": 3,
    "name": {
      "ru": "Тройка Пентаклей",
      "en": "Three of Pentacles"
    }
  },
  {
    "id": "pentacles-4",
    "suit": "pentacles",
    "rank": 4,
    "name": {
      "ru": "Четвёрка Пентаклей",
      "en": "Four of Pentacles"
    }
  },
  {
    "id": "pentacles-5",
    "suit": "pentacles",
    "rank": 5,
    "name": {
      "ru": "Пятёрка Пентаклей",
      "en": "Five of Pentacles"
    }
  },
  {
    "id": "pentacles-6",
    "suit": "pentacles",
    "rank": 6,
    "name": {
      "ru": "Шестёрка Пентаклей",
      "en": "Six of Pentacles"
    }
  },
  {
    "id": "pentacles-7",
    "suit": "pentacles",
    "rank": 7,
    "name": {
      "ru": "Семёрка Пентаклей",
      "en": "Seven of Pentacles"
    }
  },
  {
    "id": "pentacles-8",
    "suit": "pentacles",
    "rank": 8,
    "name": {
      "ru": "Восьмёрка Пентаклей",
      "en": "Eight of Pentacles"
    }
  },
  {
    "id": "pentacles-9",
    "suit": "pentacles",
    "rank": 9,
    "name": {
      "ru": "Девятка Пентаклей",
      "en": "Nine of Pentacles"
    }
  },
  {
    "id": "pentacles-10",
    "suit": "pentacles",
    "rank": 10,
    "name": {
      "ru": "Десятка Пентаклей",
      "en": "Ten of Pentacles"
    }
  },
  {
    "id": "pentacles-11",
    "suit": "pentacles",
    "rank": 11,
    "name": {
      "ru": "Паж Пентаклей",
      "en": "Page of Pentacles"
    }
  },
  {
    "id": "pentacles-12",
    "suit": "pentacles",
    "rank": 12,
    "name": {
      "ru": "Рыцарь Пентаклей",
      "en": "Knight of Pentacles"
    }
  },
  {
    "id": "pentacles-13",
    "suit": "pentacles",
    "rank": 13,
    "name": {
      "ru": "Королева Пентаклей",
      "en": "Queen of Pentacles"
    }
  },
  {
    "id": "pentacles-14",
    "suit": "pentacles",
    "rank": 14,
    "name": {
      "ru": "Король Пентаклей",
      "en": "King of Pentacles"
    }
  }
];
export const CARDS = cardIndex.map(card=>({...card,keywords:{ru:SUITS[card.suit].ru,en:SUITS[card.suit].en},...WAITE_MEANINGS[card.id]}));
export const CARD_BY_ID = Object.fromEntries(CARDS.map(c=>[c.id,c]));
const p=(id,ru,en)=>({id,ru,en});
export const TOPICS = [p('general','Общий вопрос','General'),p('love','Отношения','Relationships'),p('work','Работа и дела','Work & projects'),p('study','Учёба','Learning'),p('choice','Личный выбор','A personal choice')];
export const INTENTS = [p('reflection','Понять ситуацию','Understand the situation'),p('advice','Найти следующий шаг','Find a next step'),p('obstacle','Увидеть препятствие','Explore an obstacle')];
export const SPREADS = [
 {id:'one',ru:'Одна карта',en:'One card',hint:{ru:'Подсказка и повод задуматься',en:'A little guidance, a fresh perspective'},count:1,demo:false,roles:[p('focus','Ваш ориентир','Your focus')]},
 {id:'three',ru:'Прошлое · настоящее · будущее',en:'Past · present · future',hint:{ru:'Посмотреть на историю целиком',en:'See the story in a wider frame'},count:3,demo:false,roles:[p('past','Прошлое','Past'),p('present','Настоящее','Present'),p('future','Будущее','Future')]},
 {id:'situation',ru:'Взгляд на ситуацию',en:'A closer look',hint:{ru:'Суть, препятствие, опора и действие',en:'The situation, a challenge and a way forward'},count:5,demo:true,roles:[p('present','Суть ситуации','The situation'),p('obstacle','Препятствие','The challenge'),p('support','Ваша опора','Your support'),p('advice','Следующий шаг','A next step'),p('future','Возможное развитие','A possible direction')]},
 {id:'choice',ru:'Два пути',en:'Two paths',hint:{ru:'Сравнить два возможных решения',en:'Consider two possible choices'},count:6,demo:true,roles:[p('a-now','Путь А: начало','Path A: the start'),p('a-challenge','Путь А: сложность','Path A: the challenge'),p('a-future','Путь А: развитие','Path A: a direction'),p('b-now','Путь Б: начало','Path B: the start'),p('b-challenge','Путь Б: сложность','Path B: the challenge'),p('b-future','Путь Б: развитие','Path B: a direction')]}
];
