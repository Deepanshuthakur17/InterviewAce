// Mock Database for InterviewAce
// Persists data in localStorage and provides realistic delays for SWR fetching

export interface Question {
  id: string;
  categoryId: string; // e.g., 'react', 'javascript', 'hr'
  categoryName: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  idealKeywords: string[];
  idealAnswer: string;
  explanation: string;
}

export interface InterviewRole {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // in minutes
  questionCount: number;
  icon: string; // Lucide icon name
  questions: Question[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  careerGoals: string;
  interviewPreferences: {
    role: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    duration: number;
  };
  resumeName: string | null;
  resumeParsedSkills: string[];
}

export interface AnswerRecord {
  questionId: string;
  questionText: string;
  answerText: string;
  timeSpent: number; // in seconds
  isBookmarked: boolean;
  isSkipped: boolean;
}

export interface AIFeedback {
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  overallScore: number;
  suggestedImprovements: string[];
  commonMistakes: string[];
  detailedAnalysis: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    technicalAccuracy: number;
    feedbackText: string;
    suggestedAdditions: string[];
  }>;
}

export interface HistoryItem {
  id: string;
  roleId: string;
  roleTitle: string;
  date: string;
  durationSpent: number; // in seconds
  totalQuestions: number;
  answeredQuestions: number;
  feedback: AIFeedback;
  answers: AnswerRecord[];
}

// Initial library data
const INITIAL_LIBRARY: InterviewRole[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    description: 'Master HTML5, CSS3, modern layouts, browser performance, and core web concepts.',
    category: 'Frontend',
    difficulty: 'Medium',
    duration: 15,
    questionCount: 5,
    icon: 'Layout',
    questions: [
      {
        id: 'fe-1',
        categoryId: 'frontend',
        categoryName: 'Frontend',
        question: 'Explain the difference between semantic HTML and non-semantic HTML. Why is it important?',
        difficulty: 'Easy',
        idealKeywords: ['accessibility', 'seo', 'screen readers', 'meaning', 'nav', 'article', 'div'],
        idealAnswer: 'Semantic HTML uses tags that describe their meaning (like <header>, <nav>, <article>, <footer>) rather than just visual appearance (like <div>, <span>). It is crucial for accessibility (helping screen readers navigate), SEO (helping search engine crawlers understand content structure), and code maintainability.',
        explanation: 'Semantic elements clearly describe their meaning in a human- and machine-readable way.'
      },
      {
        id: 'fe-2',
        categoryId: 'frontend',
        categoryName: 'Frontend',
        question: 'What is event delegation in JavaScript and how does it work?',
        difficulty: 'Medium',
        idealKeywords: ['bubbling', 'parent', 'event listener', 'performance', 'target', 'memory'],
        idealAnswer: 'Event delegation is a technique where a single event listener is attached to a parent element instead of multiple event listeners on individual children. It works because of event bubbling (events bubble up from the target element to its ancestors). By checking event.target, we can identify which child element triggered the event. This saves memory and handles dynamically added children automatically.',
        explanation: 'Event propagation/bubbling allows a single handler on a parent to manage events for all descendants.'
      },
      {
        id: 'fe-3',
        categoryId: 'frontend',
        categoryName: 'Frontend',
        question: 'How does CSS Flexbox differ from CSS Grid, and when would you use each?',
        difficulty: 'Medium',
        idealKeywords: ['one-dimensional', 'two-dimensional', 'layout', 'rows', 'columns', 'align', 'track'],
        idealAnswer: 'CSS Flexbox is one-dimensional (deals with either rows OR columns at a time), making it ideal for content alignment, navigation bars, or small components. CSS Grid is two-dimensional (deals with rows AND columns simultaneously), making it perfect for overall page layouts, complex dashboards, or asymmetric designs where alignment in both axes is required.',
        explanation: 'Flexbox is content-out (one dimension); Grid is layout-in (two dimensions).'
      },
      {
        id: 'fe-4',
        categoryId: 'frontend',
        categoryName: 'Frontend',
        question: 'What are the main core web vitals and how can you optimize them?',
        difficulty: 'Hard',
        idealKeywords: ['LCP', 'FID', 'CLS', 'loading', 'interactivity', 'visual stability', 'lazy load', 'INP'],
        idealAnswer: 'Core Web Vitals are a set of metrics that measure real-world user experience. They include: 1) LCP (Largest Contentful Paint) measuring loading performance (optimize by compressing images, using CDN, lazy loading). 2) INP (Interaction to Next Paint, replacing FID) measuring interactivity (optimize by reducing JS execution, splitting code). 3) CLS (Cumulative Layout Shift) measuring visual stability (optimize by setting size attributes on images, avoiding inserting dynamic content above existing content).',
        explanation: 'Core Web Vitals are search ranking factors focused on user experience.'
      },
      {
        id: 'fe-5',
        categoryId: 'frontend',
        categoryName: 'Frontend',
        question: 'What is the difference between REST APIs and GraphQL?',
        difficulty: 'Medium',
        idealKeywords: ['endpoint', 'over-fetching', 'under-fetching', 'query', 'schema', 'single request'],
        idealAnswer: 'REST APIs use multiple endpoints representing resources, which can lead to over-fetching (getting more data than needed) or under-fetching (needing multiple roundtrips). GraphQL uses a single endpoint where clients write queries specifying exactly what data they need, eliminating over/under-fetching and allowing nested relationships to be fetched in a single request.',
        explanation: 'GraphQL offers flexible data fetching; REST offers standard, cacheable resource URIs.'
      }
    ]
  },
  {
    id: 'react-dev',
    title: 'React Developer',
    description: 'Deep dive into React hooks, state management, reconciler, and component lifecycle.',
    category: 'React',
    difficulty: 'Medium',
    duration: 20,
    questionCount: 5,
    icon: 'Atom',
    questions: [
      {
        id: 're-1',
        categoryId: 'react',
        categoryName: 'React',
        question: 'What are the rules of React Hooks, and why must they be followed?',
        difficulty: 'Easy',
        idealKeywords: ['top level', 'only react functions', 'loops', 'conditions', 'order of execution', 'fiber'],
        idealAnswer: 'The two main rules of React Hooks are: 1) Only call hooks at the top level of your functional components (never inside loops, conditions, or nested functions). 2) Only call hooks from React function components or custom hooks. These rules are necessary because React relies on the call order of hooks to associate state variables correctly across renders.',
        explanation: 'React tracks hook state by call index, so the order of calls must remain identical every render.'
      },
      {
        id: 're-2',
        categoryId: 'react',
        categoryName: 'React',
        question: 'Explain the Virtual DOM and how React reconciles changes.',
        difficulty: 'Medium',
        idealKeywords: ['virtual DOM', 'reconciliation', 'diffing algorithm', 'fiber', 'rerender', 'patch'],
        idealAnswer: 'The Virtual DOM is a lightweight, in-memory representation of the real DOM. When state changes, React creates a new virtual DOM tree, compares it with the previous one using a highly optimized "diffing" algorithm (called reconciliation), and calculates the minimum set of changes. It then batches and applies only those changes (patches) to the real DOM, avoiding expensive layout recalculations.',
        explanation: 'Reconciliation minimizes costly real DOM manipulations by batching diff updates.'
      },
      {
        id: 're-3',
        categoryId: 'react',
        categoryName: 'React',
        question: 'How do you optimize React component rendering performance?',
        difficulty: 'Medium',
        idealKeywords: ['useMemo', 'useCallback', 'React.memo', 're-render', 'dependency array', 'state placement'],
        idealAnswer: 'Optimization strategies include: 1) React.memo to prevent functional components from re-rendering if props haven\'t changed. 2) useMemo to cache expensive calculations. 3) useCallback to cache callback functions to prevent breaking child component memoization. 4) Moving state closer to where it is used (lifting state down) to localize re-renders. 5) Virtualizing long lists using libraries like react-window.',
        explanation: 'Prevent redundant re-renders by memoizing values/functions and keeping state localized.'
      },
      {
        id: 're-4',
        categoryId: 'react',
        categoryName: 'React',
        question: 'What is the difference between Context API and Redux (or other state managers)? When should you use which?',
        difficulty: 'Medium',
        idealKeywords: ['global state', 'prop drilling', 're-render', 'frequent updates', 'middleware', 'flux'],
        idealAnswer: 'Context API is built into React and is designed to solve prop-drilling for low-frequency updates (like themes, user auth). However, any context change triggers a re-render in all consuming components, which can be inefficient. Redux (or Zustand) is an external state manager designed for high-frequency, complex updates, providing selector-based subscriptions, middleware, and clear actions, making it better for large-scale enterprise apps.',
        explanation: 'Context is for dependency injection/prop-drilling; Redux is for complex state management.'
      },
      {
        id: 're-5',
        categoryId: 'react',
        categoryName: 'React',
        question: 'What is the difference between controlled and uncontrolled components?',
        difficulty: 'Easy',
        idealKeywords: ['useState', 'value', 'onChange', 'useRef', 'source of truth', 'DOM'],
        idealAnswer: 'In a controlled component, the form data is handled by a React component state (using useState, value, and onChange), making React the single source of truth. In an uncontrolled component, the form data is handled by the DOM itself, and we access the input values using React refs (useRef) when needed. Controlled is preferred for validation and instant feedback; uncontrolled is simpler and can be faster for large forms.',
        explanation: 'Controlled uses React state; uncontrolled uses DOM node values via refs.'
      }
    ]
  },
  {
    id: 'nextjs-dev',
    title: 'Next.js Developer',
    description: 'Master Next.js 14/15 App Router, Server Components, Server Actions, SSR, and ISR.',
    category: 'Next.js',
    difficulty: 'Hard',
    duration: 25,
    questionCount: 5,
    icon: 'Layers',
    questions: [
      {
        id: 'next-1',
        categoryId: 'nextjs',
        categoryName: 'Next.js',
        question: 'What is the difference between Server Components and Client Components in Next.js App Router?',
        difficulty: 'Medium',
        idealKeywords: ['server components', 'client components', 'use client', 'bundle size', 'seo', 'interactivity', 'security'],
        idealAnswer: 'React Server Components (RSC) render on the server, meaning their code doesn\'t get sent to the browser, which reduces bundle size, improves loading speed, and boosts SEO. They can fetch data directly from databases. Client Components (marked with "use client") are hydrated in the browser, allowing them to use React hooks (useState, useEffect) and event listeners for interactive elements.',
        explanation: 'Server Components are the default in App Router, offering zero-bundle-size server execution. Client Components add browser interactivity.'
      },
      {
        id: 'next-2',
        categoryId: 'nextjs',
        categoryName: 'Next.js',
        question: 'Explain the difference between SSR, SSG, and ISR in Next.js.',
        difficulty: 'Hard',
        idealKeywords: ['Server-Side Rendering', 'Static Site Generation', 'Incremental Static Regeneration', 'revalidate', 'build time', 'request time'],
        idealAnswer: '1) SSG (Static Site Generation) compiles HTML at build time, yielding instant loads but static data. 2) SSR (Server-Side Rendering) generates HTML on every request, ensuring fresh data but slower responses. 3) ISR (Incremental Static Regeneration) allows you to update static pages in the background after a specified interval (e.g., revalidate: 60) without rebuilding the entire site, giving you the speed of SSG and freshness of SSR.',
        explanation: 'SSG is static; SSR is dynamic on-demand; ISR is static but revalidates in background.'
      },
      {
        id: 'next-3',
        categoryId: 'nextjs',
        categoryName: 'Next.js',
        question: 'What are Server Actions in Next.js, and what security benefits do they provide?',
        difficulty: 'Hard',
        idealKeywords: ['server actions', 'use server', 'form action', 'api endpoint', 'csrf', 'post request'],
        idealAnswer: 'Server Actions are asynchronous server-side functions that can be called directly from Client or Server Components. Defined with "use server", they eliminate the need to write custom API endpoints for form submissions or database updates. Security-wise, they automatically protect against CSRF attacks, run completely on the backend (keeping secrets secure), and integrate natively with React form handling.',
        explanation: 'Server Actions provide RPC-style backend execution directly from React components with built-in security.'
      },
      {
        id: 'next-4',
        categoryId: 'nextjs',
        categoryName: 'Next.js',
        question: 'How does Next.js middleware work, and what are its common use cases?',
        difficulty: 'Medium',
        idealKeywords: ['middleware', 'request', 'response', 'redirect', 'rewrite', 'cookies', 'authentication'],
        idealAnswer: 'Middleware runs before a request is completed. It intercepts the incoming request, allowing you to run code, modify headers, redirect, rewrite, or respond directly. Common use cases include: 1) Authentication and authorization checks. 2) Geolocation-based routing. 3) A/B testing. 4) Logging and analytics. 5) Header manipulation.',
        explanation: 'Middleware runs on the edge before routing, making it highly efficient for security and redirects.'
      },
      {
        id: 'next-5',
        categoryId: 'nextjs',
        categoryName: 'Next.js',
        question: 'How do you optimize image loading and font delivery in Next.js?',
        difficulty: 'Medium',
        idealKeywords: ['next/image', 'next/font', 'CLS', 'webp', 'layout shift', 'google fonts', 'preload'],
        idealAnswer: 'Next.js provides optimized components: 1) <Image /> from "next/image" automatically resizes images, converts them to modern formats (WebP/AVIF), lazy loads them, and reserves space to prevent Cumulative Layout Shift (CLS). 2) "next/font" automatically downloads and hosts Google Fonts locally at build time, eliminating external network requests, preloading fonts, and eliminating Flash of Unstyled Text (FOUT).',
        explanation: 'Built-in Next.js components automate performance best practices for images and fonts.'
      }
    ]
  },
  {
    id: 'js-dev',
    title: 'JavaScript Developer',
    description: 'Master core JavaScript concepts: Closures, Event Loop, Promises, Prototypes, and Scope.',
    category: 'JavaScript',
    difficulty: 'Easy',
    duration: 15,
    questionCount: 5,
    icon: 'Braces',
    questions: [
      {
        id: 'js-1',
        categoryId: 'javascript',
        categoryName: 'JavaScript',
        question: 'What is a closure in JavaScript, and can you give a practical example?',
        difficulty: 'Medium',
        idealKeywords: ['closure', 'lexical environment', 'inner function', 'outer scope', 'encapsulation', 'private variables'],
        idealAnswer: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function\'s scope even after the outer function has returned. Practical examples include creating private variables (encapsulation) or maintaining state in function factories and currying.',
        explanation: 'Functions in JS retain access to their birth scope, creating a closure.'
      },
      {
        id: 'js-2',
        categoryId: 'javascript',
        categoryName: 'JavaScript',
        question: 'Explain the JavaScript Event Loop, Call Stack, Task Queue, and Microtask Queue.',
        difficulty: 'Hard',
        idealKeywords: ['event loop', 'call stack', 'task queue', 'microtask queue', 'promise', 'setTimeout', 'non-blocking'],
        idealAnswer: 'JavaScript is single-threaded and non-blocking. The Call Stack executes synchronous code. When an async operation (like setTimeout or fetch) is called, it is handled by the browser APIs. Once complete, its callback is placed in a queue: Promises go to the Microtask Queue, while setTimeouts go to the Task Queue (Macrotask). The Event Loop continuously checks if the Call Stack is empty. If empty, it first executes ALL tasks in the Microtask Queue, then picks the first task from the Task Queue.',
        explanation: 'The event loop orchestrates asynchronous execution by feeding tasks into the single-threaded call stack.'
      },
      {
        id: 'js-3',
        categoryId: 'javascript',
        categoryName: 'JavaScript',
        question: 'What is the difference between double equality (==) and triple equality (===) in JavaScript?',
        difficulty: 'Easy',
        idealKeywords: ['loose equality', 'strict equality', 'type coercion', 'value', 'data type'],
        idealAnswer: 'Double equality (==) is loose equality; it compares values for equality after performing type coercion (converting both variables to a common type if they are different). Triple equality (===) is strict equality; it compares both the value and the data type, returning true only if both are identical without any coercion. It is highly recommended to use === to avoid unexpected bugs.',
        explanation: '== allows type coercion; === requires identical value and type.'
      },
      {
        id: 'js-4',
        categoryId: 'javascript',
        categoryName: 'JavaScript',
        question: 'What are Promises, and how do they improve upon callbacks? What is async/await?',
        difficulty: 'Easy',
        idealKeywords: ['promise', 'callback hell', 'resolve', 'reject', 'async', 'await', 'syntactic sugar'],
        idealAnswer: 'Promises are objects representing the eventual completion or failure of an asynchronous operation, preventing "callback hell" by allowing chained .then() and .catch() blocks. Async/await is syntactic sugar written on top of promises, making asynchronous code look and behave like synchronous code, which greatly improves readability and error handling using try/catch.',
        explanation: 'Promises represent future values; async/await simplifies promise consumption.'
      },
      {
        id: 'js-5',
        categoryId: 'javascript',
        categoryName: 'JavaScript',
        question: 'Explain prototypal inheritance in JavaScript.',
        difficulty: 'Hard',
        idealKeywords: ['prototype', '__proto__', 'prototype chain', 'constructor', 'Object.create', 'inheritance'],
        idealAnswer: 'In JavaScript, objects have a special hidden property [[Prototype]] (accessed via Object.getPrototypeOf() or __proto__), which links to another object. When we access a property or method on an object, JavaScript first looks on the object itself. If not found, it climbs the "prototype chain" to search the linked prototype object, and so on, up to Object.prototype. This is how inheritance is achieved in JS, which differs from classical class-based inheritance.',
        explanation: 'JavaScript inherits properties via a chain of linked prototype objects.'
      }
    ]
  },
  {
    id: 'ts-dev',
    title: 'TypeScript Developer',
    description: 'Learn static typing, generics, utility types, union/intersection types, and type guards.',
    category: 'TypeScript',
    difficulty: 'Medium',
    duration: 20,
    questionCount: 5,
    icon: 'ShieldCheck',
    questions: [
      {
        id: 'ts-1',
        categoryId: 'typescript',
        categoryName: 'TypeScript',
        question: 'What is the difference between an interface and a type alias in TypeScript?',
        difficulty: 'Easy',
        idealKeywords: ['interface', 'type alias', 'extends', 'intersection', 'declaration merging', 'union'],
        idealAnswer: 'Interfaces are primarily used to define object shapes and can be extended (extends) or merged (declaration merging, where defining the same interface twice merges their fields). Type aliases (type) are more versatile: they can represent objects, unions (type A = B | C), primitives, tuples, and intersections. In modern TS, they are mostly interchangeable for objects, but interfaces are preferred for public APIs due to better error messages and performance.',
        explanation: 'Interfaces support declaration merging and extension; Type aliases support unions and primitives.'
      },
      {
        id: 'ts-2',
        categoryId: 'typescript',
        categoryName: 'TypeScript',
        question: 'What are Generics in TypeScript, and why are they useful? Provide an example.',
        difficulty: 'Medium',
        idealKeywords: ['generics', 'reusable', 'type parameter', 'placeholder', 'type safety', 'T'],
        idealAnswer: 'Generics allow you to write reusable, type-safe components or functions that work with a variety of types rather than a single one. They act as type variables/placeholders. For example, function identity<T>(arg: T): T { return arg; } allows the function to accept any type, but ensures that the return type is exactly the same as the input type, preserving full type safety.',
        explanation: 'Generics parameterize types, enabling reusable logic while preserving static type safety.'
      },
      {
        id: 'ts-3',
        categoryId: 'typescript',
        categoryName: 'TypeScript',
        question: 'What are utility types? Explain Partial, Omit, and Pick with examples.',
        difficulty: 'Medium',
        idealKeywords: ['utility types', 'Partial', 'Omit', 'Pick', 'optional', 'exclude', 'select'],
        idealAnswer: 'Utility types are built-in type transformations. 1) Partial<T> makes all properties of T optional (useful for patch updates). 2) Pick<T, Keys> constructs a type by selecting a set of keys from T. 3) Omit<T, Keys> constructs a type by removing a set of keys from T. For example, Omit<User, "password"> creates a type with all User fields except the password.',
        explanation: 'Utility types transform existing types into new configurations easily.'
      },
      {
        id: 'ts-4',
        categoryId: 'typescript',
        categoryName: 'TypeScript',
        question: 'What is the difference between "any" and "unknown" types, and when should you use "unknown"?',
        difficulty: 'Medium',
        idealKeywords: ['any', 'unknown', 'type safety', 'type assertion', 'type guard', 'narrowing'],
        idealAnswer: '"any" completely disables type checking, allowing you to perform any operation on the value, which defeats the purpose of TypeScript. "unknown" is the type-safe counterpart; it represents any value, but TypeScript won\'t let you perform any operations on it (like calling methods or accessing properties) until you narrow the type using a type guard (typeof, instanceof) or assert its type. Use "unknown" for API responses or dynamic inputs where you want to enforce safe type checking.',
        explanation: 'any bypasses compiler checks; unknown requires type narrowing before usage.'
      },
      {
        id: 'ts-5',
        categoryId: 'typescript',
        categoryName: 'TypeScript',
        question: 'How do you create a custom Type Guard in TypeScript?',
        difficulty: 'Hard',
        idealKeywords: ['type guard', 'is', 'type predicate', 'narrowing', 'boolean', 'return type'],
        idealAnswer: 'A custom Type Guard is a function whose return type is a "type predicate" in the form `parameterName is Type`. It returns a boolean. For example: `function isUser(obj: any): obj is User { return obj && typeof obj.name === "string"; }`. Inside an if-statement checking `isUser(data)`, TypeScript automatically narrows the type of `data` to `User` within that block.',
        explanation: 'Type predicates (arg is Type) instruct the compiler to narrow types upon positive boolean returns.'
      }
    ]
  },
  {
    id: 'hr-interview',
    title: 'HR Interview Prep',
    description: 'Master behavioral questions, conflict resolution, career goals, and cultural fit.',
    category: 'HR & Behavioral',
    difficulty: 'Easy',
    duration: 15,
    questionCount: 5,
    icon: 'Users',
    questions: [
      {
        id: 'hr-1',
        categoryId: 'hr',
        categoryName: 'HR',
        question: 'Tell me about yourself and your background.',
        difficulty: 'Easy',
        idealKeywords: ['present', 'past', 'future', 'experience', 'skills', 'passion', 'goals'],
        idealAnswer: 'Use the Present-Past-Future formula. Talk briefly about your current role/studies and recent achievements (Present), how you got there by highlighting key experiences, projects, or education (Past), and why you are excited about this specific opportunity and how it aligns with your career trajectory (Future). Keep it concise, professional, and under 2 minutes.',
        explanation: 'Structure your answer professionally using Present-Past-Future, keeping it relevant to the target job.'
      },
      {
        id: 'hr-2',
        categoryId: 'hr',
        categoryName: 'HR',
        question: 'What are your greatest strengths and weaknesses?',
        difficulty: 'Easy',
        idealKeywords: ['strength', 'weakness', 'self-awareness', 'improvement', 'analytical', 'public speaking', 'action plan'],
        idealAnswer: 'For strengths, pick 1 or 2 professional traits (e.g., analytical problem-solving, rapid learning) and back them up with a brief example. For weaknesses, pick a genuine but non-fatal professional skill (e.g., public speaking, over-delegation, or difficulty saying no initially), explain how it has affected you, and immediately share the concrete action plan/steps you are taking to improve (e.g., taking courses, practicing).',
        explanation: 'Strengths should match the job; weaknesses must show self-awareness and active self-improvement.'
      },
      {
        id: 'hr-3',
        categoryId: 'hr',
        categoryName: 'HR',
        question: 'Describe a situation where you had a conflict with a team member. How did you resolve it?',
        difficulty: 'Medium',
        idealKeywords: ['STAR method', 'situation', 'task', 'action', 'result', 'communication', 'empathy', 'compromise'],
        idealAnswer: 'Use the STAR method (Situation, Task, Action, Result). Describe a minor, professional disagreement (e.g., design direction or task distribution). Emphasize empathy, active listening, and objective communication. Explain how you invited them to discuss it privately, focused on facts rather than emotions, worked together to find a compromise (Action), and how it led to a successful project outcome and a stronger working relationship (Result).',
        explanation: 'Focus on constructive resolution, collaboration, and objective outcomes, never badmouthing others.'
      },
      {
        id: 'hr-4',
        categoryId: 'hr',
        categoryName: 'HR',
        question: 'Why do you want to join our company?',
        difficulty: 'Easy',
        idealKeywords: ['research', 'culture', 'mission', 'alignment', 'growth', 'product', 'values'],
        idealAnswer: 'Show that you did your homework. Mention specific aspects of their company mission, values, recent achievements, or products that genuinely excite you. Connect these elements to your own career goals, skills, and personal values. Explain how you can contribute to their success while growing professionally alongside their team.',
        explanation: 'Demonstrate deep company research and align your personal values/skills with their mission.'
      },
      {
        id: 'hr-5',
        categoryId: 'hr',
        categoryName: 'HR',
        question: 'Where do you see yourself in 5 years?',
        difficulty: 'Easy',
        idealKeywords: ['growth', 'expertise', 'leadership', 'long-term', 'value', 'learning', 'contribution'],
        idealAnswer: 'Express a desire to grow within the company. Explain that you want to master your current domain, take on more responsibilities, and eventually move into a leadership or senior technical specialist role. Emphasize that your goal is to deliver long-term value, become a trusted expert, and contribute to the company\'s strategic goals.',
        explanation: 'Show ambition and commitment to long-term professional growth and organizational value.'
      }
    ]
  },
  {
    id: 'bca-grad',
    title: 'BCA Graduate Interview',
    description: 'Perfect for Computer Application graduates. Covers OOPs, Databases, SDLC, Networking, and OS.',
    category: 'Academic/General',
    difficulty: 'Medium',
    duration: 15,
    questionCount: 5,
    icon: 'GraduationCap',
    questions: [
      {
        id: 'bca-1',
        categoryId: 'bca',
        categoryName: 'BCA',
        question: 'What are the main pillars of Object-Oriented Programming (OOP)? Explain with examples.',
        difficulty: 'Easy',
        idealKeywords: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'class', 'object', 'override'],
        idealAnswer: 'The four pillars of OOP are: 1) Encapsulation: Bundling data and methods into a single unit (Class) and restricting direct access (using private variables, getters/setters). 2) Inheritance: Acquiring properties of an existing class (e.g., a Car class inheriting from Vehicle). 3) Polymorphism: The ability to take many forms, like method overloading or overriding (e.g., a draw() method behaving differently in Circle vs Square). 4) Abstraction: Hiding complex implementation details and showing only essential features (using abstract classes/interfaces).',
        explanation: 'OOP organizes software design around data (objects) and well-defined interfaces.'
      },
      {
        id: 'bca-2',
        categoryId: 'bca',
        categoryName: 'BCA',
        question: 'What is the difference between SQL and NoSQL databases?',
        difficulty: 'Medium',
        idealKeywords: ['relational', 'non-relational', 'schema', 'flexible', 'scaling', 'join', 'document', 'acid'],
        idealAnswer: 'SQL databases are Relational (RDBMS), use structured tables with a predefined schema, support complex JOIN queries, adhere strictly to ACID properties, and scale vertically (adding more power to a single server). NoSQL databases are Non-Relational, store data as documents, key-values, or graphs with flexible dynamic schemas, scale horizontally (adding more servers), and are optimized for high-write loads and unstructured big data.',
        explanation: 'SQL is structured and relational; NoSQL is flexible, distributed, and non-relational.'
      },
      {
        id: 'bca-3',
        categoryId: 'bca',
        categoryName: 'BCA',
        question: 'Explain the phases of the Software Development Life Cycle (SDLC).',
        difficulty: 'Easy',
        idealKeywords: ['planning', 'analysis', 'design', 'development', 'testing', 'deployment', 'maintenance'],
        idealAnswer: 'SDLC consists of several sequential phases: 1) Requirement Gathering & Analysis: Defining what the software must do. 2) Design: Planning system architecture and database design. 3) Coding/Development: Writing the actual code. 4) Testing: Verifying the software is bug-free and meets requirements. 5) Deployment: Releasing the software to production. 6) Maintenance: Fixing post-release bugs and adding updates.',
        explanation: 'SDLC is a structured process for building high-quality software efficiently.'
      },
      {
        id: 'bca-4',
        categoryId: 'bca',
        categoryName: 'BCA',
        question: 'How does the Domain Name System (DNS) work?',
        difficulty: 'Medium',
        idealKeywords: ['IP address', 'domain name', 'nameserver', 'resolver', 'root', 'tld', 'cache'],
        idealAnswer: 'DNS acts as the phonebook of the internet. It translates human-friendly domain names (like google.com) into computer-friendly IP addresses (like 142.250.190.46). When you enter a URL, your browser asks a DNS Resolver (ISP). If not cached, the resolver queries: 1) Root Nameserver, 2) TLD (Top-Level Domain) Nameserver (like .com), and 3) Authoritative Nameserver, which returns the IP. The resolver caches this IP and returns it to your browser to load the site.',
        explanation: 'DNS resolves text hostnames to numeric IP addresses through a hierarchical lookup system.'
      },
      {
        id: 'bca-5',
        categoryId: 'bca',
        categoryName: 'BCA',
        question: 'What is the difference between a Process and a Thread in an Operating System?',
        difficulty: 'Medium',
        idealKeywords: ['process', 'thread', 'memory', 'resource sharing', 'lightweight', 'context switch', 'overhead'],
        idealAnswer: 'A Process is an independent program in execution with its own allocated memory space, address space, and resources; processes are isolated and communicate via IPC, having high overhead. A Thread is a lightweight, basic unit of CPU utilization within a process. Multiple threads run inside a single process, sharing its memory space, code, and resources, which makes thread communication faster and context switching much cheaper.',
        explanation: 'Processes are isolated execution instances; threads are execution pathways sharing a parent process\'s memory.'
      }
    ]
  }
];

// Default User Profile (Empty)
const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  avatar: '',
  skills: [],
  careerGoals: '',
  interviewPreferences: {
    role: 'frontend-dev',
    difficulty: 'Medium',
    duration: 15
  },
  resumeName: null,
  resumeParsedSkills: []
};

// Default History / Completed Interviews (Empty)
const DEFAULT_HISTORY: HistoryItem[] = [];

// Initialize database in localStorage if empty
export const initDb = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem('v2_ace_library')) {
    localStorage.setItem('v2_ace_library', JSON.stringify(INITIAL_LIBRARY));
  }
  if (!localStorage.getItem('v2_ace_profile')) {
    localStorage.setItem('v2_ace_profile', JSON.stringify(DEFAULT_PROFILE));
  }
  if (!localStorage.getItem('v2_ace_history')) {
    localStorage.setItem('v2_ace_history', JSON.stringify(DEFAULT_HISTORY));
  }
  if (!localStorage.getItem('v2_ace_bookmarks')) {
    localStorage.setItem('v2_ace_bookmarks', JSON.stringify([]));
  }
  if (!localStorage.getItem('v2_ace_favorites')) {
    localStorage.setItem('v2_ace_favorites', JSON.stringify([]));
  }
};

// Core Database API
export const mockDb = {
  // Library
  getLibrary: (): InterviewRole[] => {
    initDb();
    return JSON.parse(localStorage.getItem('v2_ace_library') || '[]');
  },

  getRoleById: (id: string): InterviewRole | null => {
    const lib = mockDb.getLibrary();
    return lib.find(r => r.id === id) || null;
  },

  // Profile
  getProfile: (): UserProfile => {
    initDb();
    return JSON.parse(localStorage.getItem('v2_ace_profile') || '{}');
  },

  updateProfile: (profile: Partial<UserProfile>): UserProfile => {
    const current = mockDb.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem('v2_ace_profile', JSON.stringify(updated));
    return updated;
  },

  // History / Results
  getHistory: (): HistoryItem[] => {
    initDb();
    return JSON.parse(localStorage.getItem('v2_ace_history') || '[]');
  },

  addHistoryItem: (item: HistoryItem): HistoryItem[] => {
    const history = mockDb.getHistory();
    const updated = [item, ...history];
    localStorage.setItem('v2_ace_history', JSON.stringify(updated));
    return updated;
  },

  getHistoryItemById: (id: string): HistoryItem | null => {
    const history = mockDb.getHistory();
    return history.find(item => item.id === id) || null;
  },

  // Bookmarked / Saved Questions
  getBookmarks: (): string[] => {
    initDb();
    return JSON.parse(localStorage.getItem('v2_ace_bookmarks') || '[]');
  },

  toggleBookmark: (questionId: string): boolean => {
    const bookmarks = mockDb.getBookmarks();
    const index = bookmarks.indexOf(questionId);
    let isBookmarked = false;
    if (index > -1) {
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(questionId);
      isBookmarked = true;
    }
    localStorage.setItem('v2_ace_bookmarks', JSON.stringify(bookmarks));
    return isBookmarked;
  },

  // Favorites (Roles or Questions)
  getFavorites: (): string[] => {
    initDb();
    return JSON.parse(localStorage.getItem('v2_ace_favorites') || '[]');
  },

  toggleFavorite: (id: string): boolean => {
    const favs = mockDb.getFavorites();
    const index = favs.indexOf(id);
    let isFav = false;
    if (index > -1) {
      favs.splice(index, 1);
    } else {
      favs.push(id);
      isFav = true;
    }
    localStorage.setItem('v2_ace_favorites', JSON.stringify(favs));
    return isFav;
  },

  // Stats for Dashboard
  getStats: () => {
    const history = mockDb.getHistory();
    const library = mockDb.getLibrary();

    const totalInterviews = history.length;
    if (totalInterviews === 0) {
      return {
        totalInterviews: 0,
        averageScore: 0,
        technicalAverage: 0,
        communicationAverage: 0,
        confidenceAverage: 0,
        totalHours: 0,
        weeklyProgress: [0, 0, 0, 0],
        strongTopics: [],
        weakTopics: []
      };
    }

    const totalScore = history.reduce((acc, item) => acc + item.feedback.overallScore, 0);
    const totalTech = history.reduce((acc, item) => acc + item.feedback.technicalScore, 0);
    const totalComm = history.reduce((acc, item) => acc + item.feedback.communicationScore, 0);
    const totalConf = history.reduce((acc, item) => acc + item.feedback.confidenceScore, 0);
    const totalSeconds = history.reduce((acc, item) => acc + item.durationSpent, 0);

    const averageScore = Math.round(totalScore / totalInterviews);
    const technicalAverage = Math.round(totalTech / totalInterviews);
    const communicationAverage = Math.round(totalComm / totalInterviews);
    const confidenceAverage = Math.round(totalConf / totalInterviews);
    const totalHours = parseFloat((totalSeconds / 3600).toFixed(1));

    // Calculate strong & weak topics based on categories practiced
    // Map categories to scores
    const categoryScores: Record<string, { total: number; count: number }> = {};
    history.forEach(item => {
      const role = library.find(r => r.id === item.roleId);
      const cat = role ? role.category : 'General';
      if (!categoryScores[cat]) {
        categoryScores[cat] = { total: 0, count: 0 };
      }
      categoryScores[cat].total += item.feedback.overallScore;
      categoryScores[cat].count += 1;
    });

    const topics = Object.entries(categoryScores).map(([name, data]) => ({
      name,
      score: Math.round(data.total / data.count)
    }));

    const strongTopics = topics.filter(t => t.score >= 80).map(t => t.name);
    const weakTopics = topics.filter(t => t.score < 80).map(t => t.name);

    // Fallbacks if no diversity
    if (strongTopics.length === 0 && topics.length > 0) {
      strongTopics.push(topics[0].name);
    }
    if (weakTopics.length === 0) {
      weakTopics.push('System Design', 'Data Structures');
    }
    if (strongTopics.length === 0) {
      strongTopics.push('React Core', 'HTML/CSS Layouts');
    }

    // Weekly progress (mock representation of sessions over last 4 weeks)
    // E.g., count how many sessions in chunks of time
    const weeklyProgress = [1, 2, totalInterviews > 2 ? totalInterviews - 2 : 1, totalInterviews];

    return {
      totalInterviews,
      averageScore,
      technicalAverage,
      communicationAverage,
      confidenceAverage,
      totalHours,
      weeklyProgress,
      strongTopics,
      weakTopics
    };
  },

  // SWR API Interceptor (Simulated endpoints)
  get: async (url: string) => {
    // Artificial network delay removed for instant, blazing-fast UI

    if (url === '/api/profile') {
      return mockDb.getProfile();
    }
    if (url === '/api/library') {
      return mockDb.getLibrary();
    }
    if (url === '/api/history') {
      return mockDb.getHistory();
    }
    if (url === '/api/stats') {
      return mockDb.getStats();
    }
    if (url === '/api/bookmarks') {
      return mockDb.getBookmarks();
    }
    if (url === '/api/favorites') {
      return mockDb.getFavorites();
    }
    if (url.startsWith('/api/role/')) {
      const id = url.split('/').pop() || '';
      return mockDb.getRoleById(id);
    }
    if (url.startsWith('/api/history/')) {
      const id = url.split('/').pop() || '';
      return mockDb.getHistoryItemById(id);
    }
    if (url === '/api/question-bank') {
      // Return flat list of all questions in the library
      const lib = mockDb.getLibrary();
      const allQuestions: Question[] = [];
      lib.forEach(role => {
        role.questions.forEach(q => {
          if (!allQuestions.some(existing => existing.id === q.id)) {
            allQuestions.push(q);
          }
        });
      });
      return allQuestions;
    }

    throw new Error(`404: Not Found ${url}`);
  },

  // AI Feedback Engine
  // Analyzes the responses and generates a beautiful, highly customized AI report!
  generateFeedback: (roleId: string, answers: AnswerRecord[], totalDurationSeconds: number): HistoryItem => {
    const role = mockDb.getRoleById(roleId);
    if (!role) throw new Error('Role not found');

    const detailedAnalysis = answers.map(ans => {
      const originalQuestion = role.questions.find(q => q.id === ans.questionId);
      if (!originalQuestion) {
        return {
          questionId: ans.questionId,
          questionText: ans.questionText,
          userAnswer: ans.answerText,
          technicalAccuracy: 50,
          feedbackText: 'Question details not found in database.',
          suggestedAdditions: []
        };
      }

      if (ans.isSkipped || ans.answerText.trim().length === 0) {
        return {
          questionId: ans.questionId,
          questionText: ans.questionText,
          userAnswer: '[Question Skipped]',
          technicalAccuracy: 0,
          feedbackText: 'This question was skipped. It is highly recommended to attempt all questions during an interview. Even a partial answer demonstrates problem-solving ability and courage.',
          suggestedAdditions: originalQuestion.idealKeywords
        };
      }

      const text = ans.answerText.toLowerCase();
      const matchedKeywords = originalQuestion.idealKeywords.filter(kw => 
        text.includes(kw.toLowerCase())
      );

      const keywordRatio = matchedKeywords.length / originalQuestion.idealKeywords.length;
      const wordCount = ans.answerText.trim().split(/\s+/).length;

      // Calculate a realistic score
      let techScore = 40; // baseline
      if (wordCount > 5) techScore += 10;
      if (wordCount > 20) techScore += 15;
      if (wordCount > 50) techScore += 10;
      techScore += Math.round(keywordRatio * 25);

      if (techScore > 100) techScore = 100;

      // Custom feedback comments based on score
      let feedbackText = '';
      const missedKeywords = originalQuestion.idealKeywords.filter(kw => !matchedKeywords.includes(kw));

      if (techScore >= 85) {
        feedbackText = `Outstanding response! You demonstrated a clear and deep understanding of this topic. You accurately explained the core concept and hit almost all high-yield industry terms. Your explanation is structured and professional.`;
      } else if (techScore >= 70) {
        feedbackText = `Strong answer with solid fundamental knowledge. You correctly identified the primary mechanism. To make this response elite, try to incorporate more technical terminology and provide a concrete practical example of how you apply this in a real project.`;
      } else if (techScore >= 50) {
        feedbackText = `A decent start, but the answer lacks technical depth and specific details. You mentioned the general area, but missed several core concepts. Elaborate further on "how" and "why" rather than just "what".`;
      } else {
        feedbackText = `The response is too brief or lacks alignment with the core question. A strong technical response should explicitly define the term, explain its operational mechanics, and describe its practical advantages in development.`;
      }

      return {
        questionId: ans.questionId,
        questionText: ans.questionText,
        userAnswer: ans.answerText,
        technicalAccuracy: techScore,
        feedbackText,
        suggestedAdditions: missedKeywords.slice(0, 3)
      };
    });

    // Calculate aggregate scores
    const attemptedAnswers = detailedAnalysis.filter(a => a.userAnswer !== '[Question Skipped]');
    const answeredCount = attemptedAnswers.length;

    let avgTech = 0;
    let avgComm = 75; // baseline
    let avgConf = 70; // baseline

    if (answeredCount > 0) {
      const sumTech = attemptedAnswers.reduce((acc, curr) => acc + curr.technicalAccuracy, 0);
      avgTech = Math.round(sumTech / detailedAnalysis.length); // skipped count as 0

      // Communication score based on length and structure of answers
      const totalWords = attemptedAnswers.reduce((acc, curr) => acc + curr.userAnswer.split(/\s+/).length, 0);
      const avgWords = totalWords / answeredCount;
      if (avgWords > 40) avgComm += 15;
      else if (avgWords > 20) avgComm += 10;
      else if (avgWords > 10) avgComm += 5;
      else avgComm -= 10;

      // Confidence score based on skip count and speed
      const skipCount = detailedAnalysis.length - answeredCount;
      avgConf -= skipCount * 12;
      
      const avgTimeSpent = totalDurationSeconds / detailedAnalysis.length;
      if (avgTimeSpent > 45 && avgTimeSpent < 180) {
        avgConf += 15; // healthy pacing
      } else if (avgTimeSpent <= 15) {
        avgConf -= 10; // rushed
      }

      avgComm = Math.max(30, Math.min(98, avgComm));
      avgConf = Math.max(30, Math.min(98, avgConf));
    } else {
      avgTech = 0;
      avgComm = 30;
      avgConf = 30;
    }

    const overallScore = Math.round((avgTech * 0.5) + (avgComm * 0.3) + (avgConf * 0.2));

    // Custom general recommendations
    const suggestedImprovements: string[] = [];
    const commonMistakes: string[] = [];

    if (avgTech < 75) {
      suggestedImprovements.push('Focus on integrating high-yield technical keywords into your explanations.');
      commonMistakes.push('Providing overly brief or generic answers without technical elaboration.');
    } else {
      suggestedImprovements.push('Refine your answers by adding edge cases or performance considerations.');
    }

    if (avgComm < 75) {
      suggestedImprovements.push('Structure your answers using the "Concept -> Mechanism -> Benefit" framework to sound more articulate.');
      commonMistakes.push('Rushing into explanations without establishing clear introductory definitions.');
    } else {
      suggestedImprovements.push('Maintain your strong narrative structure and professional vocabulary.');
    }

    if (detailedAnalysis.some(a => a.userAnswer === '[Question Skipped]')) {
      suggestedImprovements.push('Attempt every single question, as blank answers automatically score zero in real interviews.');
      commonMistakes.push('Skipping hard technical questions instead of talking through a partial, logical solution.');
    }

    if (suggestedImprovements.length < 3) {
      suggestedImprovements.push('Practice mock sessions with a live timer to improve your time management and structural pacing.');
    }
    if (commonMistakes.length < 2) {
      commonMistakes.push('Forgetting to mention real-world application examples when explaining abstract programming patterns.');
    }

    const newHistoryItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      roleId,
      roleTitle: role.title,
      date: new Date().toISOString().split('T')[0],
      durationSpent: totalDurationSeconds,
      totalQuestions: role.questionCount,
      answeredQuestions: answeredCount,
      feedback: {
        communicationScore: avgComm,
        technicalScore: avgTech,
        confidenceScore: avgConf,
        overallScore,
        suggestedImprovements,
        commonMistakes,
        detailedAnalysis
      },
      answers
    };

    mockDb.addHistoryItem(newHistoryItem);
    return newHistoryItem;
  }
};
