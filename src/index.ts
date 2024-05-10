import express from "express";
import prisma from "./db";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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

app.post("/api/v1/user", async (req, res) => {
  const { email, userName } = req.body;

  try {
    const user = await prisma.data.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User Already Exists" });
    }
    await prisma.data.create({
      data: {
        email,
        userName,
      },
    });
    res.cookie("id", user.id);

    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/:questionId", async (req, res) => {
  const { code } = req.body;
  const questionId = req.params.questionId;
  const { id } = req.cookies;

  try {
    await prisma.data.update({
      where: {
        id,
      },
      data: {
        [getQuestionField(questionId)]: code,
      },
    });

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
