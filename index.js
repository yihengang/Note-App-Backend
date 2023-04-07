const express = require("express");
const cors = require("cors");
let app = express();

app.use(cors());

const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(requestLogger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World</h1>");
// });

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => {
    return note.id === id;
  });
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = `Note ${id} is not found`;
    response.status(404).end();
  }
});

app.post("/api/notes", (request, response) => {
  const plusOneID = () => {
    const maxId =
      notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
    return maxId + 1;
  };
  //take new note from request.body
  const noteFromBody = request.body;

  if (!noteFromBody.content) {
    return response.status(400).json({ error: "content missing" });
  }

  //make a new note
  const newNote = {
    id: plusOneID(),
    content: noteFromBody.content,
    important: noteFromBody.important || false,
  };
  //new note must have 1) id + 1, 2) content, if not content return 404, don't make a new note 3) important, which defaults to false
  // send new note to response.json(note)
  // add it to the notes
  notes = notes.concat(newNote);

  response.json(newNote);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
