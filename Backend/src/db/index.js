import mongoose from 'mongoose';

export const connectDB =  async function () {
    try {
        const promise = await mongoose.connect(`${process.env.MONGODB_URI}`)
          console.log(`MONGODB_URI : `, promise.connections[0]._connectionString);
        return promise
    } catch (error) {
          process.exit(1)
    }
}
