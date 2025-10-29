const express = require("express");
const app = express();
const port = 3001;
//const db = require("./base.json");
const fs = require("fs/promises");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb://alexlloyd:7RYq2pW0XQ2K3zTG@cluster0-shard-00-00.gjxyy.mongodb.net:27017,cluster0-shard-00-01.gjxyy.mongodb.net:27017,cluster0-shard-00-02.gjxyy.mongodb.net:27017/?replicaSet=atlas-f107as-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
//const uri =
 // "mongodb+srv://alexlloyd:7RYq2pW0XQ2K3zTG@cluster0.gjxyy.mongodb.net/english_learning?retryWrites=true&w=majority&appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

let dbName = "sample_mflix";
/*
(async () => {
  await client.connect();
  db = client.db(dbName);
})();

//db.user.find => await User.findOne*/
//отключил рабочую коннектдб
/*async function startServer() {
  try {
    await client.connect();
    console.log("MongoDB connected");
    db = client.db(dbName); // Указываем свою базу данных
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log("MongoDB connection error:", err);
    process.exit(1); // Завершаем процесс, если подключение не удалось
  }
}

startServer();*/

app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

app.use(
  require("cors")({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  // db.push("hello")

  // SaveDb()

  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password || !req.body.role) {
    res.send({ success: false });
    return;
  }

  //const user = db.users.find((x) => x.email == req.body.email);
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ email: req.body.email });
  //const user = db.find((x) => x.email == req.body.email);

  console.log(user);

  if (user) {
    res.send({ success: false });
    return;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const role = req.body.role;

  console.log(req.body);

  const newUser = {
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    rooms: [],
    token: crypto.randomBytes(12).toString("hex"),
    id: Math.floor((Date.now() * 2) / 3),
  };

  //newUser.token = crypto.randomBytes(12).toString("hex");

  //db.users.push(newUser);
  //db.push(newUser);

  // await SaveDb();

  await usersCollection.insertOne(newUser);

  res.cookie("token", newUser.token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.send({ success: true, role: role });
});

app.post("/login", async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.send({ success: false });
    return;
  }

  //const user = db.find((x) => x.email == req.body.email);

  //const user = db.users.find((x) => x.email == req.body.email);
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ email: req.body.email });

  if (!user) {
    console.log("User not found");
    return res.send({ success: false });
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (passwordMatch) {
    console.log("1");
  }

  if (!passwordMatch) {
    console.log("2");
    return res.send({ success: false });
  }


  /*if (!user || user.password !== req.body.password) {
    console.log("3")
    res.send({ success: false });
    return;
  }*/

  const token = crypto.randomBytes(12).toString("hex");

  await usersCollection.updateOne(
    { email: req.body.email },
    { $set: { token: token } }
  );

  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  //user.token = token;

  const role = user.role;

  res.send({ success: true, role: role });

  //SaveDb();
});

app.post("/getuser", async (req, res) => {
  //const user = db.find((x) => x.token == req.cookies.token);
  //const user = db.users.find((x) => x.email == req.body.email);

  //const user = db.users.find((x) => x.token == req.cookies.token);
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ token: req.cookies.token });

  console.log(user, "user");


if(!user){
  res.send({success: false})
}

  if (!user) {
    res.send({ success: false });
    return;
  }

  res.send(user);
});

//async function SaveDb() {
//await fs.writeFile("./base.json", JSON.stringify(db, null, 2));
//}
/*
const questions = [
  {
    id: 1,
    text: "He _____ (play) the guitar every day.",
    correctAnswer: "plays",
    options: ["play", "played", "playing", "plays"],
  },
  {
    id: 2,
    text: "They _____ (eat) breakfast at 8 AM.",
    correctAnswer: "eat",
    options: ["eats", "ate", "eating", "eat"],
  },
  {
    id: 3,
    text: "The sun _____ (rise) in the east.",
    correctAnswer: "rises",
    options: ["rise", "rose", "rising", "rises"],
  },
  {
    id: 4,
    text: "We _____ (watch) TV in the evening.",
    correctAnswer: "watch",
    options: ["watches", "watched", "watching", "watch"],
  },
  {
    id: 5,
    text: "She _____ (work) at the bank.",
    correctAnswer: "works",
    options: ["work", "worked", "working", "works"],
  },
  {
    id: 6,
    text: "They _____ (live) in London.",
    correctAnswer: "live",
    options: ["lives", "lived", "living", "live"],
  },
  {
    id: 7,
    text: "He _____ (drink) coffee in the morning.",
    correctAnswer: "drinks",
    options: ["drink", "drunk", "drinking", "drinks"],
  },
  {
    id: 8,
    text: "We _____ (go) to school by bus.",
    correctAnswer: "go",
    options: ["goes", "went", "going", "go"],
  },
  {
    id: 9,
    text: "She _____ (read) books in her free time.",
    correctAnswer: "reads",
    options: ["read", "reading", "reads", "have read"],
  },
  {
    id: 10,
    text: "They _____ (study) hard for their exams.",
    correctAnswer: "study",
    options: ["studies", "studied", "studying", "study"],
  },
  {
    id: 11,
    text: "The train _____ (leave) at 10 AM every morning.",
    correctAnswer: "leaves",
    options: ["leave", "left", "leaving", "leaves"],
  },
  {
    id: 12,
    text: "I _____ (take) the dog for a walk every evening.",
    correctAnswer: "take",
    options: ["takes", "took", "taking", "take"],
  },
  {
    id: 13,
    text: "She _____ (speak) English very well.",
    correctAnswer: "speaks",
    options: ["speak", "spoke", "speaking", "speaks"],
  },
  {
    id: 14,
    text: "They _____ (play) football on Sundays.",
    correctAnswer: "play",
    options: ["plays", "played", "playing", "play"],
  },
  {
    id: 15,
    text: "He _____ (watch) the news every night.",
    correctAnswer: "watches",
    options: ["watch", "watched", "watching", "watches"],
  },
  {
    id: 16,
    text: "We _____ (have) lunch at 1 PM.",
    correctAnswer: "have",
    options: ["has", "had", "having", "have"],
  },
  {
    id: 17,
    text: "She _____ (listen) to music while she works.",
    correctAnswer: "listens",
    options: ["listen", "listened", "listening", "listens"],
  },
  {
    id: 18,
    text: "They _____ (work) in a factory.",
    correctAnswer: "work",
    options: ["works", "worked", "working", "work"],
  },
  {
    id: 19,
    text: "He _____ (read) the newspaper every morning.",
    correctAnswer: "reads",
    options: ["read", "reading", "reads", "have read"],
  },
  {
    id: 20,
    text: "We _____ (clean) the house on Saturdays.",
    correctAnswer: "clean",
    options: ["cleans", "cleaned", "cleaning", "clean"],
  },
];

app.get("/questions", (req, res) => {
  res.send(questions);
});

const questions2 = [
  {
    id: 1,
    text: "She _____ (finish) her homework.",
    correctAnswer: "has finished",
    options: ["have finished", "has finished", "finished", "finishes"],
  },
  {
    id: 2,
    text: "They _____ (visit) Paris twice.",
    correctAnswer: "have visited",
    options: ["has visited", "have visited", "visited", "visits"],
  },
  {
    id: 3,
    text: "I _____ (see) that movie already.",
    correctAnswer: "have seen",
    options: ["has seen", "have saw", "have seen", "seen"],
  },
  {
    id: 4,
    text: "He _____ (break) his leg.",
    correctAnswer: "has broken",
    options: ["has broke", "have broken", "has broken", "broke"],
  },
  {
    id: 5,
    text: "We _____ (eat) all the pizza.",
    correctAnswer: "have eaten",
    options: ["have ate", "has eaten", "have eaten", "ate"],
  },
  {
    id: 6,
    text: "You _____ (make) a mistake.",
    correctAnswer: "have made",
    options: ["has made", "have made", "made", "makes"],
  },
  {
    id: 7,
    text: "It _____ (rain) all day.",
    correctAnswer: "has rained",
    options: ["has rained", "have rained", "rained", "rains"],
  },
  {
    id: 8,
    text: "They _____ (not arrive) yet.",
    correctAnswer: "have not arrived",
    options: ["hasn't arrived", "have not arrived", "haven't arrive", "didn't arrive"],
  },
  {
    id: 9,
    text: "He _____ (write) three books.",
    correctAnswer: "has written",
    options: ["have written", "has wrote", "has written", "wrote"],
  },
  {
    id: 10,
    text: "I _____ (lose) my keys.",
    correctAnswer: "have lost",
    options: ["has lost", "have lost", "lost", "loses"],
  },
  {
    id: 11,
    text: "We _____ (be) to New York many times.",
    correctAnswer: "have been",
    options: ["has been", "have been", "was", "were"],
  },
  {
    id: 12,
    text: "She _____ (not call) me today.",
    correctAnswer: "has not called",
    options: ["has not called", "have not called", "didn't call", "hasn't call"],
  },
  {
    id: 13,
    text: "You _____ (see) him recently?",
    correctAnswer: "have seen",
    options: ["have seen", "has saw", "did see", "seen"],
  },
  {
    id: 14,
    text: "They _____ (clean) the house.",
    correctAnswer: "have cleaned",
    options: ["has cleaned", "have cleaned", "cleaned", "cleaning"],
  },
  {
    id: 15,
    text: "He _____ (forget) his password.",
    correctAnswer: "has forgotten",
    options: ["has forgot", "have forgotten", "has forgotten", "forgot"],
  },
  {
    id: 16,
    text: "I _____ (never try) sushi.",
    correctAnswer: "have never tried",
    options: ["has never tried", "have never tried", "tried", "never try"],
  },
  {
    id: 17,
    text: "We _____ (just arrive) at the station.",
    correctAnswer: "have just arrived",
    options: ["have just arrived", "has just arrived", "just arrived", "arrived just"],
  },
  {
    id: 18,
    text: "She _____ (already read) that book.",
    correctAnswer: "has already read",
    options: ["has already read", "have already read", "read already", "has readed"],
  },
  {
    id: 19,
    text: "They _____ (never be) to Japan.",
    correctAnswer: "have never been",
    options: ["has never been", "have never been", "never were", "have been never"],
  },
  {
    id: 20,
    text: "He _____ (buy) a new phone.",
    correctAnswer: "has bought",
    options: ["has bought", "have bought", "bought", "buyed"],
  },
];


app.get("/questions2", (req, res) => {
  res.send(questions2);
});

const questions3 = [
  {
    id: 1,
    text: "She _____ (study) for hours.",
    correctAnswer: "has been studying",
    options: ["has been studying", "have been studied", "was studying", "has studied"],
  },
  {
    id: 2,
    text: "They _____ (work) on the project all day.",
    correctAnswer: "have been working",
    options: ["has been working", "have worked", "have been working", "had been working"],
  },
  {
    id: 3,
    text: "I _____ (wait) for you since morning.",
    correctAnswer: "have been waiting",
    options: ["have waited", "have been waiting", "has been waiting", "am waiting"],
  },
  {
    id: 4,
    text: "He _____ (live) here for ten years.",
    correctAnswer: "has been living",
    options: ["has lived", "has been living", "have been living", "lives"],
  },
  {
    id: 5,
    text: "We _____ (try) to fix the issue.",
    correctAnswer: "have been trying",
    options: ["have tried", "have been trying", "had tried", "has been trying"],
  },
  {
    id: 6,
    text: "You _____ (talk) on the phone for an hour.",
    correctAnswer: "have been talking",
    options: ["have been talking", "has been talking", "talked", "talking"],
  },
  {
    id: 7,
    text: "It _____ (rain) all morning.",
    correctAnswer: "has been raining",
    options: ["has rained", "has been raining", "have been raining", "rains"],
  },
  {
    id: 8,
    text: "They _____ (argue) since yesterday.",
    correctAnswer: "have been arguing",
    options: ["have been arguing", "has been arguing", "have argued", "are arguing"],
  },
  {
    id: 9,
    text: "He _____ (drive) for hours.",
    correctAnswer: "has been driving",
    options: ["has driven", "has been driving", "have been driving", "was driving"],
  },
  {
    id: 10,
    text: "I _____ (look) for my keys all morning.",
    correctAnswer: "have been looking",
    options: ["have been looking", "has been looking", "looked", "have looked"],
  },
  {
    id: 11,
    text: "We _____ (cook) since 4 PM.",
    correctAnswer: "have been cooking",
    options: ["have been cooking", "has cooked", "have cooked", "had been cooking"],
  },
  {
    id: 12,
    text: "She _____ (feel) tired lately.",
    correctAnswer: "has been feeling",
    options: ["has been feeling", "have felt", "feels", "has felt"],
  },
  {
    id: 13,
    text: "They _____ (paint) the house for weeks.",
    correctAnswer: "have been painting",
    options: ["have painted", "have been painting", "has been painting", "paint"],
  },
  {
    id: 14,
    text: "He _____ (read) that book all day.",
    correctAnswer: "has been reading",
    options: ["has read", "has been reading", "have been reading", "read"],
  },
  {
    id: 15,
    text: "You _____ (watch) too much TV lately.",
    correctAnswer: "have been watching",
    options: ["have watched", "have been watching", "has been watching", "watch"],
  },
  {
    id: 16,
    text: "They _____ (travel) since January.",
    correctAnswer: "have been traveling",
    options: ["have been traveling", "have traveled", "has been traveling", "traveled"],
  },
  {
    id: 17,
    text: "We _____ (learn) English for two years.",
    correctAnswer: "have been learning",
    options: ["have been learning", "has been learning", "learned", "learn"],
  },
  {
    id: 18,
    text: "She _____ (clean) the room for an hour.",
    correctAnswer: "has been cleaning",
    options: ["has been cleaning", "have cleaned", "cleaned", "has cleaned"],
  },
  {
    id: 19,
    text: "He _____ (exercise) regularly.",
    correctAnswer: "has been exercising",
    options: ["has been exercising", "have exercised", "exercised", "is exercising"],
  },
  {
    id: 20,
    text: "I _____ (write) emails all morning.",
    correctAnswer: "have been writing",
    options: ["have written", "have been writing", "has been writing", "wrote"],
  },
];


app.get("/questions3", (req, res) => {
  res.send(questions3);
});

const questions4 = [
  {
    id: 1,
    text: "She _____ (leave) before I arrived.",
    correctAnswer: "had left",
    options: ["left", "had left", "has left", "was leaving"],
  },
  {
    id: 2,
    text: "They _____ (finish) dinner when we came.",
    correctAnswer: "had finished",
    options: ["have finished", "had finished", "finished", "was finishing"],
  },
  {
    id: 3,
    text: "I _____ (see) the film before.",
    correctAnswer: "had seen",
    options: ["saw", "had seen", "have seen", "was seeing"],
  },
  {
    id: 4,
    text: "He _____ (not call) me back.",
    correctAnswer: "had not called",
    options: ["didn’t call", "had not called", "has not called", "was not calling"],
  },
  {
    id: 5,
    text: "We _____ (meet) her before the party.",
    correctAnswer: "had met",
    options: ["met", "have met", "had met", "was meeting"],
  },
  {
    id: 6,
    text: "They _____ (not finish) their work when I came.",
    correctAnswer: "had not finished",
    options: ["have not finished", "had not finished", "didn’t finish", "was not finishing"],
  },
  {
    id: 7,
    text: "I _____ (never be) to Paris before last summer.",
    correctAnswer: "had never been",
    options: ["was never", "had never been", "have never been", "never went"],
  },
  {
    id: 8,
    text: "She _____ (already leave) when I called her.",
    correctAnswer: "had already left",
    options: ["already left", "had already left", "has already left", "left already"],
  },
  {
    id: 9,
    text: "He _____ (write) the email before lunch.",
    correctAnswer: "had written",
    options: ["wrote", "had written", "has written", "was writing"],
  },
  {
    id: 10,
    text: "They _____ (live) in London before moving to New York.",
    correctAnswer: "had lived",
    options: ["lived", "had lived", "have lived", "was living"],
  },
  {
    id: 11,
    text: "We _____ (know) each other for years.",
    correctAnswer: "had known",
    options: ["knew", "had known", "have known", "was knowing"],
  },
  {
    id: 12,
    text: "You _____ (forget) your keys again.",
    correctAnswer: "had forgotten",
    options: ["forgot", "had forgotten", "have forgotten", "was forgetting"],
  },
  {
    id: 13,
    text: "She _____ (break) the vase before I came.",
    correctAnswer: "had broken",
    options: ["broke", "had broken", "has broken", "was breaking"],
  },
  {
    id: 14,
    text: "He _____ (not do) his homework.",
    correctAnswer: "had not done",
    options: ["did not do", "had not done", "has not done", "was not doing"],
  },
  {
    id: 15,
    text: "I _____ (read) the book before watching the movie.",
    correctAnswer: "had read",
    options: ["read", "had read", "have read", "was reading"],
  },
  {
    id: 16,
    text: "We _____ (leave) by the time they arrived.",
    correctAnswer: "had left",
    options: ["left", "had left", "was leaving", "have left"],
  },
  {
    id: 17,
    text: "They _____ (eat) all the food.",
    correctAnswer: "had eaten",
    options: ["ate", "had eaten", "have eaten", "was eating"],
  },
  {
    id: 18,
    text: "She _____ (not see) him before.",
    correctAnswer: "had not seen",
    options: ["did not see", "had not seen", "has not seen", "was not seeing"],
  },
  {
    id: 19,
    text: "I _____ (hear) the news before you told me.",
    correctAnswer: "had heard",
    options: ["heard", "had heard", "have heard", "was hearing"],
  },
  {
    id: 20,
    text: "They _____ (start) the meeting when we arrived.",
    correctAnswer: "had started",
    options: ["started", "had started", "have started", "was starting"],
  },
];
*/
const questions = [
  {
    id: 1,
    text: "Он был очень талантливо _____ (организова___ый) и спокойный.",
    correctAnswer: "организованный",
    options: ["организованый", "организованный", "арганизованный", "организонный"],
  },
  {
    id: 2,
    text: "Это была хорошо _____ (прожар___ая) котлета.",
    correctAnswer: "прожаренная",
    options: ["прожареная", "прожаренная", "прожареннаяя", "прожоренная"],
  },
  {
    id: 3,
    text: "Он выглядел утомлённо и сильно _____ (раздража___ый).",
    correctAnswer: "раздражённый",
    options: ["раздраженный", "раздражённый", "раздраённый", "раздражёненый"],
  },
  {
    id: 4,
    text: "На столе лежала _____ (сол___ая) рыба.",
    correctAnswer: "солёная",
    options: ["солёная", "соленная", "сольная", "соленая"],
  },
  {
    id: 5,
    text: "Ветер был не просто сильный, а _____ (ужа___ый).",
    correctAnswer: "ужасный",
    options: ["ужасный", "ужассный", "ужасеный", "ужасенний"],
  },
  {
    id: 6,
    text: "Нужно быть _____ (воспита___ым) и вежливым.",
    correctAnswer: "воспитанным",
    options: ["воспитаным", "воспитанным", "воспитонным", "воспитанный"],
  },
  {
    id: 7,
    text: "Она осталась _____ (непобеди___ой) до конца турнира.",
    correctAnswer: "непобедимой",
    options: ["непобедимой", "непобеденой", "непобедимой", "непабидимой"],
  },
  {
    id: 8,
    text: "Это был _____ (стекля___ый) сосуд.",
    correctAnswer: "стеклянный",
    options: ["стекляный", "стеклянный", "стеклянный", "стеклянныйи"],
  },
  {
    id: 9,
    text: "Это был тщательно _____ (обдума___ый) шаг.",
    correctAnswer: "обдуманный",
    options: ["обдуманный", "обдуманый", "абдуманный", "обдУманный"],
  },
  {
    id: 10,
    text: "У нас не было _____ (ожида___ых) новостей.",
    correctAnswer: "ожиданных",
    options: ["ожиданых", "ожиданных", "ожиданнных", "ожыданных"],
  },
  {
    id: 11,
    text: "Он прислал недавно _____ (написа___ое) письмо.",
    correctAnswer: "написанное",
    options: ["написанное", "написаное", "написонное", "напесанное"],
  },
  {
    id: 12,
    text: "Мы смотрели на _____ (запеча___ое) здание.",
    correctAnswer: "запечатанное",
    options: ["запечатанное", "запечатаное", "запечатанное", "запечатонное"],
  },
  {
    id: 13,
    text: "На полке лежала _____ (прочита___ая) книга.",
    correctAnswer: "прочитанная",
    options: ["прочитанная", "прочитаная", "прочитаннная", "прачитанная"],
  },
  {
    id: 14,
    text: "Мы нашли _____ (потеря___ое) кольцо.",
    correctAnswer: "потерянное",
    options: ["потеряное", "потерянное", "потирянное", "потеронное"],
  },
  {
    id: 15,
    text: "Это был тщательно _____ (спланирова___ый) проект.",
    correctAnswer: "спланированный",
    options: ["спланированный", "спланированый", "спланерованный", "сплонированный"],
  },
  {
    id: 16,
    text: "В воздухе стоял _____ (запеча___ый) аромат.",
    correctAnswer: "запечатлённый",
    options: ["запечатлённый", "запечатленный", "запечотлённый", "запечатлёненый"],
  },
  {
    id: 17,
    text: "Это было тщательно _____ (подготовле___ое) выступление.",
    correctAnswer: "подготовленное",
    options: ["подготовленное", "подготовлено", "падготовленное", "подготовленнное"],
  },
  {
    id: 18,
    text: "Он был явно _____ (расстро___).",
    correctAnswer: "расстроен",
    options: ["расстроен", "расстроенный", "расстроин", "расстронен"],
  },
  {
    id: 19,
    text: "На улице стояла _____ (замёрз___ая) вода.",
    correctAnswer: "замёрзшая",
    options: ["замёрзшая", "замерзшая", "замёршая", "замёрзшя"],
  },
  {
    id: 20,
    text: "Это был _____ (испечё___ый) хлеб.",
    correctAnswer: "испечённый",
    options: ["испечённый", "испечонный", "испечённый", "испечёный"],
  },
];

const questions2 = [
  { id: 21, number: 1, text: "Это была долго _____ (неопла___ая) работа.", correctAnswer: "неоплаченная", options: ["неоплаченая", "неоплаченная", "неоплатченная", "неоплащенная"] },
  { id: 22, number: 2, text: "Документ был _____ (незапо___енный) должным образом.", correctAnswer: "незаполненный", options: ["незаполненный", "незаполненый", "незаполенный", "незаполоненный"] },
  { id: 23, number: 3, text: "Он остался _____ (непотре___ым) и забытым.", correctAnswer: "непотреблённым", options: ["непотреблённым", "непотребленным", "непотрeблённым", "непатреблённым"] },
  { id: 24, number: 4, text: "Мы увидели недавно _____ (постро___ый) мост.", correctAnswer: "построенный", options: ["пастроенный", "построеный", "построенный", "пастроеный"] },
  { id: 25, number: 5, text: "Ребёнок был очень _____ (воспита___ый).", correctAnswer: "воспитанный", options: ["воспитаный", "воспитанный", "воспитеный", "воспитонный"] },
  { id: 26, number: 6, text: "Он чувствовал себя _____ (оскорбл___ым).", correctAnswer: "оскорблённым", options: ["оскарблённым", "оскорблённым", "оскарбленным", "аскорблённым"] },
  { id: 27, number: 7, text: "Это было строго _____ (запрещ___о).", correctAnswer: "запрещено", options: ["запрещено", "заприщено", "запрещенна", "запрещяно"] },
  { id: 28, number: 8, text: "Их приезд был заранее _____ (ожида___).", correctAnswer: "ожидаем", options: ["ожидаем", "ожыдаем", "ожидан", "ожидаэм"] },
  { id: 29, number: 9, text: "Ученик написал сочинение _____ (чита___о).", correctAnswer: "читабельно", options: ["читаемо", "читабильно", "читабельно", "читавельно"] },
  { id: 30, number: 10, text: "Это был хорошо _____ (выуч___ый) урок.", correctAnswer: "выученный", options: ["выученый", "выученный", "выучивший", "выученныйй"] },
  { id: 31, number: 11, text: "Проект был тщательно _____ (провер___).", correctAnswer: "проверен", options: ["проверен", "проверенный", "проверенн", "проверён"] },
  { id: 32, number: 12, text: "Бумаги были аккуратно _____ (слож___ы).", correctAnswer: "сложены", options: ["сложены", "сложенны", "сложеные", "сложины"] },
  { id: 33, number: 13, text: "Доклад был полностью _____ (подготовле___).", correctAnswer: "подготовлен", options: ["подготовлен", "подготовленный", "подготовленн", "падготовлен"] },
  { id: 34, number: 14, text: "Задача оказалась _____ (реш___ой).", correctAnswer: "решённой", options: ["решённой", "решеной", "решонной", "решённойй"] },
  { id: 35, number: 15, text: "Дом был недавно _____ (покра___).", correctAnswer: "покрашен", options: ["покрашен", "покрашенный", "покрашен", "покрашён"] },
  { id: 36, number: 16, text: "Документ был уже _____ (подпи___).", correctAnswer: "подписан", options: ["подписан", "подписанный", "подпесан", "падписан"] },
  { id: 37, number: 17, text: "Это было заранее _____ (преду___ено).", correctAnswer: "предусмотрено", options: ["предусмотрено", "предусмотренно", "предусмотрена", "предусмотронно"] },
  { id: 38, number: 18, text: "Отчёт был тщательно _____ (офор___).", correctAnswer: "оформлен", options: ["оформлен", "аформлен", "оформленный", "оформленн"] },
  { id: 39, number: 19, text: "Письмо было случайно _____ (потер___).", correctAnswer: "потеряно", options: ["потеряно", "потеренно", "потерено", "потиряно"] },
  { id: 40, number: 20, text: "Ответ был заранее _____ (подгото___).", correctAnswer: "подготовлен", options: ["подготовлен", "подготовленный", "падготовлен", "подготовленно"] },
];

const questions3 = [
  { id: 41, number: 1, text: "Он всегда был _____ (самоувер___) и настойчив.", correctAnswer: "самоуверен", options: ["самоуверен", "самоуверенный", "самоувереный", "самоуверен"] },
  { id: 42, number: 2, text: "Работа выполнена крайне _____ (небреж___).", correctAnswer: "небрежно", options: ["небрежно", "небрежноё", "небрежна", "небрежьно"] },
  { id: 43, number: 3, text: "Это был _____ (долгожда___ый) отпуск.", correctAnswer: "долгожданный", options: ["долгожданный", "долгожданый", "долгажданный", "долгождённый"] },
  { id: 44, number: 4, text: "Мы столкнулись с _____ (беспрецеде___ой) ситуацией.", correctAnswer: "беспрецедентной", options: ["беспрецедентной", "бесприцедентной", "беспрецедентной", "беспрецидентной"] },
  { id: 45, number: 5, text: "Это решение было _____ (обоснова___о).", correctAnswer: "обосновано", options: ["обосновано", "абосновано", "обасновано", "обоснованно"] },
  { id: 46, number: 6, text: "Он говорил очень _____ (увер___).", correctAnswer: "уверенно", options: ["уверено", "уверенно", "уверенна", "уверёно"] },
  { id: 47, number: 7, text: "Она чувствовала себя _____ (устав___).", correctAnswer: "уставшей", options: ["уставшей", "уставшой", "уставша", "уставенной"] },
  { id: 48, number: 8, text: "Письмо было написано _____ (аккурат___).", correctAnswer: "аккуратно", options: ["аккуратно", "аккуратна", "аккуратнно", "аккурат"] },
  { id: 49, number: 9, text: "Он смотрел _____ (печа___).", correctAnswer: "печально", options: ["печально", "печальна", "печалнно", "печаленно"] },
  { id: 50, number: 10, text: "Она ответила _____ (реши___).", correctAnswer: "решительно", options: ["решительно", "решитильно", "решытельно", "решетильно"] },
  { id: 51, number: 11, text: "Он действовал _____ (медле___).", correctAnswer: "медленно", options: ["медленно", "медленна", "медленнно", "медлено"] },
  { id: 52, number: 12, text: "Она улыбнулась _____ (дружелю___).", correctAnswer: "дружелюбно", options: ["дружелюбно", "дружелюбна", "дружолюбно", "дружелюбенно"] },
  { id: 53, number: 13, text: "Он подошёл _____ (тихо___).", correctAnswer: "тихонько", options: ["тихо", "тихонько", "тихонечко", "тихенёко"] },
  { id: 54, number: 14, text: "Мальчик говорил _____ (вежли___).", correctAnswer: "вежливо", options: ["вежливо", "вежлево", "вежливно", "вежлева"] },
  { id: 55, number: 15, text: "Он поступил _____ (прави___).", correctAnswer: "правильно", options: ["правильно", "правельно", "правилно", "правлина"] },
  { id: 56, number: 16, text: "Она смеялась _____ (звон___).", correctAnswer: "звонко", options: ["звонко", "звонка", "звонкоё", "звонько"] },
  { id: 57, number: 17, text: "Он выглядел _____ (увер___).", correctAnswer: "уверенно", options: ["уверенно", "уверенна", "уверённо", "уверонно"] },
  { id: 58, number: 18, text: "Она ответила _____ (спокой___).", correctAnswer: "спокойно", options: ["спокойно", "спокойна", "спакойно", "спокойноё"] },
  { id: 59, number: 19, text: "Они ждали _____ (терпели___).", correctAnswer: "терпеливо", options: ["терпеливо", "терпиливо", "терпиливно", "терпеливно"] },
  { id: 60, number: 20, text: "Он шёл _____ (быст___).", correctAnswer: "быстро", options: ["быстро", "быстра", "быстрo", "быстрон"] },
];

const questions4 = [
  { id: 61, number: 1, text: "Это был свеже _____ (скош___ый) луг.", correctAnswer: "свежескошенный", options: ["свежескошенный", "свежескошеный", "свежескощенный", "свежескошенний"] },
  { id: 62, number: 2, text: "На ужин подали _____ (запече___ое) мясо.", correctAnswer: "запечённое", options: ["запечённое", "запечонное", "запечёное", "запеченое"] },
  { id: 63, number: 3, text: "Это было _____ (вычи___ое) помещение.", correctAnswer: "вычищенное", options: ["вычищенное", "вычищеное", "вычещенное", "вычищанное"] },
  { id: 64, number: 4, text: "На столе стояла _____ (откры___ая) книга.", correctAnswer: "открытая", options: ["открытая", "открытаяя", "откртая", "аткрытая"] },
  { id: 65, number: 5, text: "Он выглядел _____ (растеря___ым) и грустным.", correctAnswer: "растерянным", options: ["растерянным", "растеряным", "растеряненым", "растеряный"] },
  { id: 66, number: 6, text: "Перед ними лежал _____ (слом___ый) меч.", correctAnswer: "сломанный", options: ["сломанный", "сломаный", "сломеный", "сломанныйй"] },
  { id: 67, number: 7, text: "Мы ели только что _____ (свари___ый) суп.", correctAnswer: "сваренный", options: ["сваренный", "свареный", "сварёный", "сваренныйй"] },
  { id: 68, number: 8, text: "В саду стояло _____ (посаж___ое) дерево.", correctAnswer: "посаженное", options: ["посаженное", "посажонное", "посажаное", "посоженное"] },
  { id: 69, number: 9, text: "Это был аккуратно _____ (улож___ый) кирпич.", correctAnswer: "уложенный", options: ["уложенный", "уложеный", "уложонный", "уложен"] },
  { id: 70, number: 10, text: "Перед входом висела _____ (повре___ая) табличка.", correctAnswer: "повреждённая", options: ["повреждённая", "поврежденая", "поврежёная", "повреждёная"] },
  { id: 71, number: 11, text: "На окне стоял _____ (забы___ый) цветок.", correctAnswer: "забытый", options: ["забытый", "забытыйй", "забыденный", "забытыйе"] },
  { id: 72, number: 12, text: "В лесу виднелся _____ (упав___ий) ствол.", correctAnswer: "упавший", options: ["упавший", "упавшый", "упавщый", "упавшиий"] },
  { id: 73, number: 13, text: "Он подарил _____ (высуш___ые) цветы.", correctAnswer: "высушенные", options: ["высушенные", "высушеные", "высушонные", "высушенны"] },
  { id: 74, number: 14, text: "Перед нами был _____ (перекра___ый) забор.", correctAnswer: "перекрашенный", options: ["перекрашенный", "перекрашеный", "перекрасшенный", "перекрашонный"] },
  { id: 75, number: 15, text: "Это было _____ (нарисо___ое) вручную полотно.", correctAnswer: "нарисованное", options: ["нарисованное", "нарисованое", "наресованное", "нарисонное"] },
  { id: 76, number: 16, text: "Перед школой стоял _____ (постро___ый) памятник.", correctAnswer: "построенный", options: ["построенный", "построеный", "пастроенный", "построенныйй"] },
  { id: 77, number: 17, text: "На столе лежало _____ (разрез___ое) яблоко.", correctAnswer: "разрезанное", options: ["разрезанное", "разрезаное", "разрезонное", "разрезеное"] },
  { id: 78, number: 18, text: "В шкафу висело _____ (погла___ое) платье.", correctAnswer: "поглаженное", options: ["поглаженное", "поглаженое", "поглажённое", "поглащенное"] },
  { id: 79, number: 19, text: "Он купил недавно _____ (сдела___ую) мебель.", correctAnswer: "сделанную", options: ["сделанную", "сделонную", "сделеную", "сделаная"] },
  { id: 80, number: 20, text: "Это было _____ (выши___ое) полотенце.", correctAnswer: "вышитое", options: ["вышитое", "вышитоее", "вышытое", "вышытоё"] },
];



app.get("/questions", (req, res) => {
  res.send(questions);
});
app.get("/questions2", (req, res) => {
  res.send(questions2);
});
app.get("/questions3", (req, res) => {
  res.send(questions3);
});
app.get("/questions4", (req, res) => {
  res.send(questions4);
});


app.post("/checkAnswer/:id", (req, res) => {
  const questionId = parseInt(req.params.id);
  const userAnswer = req.body.answer;
  
  const question =
    questions.find((q) => q.id === questionId) ||
    questions2.find((q) => q.id === questionId) ||
    questions3.find((q) => q.id === questionId) ||
    questions4.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  // 🧹 Нормализуем обе строки
  const normalize = (str) =>
    str.trim().toLowerCase().replace(/ё/g, "е");

  console.log({
  rawAnswer: req.body.answer,
  userAnswer: normalize(req.body.answer),
  correctAnswer: normalize(question.correctAnswer),
});


  const isCorrect = normalize(question.correctAnswer) === normalize(userAnswer);

  res.json({ isCorrect });
});


app.post("/mymark", async (req, res) => {
  //ANGULAY//
  const correctanswcount = req.body.correctansw;
  const incorrectanswcount = req.body.incorrectansw;

  const totalAnswers = correctanswcount + incorrectanswcount;
  const percentcorrect = totalAnswers > 0 ? correctanswcount / totalAnswers : 0;

  let mark = 0;
  if (percentcorrect >= 0.9) {
    mark = 5;
  } else if (percentcorrect >= 0.7) {
    mark = 4;
  } else if (percentcorrect >= 0.5) {
    mark = 3;
  } else {
    mark = 2;
  }

  //const user = db.find((x) => x.token === req.cookies.token);
  //const user = db.users.find((x) => x.token === req.cookies.token);

  ////const usersCollection = db.collection("users");
  ////const user = await usersCollection.findOne({ token: req.cookies.token });

  // console.log("ghbdtn",  req.cookies.token);


  //Временно убрана в связи с изменением функционала
  /*if (!user) {
    console.log("404");
    return res.status(404).send({ error: "User not found" });
  }*/


  //рабочий код, но временно не нужен
  /*  await usersCollection.updateOne(
    { token: req.cookies.token },
    { $set: { markpresentsimple: mark } }
  );*/

  // await SaveDb();

  res.send({ mark: mark });

  /*
  if(markTwo) {
    
    res.send({mark: 2})
    return
  } else if(markThree){

    res.send({mark: 3})
    return
  } else if(markFour){

    res.send({mark: 4})
    return
  } else if(markFive){

      res.send({mark: 5})
      return
  } */

  /*
  const markTwo = totalAnswers > 0 ? correctanswcount/totalAnswers < 0.5 : false;
  const markThree = totalAnswers > 0 ? (correctanswcount/totalAnswers >= 0.5 && correctanswcount/totalAnswers < 0.7 ) : false;
  const markFour = totalAnswers > 0 ? (correctanswcount/totalAnswers >= 0.7 && correctanswcount/totalAnswers < 0.9 ) : false;
  const markFive = totalAnswers > 0 ? correctanswcount/totalAnswers >= 0.9  : false;
 */
});

app.post("/logout", async (req, res) => {
  //console.log("вот ",req.headers.cookie)

  //  console.log('Headers:', req.headers);
  //    console.log('Cookies:', req.cookies);

  const token = req.cookies.token;
  //console.log("token:", token)

  //const user = db.users.find(x => x.token === token);
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ token: token });
  if (!user) {
    return res.json({ success: false });
  }

  //const user = db.find(x => x.token === token);

  //console.log("user:", user)
  //console.log("token-before:", token)

  //await SaveDb();
  //console.log("savedb")

  await usersCollection.updateOne({ token: token }, { $set: { token: "" } });
  res.clearCookie("token");
  res.json({ success: true });
});
  


app.get("/getrooms", async (req, res) => {
  const token = req.cookies.token;
  console.log("token", token);

//Функция исправна но временно отключена(
/*
  if (!token) {
    console.log("getrooms: !token, token:", token);
    res.send({ success: false });
  }*/

  //const user = db.find( x => x.token === token);

  //const user = db.users.find( x => x.token === token);
  //if (user.role === "teacher") {
  //  rooms = db.rooms.filter((room) => user.rooms.includes(room.id));
  //} else if (user.role === "student") {
  //  rooms = db.rooms.filter((room) => user.rooms.includes(room.id));
  //}

  //нижние 3 строки исправны но закрыты временно 
  //const usersCollection = db.collection("users");
  //const roomsCollection = db.collection("rooms");
 // const user = await usersCollection.findOne({ token: token });
  
//Функция исправна но временно отключена
  /*
  if (!user) {
    console.log("getrooms: user trouble");
    return res.send({ success: false });
  }
  */

  // if (user.role === "teacher") {
  //   rooms = Room.filter((room) => user.rooms.includes(room.id));
  // } else if (user.role === "student") {
  //   rooms = Room.filter((room) => user.rooms.includes(room.id));
  //}

  //Функция исправна но временно отключена
  /*
  const rooms = await roomsCollection
    .find({ id: { $in: user.rooms } })
    .toArray();
*/

  //let rooms;
  //if (user.role === "teacher" || user.role === "student") {
  //  rooms = await Room.find({ id: { $in: user.rooms } });
  //}

  /*
 console.log("user",user)

if(!user){
  console.log("getrooms: user trouble", user)
  res.send({success: false})
}

//const userRooms = db.rooms.filter((room) => user.rooms.includes(room.id));
//const userRooms = db.rooms.filter((room) => user.rooms.includes(room.id));
 // const rooms = user.rooms;
 if (user.role === "teacher") {
  rooms = db.rooms.filter((room) => user.rooms.includes(room.id));
} else if (user.role === "student") {
  rooms = user.rooms;
}
 //const rooms = db.rooms;
 console.log("rooms",rooms)

  // if (!userRooms) {
    //userRooms = [];
  //}


//const rooms = userRooms;



//console.log(rooms)

  res.send({ rooms });*/
});

app.post("/postroom", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("postroom: !token, token:", token);
    res.send({ success: false });
  }

  console.log("postroom token", token);

  // const user = db.find( x => x.token === token);

  //const user = db.users.find( x => x.token === token);
  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");
  const user = await usersCollection.findOne({ token: token });

  if (!user) {
    console.log("postroom: user trouble", user);
    res.send({ success: false });
  }
  console.log("postroom user", user);

  //const rooms = user.rooms;
  /*
if (!user.rooms) {
  rooms = [];
}*/


  const newRoomName = req.body.newRoomName;
  const newRoom = {
    id: Date.now(),
    name: newRoomName,
    students: [],
    homework: [],
  };

  await roomsCollection.insertOne(newRoom);
  await usersCollection.updateOne(
    { token: token },
    { $push: { rooms: newRoom.id } }
  );
  //user.rooms.push(newRoom);
  //db.rooms.push(newRoom);

  const updatedUser = await usersCollection.findOne({ token: token });
  
  const rooms = await roomsCollection
    .find({ id: { $in: updatedUser.rooms } })
    .toArray();
  //user.rooms.push(newRoom.id);

  //SaveDb();

  console.log(rooms);

  res.send({ rooms });
});

app.delete("/delroom", async (req, res) => {
  const token = req.cookies.token;
  const roomId = req.body.room.id;
  //const user = db.find(x => x.token === token);
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ token: token });

  //user.rooms = user.rooms.filter((room) => room.id !== roomId);
  await usersCollection.updateOne(
    { token: token },
    { $pull: { rooms: roomId } }
  );

  const updatedRooms = await db
    .collection("rooms")
    .find({ id: { $in: user.rooms.filter((id) => id !== roomId) } })
    .toArray();
  //SaveDb();

  res.json({ success: true, rooms: updatedRooms });
});

app.post("/changern", async (req, res) => {
  const token = req.cookies.token;
  const roomId = req.body.room.id;
  const changedName = req.body.changeRoomName;
  //const user = db.find(x => x.token === token);
  //const user = db.users.find(x => x.token === token);
  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");
  const user = await usersCollection.findOne({ token: token });
  if (!user) {
    return res.send({ success: false });
  }

  console.log("новое имя", changedName);

  //const room = user.rooms.findIndex(room => room.id === roomId);

  //const userRooms = db.rooms.filter((room) => user.rooms.includes(room.id));
  //const userRooms = await Room.filter((room) => user.rooms.includes(room.id));
  //const userRooms = await Room.find({ id: { $in: user.rooms } });

  //const room = userRooms.findIndex(room => room.id === roomId);
  const room = await roomsCollection.findOne({ id: roomId });
  if (!room || !user.rooms.includes(roomId)) {
    return res.send({ success: false });
  }

  console.log("комната", room);

  //user.rooms[room].name = changedName;

  //db.rooms[room].name = changedName;
  await roomsCollection.updateOne(
    { id: roomId },
    { $set: { name: changedName } }
  );

  const userRooms = await roomsCollection
    .find({ id: { $in: user.rooms } })
    .toArray();

  console.log("замененное имя", db.rooms[room].name);

  //SaveDb();


  res.json({ success: true, rooms: userRooms /*user.rooms*/ });
});

app.post("/addhomework", async (req, res) => {
  const token = req.cookies.token;
  //const user = db.find(x => x.token === token);
  //const user = db.users.find(x => x.token === token);
  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");
  const user = await usersCollection.findOne({ token: token });

  if (!user) {
    return res.send({ success: false, message: "User not found" });
  }
  const roomId = req.body.room.id;
  console.log("addhomework roomId:", roomId);
  //const room = user.rooms.find(room => room.id === Number(roomId));

  // const room = db.rooms.find(room => room.id === Number(roomId));
  const room = await roomsCollection.findOne({ id: Number(roomId) });

  console.log("addhw room:", room);

  const randomNumber = Math.floor(Math.random() * 1000);

  const newHomework = {
    id: Date.now(),
    name: `homework ${randomNumber}`,
    exercises: [],
    status: "",
  };

  if (!Array.isArray(room.homework)) {
    room.homework = [];
  }

  await roomsCollection.updateOne(
    { id: Number(roomId) },
    { $push: { homework: newHomework } }
  );
  //room.homework.push(newhomework);

  console.log("is pushed");

  //SaveDb();
  const updatedRoom = await roomsCollection.findOne({ id: Number(roomId) });
  res.send({ homework: updatedRoom.homework });
});

app.get("/gethomework", async (req, res) => {
  //const token = req.cookies.token;
  const roomId = Number(req.query.roomId);

  if (!roomId) {
    return res.status(400).send({ success: false, message: "roomId is required" });
  }
  //console.log("roomId", roomId)
  //const user = db.find(x => x.token === token);
  //const user = db.users.find(x => x.token === token);
  //const room = user.rooms.find(room => room.id === Number(roomId));
  //const room = db.rooms.find(room => room.id === Number(roomId));
  const roomsCollection = db.collection("rooms");
  const room = await roomsCollection.findOne({ id: roomId });
  if (!room) {
    res.send({ success: false });
  }
  //console.log("room^", room)
  /*const homework = room.homework;
const status = homework.status;

let statuss = "";

if(status === "completed"){
  statuss = true;
}else{
 statuss = false;
}

if (!Array.isArray(homework)) {
  homework= []; 
}

console.log("homework",homework)

res.send({homework: homework, statuss})
//*/
  const homework = room.homework || [];
  res.send({
    homework: homework,
    statuss: Array.isArray(homework) ? homework.map((hw) => hw.status === "completed") : [], // Массив статусов для каждой домашки
  });
});

app.post("/teacheraddhomework", async (req, res) => {
  const token = req.cookies.token;
  const { roomId, thehomeworkId, exercizeBlock } = req.body;
  // const user = db.find((x) => x.token === token);
  //const user = db.users.find((x) => x.token === token);
  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");
  const user = await usersCollection.findOne({ token: token });
  
  if (!user) {
    return res.send({ success: false, message: "User not found" });
  }
  //const room = user.rooms.find((room) => room.id === Number(roomId));
  //const room = db.rooms.find((room) => room.id === Number(roomId));
  const room = await roomsCollection.findOne({ id: Number(roomId) });
  
  if (!room) {
    return res.send({ success: false, message: "Room not found" });
  }

  const homework = room.homework.find((hw) => hw.id === Number(thehomeworkId));
  if (!homework) {
    return res.send({ success: false, message: "Homework not found" });
  }

  const updatedExercises = homework.exercises.concat(exercizeBlock);
  await roomsCollection.updateOne(
    { id: Number(roomId), "homework.id": Number(thehomeworkId) },
    { $set: { "homework.$.exercises": updatedExercises, "homework.$.status": status } }
  );

  const updatedRoom = await roomsCollection.findOne({ id: Number(roomId) });
  const updatedHomework = updatedRoom.homework.find(
    (hw) => hw.id === Number(thehomeworkId)
  );

  console.log("homework", homework);
  //const status = req.body.status;

  //console.log("statuSs:", status);

  //console.log('homework:', homework)

  //if (!Array.isArray(homework.exercises)) {
  //  homework.exercises = [];
  //}
//
  //homework.exercises.push(...exercizeBlock);
  //homework.status = status;
  //SaveDb();

  console.log("saved");

  res.send({ success: true, message: "Упражнения добавлены", homework: updatedHomework });
});

app.get("/getexercisesforseparatehomework", async (req, res) => {
  // const token = req.cookies.token;
  // const user = db.find((x) => x.token === token);
  //const user = db.users.find((x) => x.token === token);

  const thehomeworkId = req.query.thehomeworkId;

  console.log("thehomeworkId:", thehomeworkId);

  const roomId = req.query.roomId;

  console.log("roomId:", roomId);

  // const room = user.rooms.find((room) => room.id === Number(roomId));
  //const room = db.rooms.find((room) => room.id === Number(roomId));

  const roomsCollection = db.collection("rooms");
  const room = await roomsCollection.findOne({ id: roomId });
  
  if (!room) {
    return res.send({ success: false });
  }

  const homework = room.homework.find((hw) => hw.id === Number(thehomeworkId));
  if (!homework) {
    return res.send({ success: false });
  }
  const status = homework.status;

  console.log("homework:", homework);

  const exercises = Array.isArray(homework.exercises) ? homework.exercises : [];

  res.send({ exercises, status });
});

app.post("/addstudenttoroom", async (req, res) => {
  const token = req.cookies.token;
  //const user = db.find((x) => x.token === token);
  //const user = db.users.find((x) => x.token === token);
  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");
  const user = await usersCollection.findOne({ token: token });

  if (!user) {
    return res.json({ success: false, message: "Пользователь не найден" });
  }

  const studentId = Number(req.body.studentId);
  const roomId = Number(req.body.roomId);

  //const student = db.find(user => user.role === "student" && user.id === studentId);
  //const student = db.users.find(user => user.role === "student" && user.id === studentId);
  //const student = await User.find(user => user.role === "student" && user.id === studentId);
  const student = await usersCollection.findOne({
    role: "student",
    id: studentId,
  });
  const room = await roomsCollection.findOne({ id: roomId });

  //console.log("roomidddd",roomId)

  //const room = user.rooms.find(room => room.id === Number(roomId));
  //const room = db.rooms.find(room => room.id === Number(roomId));

  if (!room) {
    return res.json({ success: false, message: "Комната не найдена" });
  }

  if (room.students.includes(studentId)) {
    return res.json({ success: false, message: "Студент уже в комнате" });
  }

  if (student) {
    room.students.push(studentId);
  } else {
    return res.json({
      success: false,
      message: "Студента не существует с таким id",
    });
  }

  //student.rooms.push(room);
  //room.students.push(studentId);
  await roomsCollection.updateOne(
    { id: roomId },
    { $push: { students: studentId } }
  );
  await usersCollection.updateOne(
    { id: studentId },
    { $push: { rooms: roomId } }
  );
  //SaveDb();

  res.json({ success: true, message: "Студент добавлен в комнату" });
});

app.post("/checkhomework", async (req, res) => {
  const { roomId, homeworkId, answers } = req.body;
  //const room = db.rooms.find((r) => r.id === Number(roomId));
  const roomsCollection = db.collection("rooms");
  const usersCollection = db.collection("users");
  const room = await roomsCollection.findOne({ id: Number(roomId) });
  
  if (!room) {
    return res.send({ success: false, message: "Room not found" });
  }
  const homework = room.homework.find((hw) => hw.id === Number(homeworkId));
  if (!homework) {
    return res.send({ success: false, message: "Homework not found" });
  }
  const token = req.cookies.token;
  //const user = db.users.find((x) => x.token === token);
  const user = await usersCollection.findOne({ token: token });
  
  if (!user) {
    return res.send({ success: false, message: "User not found" });
  }

  let score = 0;
  let total = 0;

  homework.exercises.forEach((exercise, exerciseIndex) => {
    exercise.inputs.forEach((input, inputIndex) => {
      if (input.type === "radio" || input.type === "word") {
        total++;
        const studentAnswer = answers[exerciseIndex]?.[inputIndex];
        if (studentAnswer === input.correctAnswer) {
          score++;
        }
      }
    });
  });
  const grade = (score / total) * 100;

  const gradeEntry = `${homework.name}: ${grade}`;

  if (!user.grades) {
    user.grades = [gradeEntry];
  } else {
    if (!Array.isArray(user.grades)) {
      user.grades = [user.grades];
    }
    user.grades.push(gradeEntry);
  }

  //SaveDb();
  await usersCollection.updateOne(
    { token: token },
    { $push: { grades: gradeEntry } }
  );

  res.send({ success: true, grade });
});

app.get("/getinfo", async (req, res) => {
  const thehomeworkid = req.query.thehomeworkid;
  const token = req.cookies.token;
  //const user = db.users.find((x) => x.token === token);
  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");
  const user = await usersCollection.findOne({ token: token });
  
  console.log("userrrrrrrrrrrrrrrr:", user.role, user.id);

  // Проверяем, что запрос делает учитель
  if (!user || user.role !== "teacher") {
    return res.status(403).send({ success: false, message: "Unauthorized" });
  }

  // Находим комнату и домашку по thehomeworkid
  /*let targetRoom, homework;
  {db.rooms}       Room.find.forEach((room) => {
    const foundHw = room.homework.find((hw) => hw.id === Number(thehomeworkid));
    if (foundHw) {
      targetRoom = room;
      homework = foundHw;
    }
  });*/

  const rooms = await roomsCollection.find().toArray();
  
  let targetRoom, homework;
  rooms.forEach((room) => {
    const foundHw = room.homework.find((hw) => hw.id === Number(thehomeworkid));
    if (foundHw) {
      targetRoom = room;
      homework = foundHw;
    }
  });

  console.log("homeworkkkkkkkkkkkk:", homework);

  if (!homework) {
    return res
      .status(404)
      .send({ success: false, message: "Homework not found" });
  }

  // Находим учеников комнаты, у которых есть оценка за эту домашку
  /*const studentsWithGrades = User                                                     //db.users
    .filter((u) => u.role === "student" && targetRoom.students.includes(u.id))
    .map((student) => {
      const gradeEntry = student.grades?.find((g) => g.startsWith(`${homework.name}:`));
      if (gradeEntry) {
        const grade = gradeEntry.split(": ")[1];
        return { email: student.email, grade };
      }
      return null;
    })
    .filter((entry) => entry !== null);*/

    const studentsWithGrades = (
      await usersCollection
        .find({ role: "student", id: { $in: targetRoom.students } })
        .toArray()
    )
      .map((student) => {
        const gradeEntry = student.grades?.find((g) =>
          g.startsWith(`${homework.name}:`)
        );
      if (gradeEntry) {
        const grade = gradeEntry.split(": ")[1];
        return { email: student.email, grade };
      }
      return null;
    })
    .filter((entry) => entry !== null);

  res.send({ success: true, students: studentsWithGrades });
});

/*app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});*/
