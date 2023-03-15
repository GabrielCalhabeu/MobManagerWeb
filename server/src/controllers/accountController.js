const account = require("../models/accounts");

module.exports = {
  async auth(request, response) {
    const { user, password } = request.body;
    const login = await account.findOne({ user, password });
    if (login != null) {
      return response.json(login);
    } else {
      return response.status(401).json({ error: "Invalid Credentials" });
    }
  },

  async create(request, response) {
    const { user, password } = request.body;
    const newUser = user;
    if (!user || !password) {
      return response
        .status(400)
        .json({ error: "No user or password being sent" });
    }
    if ((existingUser = await account.findOne({ user }))) {
      return response.status(401).json({ error: "User already exists" });
    }
    const accountCreated = await account.create({ user, password });
    return response.json(accountCreated);
  },

  async delete(request, response) {
    const { id } = request.params;

    const accountDeleted = await account.findByIdAndDelete(id);

    if (accountDeleted) {
      return response.json(accountDeleted);
    }

    return response.status(400).json({ error: "id not found" });
  },
};
