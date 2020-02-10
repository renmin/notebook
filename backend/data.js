const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
        id: Number,
        message: String
    },
    { timestamps: true }
);

// 返回Schema
module.exports = mongoose.model("Data", DataSchema);