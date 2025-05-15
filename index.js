const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "message.txt");

const fsPromises = async () => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    console.log(data);

    await fs.appendFile(filePath, "\ntest three");
    console.log("File appended successfully");

    const stats = await fs.stat('practice.txt')
    await fs.unlink('index.html')

  } catch (err) {
    console.log(err);
  }
};

fsPromises();