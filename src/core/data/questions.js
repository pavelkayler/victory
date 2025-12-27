const topics = [
  {
    id: "react-basics",
    title: "React: основы и практики",
    description:
      "Сопоставляйте вопросы по React с краткими ответами, чтобы освежить знания по хукам, состоянию и жизненному циклу.",
    timeLimitMin: 5,
    questions: [
      {
        id: 1,
        left: "Для чего используется useState?",
        right: "Хранение и обновление локального состояния компонента",
      },
      {
        id: 2,
        left: "Когда вызывается useEffect с пустым массивом зависимостей?",
        right: "Один раз после первого рендера",
      },
      {
        id: 3,
        left: "Что возвращает useMemo?",
        right: "Мемоизированное значение вычисления",
      },
      {
        id: 4,
        left: "Какой хук нужен для доступа к DOM-элементу?",
        right: "useRef",
      },
      {
        id: 5,
        left: "Зачем нужен ключ (key) в списках?",
        right: "Чтобы React отслеживал элементы при перестроении",
      },
      {
        id: 6,
        left: "Что делает StrictMode в React?",
        right: "Подсвечивает потенциальные проблемы в разработке",
      },
      {
        id: 7,
        left: "Как предотвратить лишние рендеры дочерних компонентов?",
        right: "Оборачивать их в React.memo",
      },
      {
        id: 8,
        left: "Чем отличается state от props?",
        right: "State управляется компонентом, props приходят извне",
      },
      {
        id: 9,
        left: "Что такое портал в React?",
        right: "Рендер компонента в другой узел DOM вне родителя",
      },
      {
        id: 10,
        left: "Как объявить обработчик без повторного создания?",
        right: "Завернуть его в useCallback",
      },
      {
        id: 11,
        left: "Что делает Suspense?",
        right: "Показывает запасной UI, пока компонент загружается",
      },
      {
        id: 12,
        left: "Когда использовать lazy-загрузку компонентов?",
        right: "Когда часть интерфейса нужна не сразу",
      },
      {
        id: 13,
        left: "Для чего нужен Context API?",
        right: "Передавать данные без проп-дриллинга",
      },
      {
        id: 14,
        left: "Как мемоизировать тяжёлый компонент?",
        right: "Оборачивать его в React.memo и useMemo внутри",
      },
      {
        id: 15,
        left: "Что хранит useRef, кроме DOM-ссылок?",
        right: "Любое мутируемое значение между рендерами",
      },
      {
        id: 16,
        left: "Когда стоит применять Error Boundary?",
        right: "Чтобы отловить ошибки рендера дочерних компонентов",
      },
    ],
  },
  {
    id: "en-ru-words",
    title: "English & Russian words",
    description:
      "Соотнесите английские слова с их русскими переводами и потренируйте словарный запас.",
    timeLimitMin: 5,
    questions: [
      { id: 1, left: "apple", right: "яблоко" },
      { id: 2, left: "bridge", right: "мост" },
      { id: 3, left: "sunrise", right: "рассвет" },
      { id: 4, left: "river", right: "река" },
      { id: 5, left: "knowledge", right: "знание" },
      { id: 6, left: "journey", right: "путешествие" },
      { id: 7, left: "mountain", right: "гора" },
      { id: 8, left: "whisper", right: "шёпот" },
      { id: 9, left: "courage", right: "смелость" },
      { id: 10, left: "harbor", right: "гавань" },
      { id: 11, left: "feather", right: "перо" },
      { id: 12, left: "mirror", right: "зеркало" },
      { id: 13, left: "thunder", right: "гром" },
      { id: 14, left: "silence", right: "тишина" },
      { id: 15, left: "garden", right: "сад" },
      { id: 16, left: "freedom", right: "свобода" },
    ],
  },
];

export { topics };
