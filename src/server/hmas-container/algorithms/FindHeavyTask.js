/**
 * FIND MAXIMUM EXECUTION ALGORITHM
 *
 * Runs algorithm with given parameters
 * ALGORITHMS PHASES
 * PHASE 1 - Sort tasks according their estimated_time (longest first) and choose only tasks whose start_date has started and that are not completed
 * PHASE 2 - Pick holons whose is_available field is true and whose availability_data's currentValue is between 1 and 0
 * PHASE 3 - Create a clone for each holon
 * PHASE 4 - Validation check
 * PHASE 5 - Pick a task from the bottom of the list
 * PHASE 6 - Call findBestMatch function to find suitable holons for the picked task
 * After finding best possible holons, the algorithm allocates holons according to their priorities
 * @param {array} tasks tasks related to allocation - constraints: should not be empty
 * @param {array} holons holons related to allocation - constraints: should not be empty
 * @return {JSON} result with either error field or allocations array field (each element must be an object with two fields: taskId (array) and holonIds (array))
 */
 export const run = (tasks, holons) => {
    try {
      // PHASE 1
      sortTasksEstimatedTime(tasks);
      const sortedTasks = tasks.filter((task) => {
        if (task.is_completed) return false;
        if (task.start_date) {
          if (task.start_date - new Date() < 0) return true;
          else return false;
        } else return true;
      });
  
      // PHASE 2
      const availableHolons = holons.filter((i) => {
        if (
          i.is_available === true &&
          i.availability_data.currentValue >= 0 &&
          i.availability_data.currentValue < 1 &&
          typeof i.daily_work_hours === 'number' &&
          i.daily_work_hours > 0
        )
          return true;
        else return false;
      });
      // PHASE 3
      const clonedHolons = cloneHolons(availableHolons);
      // PHASE 4
      if (availableHolons.length === 0) throw new Error(1);
      if (sortedTasks.length === 0) throw new Error(0);
      // PHASE 5 and 6
      const allocations = [];
      for (let i = 0; i < sortedTasks.length; i++) {
        const allocation = findBestMatch(sortedTasks[i], clonedHolons);
        if (allocation) allocations.push(allocation);
      }
      return JSON.stringify({ allocations });
    } catch (err) {
      // err.message === 0 means no tasks available
      if (err.message === (0).toString()) {
        return JSON.stringify({ error: "HMAS couldn't run algorithm due to lack of allocable tasks" });
      }
      // err.message === 1 means no holons are available
      else if (err.message === (1).toString()) {
        return JSON.stringify({ error: "HMAS couldn't run algorithm due to lack of available holons" });
      }
      // other values means unexpected error occured
      else {
        return JSON.stringify({ error: "HMAS couldn't run algorithm due to unexpected error" });
      }
    }
  };
  
  /**
   * Sort tasks according to their estimated_time
   * Tasks with higher estimated_time are moved to the end of line
   * @param {array} tasks tasks to be sorted
   */
  export const sortTasksEstimatedTime = (tasks) => {
    tasks.sort((a, b) => {
      let response = 0;
      if (a.estimated_time === null && b.estimated_time !== null) response = 1;
      else if (a.estimated_time !== null && b.estimated_time === null) response = -1;
      else if (a.estimated_time === b.estimated_time) response = 0;
      else if (a.estimated_time < b.estimated_time) response = -1;
      else if (a.estimated_time > b.estimated_time) response = 1;
      return response;
    });
    tasks.reverse();
  };
  
  /**
   * Creates an array and fills it with clones
   * Each clone has all properties of its original holon except latest_state property:
   * @param {array} holons
   * @return {ərray} clonedHolons
   */
  export const cloneHolons = (holons) => {
    return holons.map((holon) => {
      const clonedHolon = {
        ...holon,
        availability_data: { ...holon.availability_data },
        cost_data: { ...holon.cost_data },
        load_data: { ...holon.load_data },
        stress_data: { ...holon.stress_data },
      };
      return clonedHolon;
    });
  };
  
  /**
   * Sorts holons according to criteria
   * There are only two supported criterias: availability_data and cost_data
   * @param {array} holons
   * @param {string} criteria
   */
  export const sortHolons = (holons, criteria) => {
    if (!['availability_data', 'cost_data'].includes(criteria)) return;
    holons.sort((a, b) => {
      if (a[criteria] === null && b[criteria] !== null) return -1;
      else if (a[criteria] !== null && b[criteria] === null) return 1;
      else if (a[criteria] === null && b[criteria] === null) return 0;
      else if (a[criteria]['currentValue'] === b[criteria]['currentValue']) return 0;
      else if (a[criteria]['currentValue'] > b[criteria]['currentValue']) return 1;
      else if (a[criteria]['currentValue'] < b[criteria]['currentValue']) return -1;
    });
  };
  
  /**
   * Sorts holons according to demands
   * @param {object} task
   * @param {array} holons
   */
  export const sortByDemands = (task, holons) => {
    holons.sort((a, b) => {
      const aScore = getDemandScore(task, a);
      const bScore = getDemandScore(task, b);
      if (aScore === bScore) return 0;
      else if (aScore > bScore) return 1;
      else if (aScore < bScore) return -1;
    });
    holons.reverse();
  };
  
  /**
   * Calculates a demand score for the holon based on the demands of the task
   * @param {object} task
   * @param {object} holon
   * @returns number - 0 if calculation fails
   */
  export const getDemandScore = (task, holon) => {
    try {
      let score = 0;
      // Holon related properties
      let knowledgeTags = [];
      let issues = [];
      let type = holon.type.toLowerCase();
      let experienceYears = holon.experience_years;
  
      // Task related properties
      let demandedKnowledgeTags = [];
      let demands = [];
      if (Array.isArray(task.knowledge_tags?.tags) && task.knowledge_tags?.tags.length > 0) demandedKnowledgeTags = task.knowledge_tags.tags.map((i) => i.toLowerCase());
      if (Array.isArray(task.resource_demand?.demands) && task.resource_demand?.demands.length > 0)
        demands = task.resource_demand.demands.map((i) => {
          if (i[0]) i[0] = i[0].toLowerCase();
          if (i[2]) i[2] = i[2].map((i) => i.toLowerCase());
          return i;
        });
  
      // Extract knowledge tags and issues from the holon's graphRecords
      if (Array.isArray(holon.graphRecords)) {
        holon.graphRecords.forEach((record) => {
          const node = record.get(0);
          const relations = record.get(1);
          const target = record.get(2);
  
          if (relations.length === 1 && relations[0].type.toLowerCase() === 'knows') {
            if (target.properties.name) knowledgeTags.push(target.properties.name);
          }
  
          if (relations.length === 1 && relations[0].type.toLowerCase() === 'has' && target.labels[0].toLowerCase() === 'issue') {
            if (target.properties.name) issues.push(target.properties.name);
          }
        });
      }
  
      // Return 0 if holon has no knowledge tags or issues OR the task has no demands
      if ((knowledgeTags.length === 0 && issues.length === 0) || (demandedKnowledgeTags.length === 0 && demands.length === 0)) {
        return 0;
      }
  
      if (demandedKnowledgeTags.length > 0) {
        let ktScoreUnit = 1 / demandedKnowledgeTags.length;
        demandedKnowledgeTags.forEach((i) => {
          if (knowledgeTags.includes(i)) score += ktScoreUnit;
        });
      }
  
      if (demands.length > 0) {
        let dScoreUnit = 1;
        demands.forEach((demand) => {
          if (!Array.isArray(demand) || demand.length !== 3) return;
          if (demand[0] && type && demand[0] === type) score += dScoreUnit;
          if (typeof demand[1] === 'number' && typeof experienceYears === 'number' && demand[1] <= experienceYears) score += dScoreUnit;
          if (Array.isArray(demand[2]) && Array.isArray(knowledgeTags) && knowledgeTags.length > 0) {
            demand[2].forEach((tag) => {
              if (knowledgeTags.includes(tag.toLowerCase())) score += dScoreUnit;
            });
          }
        });
      }
  
      return score;
    } catch (err) {
      return 0;
    }
  };
  
  /**
   * Finds best holon(s) for the task
   * PHASE 1 - Sort holons according to their cost_data and choose only available holons
   * PHASE 2 - Iterate over previously sorted holons and choose holons whose knowledge matches the task's resource_demand
   * PHASE 3 - Loop in which the best holon is picked till the task has all the hours it needs
   * @param {object} task standard task
   * @param {array} holons arra of standard holons
   * @returns {object} allocation
   */
  export const findBestMatch = (task, holons) => {
    try {
      let isReady = false;
      const taskId = task.id;
      let holonIds = [];
      let addedHours = 0;
  
      while (!isReady) {
        // PHASE 1
        sortHolons(holons, 'cost_data');
        const availableHolons = holons.filter((i) => i.availability_data.currentValue >= 0 && i.availability_data.currentValue < 1);
        if (availableHolons.length === 0) break;
        // PHASE 2
        sortByDemands(task, availableHolons);
        // PHASE 3
        const bestHolon = availableHolons[0];
        // The task has estimated_time -  meaning it may need multiple holons
        if (typeof task.estimated_time === 'number') {
          const hoursNeeded = task.estimated_time - addedHours;
          // The task has due_date - meaning it may need multiple holons
          if (task.due_date instanceof Date) {
            const totalDaysLeft = Math.floor((task.due_date - new Date()) / (1000 * 60 * 60 * 24));
            const totalHoursHolonCouldProvide = totalDaysLeft * bestHolon.daily_work_hours * (1 - bestHolon.availability_data.currentValue);
            // daily_work_hours the holon provide is enough for the task - meaning no need to add another holon
            if (totalHoursHolonCouldProvide >= hoursNeeded) {
              bestHolon.availability_data.currentValue = 1;
              holonIds.push(bestHolon.id);
              break;
            }
            // daily_work_hours the holon provides is not enought for the task - meaning another holon is needed
            else {
              bestHolon.availability_data.currentValue = 1;
              holonIds.push(bestHolon.id);
              addedHours += totalHoursHolonCouldProvide;
            }
          }
  
          // The task has no due_date - meaning one holon is enough
          else {
            holonIds.push(bestHolon.id);
            bestHolon.availability_data.currentValue = 1;
            break;
          }
        }
        // The task has no estimated_time - meaning one holon is enough
        else {
          holonIds.push(bestHolon.id);
          bestHolon.availability_data.currentValue = 1;
          break;
        }
      }
  
      return { taskId, holonIds };
    } catch (err) {
      return { taskId: task.id, holonIds: [] };
    }
  };
  