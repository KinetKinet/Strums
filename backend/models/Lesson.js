import mongoose from 'mongoose';

const { Schema } = mongoose;

const LessonSchema = new Schema({
  chapter: { type: Number, required: true, unique: true },
  tag: String,
  title: String,
  description: String,
  data: { type: Schema.Types.Mixed },
  videoUrl: String,
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', LessonSchema);
export default Lesson;
