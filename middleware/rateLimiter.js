
const client = require('../redis.client')

const rateLimiter = async(req,res,next)=>{
    try{
const userId = req.body.userId;
      const currentTime = Date.now();
      const userRateLimitKey = `minute-limit:${userId}`;
      const userSecondLimitKey = `second-limit:${userId}`;

      // Fetch user requests in the past minute
      const recentRequests = await client.zRangeByScore(userRateLimitKey, currentTime - 60000, currentTime);

      // Enforce rate limits
      if (recentRequests.length >= 2) {
        //adding to queue for wait
        await client.lPush('taskQueue', JSON.stringify({ userId }));
        return res.status(429).json({ message: 'Rate limit exceeded, task queued' });
      }

      const secondLimit = await client.exists(userSecondLimitKey);
      if (secondLimit) {
        //adding to queue for wait
        await client.lPush('taskQueue', JSON.stringify({ userId }));
        return res.status(429).json({ message: 'Rate limit exceeded, task queued' });
      }

    //   console.log(`Processing the request of user ${userId}`);

      //add in sorted set
      await client.zAdd(userRateLimitKey, { score: currentTime, value: `${currentTime}` });
      // Expire after 1 minute
      await client.expire(userRateLimitKey, 60); 
      //Add a key-value pair with 1 second expire timer
      await client.set(userSecondLimitKey, '1', { EX: 1 });
      next()
    }catch(err){
     console.log(err);
        
    }
      
}

module.exports = {rateLimiter}