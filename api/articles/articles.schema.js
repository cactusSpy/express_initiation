const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: String,
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

let Article;

module.exports = Article = model("Article", articleSchema);

//////
// async function test() {
//   try {
//     const articles = await Article.find().populate({
//       path: "user",
//       select: "-password",
//       match: { name: /ben/i },
//     });

//     if (Array.isArray(articles)) {
//       console.log(articles.filter((article) => article.user));
//     } else {
//       console.log("Aucun article trouvé");
//     }
//   } catch (error) {
//     console.error("Error articles:", error);
//   }
// }

// test();
//////