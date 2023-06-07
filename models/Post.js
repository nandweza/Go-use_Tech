const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        blogimg: { type: String },
        content: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);
