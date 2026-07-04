import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=>{console.log("Database connected successfully")})

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';

        if(!mongodbURI){
            throw new Error("MONGODB_URI environment variable not set")
        }

        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0, -1)
        }


        let connectString = mongodbURI;
        const hasQuery = mongodbURI.includes('?')
        const hasDbPath = /\/.+/.test(mongodbURI.replace('mongodb+srv://', '').replace('mongodb://', ''))

        if (!hasQuery && !hasDbPath) {
            connectString = `${mongodbURI}/${projectName}`
        }

        // Try normal connection first
        try {
            await mongoose.connect(connectString)
        } catch (err) {
            console.error('Initial MongoDB connection failed:', err.message || err)

            // If the failure appears SSL/TLS related, retry with an insecure TLS fallback
            const isTLSError = (err && err.message && /SSL|TLS|tls/i.test(err.message)) || (err && err.code && /SSL|TLS|ERR_SSL/i.test(String(err.code)))
            if (isTLSError) {
                console.warn('Detected SSL/TLS error connecting to MongoDB. Retrying with tlsAllowInvalidCertificates=true (insecure fallback)')
                try {
                    await mongoose.connect(connectString, {
                        tls: true,
                        tlsAllowInvalidCertificates: true,
                        tlsAllowInvalidHostnames: true,
                    })
                    console.warn('Connected to MongoDB with insecure TLS fallback. This is NOT recommended for production.')
                    return
                } catch (err2) {
                    console.error('Retry with insecure TLS failed:', err2.message || err2)
                    throw err2
                }
            }

            // rethrow original error if not TLS-related
            throw err
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        throw error
    }
}

export default connectDB;