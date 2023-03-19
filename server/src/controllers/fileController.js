const savefiles = require("../models/file");

module.exports = {
  async read(request, response) {
    const { user } = request.query;

    const filesFound = await savefiles.findOne({ user });
    if (filesFound == null) {
      return response.status(404).json({ error: "No files found" });
    }
    return response.json(filesFound);
  },

  async create(request, response) {
    const { user, title, file } = request.body;

    if (!user) {
      return response
        .status(400)
        .json({ erro: "No such user found or bad syntax" });
    }
    let fileSaved;
    if (
      !(fileSaved = await savefiles.findOneAndReplace(
        { user },
        { user, title, file }
      ))
    ) {
      fileSaved = await savefiles.create({ user, title, file });
    }

    //const fileCreated = await savefiles.create({ user, title, file });
    return response.json(fileSaved);
  },

  async delete(request, response) {
    const { user } = request.query;
    const fileDeleted = await savefiles.findOneAndDelete({ user: user });

    if (fileDeleted) {
      return response.json(fileDeleted);
    }

    return response.status(404).json({ error: "file not found" });
  },

  async update(request, response) {
    const { id } = request.params;
    const { user, title, file } = request.body;
    const fileUpdated = await savefiles.findByIdAndUpdate(
      id,
      { title, file },
      { new: true }
    );
    return response.json(fileUpdated);
  },
};
