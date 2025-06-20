import ratelimit from "../config/upstash.js";


const rateLimiter = async (req, res, next) => {

  try {
    const {success} = await ratelimit.limit("my-rate-limit"); //can use any identifier here, like user ID, so that the limit depends on each user
    if (!success) {
      return res.status(429).json({ 
        message: "Too many requests, please try again later." 
    });
    }
    next();

  } catch (error) {
    console.error("Rate limiter error:", error);
    next(error);
  }
};

export default rateLimiter;

