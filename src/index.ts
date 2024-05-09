import express from "express";
import prisma from "./db";

const app = express();

app.use(express.json());

function getQuestionField(questionId: string) {
  switch (questionId) {
    case "1":
      return "question1";
    case "2":
      return "question2";
    default:
      throw new Error(`Invalid questionId: ${questionId}`);
  }
}

app.get("/api/v1/:questionId", async (req, res) => {
  const { code } = req.body;
  const questionId = req.params.questionId;
  const { email, userName } = req.cookies;

  try {
    const dataTransaction = await prisma.$transaction(async (prisma) => {
      const data = await prisma.data.findFirst({
        where: {
          email,
        },
      });
      if (data) {
        await prisma.data.update({
          where: {
            id: data.id,
          },
          data: {
            userName,
            email,
            [getQuestionField(questionId)]: code,
          },
        });
      } else {
        await prisma.data.create({
          data: {
            userName,
            email,
            [getQuestionField(questionId)]: code,
          },
        });
      }

      return true;
    });

    if (!dataTransaction) {
      return res.status(500).json({ message: "Something went wrong" });
    }

    res.status(201).json({ message: "Submitted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
