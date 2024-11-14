const client = require("../redis.client");
const { logToFile } = require("../utils/loging.system");


const processQueue = async()=>{
  try{
    const taskData = await client.rPop('taskQueue');

    if (taskData) {
      //converting from string to JSON
      const task = JSON.parse(taskData);
      const { userId } = task;
      const currentTime = Date.now();
      const userRateLimitKey = `minute-limit:${userId}`;
      const userSecondLimitKey = `second-limit:${userId}`;

      // Check the rate limits for this user
      const recentRequests = await client.zRangeByScore(userRateLimitKey, currentTime - 60000, currentTime);
      const secondLimitExists = await client.exists(userSecondLimitKey);

      if (recentRequests.length < 2 && !secondLimitExists) {
        // Update rate limiting keys as this task will be processed
        await client.zAdd(userRateLimitKey, { score: currentTime, value: `${currentTime}` });
        await client.set(userSecondLimitKey, '1', { EX: 1 });

        // Process the task
        // console.log(`Processing delayed task for user ${userId}`);
        logToFile(`proccess of userId - ${userId} is successfully processed`)
        // (Place additional task logic here as needed)

      } else {
        // Re-queue the task if the rate limit is still exceeded
        await client.lPush('taskQueue', JSON.stringify({userId}));
      }
    }
  }catch(err){
    console.log(err);
    
  }
     //getting value from queue from right
    
}

module.exports = processQueue